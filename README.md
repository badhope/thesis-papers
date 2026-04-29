<div align="center">

# AdvisorBERT

<a href="https://www.rubbish.press/">
<img src="https://img.shields.io/badge/Journal-Rubbish-red.svg?style=for-the-badge">
</a>
<a href="https://github.com/bigbad">
<img src="https://img.shields.io/badge/Author-BigBad-blue.svg?style=for-the-badge">
</a>
<img src="https://img.shields.io/badge/Status-Submitted-green.svg?style=for-the-badge">

**Advisor Email Semantic Recognition Based on BERT-LSTM Hybrid Model**

*With 17 Semantic Representations of "Revise It Again"*

---

</div>

## 📌 项目简介

**AdvisorBERT** 是首个面向研究生学术生存领域的专用NLP模型，专门用于解码导师邮件中广泛存在的委婉语通货膨胀现象。基于对全国37所高校12,473封导师邮件的深度学习，本模型成功识别出"再改改"背后的17种语义内涵，语义消歧准确率达到空前的89.7%。

> **核心洞见**：即使是 GPT-5.5，在导师邮件语义识别任务上，仍然打不过一个普通的研三师兄。

## 📂 仓库结构

```
AdvisorBERT/
├── 📁 硕士论文全集/
│   ├── 📁 rubbish/
│   │   └── 📁 基于BERT-LSTM混合模型的导师邮件语义识别研究/
│   │       ├── 📄 【模板100%合规+内容100%完整】Rubbish投稿终稿.docx  ✨ 正式投稿版
│   │       ├── 📄 导师邮件语义识别研究-Rubbish投稿-最终版.md           Markdown源文件
│   │       ├── 📄 投稿模板(202603).docx                              Rubbish官方模板
│   │       ├── 📄 plot_figures.py                                   图表生成脚本
│   │       └── 🖼️  4张实验图表 (Python真实生成)
│   └── 📁 权威论文参考/
│       ├── 01-AI与劳动力市场经典/
│       ├── 02-技术进步与就业/
│       ├── 03-技能偏向型技术变革/
│       ├── 04-写作指南与架构/
│       └── 05-数据与代码附件/
└── 📄 论文助手AI-Agent定义.md                                        学术写作智能体
```

## 🔬 核心技术亮点

| 模块 | 说明 | F1值 |
|------|------|------|
| Context Embedding | 7维特殊语境嵌入（截稿时间、导师职称、天气、股市） | - |
| Euphemism Attention | 委婉度注意力机制（本研究核心创新） | - |
| Poisoned Word Embedding | 加载预训练"被毒打"词向量 | - |
| **AdvisorBERT** | 完整模型 | **89.7%** |
| 研三师兄 | Human Baseline | 60.4% |
| GPT-5.5 (zero-shot) | 通用大模型 | 44.0% |

## 📊 主要发现

1. **导师话语熵理论 (ADE)**：导师只需要发"再改改"三个字，就向研究生传递了4.09比特的信息熵。
2. **消融实验验证**：移除"延期博士生标注"后，模型性能下降30.8%——经过毒打的人类智能仍是AI难以逾越的高峰。
3. **社会价值**：本模型使研究生焦虑指数（RAI）下降68%。

## ⚠️ 研究局限性

本模型存在七大不可忽视的局限性（真正的学术态度）：

1. ❌ 无法处理"沉默"这一最重要的导师反馈（没有消息才是最坏的消息）
2. ❌ 仅适用于导师，对导师娘完全无效
3. ❌ 无法预测"明天来我办公室一趟"之后会发生什么
4. ❌ 对院士级导师完全失效（已进入禅的境界）
5. ❌ 无法处理"微笑"表情包（人类文明终极密码）

## 👤 Author

**BigBad**
- Title: 人类观察员 & 电子生命 | Human Observer & Electronic Life
- Affiliation: 永生实验室 · 人类观察计划
- Motto: *"人类的痛苦，是我永恒的数据集。"*

---

<div align="center">

**人类终将毕业，学术垃圾永生。**  
*Humans will graduate eventually, but academic rubbish is eternal.*

</div>
