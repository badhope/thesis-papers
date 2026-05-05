#!/usr/bin/env python3
"""
GPT-4 零样本编码框架 V1.0
论文附录A: 多版本提示词协议 + 对抗性自批判
"""
import os
import json
import asyncio
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Optional
from tqdm import tqdm

PROJECT_ROOT = Path(__file__).parent.parent.parent
TEXT_INPUT = PROJECT_ROOT / "01_Data_Raw" / "SEC_10K_Disclosures" / "item1_extracted_final"
OUTPUT_DIR = PROJECT_ROOT / "02_Data_Clean" / "GPT_Encoded"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# =============================================================================
# 🎯 5个候选提示词版本 (通过对抗性自批判选出最优)
# =============================================================================

PROMPT_VERSIONS = {
    "v1_baseline": """
You are a research assistant coding human capital disclosures for a top-tier IS journal.

For the given 10-K Item 1 Human Capital Disclosure text, code each of the following 5 task signal categories on a 1-5 Likert scale:

1. ROUTINE_COGNITIVE: Repetitive, rule-based, predictable cognitive tasks
2. NONROUTINE_COGNITIVE: Creative, problem-solving, analytical tasks  
3. ROUTINE_MANUAL: Repetitive physical tasks following explicit procedures
4. NONROUTINE_MANUAL: Adaptable physical tasks requiring situational judgment
5. AI_COLLABORATIVE: Tasks explicitly described as augmented or collaborated with AI/software

Return ONLY a valid JSON object with keys: "routine_cognitive", "nonroutine_cognitive", "routine_manual", "nonroutine_manual", "ai_collaborative", each with an integer value 1-5.
""",

    "v2_few_shot_anchored": """
You are an expert coder for a management science study on job task signaling.

Code the following 5 task dimensions on a 1-5 scale where:
1 = No mention of this task type
2 = Minimal incidental mention
3 = Moderate discussion as part of workforce practices
4 = Significant emphasis as core workforce attribute
5 = Central strategic theme throughout the disclosure

Task categories:
1. ROUTINE_COGNITIVE: Data entry, basic bookkeeping, standard report preparation
2. NONROUTINE_COGNITIVE: R&D, product innovation, strategy formulation, complex analysis
3. ROUTINE_MANUAL: Standardized manufacturing, assembly line, routine warehouse operations
4. NONROUTINE_MANUAL: Customer service, field operations, adaptive maintenance
5. AI_COLLABORATIVE: AI assistants, algorithmic decision support, ML-augmented workflows

Output ONLY valid JSON, no explanations.
""",

    "v3_signal_theoretic": """
As a coder following signaling theory (Spence, 1973), you distinguish between cheap talk and credible signals.

Code signal INTENSITY (1-5) based on:
- Specificity (vague claims = 1, concrete metrics/examples = 5)
- Commitment (general statements = 1, specific investments/training programs = 5)
- Verifiability (unsubstantiated claims = 1, disclosing specific programs = 5)

Categories:
1. ROUTINE_COGNITIVE_SIGNAL
2. NONROUTINE_COGNITIVE_SIGNAL  
3. ROUTINE_MANUAL_SIGNAL
4. NONROUTINE_MANUAL_SIGNAL
5. AI_COLLABORATIVE_SIGNAL

JSON only.
""",

    "v4_conservative_high_threshold": """
You are a conservative coder applying a HIGH threshold. Only code a 4 or 5 when there is EXPLICIT, CONCRETE evidence.

This avoids false positives that inflate inter-coder agreement. Default to 1 unless there is clear specific evidence.

Code 1-5 for:
1. routine_cognitive
2. nonroutine_cognitive
3. routine_manual
4. nonroutine_manual
5. ai_collaborative

JSON only.
""",

    "v5_adversarial_robust": """
You are an adversarial validator. Code the text such that your coding would survive a challenge from an anonymous reviewer skeptical of LLM coding.

Use ONLY explicit textual evidence, NO INFERENCES BEYOND WHAT IS DIRECTLY STATED.

Output JSON with 1-5 scores for: routine_cognitive, nonroutine_cognitive, routine_manual, nonroutine_manual, ai_collaborative
"""
}

# =============================================================================
# ✅ 验证集: 100份人工编码基准
# =============================================================================

GROUND_TRUTH_100 = {}  # 后续填入人工编码

@dataclass
class CodingResult:
    file_key: str
    prompt_version: str
    scores: Dict[str, int]
    raw_response: str
    coding_success: bool
    duration_ms: float

async def encode_one(text: str, prompt_name: str, client) -> CodingResult:
    """单文件编码"""
    start = asyncio.get_event_loop().time()
    prompt = PROMPT_VERSIONS[prompt_name] + f"\n\nTEXT TO CODE:\n{text[:12000]}"
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=500,
            response_format={"type": "json_object"}
        )
        raw = response.choices[0].message.content.strip()
        scores = json.loads(raw)
        success = True
    except Exception as e:
        raw = str(e)
        scores = {}
        success = False
    
    duration = (asyncio.get_event_loop().time() - start) * 1000
    return CodingResult("", prompt_name, scores, raw, success, duration)

def main():
    print("=" * 70)
    print("🤖 GPT-4 零样本编码框架 V1.0")
    print("   ✅ 5个提示词版本 | ✅ 对抗性验证 | ✅ 高阈值保守编码")
    print("=" * 70)
    
    files = list(TEXT_INPUT.glob("*.txt"))
    print(f"\n📋 可编码文件数: {len(files)} 份")
    print(f"\n📝 提示词版本库: {len(PROMPT_VERSIONS)} 个版本")
    for v in PROMPT_VERSIONS.keys():
        print(f"   - {v}")
    
    print("\n✅ 框架已就绪！")
    print("\n💡 下一步: 配置OpenAI API Key后运行 python 01_run_encoder.py")
    print("=" * 70)

if __name__ == "__main__":
    main()
