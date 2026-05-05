#!/usr/bin/env python3
"""
标准数据库批量下载器
BLS OES, Webb AI Patent, Eloundou LLM Exposure
"""
import os
import requests
from pathlib import Path
from tqdm import tqdm

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw"

def download_file(url, filepath, desc=""):
    try:
        response = requests.get(url, stream=True, timeout=120, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        response.raise_for_status()
        total_size = int(response.headers.get("content-length", 0))
        with open(filepath, "wb") as f, tqdm(
            desc=desc, total=total_size, unit="B", unit_scale=True
        ) as pbar:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                pbar.update(len(chunk))
        return True
    except Exception as e:
        print(f"❌ {desc} 失败: {e}")
        return False

def main():
    print("=" * 60)
    print("🚀 论文标准数据库批量下载器")
    print("=" * 60)

    # =================================================================
    # 1. BLS OES 就业数据 2020-2024
    # =================================================================
    print("\n📊 1/3 下载 BLS OES 就业数据...")
    BLS_DIR = DATA_RAW / "BLS_OES"
    BLS_DIR.mkdir(parents=True, exist_ok=True)
    
    bls_urls = {
        "oesm20nat.zip": "https://www.bls.gov/oes/special-requests/oesm20nat.zip",
        "oesm21nat.zip": "https://www.bls.gov/oes/special-requests/oesm21nat.zip",
        "oesm22nat.zip": "https://www.bls.gov/oes/special-requests/oesm22nat.zip",
        "oesm23nat.zip": "https://www.bls.gov/oes/special-requests/oesm23nat.zip",
    }
    
    for name, url in bls_urls.items():
        download_file(url, BLS_DIR / name, f"BLS {name}")

    # =================================================================
    # 2. Webb (2021) AI 专利数据
    # =================================================================
    print("\n💡 2/3 下载 Webb AI Patent 数据...")
    WEBB_DIR = DATA_RAW / "Webb_AI_Patent"
    WEBB_DIR.mkdir(parents=True, exist_ok=True)
    
    download_file(
        "https://raw.githubusercontent.com/xiangyongwang/AI-Patent-Data/main/Webb_2021_AI_Patent.csv",
        WEBB_DIR / "Webb_2021_AI_Patent.csv",
        "Webb AI Patent"
    )

    # =================================================================
    # 3. Eloundou et al. (2023) LLM Exposure
    # =================================================================
    print("\n🤖 3/3 下载 Eloundou LLM Exposure 数据...")
    LLM_DIR = DATA_RAW / "LLM_Exposure"
    LLM_DIR.mkdir(parents=True, exist_ok=True)
    
    download_file(
        "https://arxiv.org/src/2303.10131v1/anc/occupations_LLM_exposure.xlsx",
        LLM_DIR / "Eloundou_2023_LLM_Exposure.xlsx",
        "Eloundou LLM Exposure"
    )

    print("\n" + "=" * 60)
    print("✅ 全部下载完成！")
    print("=" * 60)

if __name__ == "__main__":
    main()
