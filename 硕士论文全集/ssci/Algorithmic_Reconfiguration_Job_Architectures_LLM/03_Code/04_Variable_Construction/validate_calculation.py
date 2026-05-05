#!/usr/bin/env python3
"""验证LLM暴露度计算是否正确"""
import pandas as pd
import numpy as np

DATA_CLEAN = r'C:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Job_Architectures_LLM\02_Data_Clean\Occupation_Exposure'

# 读取数据
exposure = pd.read_csv(f'{DATA_CLEAN}/eloundou_2024_occupation_exposure.csv')
weights = pd.read_csv(f'{DATA_CLEAN}/bls_oes_naics_soc_matrix.csv')
results = pd.read_csv(f'{DATA_CLEAN}/firm_level_llm_exposure.csv')

print('=' * 60)
print('🔍 验证LLM暴露度计算')
print('=' * 60)
print(f'职业数量: {len(exposure)}')
print(f'行业数量: {len(weights)}')
print(f'公司数量: {len(results)}')

# 验证所有行业的计算
all_pass = True
valid_naics_list = results['naics'].unique()

for naics in weights['naics'].unique():
    # 跳过没有对应公司的行业
    if naics not in valid_naics_list:
        continue
    
    # 获取该行业的权重
    test_row = weights[weights['naics'] == naics].iloc[0]
    
    # 手动重新计算
    alpha_sum = 0
    beta_sum = 0
    zeta_sum = 0
    
    for _, occ in exposure.iterrows():
        weight_col = f'weight_soc_{occ["soc_major"]}'
        if weight_col in test_row:
            alpha_sum += test_row[weight_col] * occ['alpha']
            beta_sum += test_row[weight_col] * occ['beta']
            zeta_sum += test_row[weight_col] * occ['zeta']
    
    # 获取结果文件中的值
    sample_result = results[results['naics'] == naics].iloc[0]
    
    # 计算差异
    alpha_diff = abs(alpha_sum - sample_result['llm_exposure_alpha'])
    beta_diff = abs(beta_sum - sample_result['llm_exposure_beta'])
    zeta_diff = abs(zeta_sum - sample_result['llm_exposure_zeta'])
    
    # 检查是否通过
    passed = alpha_diff < 1e-10 and beta_diff < 1e-10 and zeta_diff < 1e-10
    
    if not passed:
        print(f'\n❌ 行业 {naics} 计算不一致:')
        print(f'   手动计算: alpha={alpha_sum:.8f}, beta={beta_sum:.8f}, zeta={zeta_sum:.8f}')
        print(f'   结果文件: alpha={sample_result["llm_exposure_alpha"]:.8f}, beta={sample_result["llm_exposure_beta"]:.8f}, zeta={sample_result["llm_exposure_zeta"]:.8f}')
        print(f'   差异: alpha={alpha_diff:.10f}, beta={beta_diff:.10f}, zeta={zeta_diff:.10f}')
        all_pass = False

if all_pass:
    print('\n✅ 所有行业计算验证通过!')
    print('   计算结果准确无误')
    
    # 额外验证：随机检查10个公司
    print('\n📊 随机验证10个公司:')
    sample_companies = results.sample(10)
    for _, company in sample_companies.iterrows():
        naics = company['naics']
        test_row = weights[weights['naics'] == naics].iloc[0]
        
        beta_sum = 0
        for _, occ in exposure.iterrows():
            weight_col = f'weight_soc_{occ["soc_major"]}'
            if weight_col in test_row:
                beta_sum += test_row[weight_col] * occ['beta']
        
        diff = abs(beta_sum - company['llm_exposure_beta'])
        status = '✅' if diff < 1e-10 else '❌'
        print(f'   {status} CIK:{company["cik"]} 差异={diff:.10f}')

else:
    print('\n❌ 计算存在问题')

print('\n' + '=' * 60)
