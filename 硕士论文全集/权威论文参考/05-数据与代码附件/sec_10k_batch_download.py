#!/usr/bin/env python3
"""
SEC 10-K批量下载脚本 - 下载24,235份10-K Item 1人力资本披露
作者: AI助手
日期: 2026-04-29
说明: 使用SEC EDGAR API批量下载，自动分批次避免封锁
"""

import os
import time
import json
import zipfile
import io
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

# ===== 配置区 =====
BASE_DIR = r"C:\Users\X1882\Desktop\paper_data"
SEC_10K_DIR = Path(BASE_DIR) / "sec_10k" / "filings"
SEC_INDEX_DIR = Path(BASE_DIR) / "sec_10k"
USER_AGENT = "YourName your@email.com"  # SEC要求提供联系邮箱
YEAR_START = 2020
YEAR_END = 2024
SLEEP_BETWEEN_REQUESTS = 0.1  # 秒，避免请求过快

# 创建目录
SEC_10K_DIR.mkdir(parents=True, exist_ok=True)

def download_sec_index(year):
    """下载指定年份的SEC每日索引ZIP"""
    url = f"https://www.sec.gov/Archives/edgar/daily-index/{year}/index_{year}.zip"
    local_zip = SEC_INDEX_DIR / f"sec_daily_index_{year}.zip"
    
    if local_zip.exists():
        print(f"[✓] {year}索引已存在: {local_zip.name}")
        return local_zip
    
    print(f"[↓] 下载{year}索引...")
    req = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(req, timeout=120) as response, open(local_zip, "wb") as f:
            f.write(response.read())
        print(f"[✓] {year}索引下载完成: {local_zip.name}")
        return local_zip
    except Exception as e:
        print(f"[X] {year}索引下载失败: {e}")
        return None

def parse_10k_filings(index_zip_path):
    """从索引ZIP中解析10-K申报记录"""
    filings = []
    try:
        with zipfile.ZipFile(index_zip_path, "r") as zf:
            for name in zf.namelist():
                if name.endswith(".idx"):
                    with zf.open(name) as f:
                        lines = f.read().decode("utf-8", errors="ignore").splitlines()
                        for line in lines:
                            if "|10-K|" in line or "|10-K/A|" in line:
                                parts = line.split("|")
                                if len(parts) >= 5:
                                    cik = parts[0].strip().zfill(10)
                                    company = parts[1].strip()
                                    form_type = parts[2].strip()
                                    date_filed = parts[3].strip()
                                    file_path = parts[4].strip().lstrip("/")
                                    filings.append({
                                        "cik": cik,
                                        "company": company,
                                        "form": form_type,
                                        "date": date_filed,
                                        "path": file_path
                                    })
    except Exception as e:
        print(f"[X] 解析索引失败: {e}")
    return filings

def download_10k_filing(cik, filing_path, year):
    """下载单个10-K申报文件，提取Item 1部分"""
    # 构建下载URL
    base_url = "https://www.sec.gov/Archives/edgar/data"
    # 路径格式: /data/CIK(去掉前导零)/filing_path
    cik_no_zero = str(int(cik))
    url = f"{base_url}/{cik_no_zero}/{filing_path}"
    
    # 本地保存路径
    local_dir = SEC_10K_DIR / year / cik
    local_dir.mkdir(parents=True, exist_ok=True)
    local_file = local_dir / f"{filing_path.replace('/', '_')}.txt"
    
    if local_file.exists():
        return True  # 已存在
    
    req = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(req, timeout=30) as response:
            content = response.read().decode("utf-8", errors="ignore")
            # 提取Item 1 Human Capital Disclosure部分（简化示例）
            # 实际需更精确的正则匹配
            item1_start = content.find("Item 1.")
            if item1_start == -1:
                item1_start = content.find("ITEM 1.")
            if item1_start != -1:
                item1_content = content[item1_start:item1_start+50000]  # 取前50k字符
                with open(local_file, "w", encoding="utf-8") as f:
                    f.write(item1_content)
                return True
        return False
    except HTTPError as e:
        if e.code == 429:  # 速率限制
            time.sleep(5)
            return download_10k_filing(cik, filing_path, year)
        return False
    except Exception as e:
        return False

def main():
    print("=" * 60)
    print("SEC 10-K批量下载脚本启动")
    print(f"目标: {YEAR_START}-{YEAR_END}年10-K Item 1人力资本披露")
    print(f"保存目录: {SEC_10K_DIR}")
    print("=" * 60)
    
    all_filings = []
    # 1. 下载并解析索引
    for year in range(YEAR_START, YEAR_END + 1):
        print(f"\n[处理] {year}年数据...")
        index_zip = download_sec_index(year)
        if not index_zip:
            continue
        filings = parse_10k_filings(index_zip)
        print(f"[✓] {year}年找到{len(filings)}条10-K记录")
        all_filings.extend([(f, str(year)) for f in filings])
    
    print(f"\n[总计数] 共找到{len(all_filings)}条10-K记录")
    
    # 2. 批量下载
    success = 0
    failed = 0
    total = len(all_filings)
    
    for i, (filing, year) in enumerate(all_filings, 1):
        cik = filing["cik"]
        path = filing["path"]
        print(f"[{i}/{total}] 下载 CIK:{cik} {filing['company'][:20]}...", end="")
        
        if download_10k_filing(cik, path, year):
            print("✓")
            success += 1
        else:
            print("X")
            failed += 1
        
        time.sleep(SLEEP_BETWEEN_REQUESTS)
        
        # 每100条显示进度
        if i % 100 == 0:
            print(f"  进度: {i}/{total} ({i/total*100:.1f}%), 成功:{success}, 失败:{failed}")
    
    print("\n" + "=" * 60)
    print(f"下载完成! 成功:{success}, 失败:{failed}, 总计:{total}")
    print(f"保存位置: {SEC_10K_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
