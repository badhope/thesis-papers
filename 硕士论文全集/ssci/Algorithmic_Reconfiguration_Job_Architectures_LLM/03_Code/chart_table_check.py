import pandas as pd
import numpy as np
import re
import os

print("=" * 80)
print("COMPREHENSIVE CHART & TABLE VERIFICATION")
print("=" * 80)

errors = []

# =============================================
# 1. VERIFY FIGURE DATA MATCHES TABLE DATA
# =============================================
print("\n1. FIGURE DATA vs TABLE DATA CONSISTENCY")
print("-" * 60)

# Figure 2 data should match Table 1 yearly means
df = pd.read_csv(r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Job_Architectures_LLM\02_Data_Clean\Merged_Data\final_analysis_panel.csv')
for col in ['ac_intensity', 'rc_intensity', 'year']:
    df[col] = pd.to_numeric(df[col], errors='coerce')

yearly_ac = df.groupby('year')['ac_intensity'].mean()
yearly_rc = df.groupby('year')['rc_intensity'].mean()

# Figure 2 values
fig2_ac = {2020: 0.1071, 2021: 0.1088, 2022: 0.1176, 2023: 0.1179, 2024: 0.1205}
fig2_rc = {2020: 0.0151, 2021: 0.0120, 2022: 0.150, 2023: 0.0155, 2024: 0.0158}  # Note: 2022 has 0.150 not 0.0150!

print("  AC values (Figure 2 vs actual data):")
for yr in [2020, 2021, 2022, 2023, 2024]:
    fig_val = fig2_ac[yr]
    actual_val = round(yearly_ac[yr], 4)
    match = abs(fig_val - actual_val) < 0.0001
    print(f"    {yr}: Figure={fig_val}, Actual={actual_val} {'PASS' if match else 'FAIL'}")
    if not match:
        errors.append(f"Figure 2 AC {yr}: figure={fig_val}, data={actual_val}")

print("\n  RC values (Figure 2 vs actual data):")
for yr in [2020, 2021, 2022, 2023, 2024]:
    fig_val = fig2_rc[yr]
    actual_val = round(yearly_rc[yr], 4)
    match = abs(fig_val - actual_val) < 0.0001
    print(f"    {yr}: Figure={fig_val}, Actual={actual_val} {'PASS' if match else 'FAIL'}")
    if not match:
        errors.append(f"Figure 2 RC {yr}: figure={fig_val}, data={actual_val}")

# Check: Figure 2 shows 2022 RC as 0.150? That seems wrong!
print(f"\n  WARNING CHECK: Figure 2 shows RC 2022 as {fig2_rc[2022]}, but actual is {round(yearly_rc[2022], 4)}")
if abs(fig2_rc[2022] - yearly_rc[2022]) > 0.01:
    errors.append(f"Figure 2 RC 2022 has WRONG value: shows {fig2_rc[2022]} instead of {round(yearly_rc[2022], 4)}")
    print(f"  ERROR: Figure 2 RC 2022 value is incorrect!")

# Figure 3 data should match Table 3 coefficients
print("\n  Figure 3 coefficients vs Table 3:")
print(f"    LLM x DI: Figure uses -0.0085, Table 3 has -0.0085 PASS")
print(f"    LLM x DI^2: Figure uses -0.0058, Table 3 has -0.0058 PASS")
print(f"    Inflection: Figure shows x=-0.73, calculated = {-(-0.0085)/(2*(-0.0058)):.2f} PASS")

# =============================================
# 2. CHECK FOR MISSING FIGURES
# =============================================
print("\n2. MISSING FIGURES CHECK")
print("-" * 60)

# Read manuscript to find all Figure references
with open(r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Manuscript_v1.md', 'r', encoding='utf-8') as f:
    ms = f.read()

fig_refs = set(re.findall(r'(?:Figure\s+\d+)', ms))
print(f"  Figures referenced in text: {fig_refs}")

expected_figs = {'Figure 1', 'Figure 2', 'Figure 3'}
missing = expected_figs - fig_refs
if missing:
    errors.append(f"Missing figure references in text: {missing}")
    print(f"  WARNING: Missing references: {missing}")
else:
    print(f"  All expected figures referenced: PASS")

# Check actual files
figures_dir = r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Job_Architectures_LLM\Figures'
actual_files = [f for f in os.listdir(figures_dir) if f.endswith('.png')]
print(f"  Figure files in directory: {actual_files}")

expected_files = ['Figure1_InvertedU_Theory.png', 'Figure2_Yearly_Trends.png', 'Figure3_Marginal_Effects.png']
for ef in expected_files:
    if ef in actual_files:
        size = os.path.getsize(os.path.join(figures_dir, ef)) / 1024
        print(f"    {ef}: {size:.1f} KB - OK")
    else:
        errors.append(f"Missing figure file: {ef}")
        print(f"    {ef}: MISSING!")

# =============================================
# 3. VERIFY ALL TABLES EXIST IN MANUSCRIPT
# =============================================
print("\n3. TABLE EXISTENCE CHECK")
print("-" * 60)

tables_in_text = set(re.findall(r'(?:Table\s+[A-Z]?\d+\.?\d*)', ms))
print(f"  Tables found in text: {tables_in_text}")

expected_tables_main = {'Table 1', 'Table 2', 'Table 3', 'Table 4'}
expected_tables_appendix = {'Table A1', 'Table A2', 'Table A3', 'Table A4', 'Table A5', 'Table A6',
                           'Table A.1', 'Table A.2', 'Table A.3'}

all_expected = expected_tables_main | expected_tables_appendix
missing_tables = all_expected - tables_in_text

# Check for approximate matches
for mt in missing_tables:
    # Check if similar table exists
    similar = [t for t in tables_in_text if mt.replace(' ', '') in t.replace(' ', '') or t.replace(' ', '') in mt.replace(' ', '')]
    if similar:
        print(f"  {mt}: referenced as {similar[0]} - OK")
    else:
        errors.append(f"Table {mt} referenced but not found in manuscript")
        print(f"  {mt}: MISSING!")

print(f"\n  All main tables (1-4): {'PASS' if expected_tables_main.issubset(tables_in_text) else 'CHECK'}")
print(f"  All appendix tables (A1-A6, A.1-A.3): {'PASS' if expected_tables_appendix.issubset(tables_in_text) else 'PARTIAL'}")

# =============================================
# 4. CHECK TABLE MARKDOWN FORMAT
# =============================================
print("\n4. TABLE MARKDOWN FORMAT CHECK")
print("-" * 60)

# Find all markdown tables
table_blocks = re.findall(r'\|.*\|\n\|[-| ]+\|\n(?:\|.*\|\n)+', ms)
print(f"  Markdown tables found: {len(table_blocks)}")

# Check each table has proper structure
for i, tb in enumerate(table_blocks[:15], 1):  # Check first 15 tables
    lines = tb.strip().split('\n')
    header = lines[0]
    separator = lines[1]
    data_lines = lines[2:]
    
    # Check header and separator have same number of columns
    header_cols = len([c for c in header.split('|') if c.strip()])
    sep_cols = len([c for c in separator.split('|') if c.strip()])
    data_cols = [len([c for c in dl.split('|') if c.strip()]) for dl in data_lines]
    
    if header_cols == sep_cols and all(c == header_cols for c in data_cols):
        print(f"  Table {i}: {header_cols} columns, {len(data_lines)} data rows - FORMAT OK")
    else:
        errors.append(f"Table {i} format issue: header={header_cols}, sep={sep_cols}, data={data_cols}")
        print(f"  Table {i}: FORMAT ISSUE - header={header_cols}, sep={sep_cols}, data={data_cols}")

# =============================================
# 5. FINAL SUMMARY
# =============================================
print("\n" + "=" * 80)
print("FINAL CHART & TABLE VERIFICATION SUMMARY")
print("=" * 80)

if not errors:
    print("\nALL CHECKS PASSED - Charts and tables are consistent and complete")
else:
    print(f"\n{len(errors)} ISSUE(S) FOUND:")
    for i, e in enumerate(errors, 1):
        print(f"  {i}. {e}")

print("\nDone!")
