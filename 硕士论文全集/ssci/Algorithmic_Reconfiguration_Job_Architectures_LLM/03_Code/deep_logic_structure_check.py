import re

print("=" * 80)
print("SSCI论文深度逻辑与结构检查")
print("=" * 80)

with open(r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Manuscript_v1.md', 'r', encoding='utf-8') as f:
    ms = f.read()

issues = []
warnings = []
critical = []

# =============================================
# 1. SSCI论文结构范式检查
# =============================================
print("\n1. SSCI论文结构范式检查")
print("-" * 60)

# SSCI标准结构要求：
# Abstract -> Introduction -> Literature/Theory -> Hypotheses -> Methodology -> 
# Results -> Discussion -> Conclusion -> References

structure_flow = [
    ('Abstract', '摘要'),
    ('Keywords', '关键词'),
    ('1. Introduction', '引言'),
    ('2. Theoretical Background', '理论背景'),
    ('Hypothesis', '假设提出'),
    ('3. Methodology', '研究方法'),
    ('4. Empirical Results', '实证结果'),
    ('5. Discussion', '讨论'),
    ('6. Conclusion', '结论'),
    ('References', '参考文献')
]

last_pos = 0
structure_correct = True
for pattern, name in structure_flow:
    pos = ms.find(pattern)
    if pos == -1:
        critical.append(f"缺少{ name }部分")
        print(f"  ✗ {name}: 缺失")
        structure_correct = False
    elif pos < last_pos:
        critical.append(f"{name}位置错误，应该在前面部分之后")
        print(f"  ✗ {name}: 位置错误")
        structure_correct = False
    else:
        print(f"  ✓ {name}: 位置正确")
        last_pos = pos

# =============================================
# 2. 假设推导逻辑检查
# =============================================
print("\n2. 假设推导逻辑检查")
print("-" * 60)

# 检查每个假设是否有完整的推导链条：
# 理论基础 -> 逻辑推理 -> 假设陈述

# H1a推导检查
h1a_context = ms[ms.find('Hypothesis 1a')-500:ms.find('Hypothesis 1a')+100]
h1a_has_theory = 'Autor (2015)' in h1a_context or 'substitution' in h1a_context.lower()
h1a_has_mechanism = 'marginal value' in h1a_context.lower() or 'declines' in h1a_context.lower()
h1a_has_prediction = 'decline' in h1a_context.lower() or 'decrease' in h1a_context.lower()

print(f"  H1a (Substitution):")
print(f"    理论基础: {'✓' if h1a_has_theory else '✗'}")
print(f"    机制解释: {'✓' if h1a_has_mechanism else '✗'}")
print(f"    方向预测: {'✓' if h1a_has_prediction else '✗'}")

if not h1a_has_theory:
    critical.append("H1a缺乏明确的理论基础引用")

# H1b推导检查
h1b_section = ms[ms.find('Hypothesis 1b'):ms.find('Hypothesis 1b')+500]
h1b_is_exploratory = 'exploratory' in h1b_section.lower() or 'without a directional' in h1b_section.lower()
print(f"\n  H1b (Complementary):")
print(f"    探索性声明: {'✓' if h1b_is_exploratory else '✗'}")

if not h1b_is_exploratory:
    warnings.append("H1b应明确声明为探索性假设")

# H2推导检查
h2_section = ms[ms.find('Hypothesis 2'):ms.find('Hypothesis 2')+1000]
h2_has_three_regimes = 'Low-digitalization' in h2_section and 'Moderately' in h2_section and 'Highly' in h2_section
h2_has_theory = 'Cohen and Levinthal' in h2_section or 'absorptive' in h2_section.lower()
h2_has_mechanism = 'inverted-U' in h2_section.lower()

print(f"\n  H2 (Inverted-U Moderation):")
print(f"    三区间论述: {'✓' if h2_has_three_regimes else '✗'}")
print(f"    理论基础: {'✓' if h2_has_theory else '✗'}")
print(f"    非线性机制: {'✓' if h2_has_mechanism else '✗'}")

if not h2_has_three_regimes:
    critical.append("H2缺乏完整的三区间理论推导")

# =============================================
# 3. 理论与方法的一致性检查
# =============================================
print("\n3. 理论与方法一致性检查")
print("-" * 60)

# 理论使用signaling theory，方法应与之对应
theory_methods = {
    'signaling theory': 'human capital disclosures as signals',
    'substitution-complementary': 'task signal intensities',
    'absorptive capacity': 'digital infrastructure as moderator'
}

for theory, method in theory_methods.items():
    theory_count = ms.lower().count(theory.lower())
    method_count = ms.lower().count(method.lower())
    
    if theory_count > 0 and method_count > 0:
        print(f"  ✓ {theory}: 理论({theory_count}次) -> 方法({method_count}次)")
    elif theory_count > 0 and method_count == 0:
        critical.append(f"理论'{theory}'未转化为可操作方法")
        print(f"  ✗ {theory}: 理论提及{theory_count}次，但未转化为方法")
    else:
        print(f"  - {theory}: 未使用")

# =============================================
# 4. 实证设计与假设对应检查
# =============================================
print("\n4. 实证设计与假设对应检查")
print("-" * 60)

# H1a应该测试LLM exposure对RC的影响
# H1b应该测试LLM exposure对AC的影响
# H2应该测试DI的调节效应（含平方项）

# 检查TWFE模型设定
twfe_section = ms[ms.find('two-way fixed effects'):ms.find('two-way fixed effects')+500]
has_firm_fe = 'firm' in twfe_section.lower() and 'fixed effects' in twfe_section.lower()
has_year_fe = 'year' in twfe_section.lower() and 'fixed effects' in twfe_section.lower()
has_interaction = 'LLM_Exp × DI' in twfe_section or 'LLM × DI' in ms
has_squared = 'DI²' in ms or 'DI^2' in ms

print(f"  TWFE模型设定:")
print(f"    企业固定效应: {'✓' if has_firm_fe else '✗'}")
print(f"    年份固定效应: {'✓' if has_year_fe else '✗'}")
print(f"    交互项: {'✓' if has_interaction else '✗'}")
print(f"    平方项(检验H2): {'✓' if has_squared else '✗'}")

if not has_squared:
    critical.append("H2需要平方交互项来检验倒U型调节")

# =============================================
# 5. 结果解释与假设对应检查
# =============================================
print("\n5. 结果解释与假设对应检查")
print("-" * 60)

# 检查每个假设的结果是否都有明确的解释
h1a_result = 'H1a supported' in ms or 'supporting the substitution' in ms.lower()
h1b_result = 'H1b exploratory' in ms or 'post-complementary absorption' in ms.lower()
h2_result = 'H2 supported' in ms or 'supporting the inverted-U' in ms.lower()

print(f"  H1a结果解释: {'✓' if h1a_result else '✗'}")
print(f"  H1b结果解释: {'✓' if h1b_result else '✗'}")
print(f"  H2结果解释: {'✓' if h2_result else '✗'}")

if not h1a_result:
    warnings.append("H1a结果需要更明确的支持/不支持声明")
if not h1b_result:
    warnings.append("H1b结果需要解释与理论预期的差异")
if not h2_result:
    critical.append("H2结果需要明确的支持/不支持声明")

# =============================================
# 6. 讨论部分逻辑检查
# =============================================
print("\n6. 讨论部分逻辑检查")
print("-" * 60)

discussion = ms[ms.find('5. Discussion'):]

# 讨论应该：
# 1. 回应Introduction提出的研究问题
# 2. 解释发现的理论意义
# 3. 说明方法学贡献
# 4. 讨论实际意义
# 5. 承认局限性

intro_questions = ms[ms.find('1. Introduction'):ms.find('2. Theoretical')]
discussion_responses = {
    'theoretical_contribution': 'Theoretical Contributions' in discussion,
    'methodological_contribution': 'Methodological Contributions' in discussion,
    'practical_implication': 'Practical Implications' in discussion,
    'limitations': 'Limitations' in discussion,
}

for item, present in discussion_responses.items():
    print(f"  {item}: {'✓' if present else '✗'}")
    if not present:
        warnings.append(f"讨论部分缺少{item}")

# =============================================
# 7. 逻辑通病检查
# =============================================
print("\n7. 常见逻辑通病检查")
print("-" * 60)

# 7.1 循环论证
if 'because' in ms.lower() and ms.lower().count('because') > ms.lower().count('because the'):
    # 检查是否有"X是Y因为X是Y"的模式
    circular_patterns = re.findall(r'(\w+) is (\w+).*because.*\1.*\2', ms, re.IGNORECASE)
    if circular_patterns:
        warnings.append(f"可能的循环论证: {circular_patterns[0]}")
    else:
        print(f"  ✓ 无循环论证")

# 7.2 因果与相关混淆
correlation_causation = re.findall(r'(?i)(association|correlation).*?(cause|effect|impact)', ms)
if correlation_causation:
    warnings.append("可能存在因果与相关混淆的表述")
    print(f"  ⚠ 发现{len(correlation_causation)}处因果/相关混合表述")
else:
    print(f"  ✓ 因果与相关表述区分清楚")

# 7.3 样本外推
if 'generaliz' in ms.lower():
    print(f"  ✓ 讨论了推广性问题")
else:
    warnings.append("未讨论研究结果的可推广性")

# 7.4 内生性处理
if 'endogeneity' in ms.lower() or 'instrumental variable' in ms.lower():
    print(f"  ✓ 讨论了内生性问题")
else:
    critical.append("未讨论内生性问题")

# 7.5 稳健性检验
robustness_count = ms.lower().count('robustness')
print(f"  稳健性检验提及次数: {robustness_count}")
if robustness_count < 3:
    warnings.append("稳健性检验讨论不足")

# =============================================
# 8. 方法论逻辑检查
# =============================================
print("\n8. 方法论逻辑检查")
print("-" * 60)

# 检查测量方法是否与构念定义一致
measurement_logic = {
    'LLM exposure construct': 'Eloundou' in ms and 'occupation-level' in ms,
    'task signal construct': 'zero-shot encoding' in ms or 'Qwen' in ms,
    'digital infrastructure construct': 'composite' in ms.lower() and 'z-score' in ms.lower(),
    'control variables': 'size' in ms.lower() and 'leverage' in ms.lower(),
}

for construct, valid in measurement_logic.items():
    print(f"  {construct}: {'✓' if valid else '✗'}")
    if not valid:
        critical.append(f"{construct}的测量方法不明确")

# =============================================
# 9. 思维连贯性检查
# =============================================
print("\n9. 思维连贯性检查")
print("-" * 60)

# 检查从Introduction到Conclusion的逻辑链条
intro_puzzle = 'puzzle' in ms[ms.find('1. Introduction'):ms.find('2. Theoretical')].lower()
conclusion_answers = ms[ms.find('6. Conclusion'):].count('finding')

print(f"  Introduction提出研究难题: {'✓' if intro_puzzle else '✗'}")
print(f"  Conclusion回应研究发现: {'✓' if conclusion_answers > 0 else '✗'}")

if not intro_puzzle:
    warnings.append("Introduction应明确提出研究难题(puzzle)")

# 检查理论贡献是否与Introduction的贡献声明对应
intro_contributions = ms[ms.find('1. Introduction'):ms.find('2. Theoretical')].count('contribution')
discussion_contributions = ms[ms.find('5. Discussion'):ms.find('6. Conclusion')].count('contribution')

print(f"  Introduction贡献声明: {intro_contributions}次")
print(f"  Discussion贡献回应: {discussion_contributions}次")

if discussion_contributions < intro_contributions:
    warnings.append("Discussion未充分回应Introduction的贡献声明")

# =============================================
# 10. 核心逻辑链条完整性
# =============================================
print("\n10. 核心逻辑链条完整性")
print("-" * 60)

logic_chain = [
    ('理论基础', 'signaling theory', 'Spence'),
    ('理论框架', 'substitution-complementary', 'Autor'),
    ('调节理论', 'absorptive capacity', 'Cohen'),
    ('操作化1', 'LLM exposure', 'Eloundou'),
    ('操作化2', 'task signals', 'SEC'),
    ('实证方法', 'two-way fixed effects', ''),
    ('稳健性', 'entropy balancing', 'Hainmueller'),
]

for name, concept, author in logic_chain:
    has_concept = concept.lower() in ms.lower()
    has_author = author.lower() in ms.lower() if author else True
    
    if has_concept and has_author:
        print(f"  ✓ {name}: {concept} ({author})")
    else:
        critical.append(f"{name}环节缺失：{concept}")
        print(f"  ✗ {name}: {concept} - 缺失")

# =============================================
# 最终汇总
# =============================================
print("\n" + "=" * 80)
print("深度逻辑检查汇总")
print("=" * 80)

print(f"\n严重问题 (Critical): {len(critical)}")
for i, c in enumerate(critical, 1):
    print(f"  {i}. {c}")

print(f"\n警告 (Warnings): {len(warnings)}")
for i, w in enumerate(warnings, 1):
    print(f"  {i}. {w}")

print(f"\n问题 (Issues): {len(issues)}")
for i, issue in enumerate(issues, 1):
    print(f"  {i}. {issue}")

if not critical and not warnings:
    print("\n✓ 所有逻辑检查通过！论文结构严谨，逻辑清晰")
elif not critical:
    print(f"\n论文逻辑基本通顺，但有{len(warnings)}个警告需要注意")
else:
    print(f"\n论文存在{len(critical)}个严重逻辑问题，建议修复")

print("\n检查完成!")
