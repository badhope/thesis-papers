import re
import os

print("=" * 80)
print("SSCI论文终稿全面检查清单")
print("=" * 80)

# 读取论文
ms_path = r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Manuscript_v1.md'
with open(ms_path, 'r', encoding='utf-8') as f:
    ms = f.read()

issues = []
warnings = []

# =============================================
# 1. 参考文献格式检查
# =============================================
print("\n1. 参考文献格式检查")
print("-" * 60)

# 提取References部分
ref_section = ms.split('**References**')[1] if '**References**' in ms else ""
refs = [r.strip() for r in ref_section.split('\n\n') if r.strip()]

print(f"  找到 {len(refs)} 条参考文献")

# 检查每条参考文献是否包含必要元素（作者、年份、标题、期刊）
for ref in refs[:5]:  # 检查前5条
    has_year = bool(re.search(r'\(\d{4}\)', ref))
    has_title = '.' in ref
    has_journal = bool(re.search(r'[A-Z][a-z]+ [A-Z][a-z]+', ref))
    print(f"  ✓ 年份:{'✓' if has_year else '✗'} 标题:{'✓' if has_title else '✗'} 期刊:{'✓' if has_journal else '✗'}")
    if not has_year:
        issues.append(f"参考文献可能缺少年份: {ref[:50]}...")

# =============================================
# 2. 引用一致性检查
# =============================================
print("\n2. 引用一致性检查")
print("-" * 60)

# 找出正文中所有引用 (Author, Year) 格式
citations = re.findall(r'\(([A-Z][a-z]+[\s&]*[A-Z]?[a-z]+, \d{4})\)', ms)
print(f"  正文引用数量: {len(citations)}")

# 检查引用的文献是否在References中存在
for cite in citations[:10]:  # 检查前10个
    author_year = cite
    if author_year not in ref_section:
        # 尝试模糊匹配
        author = cite.split(',')[0].strip()
        if author not in ref_section:
            warnings.append(f"引用可能在参考文献中不存在: {cite}")
        else:
            pass  # 可能在
    else:
        pass  # 正确引用

print(f"  已检查前10个引用的有效性")

# =============================================
# 3. 章节完整性检查
# =============================================
print("\n3. 章节完整性检查")
print("-" * 60)

expected_sections = [
    'Abstract',
    'Keywords',
    '1. Introduction',
    '2. Theoretical Background',
    '3. Methodology',
    '4. Empirical Results',
    '5. Discussion',
    '6. Conclusion',
    'Appendix',
    'References'
]

for section in expected_sections:
    if section in ms:
        print(f"  ✓ {section}")
    else:
        issues.append(f"缺少章节: {section}")
        print(f"  ✗ {section} - 缺失!")

# =============================================
# 4. 假设一致性检查
# =============================================
print("\n4. 假设一致性检查")
print("-" * 60)

hypotheses_in_text = re.findall(r'Hypothesis\s+[0-9]+[a-z]?', ms)
print(f"  文中提到的假设: {set(hypotheses_in_text)}")

expected_hypotheses = ['Hypothesis 1a', 'Hypothesis 1b', 'Hypothesis 2']
for h in expected_hypotheses:
    if h in ms:
        print(f"  ✓ {h}")
    else:
        issues.append(f"缺少假设: {h}")
        print(f"  ✗ {h} - 缺失!")

# =============================================
# 5. 术语一致性检查
# =============================================
print("\n5. 术语一致性检查")
print("-" * 60)

# 检查关键术语是否一致使用
terms = {
    'LLM exposure': 'LLM_Exposure',
    'routine cognitive': 'Routine Cognitive',
    'AI-collaborative': 'AI-Collaborative',
    'digital infrastructure': 'Digital Infrastructure',
    'absorptive capacity': 'Absorptive Capacity',
    'post-complementary absorption': 'Post-Complementary Absorption'
}

for term, variant in terms.items():
    count = ms.lower().count(term.lower())
    print(f"  '{term}': 出现 {count} 次")
    if count == 0:
        warnings.append(f"术语 '{term}' 未找到")

# =============================================
# 6. 公式/统计符号检查
# =============================================
print("\n6. 统计符号和公式检查")
print("-" * 60)

# 检查β符号
beta_count = ms.count('β')
print(f"  β符号出现次数: {beta_count}")

# 检查p值格式
p_values = re.findall(r'p\s*=\s*\d+\.\d+', ms)
print(f"  p值格式: {len(p_values)} 个")

# 检查显著性标记
sig_markers = re.findall(r'\*{1,3}', ms)
print(f"  显著性标记(*, **, ***): {len(sig_markers)} 个")

