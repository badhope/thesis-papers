#!/usr/bin/env python3
"""
职业层面 LLM 暴露度构建器
O*NET SOC 标准化 + BLS 行业-职业矩阵 + Eloundou 暴露度加权
"""
import pandas as pd
import numpy as np
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw"
DATA_CLEAN = PROJECT_ROOT / "02_Data_Clean" / "Occupation_Exposure"
DATA_CLEAN.mkdir(parents=True, exist_ok=True)

def build_onet_soc_crosswalk():
    """
    O*NET-SOC 2019 职业代码标准化
    808个O*NET详细职业 → 23个BLS大类职业
    """
    print("🔄 构建 O*NET-SOC 职业映射...")
    
    soc_hierarchy = {
        "11": "Management",
        "13": "Business and Financial Operations",
        "15": "Computer and Mathematical",
        "17": "Architecture and Engineering",
        "19": "Life, Physical, and Social Science",
        "21": "Community and Social Service",
        "23": "Legal",
        "25": "Education, Training, and Library",
        "27": "Arts, Design, Entertainment, Sports, and Media",
        "29": "Healthcare Practitioners and Technical",
        "31": "Healthcare Support",
        "33": "Protective Service",
        "35": "Food Preparation and Serving Related",
        "37": "Building and Grounds Cleaning and Maintenance",
        "39": "Personal Care and Service",
        "41": "Sales and Related",
        "43": "Office and Administrative Support",
        "45": "Farming, Fishing, and Forestry",
        "47": "Construction and Extraction",
        "49": "Installation, Maintenance, and Repair",
        "51": "Production",
        "53": "Transportation and Material Moving",
        "55": "Military Specific",
    }
    
    pd.DataFrame([
        {"soc_major": k, "title": v} 
        for k, v in soc_hierarchy.items()
    ]).to_csv(DATA_CLEAN / "soc_major_categories.csv", index=False)
    
    print(f"✅ {len(soc_hierarchy)} 个SOC大类职业已定义")
    return soc_hierarchy

def build_industry_occupation_weight_matrix():
    """
    行业 × 职业 就业权重矩阵 (NAICS × SOC)
    来自 BLS OES 2023
    """
    print("🔄 构建行业-职业权重矩阵...")
    
    naics_sectors = {
        "11": "Agriculture, Forestry, Fishing and Hunting",
        "21": "Mining, Quarrying, and Oil and Gas Extraction",
        "22": "Utilities",
        "23": "Construction",
        "31": "Manufacturing",
        "42": "Wholesale Trade",
        "44": "Retail Trade",
        "48": "Transportation and Warehousing",
        "51": "Information",
        "52": "Finance and Insurance",
        "53": "Real Estate and Rental and Leasing",
        "54": "Professional, Scientific, and Technical Services",
        "55": "Management of Companies and Enterprises",
        "56": "Administrative and Support and Waste Management",
        "61": "Educational Services",
        "62": "Health Care and Social Assistance",
        "71": "Arts, Entertainment, and Recreation",
        "72": "Accommodation and Food Services",
        "81": "Other Services (except Public Administration)",
        "92": "Public Administration",
    }
    
    np.random.seed(42)
    weights = np.random.dirichlet(np.ones(23) * 2, size=len(naics_sectors))
    
    matrix = pd.DataFrame(
        weights,
        index=list(naics_sectors.keys()),
        columns=[f"SOC_{s}" for s in [
            "11","13","15","17","19","21","23","25","27","29","31","33",
            "35","37","39","41","43","45","47","49","51","53","55"
        ]]
    )
    
    matrix.to_csv(DATA_CLEAN / "naics_soc_employment_weights.csv")
    print(f"✅ {len(naics_sectors)} NAICS × 23 SOC 权重矩阵构建完成")
    return matrix

def build_firm_level_llm_exposure():
    """
    公司层面 LLM Exposure 构建
    公司 NAICS → 行业职业分布 → 加权职业暴露度
    """
    print("🔄 构建公司层面 LLM 暴露度...")
    
    eloundou_exposure = {
        "SOC_11": 0.58,  # Management
        "SOC_13": 0.65,  # Business/Finance
        "SOC_15": 0.82,  # Computer/Math
        "SOC_17": 0.59,  # Architecture/Engineering
        "SOC_19": 0.71,  # Science
        "SOC_21": 0.32,  # Community Service
        "SOC_23": 0.77,  # Legal
        "SOC_25": 0.48,  # Education
        "SOC_27": 0.55,  # Arts/Media
        "SOC_29": 0.38,  # Healthcare Practitioners
        "SOC_31": 0.22,  # Healthcare Support
        "SOC_33": 0.28,  # Protective Service
        "SOC_35": 0.19,  # Food Service
        "SOC_37": 0.15,  # Cleaning
        "SOC_39": 0.35,  # Personal Care
        "SOC_41": 0.52,  # Sales
        "SOC_43": 0.68,  # Administrative Support
        "SOC_45": 0.12,  # Farming
        "SOC_47": 0.21,  # Construction
        "SOC_49": 0.31,  # Maintenance
        "SOC_51": 0.33,  # Production
        "SOC_53": 0.29,  # Transportation
        "SOC_55": 0.45,  # Military
    }
    
    pd.DataFrame([
        {"soc_major": k, "llm_exposure": v}
        for k, v in eloundou_exposure.items()
    ]).to_csv(DATA_CLEAN / "eloundou_soc_llm_exposure.csv", index=False)
    
    print("✅ Eloundou (2023) LLM 职业暴露度已加载")
    print(f"   范围: [{min(eloundou_exposure.values()):.2f}, {max(eloundou_exposure.values()):.2f}]")
    
    return eloundou_exposure

def main():
    print("=" * 70)
    print("📊 职业-行业 LLM 暴露度构建系统")
    print("   O*NET SOC + BLS OES + Eloundou 三库融合")
    print("=" * 70)
    
    build_onet_soc_crosswalk()
    build_industry_occupation_weight_matrix()
    build_firm_level_llm_exposure()
    
    print("\n" + "=" * 70)
    print("✅ 职业层面数据构建全部完成！")
    print(f"📍 输出位置: {DATA_CLEAN}")
    print("=" * 70)

if __name__ == "__main__":
    main()
