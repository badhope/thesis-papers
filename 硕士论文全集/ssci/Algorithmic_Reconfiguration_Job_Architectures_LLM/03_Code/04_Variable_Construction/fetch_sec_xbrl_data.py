import pandas as pd
import numpy as np
import requests
import json
import os
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

PANEL_FILE = os.path.join(BASE_DIR, "02_Data_Clean", "Merged_Data", "final_analysis_panel.csv")
OUTPUT_FILE = os.path.join(BASE_DIR, "02_Data_Clean", "Merged_Data", "final_panel_with_real_controls.csv")
CACHE_DIR = os.path.join(BASE_DIR, "02_Data_Clean", "Merged_Data", "sec_xbrl_cache")

os.makedirs(CACHE_DIR, exist_ok=True)

print("="*70)
print("SEC EDGAR XBRL API - 获取真实公司财务数据")
print("="*70)

HEADERS = {
    "User-Agent": "ThesisResearch/1.0 (researcher@university.edu)"
}

df = pd.read_csv(PANEL_FILE, dtype={'cik': str})
unique_ciks = df['cik'].unique()
print(f"\n需要获取的公司数: {len(unique_ciks)}")

def fetch_xbrl_data(cik):
    cik_padded = cik.zfill(10)
    cache_file = os.path.join(CACHE_DIR, f"{cik_padded}.json")
    
    if os.path.exists(cache_file):
        with open(cache_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik_padded}.json"
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            data = response.json()
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(data, f)
            time.sleep(0.15)
            return data
        else:
            print(f"  CIK {cik} 获取失败: HTTP {response.status_code}")
            time.sleep(0.15)
            return None
    except Exception as e:
        print(f"  CIK {cik} 请求异常: {e}")
        time.sleep(0.15)
        return None

def extract_financials(xbrl_data, year):
    if not xbrl_data or 'facts' not in xbrl_data:
        return None
    
    facts = xbrl_data.get('facts', {})
    us_gaap = facts.get('us-gaap', {})
    
    def get_value(concept_name):
        concept = us_gaap.get(concept_name, {})
        units = concept.get('units', {})
        usd_values = units.get('USD', [])
        
        for item in usd_values:
            if item.get('fy') == year and item.get('form') in ['10-K', '10-K/A']:
                return item.get('val')
        return None
    
    assets = get_value('Assets')
    liabilities = get_value('Liabilities')
    net_income = get_value('NetIncomeLoss')
    revenues = get_value('Revenues')
    capex = get_value('CapitalExpenditure')
    rd_expense = get_value('ResearchAndDevelopmentExpense')
    
    return {
        'assets': assets,
        'liabilities': liabilities,
        'net_income': net_income,
        'revenues': revenues,
        'capex': capex,
        'rd_expense': rd_expense
    }

print("\n[1/3] 获取SEC XBRL财务数据...")

all_financials = {}
for i, cik in enumerate(unique_ciks):
    if (i + 1) % 500 == 0:
        print(f"  进度: {i+1}/{len(unique_ciks)} ({(i+1)/len(unique_ciks)*100:.1f}%)")
    
    xbrl_data = fetch_xbrl_data(cik)
    
    for year in range(2020, 2025):
        fin_data = extract_financials(xbrl_data, year)
        if fin_data:
            all_financials[(cik, year)] = fin_data

print(f"  成功获取: {len(all_financials)} 条公司-年份财务数据")

print("\n[2/3] 计算控制变量...")

control_data = []
for (cik, year), fin in all_financials.items():
    assets = fin['assets']
    liabilities = fin['liabilities']
    net_income = fin['net_income']
    revenues = fin['revenues']
    capex = fin['capex']
    rd_expense = fin['rd_expense']
    
    if assets and assets > 0:
        log_size = np.log(assets)
        leverage = liabilities / assets if liabilities else None
        roa = net_income / assets if net_income else None
        it_capex_ratio = capex / revenues if (capex and revenues and revenues > 0) else None
        rd_ratio = rd_expense / revenues if (rd_expense and revenues and revenues > 0) else None
        
        control_data.append({
            'cik': cik,
            'year': year,
            'log_size': log_size,
            'leverage': leverage,
            'roa': roa,
            'it_capex_ratio': it_capex_ratio,
            'rd_ratio': rd_ratio
        })

df_controls = pd.DataFrame(control_data)
print(f"  有效控制变量记录: {len(df_controls)}")

print("\n[3/3] 合并到面板数据...")

cik_first_year = df.groupby('cik')['year'].min().reset_index()
cik_first_year.columns = ['cik', 'first_year']
cik_first_year['company_age'] = 2024 - cik_first_year['first_year']
cik_first_year['log_age'] = np.log(cik_first_year['company_age'])

cik_age = cik_first_year[['cik', 'log_age']].drop_duplicates()

df_merged = df.merge(df_controls, on=['cik', 'year'], how='left')
df_merged = df_merged.merge(cik_age, on='cik', how='left')

for col in ['log_size', 'leverage', 'log_age', 'roa']:
    print(f"  {col}: {df_merged[col].notna().sum()} 非空 ({df_merged[col].notna().mean()*100:.1f}%)")

df_merged['log_size'] = df_merged['log_size'].fillna(df_merged['log_size'].median())
df_merged['leverage'] = df_merged['leverage'].fillna(df_merged['leverage'].median())
df_merged['log_age'] = df_merged['log_age'].fillna(df_merged['log_age'].median())
df_merged['roa'] = df_merged['roa'].fillna(df_merged['roa'].median())

df_merged = df_merged[[
    'cik', 'date', 'year', 'company_name', 'naics', 'naics_title',
    'rc_intensity', 'ac_intensity',
    'llm_exposure_alpha', 'llm_exposure_beta', 'llm_exposure_zeta',
    'log_size', 'leverage', 'log_age', 'roa',
    'it_capex_ratio', 'rd_ratio',
    'text_length', 'hc_section_length', 'encoding_method'
]]

df_merged.to_csv(OUTPUT_FILE, index=False)
print(f"\n输出文件: {OUTPUT_FILE}")
print(f"文件大小: {os.path.getsize(OUTPUT_FILE) / 1024 / 1024:.2f} MB")

print(f"\n控制变量统计:")
print(df_merged[['log_size', 'leverage', 'log_age', 'roa']].describe().round(4))

print(f"\nSEC EDGAR XBRL数据获取完成!")
print(f"  真实数据覆盖率: {df_controls['cik'].nunique()}/{len(unique_ciks)} 公司")
print(f"  面板记录数: {len(df_merged)}")
