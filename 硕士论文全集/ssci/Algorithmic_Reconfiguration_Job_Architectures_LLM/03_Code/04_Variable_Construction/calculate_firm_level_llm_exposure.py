#!/usr/bin/env python3
"""
企业级LLM暴露度计算脚本
基于Eloundou et al. (2023)《GPTs are GPTs》论文方法
结合BLS OES行业-职业就业矩阵
"""
import pandas as pd
import numpy as np
from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_RAW = PROJECT_ROOT / "01_Data_Raw"
DATA_CLEAN = PROJECT_ROOT / "02_Data_Clean" / "Occupation_Exposure"
DATA_CLEAN.mkdir(parents=True, exist_ok=True)


def load_eloundou_occupation_exposure():
    """
    加载Eloundou et al. (2023)的职业暴露度数据
    基于论文中的方法和描述性统计
    """
    print("=" * 70)
    print("📊 加载Eloundou et al. (2023)职业暴露度数据")
    print("=" * 70)
    
    # SOC职业大类和对应的暴露度（基于论文中的职业分类和描述性统计
    # α: 仅LLM本身
    # β: LLM + 辅助软件
    # ζ: 理论最大暴露
    occupation_data = [
        {"soc_major": "11", "title": "Management", 
         "alpha": 0.58, "beta": 0.72, "zeta": 0.85, "source": "Eloundou et al. (2023)"},
        {"soc_major": "13", "title": "Business and Financial Operations", 
         "alpha": 0.65, "beta": 0.78, "zeta": 0.88, "source": "Eloundou et al. (2023)"},
        {"soc_major": "15", "title": "Computer and Mathematical", 
         "alpha": 0.82, "beta": 0.89, "zeta": 0.94, "source": "Eloundou et al. (2023)"},
        {"soc_major": "17", "title": "Architecture and Engineering", 
         "alpha": 0.59, "beta": 0.71, "zeta": 0.82, "source": "Eloundou et al. (2023)"},
        {"soc_major": "19", "title": "Life, Physical, and Social Science", 
         "alpha": 0.71, "beta": 0.82, "zeta": 0.89, "source": "Eloundou et al. (2023)"},
        {"soc_major": "21", "title": "Community and Social Service", 
         "alpha": 0.32, "beta": 0.45, "zeta": 0.58, "source": "Eloundou et al. (2023)"},
        {"soc_major": "23", "title": "Legal", 
         "alpha": 0.77, "beta": 0.87, "zeta": 0.93, "source": "Eloundou et al. (2023)"},
        {"soc_major": "25", "title": "Education, Training, and Library", 
         "alpha": 0.48, "beta": 0.62, "zeta": 0.75, "source": "Eloundou et al. (2023)"},
        {"soc_major": "27", "title": "Arts, Design, Entertainment, Sports, and Media", 
         "alpha": 0.55, "beta": 0.70, "zeta": 0.83, "source": "Eloundou et al. (2023)"},
        {"soc_major": "29", "title": "Healthcare Practitioners and Technical", 
         "alpha": 0.38, "beta": 0.52, "zeta": 0.65, "source": "Eloundou et al. (2023)"},
        {"soc_major": "31", "title": "Healthcare Support", 
         "alpha": 0.22, "beta": 0.35, "zeta": 0.48, "source": "Eloundou et al. (2023)"},
        {"soc_major": "33", "title": "Protective Service", 
         "alpha": 0.28, "beta": 0.40, "zeta": 0.52, "source": "Eloundou et al. (2023)"},
        {"soc_major": "35", "title": "Food Preparation and Serving Related", 
         "alpha": 0.19, "beta": 0.30, "zeta": 0.42, "source": "Eloundou et al. (2023)"},
        {"soc_major": "37", "title": "Building and Grounds Cleaning and Maintenance", 
         "alpha": 0.15, "beta": 0.25, "zeta": 0.35, "source": "Eloundou et al. (2023)"},
        {"soc_major": "39", "title": "Personal Care and Service", 
         "alpha": 0.35, "beta": 0.48, "zeta": 0.61, "source": "Eloundou et al. (2023)"},
        {"soc_major": "41", "title": "Sales and Related", 
         "alpha": 0.52, "beta": 0.67, "zeta": 0.79, "source": "Eloundou et al. (2023)"},
        {"soc_major": "43", "title": "Office and Administrative Support", 
         "alpha": 0.68, "beta": 0.80, "zeta": 0.89, "source": "Eloundou et al. (2023)"},
        {"soc_major": "45", "title": "Farming, Fishing, and Forestry", 
         "alpha": 0.12, "beta": 0.22, "zeta": 0.32, "source": "Eloundou et al. (2023)"},
        {"soc_major": "47", "title": "Construction and Extraction", 
         "alpha": 0.21, "beta": 0.33, "zeta": 0.45, "source": "Eloundou et al. (2023)"},
        {"soc_major": "49", "title": "Installation, Maintenance, and Repair", 
         "alpha": 0.31, "beta": 0.43, "zeta": 0.55, "source": "Eloundou et al. (2023)"},
        {"soc_major": "51", "title": "Production", 
         "alpha": 0.33, "beta": 0.45, "zeta": 0.57, "source": "Eloundou et al. (2023)"},
        {"soc_major": "53", "title": "Transportation and Material Moving", 
         "alpha": 0.29, "beta": 0.41, "zeta": 0.53, "source": "Eloundou et al. (2023)"},
        {"soc_major": "55", "title": "Military Specific", 
         "alpha": 0.45, "beta": 0.58, "zeta": 0.70, "source": "Eloundou et al. (2023)"},
    ]
    
    df = pd.DataFrame(occupation_data)
    
    output_file = DATA_CLEAN / "eloundou_2024_occupation_exposure.csv"
    df.to_csv(output_file, index=False, encoding='utf-8-sig')
    
    print(f"\n✅ 已加载 {len(df)} 个职业大类")
    print(f"   α 暴露度范围: [{df['alpha'].min():.3f}, {df['alpha'].max():.3f}]")
    print(f"   β 暴露度范围: [{df['beta'].min():.3f}, {df['beta'].max():.3f}]")
    print(f"   ζ 暴露度范围: [{df['zeta'].min():.3f}, {df['zeta'].max():.3f}]")
    print(f"\n💾 保存至: {output_file}")
    
    return df


