import re

with open(r'c:\Users\Administrator\Desktop\thesis-papers\硕士论文全集\ssci\Algorithmic_Reconfiguration_Manuscript_v1.md', 'r', encoding='utf-8') as f:
    ms = f.read()
    lines = ms.split('\n')

print("=" * 80)
print("论文AI痕迹与口语化检查")
print("=" * 80)

issues = []

# 1. 检查第一人称
print("\n1. 第一人称使用检查")
print("-" * 60)

first_person_patterns = {
    'we': r'\bWe\b',
    'our': r'\bour\b',
    'us': r'\bus\b',
}

for pattern, name in first_person_patterns.items():
    matches = [(i+1, line.strip()) for i, line in enumerate(lines) if re.search(name, line)]
    if matches:
        print(f"\n  '{name}' 出现 {len(matches)} 次:")
        for line_num, line_text in matches[:10]:
            print(f"    L{line_num}: {line_text[:80]}...")
            issues.append(f"L{line_num}: 第一人称 '{name}' - {line_text[:60]}")

# 2. 检查AI常见表达
print("\n2. AI风格表达检查")
print("-" * 60)

ai_patterns = [
    (r'\bdelve\b', 'delve (AI常用)'),
    (r'\bcrucial\b', 'crucial (过度使用)'),
    (r'\bpivotal\b', 'pivotal (AI常用)'),
    (r'\bunderscore\b', 'underscore (AI常用)'),
    (r'\btestament\b', 'testament (AI常用)'),
    (r'\bnuanced\b', 'nuanced (AI常用)'),
    (r'\bmultifaceted\b', 'multifaceted (AI常用)'),
    (r'\brit is important to note\b', 'it is important to note (冗余)'),
    (r'\bit should be noted\b', 'it should be noted (冗余)'),
    (r'\bthis paper aims\b', 'this paper aims (模板化)'),
]

for pattern, desc in ai_patterns:
    matches = [(i+1, line.strip()) for i, line in enumerate(lines) if re.search(pattern, line, re.IGNORECASE)]
    if matches:
        print(f"\n  {desc}: {len(matches)} 次")
        for line_num, line_text in matches[:5]:
            print(f"    L{line_num}: {line_text[:80]}")
            issues.append(f"L{line_num}: {desc} - {line_text[:60]}")

# 3. 检查口语化表达
print("\n3. 口语化表达检查")
print("-" * 60)

informal_patterns = [
    (r'\bget\b', 'get (过于口语)'),
    (r'\bgo\b', 'go (过于口语)'),
    (r'\bdo\b', 'do (过于简单)'),
    (r'\bthing\b', 'thing (不具体)'),
    (r'\blot of\b', 'lot of (不正式)'),
    (r'\ba lot\b', 'a lot (不正式)'),
    (r'\bbig\b', 'big (不精确)'),
    (r'\bvery\b', 'very (弱修饰)'),
    (r'\breally\b', 'really (口语)'),
]

for pattern, desc in informal_patterns:
    matches = [(i+1, line.strip()) for i, line in enumerate(lines) if re.search(pattern, line, re.IGNORECASE)]
    if matches and len(matches) > 2:
        print(f"  {desc}: {len(matches)} 次")
        issues.append(f"{desc}出现{len(matches)}次")

# 4. 检查长句和复杂句
print("\n4. 句子长度检查")
print("-" * 60)

long_sentences = []
for i, line in enumerate(lines):
    if len(line) > 200 and not line.startswith('|') and not line.startswith('#'):
        long_sentences.append((i+1, line.strip()))

if long_sentences:
    print(f"  超过200字符的句子: {len(long_sentences)} 个")
    for line_num, line_text in long_sentences[:5]:
        print(f"    L{line_num}: {line_text[:100]}...")

# 汇总
print("\n" + "=" * 80)
print(f"共发现 {len(issues)} 个需要润色的位置")
print("=" * 80)
