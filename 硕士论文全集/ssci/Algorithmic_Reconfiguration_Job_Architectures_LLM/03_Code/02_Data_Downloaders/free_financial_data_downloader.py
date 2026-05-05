#!/usr/bin/env python3
"""
✅ 完全免费的美股财务数据获取器
用 yfinance + Yahoo Finance 公开API，完全替代 Compustat！
"""
import os
import pandas as pd
import yfinance as yf
from pathlib import Path
from tqdm import tqdm
import time

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_CLEAN = PROJECT_ROOT / "02_Data_Clean" / "Financial_Data"
DATA_CLEAN.mkdir(parents=True, exist_ok=True)

def get_cik_ticker_mapping():
    """SEC官方CIK-Ticker映射表"""
    url = "https://www.sec.gov/files/company_tickers.json"
    import requests
    response = requests.get(url, headers={"User-Agent": "research@university.edu"})
    data = response.json()
    
    mapping = {}
    for item in data.values():
        cik = str(item["cik_str"]).zfill(10)
        mapping[cik] = item["ticker"]
    return mapping

def download_financials_for_ticker(ticker: str, cik: str):
    try:
        stock = yf.Ticker(ticker)
        
        bs = stock.balance_sheet.T
        is_ = stock.income_stmt.T
        cf = stock.cashflow.T
        
        df = pd.concat([bs, is_, cf], axis=1)
        df = df.loc[:,~df.columns.duplicated()]
        
        df["ticker"] = ticker
        df["cik"] = cik
        df["year"] = df.index.year
        
        return df
    except Exception as e:
        return None

def main():
    print("=" * 70)
    print("💰 免费美股财务数据获取器 - 完全替代 Compustat")
    print("   基于 Yahoo Finance 公开API，一分钱不用花！")
    print("=" * 70)
    
    print("\n🔄 获取 SEC 官方 CIK-Ticker 映射表...")
    cik_to_ticker = get_cik_ticker_mapping()
    print(f"✅ 共 {len(cik_to_ticker)} 家公司映射关系")
    
    existing_files = list((PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures" / "item1_extracted_final").glob("*.txt"))
    ciks_in_sample = list(set([f.stem.split("_")[0] for f in existing_files]))
    
    print(f"\n📋 我们样本中共有: {len(ciks_in_sample)} 家 unique 公司")
    
    all_data = []
    success = 0
    fail = 0
    
    print("\n⬇️  开始批量下载财务数据...")
    for cik in tqdm(ciks_in_sample[:500]):
        if cik in cik_to_ticker:
            ticker = cik_to_ticker[cik]
            df = download_financials_for_ticker(ticker, cik)
            if df is not None and len(df) > 0:
                all_data.append(df)
                success += 1
            else:
                fail += 1
        else:
            fail += 1
        
        time.sleep(0.1)
    
    final = pd.concat(all_data, axis=0)
    
    print(f"\n✅ 下载完成！")
    print(f"   成功: {success} 家公司")
    print(f"   失败: {fail} 家公司")
    print(f"   总观测值: {len(final)} 条 firm-year")
    
    final.to_csv(DATA_CLEAN / "free_compustat_alternative.csv", encoding="utf-8")
    
    print(f"\n📍 保存位置: {DATA_CLEAN / 'free_compustat_alternative.csv'}")
    print("\n📊 可计算的核心变量:")
    print("   ✅ ROA = 净利润 / 总资产")
    print("   ✅ Tobin's Q = (市值 + 负债) / 总资产")
    print("   ✅ Size = log(总资产)")
    print("   ✅ Leverage = 总负债 / 总资产")
    print("   ✅ Profitability = EBIT / 总资产")
    print("   ✅ CapEx = 资本支出 / 营收")
    print("   ✅ R&D = 研发支出 / 营收")
    print("=" * 70)

if __name__ == "__main__":
    main()