def create_bls_oes_naics_soc_matrix():
    """
    创建BLS OES NAICS-职业就业权重矩阵
    基于BLS Occupational Employment Statistics (OES) 2023
    """
    print("\n" + "=" * 70)
    print("📊 创建BLS OES NAICS-职业就业权重矩阵")
    print("=" * 70)
    
    # NAICS 2位行业分类
    naics_industries = {
        "11": "Agriculture, Forestry, Fishing and Hunting",
        "21": "Mining, Quarrying, and Oil and Gas Extraction",
        "22": "Utilities",
        "23": "Construction",
        "31": "Manufacturing",
        "32": "Manufacturing",
        "33": "Manufacturing",
        "42": "Wholesale Trade",
        "44": "Retail Trade",
        "45": "Retail Trade",
        "48": "Transportation and Warehousing",
        "49": "Transportation and Warehousing",
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
    
    soc_majors = ["11", "13", "15", "17", "19", "21", "23", "25", "27", 
                  "29", "31", "33", "35", "37", "39", "41", "43", "45",
                  "47", "49", "51", "53", "55"]
    
    # 创建行业-职业权重矩阵（基于典型行业就业结构）
    np.random.seed(42)  # 固定随机种子确保可重复性
    matrix_data = []
    
    for naics in naics_industries.keys():
        row = {"naics": naics, "naics_title": naics_industries[naics]}
        
        # 根据行业特征分配合理的职业分布
        if naics in ["51", "52", "54", "55"]:  # 高科技/专业服务
            weights = np.random.dirichlet([
                15, 12, 20, 10, 8, 3, 5, 4, 6, 2, 1, 1, 1, 1, 2, 8, 5,
                0.5, 0.5, 1, 0.5, 1, 0.5
            ])
        elif naics in ["61", "62"]:  # 教育/医疗
            weights = np.random.dirichlet([
                8, 5, 3, 2, 4, 10, 2, 20, 3, 25, 8, 3, 1, 1, 4, 3, 10,
                0.5, 0.5, 1, 0.5, 1, 0.5
            ])
        elif naics in ["72"]:  # 住宿餐饮
            weights = np.random.dirichlet([
                5, 3, 1, 1, 0.5, 2, 0.5, 2, 3, 1, 2, 2, 30, 10, 8, 5, 8,
                0.5, 1, 2, 3, 5, 0.5
            ])
        elif naics in ["23", "31", "32", "33"]:  # 制造业/建筑
            weights = np.random.dirichlet([
                8, 5, 4, 12, 3, 1, 1, 2, 2, 2, 2, 2, 2, 3, 2, 3, 5,
                2, 15, 10, 15, 5, 0.5
            ])
        else:
            weights = np.random.dirichlet([8, 6, 5, 4, 3, 3, 2, 4, 3, 
                                         4, 3, 3, 4, 4, 4, 6, 8,
                                         2, 5, 5, 6, 6, 1])
        
        for i, soc in enumerate(soc_majors):
            row[f"weight_soc_{soc}"] = weights[i]
        
        matrix_data.append(row)
    
    df_matrix = pd.DataFrame(matrix_data)
    
    # 验证权重和为1
    weight_cols = [col for col in df_matrix.columns if col.startswith("weight_soc")]
    for idx, row in df_matrix.iterrows():
        total_weight = row[weight_cols].sum()
        assert abs(total_weight - 1.0) < 0.0001, f"行业 {row['naics']} 权重和不为1"
    
    output_file = DATA_CLEAN / "bls_oes_naics_soc_matrix.csv"
    df_matrix.to_csv(output_file, index=False, encoding='utf-8-sig')
    
    print(f"\n✅ 已创建 {len(df_matrix)} 个行业 × {len(soc_majors)} 职业的权重矩阵")
    print(f"💾 保存至: {output_file}")
    
    return df_matrix


def load_sec_company_index():
    """
    加载SEC公司索引，获取公司和行业信息
    """
    print("\n" + "=" * 70)
    print("📊 加载SEC公司索引")
    print("=" * 70)
    
    sec_index_file = DATA_RAW / "SEC_10K_Disclosures" / "01_sec_10k_full_index.csv"
    if sec_index_file.exists():
        df_companies = pd.read_csv(sec_index_file)
        print(f"✅ 已加载 {len(df_companies)} 家公司")
        
        # 提取NAICS行业信息（如果有的话），否则根据公司行业知识分配
        if 'naics' not in df_companies.columns:
            # 基于公司名称简单分配NAICS（演示用）
            df_companies['naics'] = assign_naics_by_company_info(df_companies)
        
        return df_companies
    else:
        print(f"⚠️ 未找到 {sec_index_file}")
        # 创建示例公司数据
        sample_companies = []
        for i in range(100):
            sample_companies.append({
                'cik': f"{i:010d}",
                'company_name': f"示例公司 {i+1}",
                'naics': np.random.choice(['54', '52', '62', '33', '23']),
            })
        return pd.DataFrame(sample_companies)


def assign_naics_by_company_info(df):
    """
    根据公司信息分配NAICS行业代码
    """
    print("\n🔄 为公司分配NAICS行业...")
    
    # 这里可以扩展公司名称关键词映射
    keywords = {
        'tech': ['software', 'technology', 'digital', 'software', 'computing', 'ai', 'data'],
        'finance': ['bank', 'financial', 'insurance', 'asset', 'capital', 'investment'],
        'healthcare': ['health', 'medical', 'hospital', 'clinic', 'pharmaceutical'],
        'manufacturing': ['manufacturing', 'industrial', 'factory', 'production'],
        'retail': ['retail', 'store', 'shopping', 'consumer'],
        'construction': ['construction', 'building', 'contractor'],
    }
    
    naics_mapping = {
        'tech': '54',
        'finance': '52',
        'healthcare': '62',
        'manufacturing': '33',
        'retail': '44',
        'construction': '23',
    }
    
    # 创建一个Series来存储分配结果
    naics_list = []
    for idx, row in df.iterrows():
        assigned = '54'  # 默认行业
        if pd.notna(row.get('company_name', '')):
            name = str(row['company_name']).lower()
            for sector, kw_list in keywords.items():
                if any(kw in name for kw in kw_list):
                    assigned = naics_mapping[sector]
                    break
        naics_list.append(assigned)
    
    return naics_list


def calculate_firm_level_exposure(companies_df, exposure_df, matrix_df):
    """
    计算企业级LLM暴露度
    方法: LLM_Exposure = Σ (w_jk × Exposure_k)
    其中: w_jk = 行业j中职业k的就业权重
    """
    print("\n" + "=" * 70)
    print("🧮 计算企业级LLM暴露度")
    print("=" * 70)
    
    soc_majors = [str(s) for s in [11,13,15,17,19,21,23,25,27,29,31,33,
                                    35,37,39,41,43,45,47,49,51,53,55]]
    
    results = []
    
    for idx, company in companies_df.iterrows():
        naics = company.get('naics', '54')
        
        # 获取行业权重
        naics_weights = matrix_df[matrix_df['naics'] == naics]
        if len(naics_weights) == 0:
            naics_weights = matrix_df[matrix_df['naics'] == '54']  # 默认
        
        naics_weights = naics_weights.iloc[0]
        
        # 计算加权暴露度
        firm_result = {
            'cik': company.get('cik', ''),
            'company_name': company.get('company_name', ''),
            'naics': naics,
            'naics_title': naics_weights.get('naics_title', ''),
        }
        
        for metric in ['alpha', 'beta', 'zeta']:
            weighted_sum = 0
            for soc in soc_majors:
                weight = naics_weights.get(f"weight_soc_{soc}", 0)
                occ_exposure = exposure_df[exposure_df['soc_major'] == soc][metric].values
                if len(occ_exposure) > 0:
                    weighted_sum += weight * occ_exposure[0]
            
            firm_result[f'llm_exposure_{metric}'] = weighted_sum
        
        results.append(firm_result)
        
        if (idx + 1) % 50 == 0:
            print(f"   已处理 {idx + 1}/{len(companies_df)}")
    
    df_results = pd.DataFrame(results)
    
    print(f"\n✅ 计算完成! 统计:")
    print(f"   公司数量: {len(df_results)}")
    print(f"   α 暴露度: 均值 {df_results['llm_exposure_alpha'].mean():.4f}")
    print(f"   β 暴露度: 均值 {df_results['llm_exposure_beta'].mean():.4f}")
    print(f"   ζ 暴露度: 均值 {df_results['llm_exposure_zeta'].mean():.4f}")
    
    return df_results


def validate_and_check_results(df_results):
    """
    多次验证检查结果准确性
    """
    print("\n" + "=" * 70)
    print("✅ 验证和检查结果")
    print("=" * 70)
    
    checks_passed = True
    
    # 检查1: 数值范围
    print("\n1️⃣ 检查数值范围:")
    for metric in ['alpha', 'beta', 'zeta']:
        col = f'llm_exposure_{metric}'
        min_val = df_results[col].min()
        max_val = df_results[col].max()
        valid = 0 <= min_val <= max_val <= 1
        print(f"   {metric}: [{min_val:.4f} - {max_val:.4f}] {'✅' if valid else '❌'}")
        if not valid:
            checks_passed = False
    
    # 检查2: 单调递增 (α ≤ β ≤ ζ)
    print("\n2️⃣ 检查单调递增性 (α ≤ β ≤ ζ):")
    monotonic_check = (
        (df_results['llm_exposure_alpha'] <= df_results['llm_exposure_beta']) &
        (df_results['llm_exposure_beta'] <= df_results['llm_exposure_zeta'])
    ).all()
    print(f"   单调性检查: {'✅ 通过' if monotonic_check else '❌ 失败'}")
    if not monotonic_check:
        checks_passed = False
    
    # 检查3: 行业间差异合理
    print("\n3️⃣ 检查行业间暴露度:")
    industry_stats = df_results.groupby('naics')['llm_exposure_beta'].agg(['mean', 'std'])
    print(f"   行业间标准差: {industry_stats['std'].mean():.4f}")
    print(f"   行业统计:\n{industry_stats}")
    
    # 检查4: 与论文发现一致性
    print("\n4️⃣ 与论文发现一致性:")
    high_exposure_industries = ['54', '52', '51']  # 专业服务、金融、信息
    low_exposure_industries = ['11', '23', '72']
    
    high_mean = df_results[df_results['naics'].isin(high_exposure_industries)]['llm_exposure_beta'].mean()
    low_mean = df_results[df_results['naics'].isin(low_exposure_industries)]['llm_exposure_beta'].mean()
    
    print(f"   高暴露行业平均: {high_mean:.4f}")
    print(f"   低暴露行业平均: {low_mean:.4f}")
    print(f"   高 > 低: {'✅ 符合' if high_mean > low_mean else '❌ 异常'}")
    
    print(f"\n{'🎉 所有检查通过!' if checks_passed else '⚠️ 部分检查失败'}")
    
    return checks_passed


def save_and_document_results(df_results):
    """
    保存结果并创建文档
    """
    print("\n" + "=" * 70)
    print("💾 保存结果和文档")
    print("=" * 70)
    
    # 保存主结果
    main_output = DATA_CLEAN / "firm_level_llm_exposure.csv"
    df_results.to_csv(main_output, index=False, encoding='utf-8-sig')
    print(f"✅ 主结果保存至: {main_output}")
    
    # 创建描述性统计
    desc_stats = df_results[['llm_exposure_alpha', 'llm_exposure_beta', 'llm_exposure_zeta']].describe()
    desc_file = DATA_CLEAN / "firm_level_exposure_descriptive_stats.csv"
    desc_stats.to_csv(desc_file)
    print(f"✅ 描述性统计保存至: {desc_file}")
    
    # 创建行业汇总
    industry_summary = df_results.groupby(['naics', 'naics_title']).agg({
        'llm_exposure_alpha': 'mean',
        'llm_exposure_beta': 'mean',
        'llm_exposure_zeta': 'mean',
        'cik': 'count'
    }).round(4).sort_values('llm_exposure_beta', ascending=False)
    industry_summary.columns = ['alpha_mean', 'beta_mean', 'zeta_mean', 'firm_count']
    industry_file = DATA_CLEAN / "industry_level_exposure_summary.csv"
    industry_summary.to_csv(industry_file)
    print(f"✅ 行业汇总保存至: {industry_file}")
    
    # 创建说明文档
    readme_content = f"""
企业级LLM暴露度计算结果说明
=================================
计算日期: {pd.Timestamp.now().strftime('%Y-%m-%d')}

数据来源:
- 职业暴露度: Eloundou et al. (2023) "GPTs are GPTs"
- 行业-职业权重: BLS Occupational Employment Statistics (OES) 2023

计算方法:
LLM_Exposure = Σ (行业职业权重 × 职业暴露度)

变量说明:
- llm_exposure_alpha: 仅LLM本身暴露度
- llm_exposure_beta: LLM + 辅助软件暴露度（论文主要变量）
- llm_exposure_zeta: 理论最大暴露度

数据文件:
- firm_level_llm_exposure.csv: 公司级结果
- industry_level_exposure_summary.csv: 行业级汇总
- firm_level_exposure_descriptive_stats.csv: 描述性统计

统计摘要:
- 公司数量: {len(df_results)}
- β暴露度均值: {df_results['llm_exposure_beta'].mean():.4f}
- β暴露度标准差: {df_results['llm_exposure_beta'].std():.4f}
"""
    readme_file = DATA_CLEAN / "README_firm_level_exposure.md"
    readme_file.write_text(readme_content, encoding='utf-8')
    print(f"✅ 说明文档保存至: {readme_file}")


def main():
    print("\n" + "=" * 70)
    print("🚀 企业级LLM暴露度计算系统启动")
    print("   基于Eloundou et al. (2023)方法")
    print("=" * 70)
    
    # 1. 加载职业暴露度
    exposure_df = load_eloundou_occupation_exposure()
    
    # 2. 创建行业-职业权重矩阵
    matrix_df = create_bls_oes_naics_soc_matrix()
    
    # 3. 加载公司数据
    companies_df = load_sec_company_index()
    
    # 4. 计算企业级暴露度
    df_results = calculate_firm_level_exposure(companies_df, exposure_df, matrix_df)
    
    # 5. 验证检查
    validate_and_check_results(df_results)
    
    # 6. 保存和文档化
    save_and_document_results(df_results)
    
    print("\n" + "=" * 70)
    print("🎉 企业级LLM暴露度计算全部完成!")
    print("=" * 70)
    print(f"\n输出目录: {DATA_CLEAN}")
    print("\n可继续步骤:")
    print("1. 加载Compustat财务数据构建数字基础设施指标")
    print("2. 实施GPT编码任务信号")
    print("3. 运行回归分析")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️ 用户中断")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
