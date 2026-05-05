#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
📊 检查SEC下载进度和失败分析
"""
import os
import csv
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures"
OUTPUT_DIR = DATA_RAW / "item1_extracted_final"

def main():
    print("=" * 70)
    print("📊 SEC下载进度检查")
    print("=" * 70)
    
    # 统计已下载文件
    downloaded_files = list(OUTPUT_DIR.glob("*.txt"))
    downloaded_count = len(downloaded_files)
    
    # 读取总索引
    with open(DATA_RAW / "01_sec_10k_full_index.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        all_filings = list(reader)
    total_count = len(all_filings)
    
    # 统计剩余
    downloaded_set = set()
    for f in downloaded_files:
        downloaded_set.add(f.stem)
    
    remaining_count = 0
    for filing in all_filings:
        key = f"{filing['cik']}_{filing['date_filed']}"
        if key not in downloaded_set:
            remaining_count += 1
    
    # 读取之前的提取结果
    success_count = 0
    failed_count = 0
    no_section_count = 0
    
    if (DATA_RAW / "02_extraction_results.csv").exists():
        with open(DATA_RAW / "02_extraction_results.csv", "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                status = row['status']
                if status == "SUCCESS":
                    success_count += 1
                elif status == "DOWNLOAD_FAILED":
                    failed_count += 1
                elif status == "START_NOT_FOUND":
                    no_section_count += 1
    
    # 输出统计
    print(f"\n📁 当前下载目录: {OUTPUT_DIR}")
    print(f"\n📊 整体进度:")
    print(f"   总样本: {total_count:,} 份")
    print(f"   已下载: {downloaded_count:,} 份")
    print(f"   剩余: {remaining_count:,} 份")
    print(f"   完成率: {downloaded_count/total_count*100:.1f}%")
    
    print(f"\n📈 历史提取结果:")
    print(f"   成功提取: {success_count:,} 份")
    print(f"   下载失败: {failed_count:,} 份")
    print(f"   未找到章节: {no_section_count:,} 份")
    
    # 分析已下载文件大小
    if downloaded_files:
        total_size = sum(f.stat().st_size for f in downloaded_files)
        avg_size = total_size / downloaded_count
        print(f"\n📦 文件大小统计:")
        print(f"   总大小: {total_size/1024/1024:.2f} MB")
        print(f"   平均大小: {avg_size/1024:.2f} KB")
    
    print("\n" + "=" * 70)
    print("💡 失败原因分析:")
    print("  1. DOWNLOAD_FAILED: SEC服务器访问限制或网络问题")
    print("  2. START_NOT_FOUND: 文件中未找到Item 1章节")
    print("  3. 正常现象: SEC有访问频率限制，部分公司可能无公开文件")
    print("=" * 70)

if __name__ == "__main__":
    main()