#!/usr/bin/env python3
"""
SEC爬虫 - 子模块M1-1: EDGAR主索引构建器
构建2020-2024季度主索引，过滤所有10-K申报
"""

import os
import re
import csv
import time
import zipfile
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures"
DATA_RAW.mkdir(parents=True, exist_ok=True)

USER_AGENT = "Academic Research your.email@university.edu"  # SEC要求提供联系信息
QUARTERS = ['QTR1', 'QTR2', 'QTR3', 'QTR4']

def download_quarterly_idx(year, quarter):
    """下载指定年份季度的主索引文件"""
    url = f"https://www.sec.gov/Archives/edgar/full-index/{year}/{quarter}/master.zip"
    local_zip = DATA_RAW / f"master_{year}_{quarter}.zip"
    
    if local_zip.exists():
        print(f"  [✓] 已存在: {year}-{quarter}")
        return local_zip
    
    print(f"  [↓] 下载: {year}-{quarter}", end="", flush=True)
    req = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(req, timeout=60) as response, open(local_zip, "wb") as f:
            f.write(response.read())
        print(" ✓")
        time.sleep(0.5)
        return local_zip
    except HTTPError as e:
        print(f" X ({e.code})")
        return None
    except Exception as e:
        print(f" X ({str(e)[:30]})")
        return None

def parse_master_idx(zip_path, year, quarter):
    """解析master.idx，提取10-K"""
    filings = []
    try:
        with zipfile.ZipFile(zip_path, "r") as zf:
            with zf.open("master.idx") as f:
                lines = f.read().decode("latin1", errors="ignore").splitlines()
        
        in_data_section = False
        for line in lines:
            line = line.strip()
            if "CIK|Company Name|Form Type" in line or "---" in line:
                in_data_section = True
                continue
            if not in_data_section or not line or "|" not in line:
                continue
            
            parts = line.split("|")
            if len(parts) < 5:
                continue
            
            form_type = parts[2].strip()
            if form_type not in ["10-K", "10-K/A"]:
                continue
            
            date_filed = parts[3].strip()
            if date_filed < "2020-11-09":
                continue
            
            cik = parts[0].strip().zfill(10)
            filings.append({
                "cik": cik,
                "company_name": parts[1].strip(),
                "form_type": form_type,
                "date_filed": date_filed,
                "file_path": parts[4].strip(),
                "year": year,
                "quarter": quarter
            })
    except Exception as e:
        print(f"    [X] 解析失败: {e}")
    return filings

def main():
    print("=" * 70)
    print("子模块M1-1: EDGAR季度主索引构建")
    print(f"时间窗口: 2020Q4-2024Q4 (SEC人力资本披露规则生效后)")
    print("=" * 70)
    
    all_filings = []
    for year in range(2020, 2025):
        print(f"\n[年份] {year}")
        for qtr in QUARTERS:
            if year == 2020 and qtr in ["QTR1", "QTR2", "QTR3"]:
                print(f"  [跳过] 2020年{qtr} - 规则尚未生效")
                continue
            
            zip_path = download_quarterly_idx(year, qtr)
            if zip_path:
                filings = parse_master_idx(zip_path, year, qtr)
                print(f"    提取 {len(filings)} 条10-K记录")
                all_filings.extend(filings)
    
    print(f"\n[汇总] 共提取 {len(all_filings)} 条10-K记录")
    
    output_csv = DATA_RAW / "01_sec_10k_full_index.csv"
    keys = ["cik", "company_name", "form_type", "date_filed", "file_path", "year", "quarter"]
    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(all_filings)
    
    print(f"\n[✓] 索引已保存: {output_csv.name}")
    print(f"    样本预览:")
    for i, f in enumerate(all_filings[:5]):
        print(f"      {i+1}. CIK:{f['cik']} | {f['company_name'][:40]} | {f['date_filed']}")
    
    cik_count = len(set(f["cik"] for f in all_filings))
    print(f"\n[统计] 唯一公司数: {cik_count}")
    
    print("\n" + "=" * 70)
    print("子模块M1-1完成! 索引构建成功")
    print("=" * 70)

if __name__ == "__main__":
    main()
