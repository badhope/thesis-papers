#!/usr/bin/env python3
import csv
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures"
OUTPUT_DIR = DATA_RAW / "item1_extracted_final"

done = set(f.stem for f in OUTPUT_DIR.glob("*.txt"))

with open(DATA_RAW / "01_sec_10k_full_index.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    all_filings = list(reader)

remaining = []
for f in all_filings:
    key = f"{f['cik']}_{f['date_filed']}"
    if key not in done:
        remaining.append(f)

print(f"剩余: {len(remaining)} 份")

with open(DATA_RAW / "03_remaining_files.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["cik", "company_name", "form_type", "date_filed", "file_path", "year", "quarter"])
    writer.writeheader()
    writer.writerows(remaining)

print(f"已保存到: {DATA_RAW / '03_remaining_files.csv'}")
