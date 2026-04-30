#!/usr/bin/env python3
import csv
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures"
OUTPUT_DIR = DATA_RAW / 'item1_extracted_final'

done = set(f.stem for f in OUTPUT_DIR.glob('*.txt'))

with open(DATA_RAW / '01_sec_10k_full_index.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    all_filings = list(reader)

remaining = []
for f in all_filings:
    key = f"{f['cik']}_{f['date_filed']}"
    if key not in done:
        remaining.append(f)

print('📊 进度报告')
print('='*50)
print(f'总样本: {len(all_filings)}')
print(f'已完成: {len(done)}')
print(f'剩余: {len(remaining)}')
print(f'完成率: {len(done)/len(all_filings)*100:.1f}%')
print('='*50)
print(f'前20个待处理:')
for i, f in enumerate(remaining[:20]):
    print(f'  {i+1}. CIK:{f["cik"]} - {f["company_name"][:40]}')
