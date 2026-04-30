# 数据流水线任务说明书

## 📋 总览
完整数据流水线 = 7个模块 × 5层稳健性防御

---

## 🎯 模块1: SEC 10-K 爬虫任务

### 任务目标
下载 4,847家美国上市公司 2020-2024年 10-K报告中的 Item 1 Human Capital Disclosure章节

### 输入数据
- 起始年份：2020年11月（SEC人力资本披露规则生效）
- 结束年份：2024年12月31日
- 样本公司：Compustat全部美国上市公司，剔除金融行业(SIC 6000-6999)

### 交付物清单
| 文件名 | 格式 | 说明 |
|--------|------|------|
| `edgar_master_index_2020_2024.csv` | CSV | EDGAR主索引，所有10-K的URL |
| `sec_10k_metadata.parquet` | Parquet | CIK, 公司名, 财年, 文件URL, 提交日期 |
| `item1_human_capital_texts.parquet` | Parquet | 纯净的人力资本披露文本 |
| `crawler_error_log.csv` | CSV | 下载失败记录 |

### 验收标准
- ✅ 最终样本量 N ≈ 24,235 (4,847 firms × 5 years)
- ✅ 每个公司至少3年连续观测
- ✅ 纯净文本无HTML标签、签名、页脚噪音
- ✅ Item 1边界切割准确率 > 95% (抽样验证)

---

## 🎯 模块2: GPT任务编码任务

### 任务目标
对24,235份文本进行多维度任务信号编码

### 五层防御体系要求
1. **提示词层**: 5个独立版本，对抗自批判生成
2. **模型层**: GPT-4 Turbo, GPT-3.5 Turbo, Claude-3.5-Sonnet
3. **验证层**: 100样本人工标注金标准
4. **一致性层**: Cohen's Kappa > 0.75
5. **确定性层**: temperature = 0

### 交付物清单
| 文件名 | 格式 | 说明 |
|--------|------|------|
| `coding_prompt_{1-5}.txt` | TXT | 5个提示词版本 |
| `human_ground_truth_100.xlsx` | Excel | 人工标注金标准 |
| `task_signals_main.parquet` | Parquet | 主编码结果 (Prompt #3 + GPT-4) |
| `task_signals_prompt_robustness.parquet` | Parquet | 5个提示词的编码结果 |
| `task_signals_model_robustness.parquet` | Parquet | 3个模型的编码结果 |
| `reliability_stats.csv` | CSV | Kappa系数, 组内相关系数 |

### 验收标准
- ✅ 主编码与人工标注 Kappa > 0.75
- ✅ 模型间相关系数 > 0.85
- ✅ 提示词间系数符号100%一致

---

## 🎯 模块3: LLM暴露度构建任务

### 任务目标
从职业→行业→企业三层聚合

### 数据链路
```
Eloundou (2023) 职业暴露分
    ↓ (BLS OES 就业权重)
NAICS 4-digit 行业暴露分
    ↓ (Compustat NAICS 匹配)
Firm-Year 企业暴露分
```

### 交付物清单
| 文件名 | 格式 | 说明 |
|--------|------|------|
| `eloundou_occupation_scores_clean.csv` | CSV | 874个SOC职业的暴露分 |
| `bls_oes_2020_2024_industry_weights.csv` | CSV | 行业-职业就业矩阵 |
| `firm_llm_exposure_alpha.parquet` | Parquet | Alpha-tier (严格) 暴露分 |
| `firm_llm_exposure_beta.parquet` | Parquet | Beta-tier (宽松) 暴露分 |
| `firm_llm_exposure_human_only.parquet` | Parquet | 仅人工评分暴露分 |

---

## 🎯 模块4: 数字基础设施指数任务

### 任务目标
三维度复合DI指数

### 计算公式
```
DI_z = 0.333 × zscore(IT_capx/rev)
      + 0.333 × zscore(R&D/rev)
      + 0.333 × zscore(AI_patent_stock)
```

### 交付物清单
| 文件名 | 格式 | 说明 |
|--------|------|------|
| `compustat_di_components.parquet` | Parquet | CapX, R&D原始数据 |
| `ai_patent_stock_firm_year.parquet` | Parquet | Webb 2021分类专利存量 |
| `digital_infrastructure_index.parquet` | Parquet | 主DI指数 |
| `di_squared_term.parquet` | Parquet | DI平方项 |

---

## 🎯 模块5: 实证回归任务

### 任务目标
全部回归可复制
Stata + Python 双重实现

### 回归表格清单
| 表号 | 内容 | 说明 |
|------|------|------|
| 表1 | 描述性统计 | 全样本 + 分时期 |
| 表2 | H1基准回归 | RC + AC 双因变量 |
| 表3 | H2倒U型调节 | 二次交互项 |
| 表A1 | 模型稳健性 | 3个编码模型 |
| 表A2 | 提示词稳健性 | 5个提示词版本 |
| 表A3 | 安慰剂检验 | 2010-2014 ERP冲击 |
| 表A4 | IV估计 | Webb专利工具变量 |
| 表A5 | 人类暴露分 | 消除自评价循环 |

### 验收标准
- ✅ 所有标准误双重聚类 (Firm + Year)
- ✅ Goodman-Bacon分解无显著负权重
- ✅ 一阶段F > 10
- ✅ 所有稳健性系数符号一致

---

## 🎯 模块6: 图表任务

### 交付物清单
| 图号 | 标题 | 格式 |
|------|------|------|
| 图1 | 倒U型机制示意图 | PDF (矢量图) |
| 图2 | RC/AC平行趋势图 | PDF |
| 图3 | 边际效应图 | PDF |
| 图A1 | 提示词稳健性森林图 | PDF |
| 图A2 | Goodman-Bacon权重分布图 | PDF |

---

## 🎯 模块7: 工具变量任务

### 任务目标
Webb (2021) AI专利暴露IV

### 逻辑
历史专利技术轨迹(2000-2010) → 职业暴露度
→ 外生于2023年ChatGPT冲击

### 交付物
- IV第一阶段回归结果
- IV第二阶段回归结果
- 排他性假设论证文档

---

## ✅ 质量控制门控清单

### 每个模块完成后必须检查
1. **可复现性**: 运行代码能重现全部输出
2. **无硬编码**: 所有路径、参数使用配置文件
3. **文档完整**: 每段代码有功能说明
4. **缺失值**: 关键变量缺失率 < 5%
5. **缩尾处理**: 1%和99%分位缩尾已执行
