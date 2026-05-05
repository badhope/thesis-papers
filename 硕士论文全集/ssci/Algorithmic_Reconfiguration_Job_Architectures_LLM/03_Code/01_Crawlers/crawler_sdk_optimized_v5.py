#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🚀 SEC 官方SDK高速爬虫 v5 - 智能验证版
✅ 先验证CIK是否有文件再下载
✅ 日期不匹配时自动查找可用文件
✅ 断点续传 + 智能跳过
✅ 提高成功率
"""
import os
import re
import csv
import shutil
import tempfile
import random
import time
from pathlib import Path
from tqdm import tqdm
from lxml import html
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures"
OUTPUT_DIR = DATA_RAW / "item1_extracted_final"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print(f"\n🚀 SEC官方SDK高速爬虫 v5 - 智能验证版")
print(f"   使用 sec-edgar-downloader 官方库\n")

MAX_WORKERS = 3
MIN_DELAY = 1.5
MAX_DELAY = 3.5

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
    section = text[start_pos:end_pos]
    if len(section) > 800:
        return section, "SUCCESS"
    return None, "TOO_SHORT"

def download_and_extract(filing, output_dir, already_done):
    from sec_edgar_downloader import Downloader
    
    cik, date = filing["cik"], filing["date_filed"]
    key = f"{cik}_{date}"
    
    if key in already_done:
        return key, "SKIPPED", 0
    
    download_folder = None
    try:
        download_folder = tempfile.mkdtemp(prefix="sec_download_")
        
        dl = Downloader("Academic Research", "research@university.edu", download_folder=download_folder)
        
        time.sleep(random.uniform(MIN_DELAY, MAX_DELAY))
        
        total_filings = dl.get(
            "10-K", 
            cik, 
            limit=1,
            download_details=False
        )
        
        if total_filings == 0:
            shutil.rmtree(download_folder, ignore_errors=True)
            return key, "NO_CIK_FILINGS", 0
        
        time.sleep(random.uniform(0.5, 1.5))
        
        filings_downloaded = dl.get(
            "10-K", 
            cik, 
            after=date,
            limit=1,
            download_details=True
        )
        
        if filings_downloaded == 0:
            time.sleep(random.uniform(0.5, 1.0))
            filings_downloaded = dl.get(
                "10-K", 
                cik, 
                limit=1,
                download_details=True
            )
        
        if filings_downloaded > 0:
            edgar_folder = Path(download_folder) / "sec-edgar-filings"
            cik_folder = edgar_folder / cik / "10-K"
            
            if cik_folder.exists():
                for filing_folder in cik_folder.glob("*"):
                    if filing_folder.is_dir():
                        html_files = list(filing_folder.glob("*.html"))
                        txt_files = list(filing_folder.glob("*.txt"))
                        
                        files_to_check = html_files if html_files else txt_files
                        
                        for file_path in files_to_check:
                            try:
                                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                                    content = f.read()
                            
                                if len(content) > 5000:
                                    section, status = extract_section(content)
                                    if section and len(section) > 800:
                                        output_file = output_dir / f"{key}.txt"
                                        with open(output_file, "w", encoding="utf-8") as f:
                                            f.write(section)
                                        
                                        shutil.rmtree(download_folder, ignore_errors=True)
                                        return key, "SUCCESS", len(section)
                            except Exception as e:
                                continue
                
                shutil.rmtree(download_folder, ignore_errors=True)
                return key, "NO_SECTION", 0
            else:
                shutil.rmtree(download_folder, ignore_errors=True)
                return key, "NO_CIK_FOLDER", 0
        else:
            shutil.rmtree(download_folder, ignore_errors=True)
            return key, "NO_FILING", 0
            
    except Exception as e:
        if download_folder:
            try:
                shutil.rmtree(download_folder, ignore_errors=True)
            except:
                pass
        return key, f"ERROR: {str(e)[:50]}", 0

def main():
    print("=" * 70)
    print("🚀 SEC官方SDK高速爬虫 v5 - 10-K人力资本提取")
    print("=" * 70)
    
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
    print(f"   使用 {MAX_WORKERS} 线程并发下载")
    print(f"   请求间隔: {MIN_DELAY}-{MAX_DELAY}秒\n")
    
    success = 0
    failed = 0
    no_cik_filings = 0
    
    with tqdm(total=len(remaining), desc="📥 处理中") as pbar:
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = {executor.submit(download_and_extract, filing, OUTPUT_DIR, already_done): filing for filing in remaining}
            
            for future in as_completed(futures):
                key, status, length = future.result()
                
                if status == "SUCCESS":
                    success += 1
                    already_done.add(key)
                elif status == "NO_CIK_FILINGS":
                    no_cik_filings += 1
                elif status != "SKIPPED":
                    failed += 1
                
                pbar.set_postfix({
                    "成功": success, 
                    "失败": failed,
                    "无文件": no_cik_filings,
                    "总完成": len(already_done)
                })
                pbar.update(1)
    
    print("\n" + "=" * 70)
    print("🏁 本轮处理完成！")
    print(f"✅ 本轮新增: {success} 份")
    print(f"❌ 本轮失败: {failed} 份")
    print(f"⚠️  无文件CIK: {no_cik_filings} 份")
    print(f"📊 最终完成: {len(already_done)} / {len(all_filings)}")
    print(f"📈 完成率: {len(already_done)/len(all_filings)*100:.1f}%")
    print("=" * 70)

if __name__ == "__main__":
    main()

