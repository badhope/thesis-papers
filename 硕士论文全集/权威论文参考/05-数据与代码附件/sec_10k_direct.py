#!/usr/bin/env python3
"""
SEC 10-K批量下载脚本 - 直接API版（更可靠）
目标: 下载4,847家美国上市公司2020-2024年10-K Item 1人力资本披露
"""

import os
import time
import json
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

# ===== 配置 =====
BASE_DIR = r"C:\Users\X1882\Desktop\paper_data"
SEC_10K_DIR = Path(BASE_DIR) / "sec_10k" / "filings_direct"
USER_AGENT = "YourName your@email.com"  # SEC要求提供联系邮箱
YEARS = [2020, 2021, 2022, 2023, 2024]
SLEEP_SEC = 0.15  # 请求间隔（秒）

# 创建目录
SEC_10K_DIR.mkdir(parents=True, exist_ok=True)

# 4,847家上市公司示例CIK列表（实际使用需从Compustat/其他来源获取完整列表）
# 这里用S&P 500公司作为示例，完整列表需替换
SAMPLE_CIKS = [
    "0000320193",  # Apple
    "0000789019",  # Microsoft
    "0001018724",  # Amazon
    "0001652044",  # Alphabet
    "0001067983",  # Tesla
    # ... 实际应用中需要完整的4,847家CIK列表
]

def get_company_filings(cik):
    """通过SEC submissions API获取公司所有申报记录"""
    cik_padded = cik.zfill(10)
    url = f"https://data.sec.gov/submissions/CIK{cik_padded}.json"
    req = Request(url, headers={"User-Agent": USER_AGENT})
    
    try:
        with urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
            return data
    except HTTPError as e:
        if e.code == 429:  # 速率限制
            time.sleep(5)
            return get_company_filings(cik)
        print(f"[X] CIK {cik} API请求失败: {e.code}")
        return None
    except Exception as e:
        print(f"[X] CIK {cik} 请求异常: {e}")
        return None

def parse_filings_from_api_response(data, years):
    """从API响应中解析出指定年份的10-K申报"""
    if not data:
        return []
    
    filings_list = []
    recent = data.get("filings", {}).get("recent", {})
    
    # SEC API返回的recent是字典，值是列表（表单类型、日期、accession号等）
    forms = recent.get("form", [])
    filing_dates = recent.get("filingDate", [])
    accession_numbers = recent.get("accessionNumber", [])
    primary_documents = recent.get("primaryDocument", [])
    
    for i in range(len(forms)):
        if forms[i] in ["10-K", "10-K/A"]:
            try:
                year = int(filing_dates[i][:4])
                if year in years:
                    filings_list.append({
                        "accession": accession_numbers[i].replace("-", ""),
                        "primaryDocument": primary_documents[i],
                        "filingDate": filing_dates[i],
                        "year": year
                    })
            except (IndexError, ValueError):
                continue
    
    return filings_list

def download_10k_filing(cik, accession_number, primary_document, year):
    """下载单个10-K文件"""
    cik_no_zero = str(int(cik))
    # URL格式: https://www.sec.gov/Archives/edgar/data/{CIK无前导零}/{accession_number}/{primary_document}
    url = f"https://www.sec.gov/Archives/edgar/data/{cik_no_zero}/{accession_number}/{primary_document}"
    
    # 本地保存路径
    local_dir = SEC_10K_DIR / str(year) / cik
    local_dir.mkdir(parents=True, exist_ok=True)
    local_file = local_dir / f"{accession_number}_{primary_document}"
    
    if local_file.exists():
        return True
    
    req = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(req, timeout=60) as response:
            content = response.read().decode("utf-8", errors="ignore")
            # 提取Item 1 Human Capital Disclosure部分（简化）
            item1_start = content.find("Item 1.")
            if item1_start == -1:
                item1_start = content.find("ITEM 1.")
            if item1_start != -1:
                # 保存前50,000字符（Item 1通常足够）
                item1_content = content[item1_start:item1_start+50000]
                with open(local_file.with_suffix(".txt"), "w", encoding="utf-8") as f:
                    f.write(item1_content)
                return True
        return False
    except HTTPError as e:
        if e.code == 429:
            time.sleep(5)
            return download_10k_filing(cik, accession_number, primary_document, year)
        return False
    except Exception as e:
        return False

def main():
    print("=" * 60)
    print("SEC 10-K批量下载（直接API版）")
    print(f"目标年份: {YEARS}")
    print(f"保存目录: {SEC_10K_DIR}")
    print("=" * 60)
    
    # 注意：这里使用S&P 500示例CIK，实际需要4,847家完整列表
    # 完整CIK列表可以从SEC EDGAR公司数据库获取：
    # https://www.sec.gov/Archives/edgar/companyinfo/companyinfo.html
    
    total_filings = 0
    success_count = 0
    
    for cik in SAMPLE_CIKS[:5]:  # 先测试前5家，避免时间过长
        print(f"\n[处理] CIK: {cik}")
        data = get_company_filings(cik)
        if not data:
            continue
        
        company_name = data.get("name", "Unknown")
        print(f"  公司: {company_name[:30]}")
        
        # 使用新的解析函数
        ten_k_filings = parse_filings_from_api_response(data, YEARS)
        
        print(f"  找到{len(ten_k_filings)}条10-K记录（{YEARS}年）")
        total_filings += len(ten_k_filings)
        
        for filing in ten_k_filings:
            
            if not accession or not primary_doc:
                continue
            
            print(f"  [↓] {filing_date} {primary_doc[:20]}...", end="")
            if download_10k_filing(cik, filing.get("accession", ""), filing.get("primaryDocument", ""), filing.get("year", year)):
                print("✓")
                success_count += 1
            else:
                print("X")
            
            time.sleep(SLEEP_SEC)
    
    print("\n" + "=" * 60)
    print(f"测试完成! 总记录:{total_filings}, 成功:{success_count}")
    print(f"保存位置: {SEC_10K_DIR}")
    print("=" * 60)
    print("\n[提示] 这只是测试版本（前5家公司）。")
    print("[下一步] 获取完整的4,847家CIK列表后，取消SAMPLE_CIKS限制即可全量下载。")

if __name__ == "__main__":
    main()
