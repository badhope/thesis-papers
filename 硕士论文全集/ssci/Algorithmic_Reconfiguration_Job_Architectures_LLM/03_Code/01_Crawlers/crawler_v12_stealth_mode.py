#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🕵️ SEC爬虫V12 - 隐形模式
✅ 终极防封技术栈 - 突破SEC限流
✅ 动态请求间隔 + 大间隙随机停顿
✅ 每请求完全独立的身份伪装
✅ 失败自动冷却机制
"""
import os
import re
import csv
import time
import random
import asyncio
import aiohttp
from pathlib import Path
from collections import Counter
from tqdm import tqdm
from lxml import html

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures"
OUTPUT_DIR = DATA_RAW / "item1_extracted_final"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MAX_CONCURRENT = 12
BATCH_SIZE = 100
COOLDOWN_AFTER_FAIL = 30

print(f"\n🕵️ V12 隐形模式爬虫启动")
print(f"   并发数: {MAX_CONCURRENT} (低并发防检测)")
print(f"   批量: {BATCH_SIZE} | 失败冷却: {COOLDOWN_AFTER_FAIL}s\n")

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
] * 5

ACCEPT_LANGUAGES = [
    "en-US,en;q=0.9",
    "en-US,en;q=0.8",
    "en-GB,en;q=0.9",
    "en-CA,en;q=0.9",
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
    for pattern, weight in [
        (re.compile(r'Item\s*1\s*\.?\s*Business', re.I), 5),
        (re.compile(r'Human\s*Capital', re.I), 10),
    ]:
        m = pattern.search(text)
        if m:
            start_pos = m.start()
            break
    if start_pos == -1:
        return None, "NO_START"
    end_pos = -1
    for pattern, weight in [
        (re.compile(r'Item\s*1A\s*\.?\s*Risk', re.I), 10),
        (re.compile(r'Item\s*2\s*\.?\s*Properties', re.I), 8),
    ]:
        m = pattern.search(text, start_pos)
        if m:
            end_pos = m.start()
            break
    if end_pos == -1:
        end_pos = min(start_pos + 60000, len(text))
    return text[start_pos:end_pos], "SUCCESS"

async def download_one(session, url, stats):
    for retry in range(6):
        try:
            pause_before = random.uniform(0.3, 2.0)
            await asyncio.sleep(pause_before)
            
            headers = {
                "User-Agent": random.choice(USER_AGENTS),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": random.choice(ACCEPT_LANGUAGES),
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": f"https://www.sec.gov/edgar/search/",
                "DNT": "1",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "TE": "trailers",
            }
            timeout = aiohttp.ClientTimeout(total=45)
            async with session.get(url, headers=headers, timeout=timeout) as resp:
                if resp.status == 429:
                    stats["429"] += 1
                    wait = 5 + retry * 5 + random.uniform(0, 5)
                    await asyncio.sleep(wait)
                    continue
                if resp.status == 403:
                    stats["403"] += 1
                    wait = 10 + retry * 10 + random.uniform(0, 10)
                    await asyncio.sleep(wait)
                    continue
                if resp.status == 200:
                    return await resp.text(errors="ignore"), "OK"
                await asyncio.sleep(1 + random.uniform(0, 1))
        except Exception as e:
            await asyncio.sleep(1 + retry * 0.5)
    return None, "FAILED"

async def process_one(session, filing, already_done, stats, semaphore, pbar, global_cooldown):
    cik, date = filing["cik"], filing["date_filed"]
    key = f"{cik}_{date}"
    if key in already_done:
        stats["CACHED"] += 1
        pbar.update(1)
        return
    async with semaphore:
        while global_cooldown[0] > time.time():
            await asyncio.sleep(1)
        
        html, status = await download_one(session, f"https://www.sec.gov/Archives/{filing['file_path']}", stats)
        
        if stats["429"] + stats["403"] > 5:
            global_cooldown[0] = time.time() + COOLDOWN_AFTER_FAIL
            stats["429"] = 0
            stats["403"] = 0
        
        if not html:
            stats[status] += 1
            pbar.update(1)
            return
        section, extract_status = extract_section(html)
        if section and len(section) > 800:
            with open(OUTPUT_DIR / f"{key}.txt", "w", encoding="utf-8") as f:
                f.write(section)
            already_done.add(key)
            stats[extract_status] += 1
        else:
            stats[extract_status] += 1
        pbar.update(1)

async def main():
    print("=" * 60)
    print("🕵️ V12 隐形模式 - SEC 10-K爬虫 (防限流版)")
    print("=" * 60)
    
    already_done = get_already_done()
    stats = Counter({"429": 0, "403": 0})
    global_cooldown = [0]
    
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
    
    random.shuffle(remaining)
    
    print(f"⏳ 剩余: {len(remaining)} 份")
    print(f"📈 进度: {len(already_done)/len(all_filings)*100:.1f}%\n")
    
    if len(remaining) == 0:
        print("🎉 全部完成！")
        return
    
    batches = [remaining[i:i+BATCH_SIZE] for i in range(0, len(remaining), BATCH_SIZE)]
    print(f"📦 分 {len(batches)} 批次处理，每批 {BATCH_SIZE} 份\n")
    
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    
    for batch_num, batch in enumerate(batches, 1):
        start_time = time.time()
        start_count = len(already_done)
        
        print(f"\n🔥 批次 {batch_num}/{len(batches)} - {len(batch)} 份")
        connector = aiohttp.TCPConnector(limit=MAX_CONCURRENT, ttl_dns_cache=300, force_close=True)
        
        async with aiohttp.ClientSession(connector=connector, cookie_jar=aiohttp.DummyCookieJar()) as session:
            pbar = tqdm(total=len(batch), desc=f"⚡ 批次{batch_num}", leave=True)
            tasks = [process_one(session, f, already_done, stats, semaphore, pbar, global_cooldown) for f in batch]
            await asyncio.gather(*tasks, return_exceptions=True)
            pbar.close()
        
        elapsed = time.time() - start_time
        added = len(already_done) - start_count
        speed = added / elapsed * 60 if elapsed > 0 else 0
        
        print(f"   ✅ 本批新增: {added} | 速度: {speed:.0f} 份/分钟")
        print(f"   📊 累计完成: {len(already_done)} / {len(all_filings)} ({len(already_done)/len(all_filings)*100:.1f}%)")
        
        if batch_num % 3 == 0:
            print(f"   ☕ 批次间休息 15s...")
            await asyncio.sleep(15)
        else:
            await asyncio.sleep(3)
    
    print("\n" + "=" * 60)
    print("🏁 全部处理完成！")
    print(f"✅ 最终完成: {len(already_done)} / {len(all_filings)}")
    print(f"📈 完成率: {len(already_done)/len(all_filings)*100:.1f}%")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
