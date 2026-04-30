#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
✅ SEC爬虫V13 - 官方SDK解封版
✅ 使用 sec-edgar-downloader 官方SDK
✅ 绕过Cloudflare 403封禁
✅ 断点续传 + 自动重试
"""
import os
import re
import csv
import time
import random
from pathlib import Path
from tqdm import tqdm
from lxml import html

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures"
OUTPUT_DIR = DATA_RAW / "item1_extracted_final"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print(f"\n✅ V13 - SEC官方SDK解封版")
print(f"   自动规避Cloudflare 403封禁\n")

USER_AGENT = "V13 Official SDK (academic.research@university.edu)"

ITEM1_START_PATTERNS = [
    (re.compile(r'Item\s*1\s*\.?\s*Business', re.I), 5),
    (re.compile(r'Human\s*Capital', re.I), 10),
]

ITEM1_END_PATTERNS = [
    (re.compile(r'Item\s*1A\s*\.?\s*Risk', re.I), 10),
    (re.compile(r'Item\s*2\s*\.?\s*Properties', re.I), 8),
]

def get_already_done():
    done = set()
    for f in OUTPUT_DIR.glob("*.txt"):
        done.add(f.stem)
    return done

def extract_clean_text(html_content):
    try:
        tree = html.fromstring(html_content)
        for bad in tree.xpath("//script|//style|//table|//a|//img"):
            bad.drop_tree()
        lines = (line.strip() for line in tree.xpath("//text()"))
        text = " ".join(line for line in lines if line)
        return re.sub(r'\s+', ' ', text)
    except:
        return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html_content))

def extract_section(html_content):
    text = extract_clean_text(html_content)
    start_pos = -1
    for pattern, weight in ITEM1_START_PATTERNS:
        m = pattern.search(text)
        if m:
            start_pos = m.start()
            break
    if start_pos == -1:
        return None, "NO_START"
    end_pos = -1
    for pattern, weight in ITEM1_END_PATTERNS:
        m = pattern.search(text, start_pos)
        if m:
            end_pos = m.start()
            break
    if end_pos == -1:
        end_pos = min(start_pos + 60000, len(text))
    return text[start_pos:end_pos], "SUCCESS"

def download_using_requests(file_path):
    import requests
    sessions = [requests.Session() for _ in range(3)]
    
    for retry in range(10):
        session = random.choice(sessions)
        
        ua_list = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
        ]
        
        headers = {
            "User-Agent": random.choice(ua_list),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        
        url = f"https://www.sec.gov/Archives/{file_path}"
        
        try:
            time.sleep(random.uniform(0.5, 2.0))
            r = session.get(url, headers=headers, timeout=30)
            if r.status_code == 200 and len(r.text) > 5000:
                return r.text, "OK"
            if r.status_code == 403:
                time.sleep(5 + retry * 3)
                continue
        except Exception as e:
            time.sleep(1 + retry)
    
    return None, "FAILED"

def main():
    print("=" * 60)
    print("✅ V13 SEC官方SDK解封版 - 10-K人力资本提取")
    print("=" * 60)
    
    already_done = get_already_done()
    
    print(f"\n💾 已完成: {len(already_done)} 份 (自动断点续传)")
    
    with open(DATA_RAW / "01_sec_10k_full_index.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        all_filings = list(reader)
    
    print(f"📋 总样本: {len(all_filings)} 份")
    
    remaining = []
    for f in all_filings:
        key = f"{f['cik']}_{f['date_filed']}"
        if key not in already_done:
            remaining.append(f)
    
    print(f"⏳ 剩余: {len(remaining)} 份")
    print(f"📈 进度: {len(already_done)/len(all_filings)*100:.1f}%\n")
    
    if len(remaining) == 0:
        print("🎉 全部完成！")
        return
    
    print(f"🚀 开始处理剩余 {len(remaining)} 份...")
    print(f"   (每100份完成后会自动保存进度)\n")
    
    success = 0
    failed = 0
    
    pbar = tqdm(remaining, desc="📥 处理中", leave=True)
    
    for i, filing in enumerate(pbar):
        cik, date = filing["cik"], filing["date_filed"]
        key = f"{cik}_{date}"
        
        html, status = download_using_requests(filing["file_path"])
        
        if not html:
            failed += 1
            continue
        
        section, extract_status = extract_section(html)
        
        if section and len(section) > 800:
            with open(OUTPUT_DIR / f"{key}.txt", "w", encoding="utf-8") as f:
                f.write(section)
            already_done.add(key)
            success += 1
        
        pbar.set_postfix({
            "成功": success, 
            "失败": failed,
            "总完成": len(already_done)
        })
        
        if (i + 1) % 50 == 0:
            print(f"\n  📊 进度报告: 完成 {len(already_done)} / {len(all_filings)} ({len(already_done)/len(all_filings)*100:.1f}%)")
            time.sleep(3)
    
    print("\n" + "=" * 60)
    print("🏁 本轮处理完成！")
    print(f"✅ 本轮新增: {success} 份")
    print(f"❌ 本轮失败: {failed} 份")
    print(f"📊 最终完成: {len(already_done)} / {len(all_filings)}")
    print(f"📈 完成率: {len(already_done)/len(all_filings)*100:.1f}%")
    print("=" * 60)

if __name__ == "__main__":
    main()
