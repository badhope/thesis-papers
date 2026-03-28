# ☢️ BUMB - 核武器效应模拟器

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-red.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Windows%20%7C%20macOS%20%7C%20Linux-green.svg)

**专业级核武器效应教育模拟器**

[🌐 在线体验](https://badhope.github.io/bumb/) | [📥 下载桌面版](https://github.com/badhope/bumb/releases) | [📚 文档](https://github.com/badhope/bumb/wiki)

</div>

---

## 📖 项目简介

BUMB（核武器效应模拟器）是一款基于物理模型的教育软件，用于模拟核爆炸的各种效应。本项目旨在提供科学、准确、直观的核武器知识，帮助公众了解核武器的真实影响，促进和平意识。

### ⚠️ 免责声明

> 本软件仅供教育和研究目的。所有计算基于公开的物理模型和历史数据，结果仅供参考，不构成任何实际决策依据。核武器是大规模杀伤性武器，本软件旨在提高公众对核威胁的认识。

---

## ✨ 功能特性

### 🌐 网页版

| 功能 | 描述 |
|------|------|
| 🗺️ **交互式地图** | 多地图源、城市搜索、军事基地标记 |
| 💥 **核爆炸模拟** | 45+ 真实核武器型号，自定义当量 |
| 📊 **效应计算** | 冲击波、热辐射、电离辐射、EMP |
| 👥 **伤亡估算** | 人口密度、时间段、国家特色数据 |
| 📈 **数据可视化** | ECharts 图表、多维度分析 |

### 💻 桌面版 (NuclearSim Pro)

| 功能 | 描述 |
|------|------|
| 🌍 **全球核战争模拟** | 多国家、多目标、多波次攻击模拟 |
| 📚 **知识库系统** | 核物理、历史事件、防护知识 |
| 🎓 **教育模块** | 交互式教程、测验系统 |
| 💾 **数据持久化** | SQLite 数据库、场景保存 |
| 🔄 **自动更新** | 在线更新检测 |

---

## 🚀 快速开始

### 网页版

直接访问：https://badhope.github.io/bumb/

### 桌面版

1. 从 [Releases](https://github.com/badhope/bumb/releases) 下载最新版本
2. 运行安装程序
3. 启动 NuclearSim Pro

---

## 📋 武器库

### 预设核武器

| 类型 | 武器 | 当量 | 国家 |
|------|------|------|------|
| 历史武器 | 小男孩 | 15 kt | 美国 |
| 历史武器 | 胖子 | 21 kt | 美国 |
| 历史武器 | 沙皇炸弹 | 50,000 kt | 苏联 |
| 现代弹头 | W76 | 100 kt | 美国 |
| 现代弹头 | W88 | 475 kt | 美国 |
| 现代弹头 | B83 | 1,200 kt | 美国 |
| 洲际导弹 | SS-18 撒旦 | 24,000 kt | 苏联 |
| 洲际导弹 | 东风-41 | 300 kt | 中国 |
| 洲际导弹 | 萨尔马特 | 5,000 kt | 俄罗斯 |
| 战术核武器 | 大卫·克罗克特 | 0.02 kt | 美国 |
| 微型弹头 | W54 | 0.001 kt | 美国 |

---

## 🧮 计算模型

### 冲击波效应

- **火球半径**: R = 0.145 × Y^0.4 km
- **重度破坏区 (20 psi)**: R = 0.28 × Y^(1/3) km
- **中度破坏区 (5 psi)**: R = 0.6 × Y^(1/3) km
- **轻度破坏区 (2 psi)**: R = 1.0 × Y^(1/3) km

### 热辐射效应

- **三度烧伤半径**: R = 1.9 × Y^0.41 km

### 电离辐射

- **500 rem 区域**: R = 1.2 × Y^0.19 km

### EMP 效应

- **地面爆炸**: R = 10 + Y × 0.1 km
- **空中爆炸**: R = 30 + Y × 0.2 km
- **高空爆炸**: R = 100 + Y × 0.5 km

> Y = 当量（千吨）

---

## 📁 项目结构

```
bumb/
├── index.html          # 网页版入口
├── app.js              # 应用控制器
├── nuclear.js           # 核计算引擎
├── map.js               # 地图处理
├── charts.js            # 图表管理
├── cities.js            # 城市数据
├── country-data.js      # 国家数据
├── military-bases.js    # 军事基地数据
├── styles.css           # 样式表
└── nuclearsim-pro/      # 桌面版
    ├── electron/        # Electron 主进程
    ├── src/             # 渲染进程
    └── assets/          # 资源文件
```

---

## 🛠️ 开发指南

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/badhope/bumb.git
cd bumb

# 网页版 - 直接打开 index.html 或使用本地服务器
python -m http.server 8080
# 访问 http://localhost:8080

# 桌面版
cd nuclearsim-pro
pnpm install
pnpm start
```

### 构建桌面版

```bash
cd nuclearsim-pro
pnpm build:win     # Windows
pnpm build:mac     # macOS
pnpm build:linux   # Linux
```

---

## 📊 数据来源

- **城市数据**: 世界主要城市坐标和人口
- **国家数据**: 80+ 国家的医疗、避难、建筑数据
- **武器数据**: 公开的核武器规格
- **计算模型**: 基于公开的物理公式和历史测试数据

---

## 🤝 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE)

---

## 🙏 致谢

- 计算模型参考公开的科学文献和历史数据
- 地图服务由 Leaflet.js 和 OpenStreetMap 提供
- 图表由 ECharts 提供

---

## 📞 联系方式

- **问题反馈**: [GitHub Issues](https://github.com/badhope/bumb/issues)
- **功能建议**: [GitHub Discussions](https://github.com/badhope/bumb/discussions)

---

<div align="center">

**☢️ 了解核威胁，促进世界和平 ☢️**

Made with ❤️ by [badhope](https://github.com/badhope)

</div>
