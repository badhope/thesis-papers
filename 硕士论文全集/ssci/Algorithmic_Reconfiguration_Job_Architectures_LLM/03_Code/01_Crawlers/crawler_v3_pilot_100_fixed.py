#!/usr/bin/env python3
"""
SEC爬虫 - 100样本试点运行 - URL已修复
同时执行: M1-2批量下载 + M1-3 Item1精准提取
"""

import os
import re
import csv
import time
from pathlib import Path
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
from tqdm import tqdm

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures"
PILOT_DIR = DATA_RAW / "pilot_100_samples"
PILOT_DIR.mkdir(parents=True, exist_ok=True)

USER_AGENT = "Academic Research your.email@university.edu"
SLEEP_BETWEEN = 0.2

ITEM1_PATTERNS = [
    re.compile(r'Item\s*1\.\s*Business', re.I),
    re.compile(r'Item\s*1\s*Business', re.I),
    re.compile(r'ITEM\s*1\s*Business', re.I),
    re.compile(r'Human\s*Capital', re.I),
    re.compile(r'Our\s*Workforce', re.I),
    re.compile(r'Our\s*Employee', re.I),
]

ITEM1A_PATTERNS = [
    re.compile(r'Item\s*1A\.\s*Risk\s*Factors', re.I),
    re.compile(r'Item\s*1A\s*Risk', re.I),
    re.compile(r'ITEM\s*1A\s*Risk', re.I),
    re.compile(r'Item\s*2\.\s*Properties', re.I),
]

def download_single_filing(file_path):
    """BUG修复: 正确的SEC URL格式"""
    url = f"https://www.sec.gov/Archives/{file_path}"
    
    req = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(req, timeout=30) as response:
            return response.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return None

def extract_text_simple(html):
    """提取纯文本，去除标签"""
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "table", "a", "img"]):
        tag.decompose()
    text = soup.get_text(separator=" ", strip=True)
    text = re.sub(r'\s+', ' ', text)
    return text

def extract_human_capital_section(html):
    """精准提取人力资本披露章节"""
    text = extract_text_simple(html)
    
    start_pos = -1
    for pattern in ITEM1_PATTERNS:
        match = pattern.search(text)
        if match:
            start_pos = match.start()
            break
    
    if start_pos == -1:
        return None, "START_NOT_FOUND"
    
    end_pos = -1
    for pattern in ITEM1A_PATTERNS:
        match = pattern.search(text, start_pos)
        if match:
            end_pos = match.start()
            break
    
    if end_pos == -1:
        end_pos = min(start_pos + 80000, len(text))
    
    section = text[start_pos:end_pos]
    return section, "SUCCESS"

def main():
    print("=" * 70)
    print("SEC爬虫 - 100样本试点运行 (URL已修复)")
    print("=" * 70)
    
    with open(DATA_RAW / "01_sec_10k_full_index.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        filings = list(reader)
    
    pilot_filings = filings[:100]
    print(f"\n[试点] 选取前100条记录")
    
    results = []
    stats = {"download_success": 0, "extract_success": 0, "start_not_found": 0}
    
    for i, filing in enumerate(tqdm(pilot_filings, desc="处理进度")):
        cik = filing["cik"]
        company = filing["company_name"][:40]
        date = filing["date_filed"]
        
        time.sleep(SLEEP_BETWEEN)
        
        html = download_single_filing(filing["file_path"])
        if not html:
            results.append({"cik": cik, "company": company, "date": date, "status": "DOWNLOAD_FAILED"})
            continue
        stats["download_success"] += 1
        
        section, extract_status = extract_human_capital_section(html)
        
        if section:
            stats["extract_success"] += 1
            with open(PILOT_DIR / f"{cik}_{date}.txt", "w", encoding="utf-8") as f:
                f.write(section)
            
            has_human = bool(re.search(r'human capital|workforce|employee', section, re.I))
            results.append({
                "cik": cik,
                "company": company,
                "date": date,
                "status": extract_status,
                "length": len(section),
                "has_human_keywords": has_human
            })
        else:
            stats["start_not_found"] += 1
            results.append({"cik": cik, "company": company, "date": date, "status": extract_status})
    
    print("\n" + "=" * 70)
    print("试点运行统计报告")
    print("=" * 70)
    print(f"  下载成功率: {stats['download_success']}/100 = {stats['download_success']}%")
    print(f"  提取成功率: {stats['extract_success']}/100 = {stats['extract_success']}%")
    print(f"  未找到开始标记: {stats['start_not_found']}")
    
    if stats['extract_success'] > 0:
        with_human = sum(1 for r in results if r.get("has_human_keywords"))
        print(f"  含人力资本关键词: {with_human}/{stats['extract_success']} = {with_human/stats['extract_success']*100:.1f}%")
        
        lengths = [r["length"] for r in results if "length" in r]
        if lengths:
            print(f"  平均文本长度: {sum(lengths)/len(lengths):.0f} 字符")
            print(f"  长度范围: {min(lengths)} - {max(lengths)} 字符")
    
    with open(PILOT_DIR / "_pilot_extraction_report.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["cik", "company", "date", "status", "length", "has_human_keywords"])
        writer.writeheader()
        writer.writerows(results)
    
    print(f"\n[✓] 报告已保存: pilot_extraction_report.csv")
    print(f"[✓] 提取文件位置: {PILOT_DIR}")
    
    print("\n" + "=" * 70)
    print("抽取3个样本展示质量:")
    print("=" * 70)
    for r in results[:3]:
        if "length" in r:
            filepath = PILOT_DIR / f"{r['cik']}_{r['date']}.txt"
            if filepath.exists():
                with open(filepath, "r", encoding="utf-8") as f:
                    preview = f.read(500)
                print(f"\n[CIK:{r['cik']}] {r['company']}")
                print(f"  长度: {r['length']} 字符 | 有人力资本: {r['has_human_keywords']}")
                print(f"  前500字预览:")
                print(f"  {preview}")
                print("  ...")
    
    print("\n" + "=" * 70)
    print("试点运行成功完成!")
    print("=" * 70)

if __name__ == "__main__":
    main()
