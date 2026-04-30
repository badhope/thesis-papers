# SEC 10-K Human Capital Disclosure Dataset

> **Algorithmic Reconfiguration of Job Architectures in the Age of Large Language Models**  
> SSCI Research Project - Large-scale Empirical Analysis

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/License-Academic-yellow.svg)](LICENSE)
[![Dataset](https://img.shields.io/badge/Dataset-20%2C214%20firms-green.svg)](https://sec.gov)

---

## 📊 Project Overview

This repository contains the complete crawler infrastructure and dataset for extracting **Human Capital Disclosure** from U.S. Securities and Exchange Commission (SEC) 10-K filings. The dataset supports empirical research on how firms' human capital practices relate to algorithmic management and LLM adoption.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Total Target Firms** | 27,622 |
| **Successfully Extracted** | **20,214** |
| **Completion Rate** | **73.2%** |
| **Average Document Length** | ~15,000 characters |
| **Time Period** | 2020-2024 |
| **Data Source** | SEC EDGAR Database |

---

## 🗂️ Repository Structure

```
Algorithmic_Reconfiguration_Job_Architectures_LLM/
├── 📁 01_Data_Raw/
│   └── SEC_10K_Disclosures/
│       ├── 01_sec_10k_full_index.csv      # Complete filing index (27,622 entries)
│       ├── 02_extraction_results.csv      # Extraction metadata
│       └── item1_extracted_final/         # Raw text files (20,214 .txt files)
│
├── 📁 03_Code/
│   └── 01_Crawlers/
│       ├── crawler_v13_sdk_unblock.py     # Latest: IP unblocking version
│       ├── crawler_v12_stealth_mode.py    # Production: Anti-throttling crawler
│       ├── crawler_v3_pilot_100_fixed.py  # Pilot test version
│       ├── crawler_v2_edgar_index_builder.py  # Index builder
│       └── check_progress.py              # Progress monitoring
│
└── README.md
```

---

## 🚀 Crawler Features

### Production Version (v12 - Stealth Mode)

**✅ Enterprise-grade Anti-throttling Stack**
- **Connection Pooling**: 12 concurrent connections with adaptive rate limiting
- **Identity Rotation**: 15+ User-Agents + full browser fingerprint spoofing
- **Human Behavior Simulation**: Random request jitter (0.3-2.0 seconds)
- **Automatic Cooldown**: Global cooling after 429/403 detection
- **Session Isolation**: Per-batch TCP connection recycling
- **Resume Support**: Idempotent processing with progress persistence

### Advanced Version (v13 - Unblock Mode)
- Multi-session rotation strategy
- Exponential backoff with jitter
- Designed for post-ban recovery scenarios

---

## 💾 Dataset Description

### Human Capital Section Extraction

All filings are programmatically extracted from **Item 1 - Business** section of 10-K reports, focusing on:

| Pattern | Example Matches |
|---------|-----------------|
| **Human Capital** | Human capital management, talent strategy |
| **Workforce** | Our workforce, employee demographics |
| **Talent** | Talent acquisition, retention programs |
| **DEI** | Diversity, equity, and inclusion initiatives |
| **Training** | Employee development, upskilling programs |

### Text Extraction Pipeline

1. **HTML Parsing**: Remove scripts, styles, tables, links, images
2. **Pattern Matching**: Regex-based boundary detection for Item 1 / Item 1A
3. **Quality Filtering**: Minimum 800 character threshold
4. **Keyword Detection**: Flag human capital related content

---

## 🔧 Usage Instructions

### Check Dataset Progress

```bash
cd 03_Code/01_Crawlers
python check_progress.py
```

### Resume Crawling (Recommended)

```bash
# Production - stable, anti-throttling
python crawler_v12_stealth_mode.py

# Recovery - for IP blocked scenarios
python crawler_v13_sdk_unblock.py
```

### Rebuild Index from Scratch

```bash
python crawler_v2_edgar_index_builder.py
```

---

## 📈 Research Applications

This dataset enables:

1. **Content Analysis**: Topic modeling of human capital practices
2. **Text Mining**: Skill mention frequency across industries
3. **Panel Data**: Year-over-year changes in disclosure quality
4. **Firm-level Analysis**: Correlation with automation adoption metrics

---

## 🛡️ Ethical Considerations

- All data is publicly available through SEC EDGAR system
- Crawling respects SEC `robots.txt` guidelines
- Rate limiting prevents undue server load
- Research-only use per SEC Fair Use policy

---

## 📝 Citation

If you use this dataset, please cite:

```bibtex
@dataset{sec_human_capital_2024,
  title     = {SEC 10-K Human Capital Disclosure Dataset},
  author    = {Research Team},
  year      = {2024},
  publisher = {GitHub},
  url       = {[repository-url]},
  version   = {1.0}
}
```

---

## 🤝 Contact

For research collaboration or data access inquiries, please open an issue in the repository.

---

**Last Updated**: April 2024  
**Dataset Version**: 1.0 - Final Release
