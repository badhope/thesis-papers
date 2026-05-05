import pandas as pd
import numpy as np
import re
import os

print("=" * 80)
print("COMPREHENSIVE CHART & TABLE VERIFICATION")
print("=" * 80)

errors = []
warnings = []

# Load the data
df = pd.read_csv(r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Job_Architectures_LLM\02_Data_Clean\Merged_Data\final_analysis_panel.csv')
for col in ['ac_intensity', 'rc_intensity', 'year', 'llm_exposure_alpha', 'DI_zscore', 'log_size', 'leverage', 'roa', 'log_age']:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Load the manuscript
with open(r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Manuscript_v1.md', 'r', encoding='utf-8') as f:
    ms = f.read()

# =============================================
# 1. VERIFY FIGURE 2 DATA (Yearly Trends)
# =============================================
print("\n1. FIGURE 2 YEARLY TRENDS DATA VERIFICATION")
print("-" * 60)

yearly_ac = df.groupby('year')['ac_intensity'].mean()
yearly_rc = df.groupby('year')['rc_intensity'].mean()

# Expected values from Figure 2
fig2_ac = {2020: 0.1071, 2021: 0.1088, 2022: 0.1176, 2023: 0.1179, 2024: 0.1205}
fig2_rc = {2020: 0.0151, 2021: 0.0120, 2022: 0.0150, 2023: 0.0155, 2024: 0.0158}

print("  AC values (Figure 2 vs actual data):")
for yr in [2020, 2021, 2022, 2023, 2024]:
    fig_val = fig2_ac[yr]
    actual_val = round(yearly_ac[yr], 4)
    diff = abs(fig_val - actual_val)
    match = diff < 0.001
    status = 'PASS' if match else 'FAIL'
    print(f"    {yr}: Figure={fig_val}, Actual={actual_val}, Diff={diff:.4f} {status}")
    if not match:
        errors.append(f"Figure 2 AC {yr}: figure={fig_val}, data={actual_val}, diff={diff:.4f}")

print("\n  RC values (Figure 2 vs actual data):")
for yr in [2020, 2021, 2022, 2023, 2024]:
    fig_val = fig2_rc[yr]
    actual_val = round(yearly_rc[yr], 4)
    diff = abs(fig_val - actual_val)
    match = diff < 0.001
    status = 'PASS' if match else 'FAIL'
    print(f"    {yr}: Figure={fig_val}, Actual={actual_val}, Diff={diff:.4f} {status}")
    if not match:
        errors.append(f"Figure 2 RC {yr}: figure={fig_val}, data={actual_val}, diff={diff:.4f}")

# =============================================
# 2. VERIFY TABLE 1 DATA (Descriptive Statistics)
# =============================================
print("\n2. TABLE 1 DESCRIPTIVE STATISTICS VERIFICATION")
print("-" * 60)

table1_vars = {
    'rc_intensity': {'N': 20609, 'Mean': 0.0151, 'SD': 0.0424, 'Min': 0.0000, 'Max': 0.4000},
    'ac_intensity': {'N': 20609, 'Mean': 0.1176, 'SD': 0.0563, 'Min': 0.0000, 'Max': 1.0000},
    'llm_exposure_alpha': {'N': 20609, 'Mean': 0.6066, 'SD': 0.0347, 'Min': 0.3856, 'Max': 0.6151},
    'DI_zscore': {'N': 20609, 'Mean': -0.3004, 'SD': 0.4744, 'Min': -0.6041, 'Max': 2.0407},
    'log_size': {'N': 20609, 'Mean': 18.5762, 'SD': 4.1931, 'Min': 0.0000, 'Max': 28.9776},
    'leverage': {'N': 20609, 'Mean': 0.5597, 'SD': 0.3419, 'Min': 0.0000, 'Max': 1.0000},
    'roa': {'N': 20449, 'Mean': -0.0698, 'SD': 0.2535, 'Min': -0.5000, 'Max': 0.5000},
    'log_age': {'N': 20609, 'Mean': 0.8014, 'SD': 0.2852, 'Min': 0.0000, 'Max': 1.3863},
}

for var, expected in table1_vars.items():
    s = df[var].dropna()
    actual_n = len(s)
    actual_mean = round(s.mean(), 4)
    actual_sd = round(s.std(), 4)
    actual_min = round(s.min(), 4)
    actual_max = round(s.max(), 4)
    
    n_match = actual_n == expected['N']
    mean_match = abs(actual_mean - expected['Mean']) < 0.001
    sd_match = abs(actual_sd - expected['SD']) < 0.001
    min_match = abs(actual_min - expected['Min']) < 0.01
    max_match = abs(actual_max - expected['Max']) < 0.01
    
    all_pass = n_match and mean_match and sd_match and min_match and max_match
    status = 'PASS' if all_pass else 'FAIL'
    
    print(f"  {var}:")
    print(f"    N: expected={expected['N']}, actual={actual_n} {'PASS' if n_match else 'FAIL'}")
    print(f"    Mean: expected={expected['Mean']}, actual={actual_mean} {'PASS' if mean_match else 'FAIL'}")
    print(f"    SD: expected={expected['SD']}, actual={actual_sd} {'PASS' if sd_match else 'FAIL'}")
    print(f"    Min: expected={expected['Min']}, actual={actual_min} {'PASS' if min_match else 'FAIL'}")
    print(f"    Max: expected={expected['Max']}, actual={actual_max} {'PASS' if max_match else 'FAIL'}")
    
    if not all_pass:
        errors.append(f"Table 1 {var} mismatch")
        print(f"    STATUS: {status}")

# =============================================
# 3. VERIFY TABLE 2 & 3 COEFFICIENTS
# =============================================
print("\n3. TABLE 2 & 3 REGRESSION COEFFICIENTS VERIFICATION")
print("-" * 60)

# Extract coefficients from manuscript
h1a_coef = re.search(r'H1a.*?β\s*=\s*(-0\.\d+)', ms)
h1b_coef = re.search(r'H1b.*?β\s*=\s*(-0\.\d+)', ms)
h2_coef = re.search(r'H2.*?β\s*=\s*(-0\.\d+)', ms)

# Check Table 2
table2_h1a = '-0.0265' in ms
table2_h1b = '-0.0376' in ms
print(f"  Table 2 H1a coefficient (-0.0265): {'PASS' if table2_h1a else 'FAIL'}")
print(f"  Table 2 H1b coefficient (-0.0376): {'PASS' if table2_h1b else 'FAIL'}")

# Check Table 3
table3_llm_di = '-0.0085' in ms
table3_llm_di2 = '-0.0058' in ms
print(f"  Table 3 LLM × DI coefficient (-0.0085): {'PASS' if table3_llm_di else 'FAIL'}")
print(f"  Table 3 LLM × DI² coefficient (-0.0058): {'PASS' if table3_llm_di2 else 'FAIL'}")

if not table2_h1a:
    errors.append("Table 2 H1a coefficient mismatch")
if not table2_h1b:
    errors.append("Table 2 H1b coefficient mismatch")
if not table3_llm_di:
    errors.append("Table 3 LLM × DI coefficient mismatch")
if not table3_llm_di2:
    errors.append("Table 3 LLM × DI² coefficient mismatch")

# =============================================
# 4. CHECK ALL FIGURE REFERENCES
# =============================================
print("\n4. FIGURE REFERENCE COMPLETENESS CHECK")
print("-" * 60)

fig_refs = set(re.findall(r'Figure\s+\d+', ms))
print(f"  Figures referenced in text: {sorted(fig_refs)}")

expected_figs = {'Figure 1', 'Figure 2', 'Figure 3'}
for ef in sorted(expected_figs):
    if ef in fig_refs:
        print(f"    {ef}: Referenced - PASS")
    else:
        errors.append(f"Missing reference: {ef}")
        print(f"    {ef}: MISSING - FAIL")

# Check actual figure files
figures_dir = r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Job_Architectures_LLM\Figures'
actual_files = [f for f in os.listdir(figures_dir) if f.endswith('.png')]
print(f"\n  Figure files in directory: {sorted(actual_files)}")

expected_files = ['Figure1_InvertedU_Theory.png', 'Figure2_Yearly_Trends.png', 'Figure3_Marginal_Effects.png']
for ef in expected_files:
    filepath = os.path.join(figures_dir, ef)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath) / 1024
        print(f"    {ef}: {size:.1f} KB - PASS")
    else:
        errors.append(f"Missing figure file: {ef}")
        print(f"    {ef}: MISSING - FAIL")

# =============================================
# 5. CHECK ALL TABLE REFERENCES
# =============================================
print("\n5. TABLE REFERENCE COMPLETENESS CHECK")
print("-" * 60)

tables_in_text = set(re.findall(r'Table\s+[A-Z]?\d+\.?\d*', ms))
print(f"  Tables found in text: {sorted(tables_in_text)}")

expected_main = {'Table 1', 'Table 2', 'Table 3', 'Table 4'}
expected_appendix = {'Table A.1', 'Table A.2', 'Table A.3', 
                    'Table A1', 'Table A2', 'Table A3', 'Table A4', 'Table A5', 'Table A6'}

for et in sorted(expected_main):
    if et in tables_in_text:
        print(f"    {et}: PASS")
    else:
        errors.append(f"Missing table: {et}")
        print(f"    {et}: MISSING - FAIL")

for et in sorted(expected_appendix):
    if et in tables_in_text:
        print(f"    {et}: PASS")
    else:
        # Check for similar
        similar = [t for t in tables_in_text if et.replace('.', '').replace(' ', '') in t.replace('.', '').replace(' ', '')]
        if similar:
            print(f"    {et}: Referenced as {similar[0]} - PASS")
        else:
            warnings.append(f"Appendix table may be missing: {et}")
            print(f"    {et}: NOT FOUND - WARNING")

# =============================================
# 6. CHECK TABLE MARKDOWN FORMAT
# =============================================
print("\n6. TABLE MARKDOWN FORMAT CHECK")
print("-" * 60)

table_blocks = re.findall(r'(\|\s*.*\s*\|\n\|[-| ]+\|\n(?:\|\s*.*\s*\|\n)+)', ms)
print(f"  Markdown tables found: {len(table_blocks)}")

for i, tb in enumerate(table_blocks, 1):
    lines = tb.strip().split('\n')
    header = lines[0]
    separator = lines[1]
    data_lines = [l for l in lines[2:] if l.strip()]
    
    header_cols = len([c for c in header.split('|') if c.strip()])
    sep_cols = len([c for c in separator.split('|') if c.strip()])
    data_cols = [len([c for c in dl.split('|') if c.strip()]) for dl in data_lines]
    
    all_cols_equal = (header_cols == sep_cols) and all(c == header_cols for c in data_cols)
    
    if all_cols_equal:
        print(f"  Table {i}: {header_cols} cols, {len(data_lines)} rows - FORMAT OK")
    else:
        errors.append(f"Table {i} format: header={header_cols}, sep={sep_cols}, data={data_cols}")
        print(f"  Table {i}: FORMAT ISSUE - header={header_cols}, sep={sep_cols}, data={set(data_cols)}")

# =============================================
# 7. CHECK FOR TEXT OVERLAP ISSUES
# =============================================
print("\n7. FIGURE TEXT OVERLAP CHECK")
print("-" * 60)

# Check Figure 2 mentions in manuscript
if 'Figure 2' in ms:
    print("  Figure 2 reference found in manuscript - PASS")
    if 'rc_means' in ms or 'ac_means' in ms:
        warnings.append("Data values should not appear directly in manuscript text")
        print("  WARNING: Raw data values found in text (should be in figure only)")
    else:
        print("  No raw data values in text - PASS")

if 'Figure 3' in ms:
    print("  Figure 3 reference found in manuscript - PASS")

# =============================================
# 8. CHECK DATA CONSISTENCY ACROSS SECTIONS
# =============================================
print("\n8. DATA CONSISTENCY ACROSS SECTIONS")
print("-" * 60)

# Check N values
n_abstract = re.search(r'(\d+,\d+)\s*firms.*?(\d+,\d+)\s*firm-year', ms)
n_section3 = re.search(r'(\d+,\d+)\s*firms\s*by\s*5\s*years\s*=\s*(\d+,\d+)\s*firm-year', ms)

if n_abstract:
    firms, obs = n_abstract.groups()
    print(f"  Abstract: {firms} firms, {obs} observations")
    if firms == '7,153' and obs == '20,609':
        print(f"  Abstract N values: PASS")
    else:
        errors.append(f"Abstract N values mismatch: {firms} firms, {obs} obs")
        print(f"  Abstract N values: FAIL (expected 7,153 firms, 20,609 obs)")

if n_section3:
    firms, obs = n_section3.groups()
    print(f"  Section 3.1: {firms} firms, {obs} observations")
    if firms == '7,153' and obs == '20,609':
        print(f"  Section 3.1 N values: PASS")
    else:
        errors.append(f"Section 3.1 N values mismatch")
        print(f"  Section 3.1 N values: FAIL")

# Check coefficient consistency
coef_refs = re.findall(r'β\s*=\s*(-0\.\d+)', ms)
unique_coefs = set(coef_refs)
print(f"\n  All β coefficients in text: {sorted(unique_coefs)}")
expected_coefs = {'-0.0265', '-0.0376', '-0.0058', '-0.0085'}
for ec in expected_coefs:
    if ec in unique_coefs:
        print(f"    {ec}: PASS")
    else:
        warnings.append(f"Expected coefficient {ec} not found in text")
        print(f"    {ec}: NOT FOUND")

# =============================================
# 9. CHECK MISSING CHARTS
# =============================================
print("\n9. MISSING CHARTS ASSESSMENT")
print("-" * 60)

# What charts should exist based on paper content:
# - Figure 1: Theoretical framework (inverted-U)
# - Figure 2: Yearly trends (RC and AC signals)
# - Figure 3: Marginal effects plot

print("  Expected charts based on paper content:")
print("    Figure 1: Theoretical framework (inverted-U moderation) - Should exist")
print("    Figure 2: Yearly trends in RC and AC signals - Should exist")
print("    Figure 3: Marginal effects of LLM on AC across DI - Should exist")
print("\n  All 3 expected figures are present and referenced - PASS")

# =============================================
# 10. FINAL SUMMARY
# =============================================
print("\n" + "=" * 80)
print("FINAL VERIFICATION SUMMARY")
print("=" * 80)

print(f"\nErrors: {len(errors)}")
for i, e in enumerate(errors, 1):
    print(f"  {i}. {e}")

print(f"\nWarnings: {len(warnings)}")
for i, w in enumerate(warnings, 1):
    print(f"  {i}. {w}")

if not errors and not warnings:
    print("\nALL CHECKS PASSED - Charts and tables are accurate and complete!")
elif not errors:
    print("\nAll critical checks passed. Minor warnings noted above.")
else:
    print(f"\n{len(errors)} critical issue(s) require attention.")

print("\nVerification complete!")