# =============================================
# 7. 语法和拼写检查（基本）
# =============================================
print("\n7. 基本语法检查")
print("-" * 60)

# 检查常见拼写错误
common_errors = {
    'teh': 'the',
    'recieve': 'receive',
    'occured': 'occurred',
    'seperate': 'separate',
}

for wrong, correct in common_errors.items():
    if wrong in ms.lower():
        issues.append(f"可能的拼写错误: '{wrong}' 应为 '{correct}'")
        print(f"  ✗ 发现拼写错误: '{wrong}'")
    else:
        print(f"  ✓ 检查 '{wrong}' - 无错误")

# =============================================
# 8. 数字格式一致性
# =============================================
print("\n8. 数字格式一致性检查")
print("-" * 60)

# 检查大数字的格式（千位分隔符）
numbers_with_commas = re.findall(r'\d{1,3}(,\d{3})+', ms)
print(f"  使用千位分隔符的数字: {len(numbers_with_commas)} 个")

# 检查小数格式
decimals = re.findall(r'\d+\.\d+', ms)
print(f"  小数数量: {len(decimals)} 个")

# =============================================
# 9. 学术规范检查
# =============================================
print("\n9. 学术规范检查")
print("-" * 60)

# 检查是否使用了第一人称（应避免或限制）
first_person = re.findall(r'\b(?:I|we|our|ours)\b', ms, re.IGNORECASE)
if len(first_person) > 20:
    warnings.append(f"第一人称使用过多 ({len(first_person)}次)")
    print(f"  ⚠ 第一人称使用: {len(first_person)} 次（可能过多）")
else:
    print(f"  ✓ 第一人称使用: {len(first_person)} 次（适当）")

# 检查缩写定义
abbreviations = re.findall(r'\b([A-Z]{2,})\b', ms)
unique_abbrevs = set(abbreviations)
print(f"  使用的缩写: {len(unique_abbrevs)} 个")

# =============================================
# 10. 表格和图引用检查
# =============================================
print("\n10. 表格和图引用检查")
print("-" * 60)

# 检查所有Table是否在文中被引用
table_defs = re.findall(r'\*\*Table\s+\d+', ms)
table_refs = re.findall(r'Table\s+\d+', ms)
print(f"  定义的表格: {len(table_defs)} 个")
print(f"  引用表格: {len(table_refs)} 次")

# 检查所有Figure是否在文中被引用
fig_defs = re.findall(r'\*\*Figure\s+\d+', ms)
fig_refs = re.findall(r'Figure\s+\d+', ms)
print(f"  定义的图: {len(fig_defs)} 个")
print(f"  引用图: {len(fig_refs)} 次")

# =============================================
# 11. 数据可用性声明
# =============================================
print("\n11. 数据可用性检查")
print("-" * 60)

if 'data available' in ms.lower() or 'data availability' in ms.lower():
    print("  ✓ 包含数据可用性声明")
else:
    warnings.append("缺少数据可用性声明")
    print("  ⚠ 未找到数据可用性声明")

# 检查数据来源说明
if 'Source:' in ms:
    sources = re.findall(r'Source: [^\.]+', ms)
    print(f"  ✓ 数据来源说明: {len(sources)} 处")
else:
    warnings.append("缺少数据来源说明")
    print("  ⚠ 未找到数据来源说明")

# =============================================
# 12. 利益冲突声明
# =============================================
print("\n12. 学术声明检查")
print("-" * 60)

if 'conflict of interest' in ms.lower() or 'competing interest' in ms.lower():
    print("  ✓ 包含利益冲突声明")
else:
    warnings.append("缺少利益冲突声明")
    print("  ⚠ 未找到利益冲突声明")

# =============================================
# 13. 致谢部分
# =============================================
print("\n13. 致谢部分检查")
print("-" * 60)

if 'Acknowledg' in ms or '致谢' in ms:
    print("  ✓ 包含致谢部分")
else:
    warnings.append("缺少致谢部分")
    print("  ⚠ 未找到致谢部分")

# =============================================
# 最终汇总
# =============================================
print("\n" + "=" * 80)
print("检查汇总")
print("=" * 80)

print(f"\n问题 (Issues): {len(issues)}")
for i, issue in enumerate(issues, 1):
    print(f"  {i}. {issue}")

print(f"\n警告 (Warnings): {len(warnings)}")
for i, warn in enumerate(warnings, 1):
    print(f"  {i}. {warn}")

if not issues and not warnings:
    print("\n✓ 所有检查通过!")
else:
    print(f"\n共发现 {len(issues)} 个问题，{len(warnings)} 个警告")

print("\n检查完成!")
