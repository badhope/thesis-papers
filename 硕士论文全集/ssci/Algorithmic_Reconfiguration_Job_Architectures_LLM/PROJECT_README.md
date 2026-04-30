# 项目工作总览

## 论文标题
**工作架构的算法重构：LLM时代数字基础设施如何塑造替代-互补边界**

**Algorithmic Reconfiguration of Job Architectures: How Digital Infrastructure Shapes the Substitution-Complementary Divide in the LLM Era**

---

## 📁 目录结构说明

```
Algorithmic_Reconfiguration_Job_Architectures_LLM/
├── 📄 PROJECT_README.md                          # 本文件
├── 00_Original_Manuscript/                       # 原始论文手稿
│   ├── Algorithmic_Reconfiguration_Manuscript_v1.docx
│   └── Algorithmic_Reconfiguration_Manuscript_v1.md
├── 01_Data_Raw/                                  # 原始数据
│   ├── SEC_10K_Disclosures/                     # SEC 10-K披露原始文件
│   ├── BLS_Occupation_Data/                     # BLS职业就业数据
│   ├── Compustat_Fundamentals/                  # Compustat财务数据
│   ├── Patent_Data/                             # 专利数据
│   └── eloundou_supplementary.xlsx              # Eloundou原始暴露度数据 ✅
├── 02_Data_Processed/                            # 处理后的数据
├── 03_Code/                                      # 所有代码
│   ├── 01_Crawlers/                             # 爬虫模块
│   │   └── sec_10k_batch_download.py            # SEC批量下载脚本 ✅
│   ├── 02_GPT_Encoding/                         # GPT任务编码模块
│   ├── 03_Variable_Construction/                # 变量构建模块
│   ├── 04_Empirical_Analysis/                   # 实证回归分析
│   └── 05_Figures_Tables/                       # 图表生成
├── 04_References/                                # 参考文献
│   └── 00_References_List.md                    # 完整参考文献清单 ✅
├── 05_Temporary_Files/                           # 临时文件
├── 06_Documentation/                             # 技术文档
└── 07_Results/                                   # 结果输出
    ├── Tables/
    └── Figures/
```

---

## 🎯 核心研究假设

| 假设 | 内容 | 验证状态 |
|------|------|----------|
| **H1a** | LLM暴露度↑ → 常规认知任务信号↓ | ⏳ Pending |
| **H1b** | LLM暴露度↑ → 人机协作任务信号↑ | ⏳ Pending |
| **H2** | 数字基础设施呈倒U型调节 | ⏳ Pending |

---

## 📊 7大工作模块进度追踪

| 模块ID | 模块名称 | 负责人 | 进度 | 截止日期 | 依赖 |
|--------|----------|--------|------|----------|------|
| **M1** | SEC 10-K人力资本披露爬虫 | | ⏳ Not Started | | None |
| **M2** | GPT任务信号编码系统 | | ⏳ Not Started | | M1 |
| **M3** | 企业层面LLM暴露度构建 | | ⏳ Not Started | | Eloundou数据✅ |
| **M4** | 数字基础设施指数构建 | | ⏳ Not Started | | Compustat |
| **M5** | 实证回归与识别策略 | | ⏳ Not Started | | M2, M3, M4 |
| **M6** | 图表可视化生产 | | ⏳ Not Started | | M5 |
| **M7** | 工具变量构建 | | ⏳ Not Started | | Patent Data |

---

## 🚨 关键里程碑

| 里程碑 | 完成标准 | 预计时间 |
|--------|----------|----------|
| **ML1** | 数据获取完成 | 第2周末 | 24,235份10-K全部下载 |
| **ML2** | GPT编码完成 | 第4周末 | 5个提示词+3模型交叉验证完成 |
| **ML3** | 基准回归出结果 | 第5周末 | TWFE主回归表格定稿 |
| **ML4** | 全部稳健性通过 | 第6周末 | 五层防御全部验证 |

---

## ⚠️ 风险与依赖

| 风险项 | 影响程度 | 应对方案 |
|--------|----------|----------|
| SEC爬虫被封禁 | 🔴 HIGH | 代理池 + 速率限制 + 断点续传 |
| OpenAI API费用/速率 | 🔴 HIGH | Batch API + 分批次处理 |
| Compustat数据获取 | 🟡 MEDIUM | WRDS接入 + 公开替代方案 |
| 编码一致性不足 | 🟡 MEDIUM | 100样本人工标注金标准 |

---

## 📝 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-04-29 | 项目文件夹结构初始化完成 |
| 2026-04-29 | 参考文献清单提取完成 |
| 2026-04-29 | Eloundou补充数据 + SEC爬虫代码就位 |
