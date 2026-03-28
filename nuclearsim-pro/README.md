# ☢️ NuclearSim Pro - 桌面应用

专业级核武器效应模拟器桌面版

## 🚀 功能特性

### 核心功能
- ✅ **45+ 种核武器** - 历史、现代、战术核武器
- ✅ **交互式地图** - 离线地图、多地图源
- ✅ **精确计算** - 物理模型、伤亡估算
- ✅ **3D爆炸效果** - Three.js 实现的3D可视化
- ✅ **数据管理** - SQLite本地数据库
- ✅ **报告导出** - PDF、Word、图片、视频
- ✅ **自动更新** - 后台自动检查更新

### 事件系统
- 📜 **历史事件重现** - 广岛、长崎、古巴导弹危机等
- 🎮 **交互式故事** - 决策影响结局
- 🎯 **假设场景** - 第三次世界大战模拟
- 🌍 **事件链系统** - 触发条件、时间线、多结局

### 教育模块
- 📚 **知识库** - 核武器原理、效应、辐射等
- 🎓 **交互式教程** - 步骤引导学习
- 📝 **测验系统** - 测试学习成果
- 🏆 **成就系统** - 历史探索者、知识收集者等

## 📦 安装

### 从发布版安装

1. 下载最新的安装包：
   - Windows: `NuclearSim-Pro-Setup-x.x.x.exe`
   - macOS: `NuclearSim-Pro-x.x.x.dmg`
   - Linux: `NuclearSim-Pro-x.x.x.AppImage`

2. 运行安装程序并按照提示完成安装

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/badhope/bumb.git
cd bumb/nuclearsim-pro

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 🛠️ 技术栈

- **Electron** - 跨平台桌面应用框架
- **Better-SQLite3** - 本地数据库
- **Leaflet.js** - 地图引擎
- **Three.js** - 3D可视化
- **ECharts** - 数据图表
- **PDFMake** - PDF生成
- **Electron-Builder** - 打包发布

## 📁 项目结构

```
nuclearsim-pro/
├── electron/
│   ├── main.js          # 主进程
│   └── preload.js       # 预加载脚本
├── src/
│   ├── renderer/        # 渲染进程
│   │   ├── index.html
│   │   ├── styles/
│   │   └── scripts/
│   ├── modules/         # 功能模块
│   │   ├── simulator/   # 模拟引擎
│   │   ├── events/      # 事件系统
│   │   ├── data/        # 数据管理
│   │   ├── education/   # 教育模块
│   │   └── visualization/ # 可视化
│   └── database/        # 数据库
├── assets/              # 资源文件
│   ├── maps/           # 离线地图
│   ├── models/         # 3D模型
│   └── icons/          # 图标
└── docs/               # 文档
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+N` | 新建模拟 |
| `Ctrl+S` | 保存场景 |
| `Ctrl+E` | 导出报告 |
| `Ctrl+H` | 历史记录 |
| `Ctrl+,` | 设置 |
| `F11` | 全屏 |
| `ESC` | 退出全屏 |

## 🔧 开发

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Python 3.x (用于构建原生模块)

### 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 打包（不发布）
npm run pack

# 构建安装包
npm run dist

# 构建特定平台
npm run build:win
npm run build:mac
npm run build:linux
```

## 📝 更新日志

### v3.0.0 (2026-03-28)

#### 新增功能
- ✨ 桌面应用版本
- ✨ 离线地图支持
- ✨ 本地数据库存储
- ✨ 事件系统
- ✨ 教育模块
- ✨ 3D爆炸效果
- ✨ 自动更新功能

#### 技术改进
- 🔧 Electron 框架
- 🔧 SQLite 数据库
- 🔧 Three.js 3D渲染
- 🔧 完整的错误处理

## 📄 许可证

MIT License

## 🙏 致谢

- [Electron](https://www.electronjs.org/) - 桌面应用框架
- [Leaflet.js](https://leafletjs.com/) - 地图引擎
- [Three.js](https://threejs.org/) - 3D可视化
- [ECharts](https://echarts.apache.org/) - 数据可视化

---

<p align="center">
  <b>⚠️ 和平利用核能，反对核战争 ⚠️</b>
</p>
