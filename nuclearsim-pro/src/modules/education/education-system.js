class EducationSystem {
    constructor() {
        this.currentArticle = null;
        this.currentTutorial = null;
        this.tutorialProgress = {};
        this.articles = this.loadArticles();
        this.tutorials = this.loadTutorials();
        this.quizzes = this.loadQuizzes();
    }

    loadArticles() {
        return {
            nuclear_basics: {
                id: 'nuclear_basics',
                title: '核武器基础原理',
                category: '基础',
                tags: ['核物理', '核武器', '基础'],
                content: `
# 核武器基础原理

## 什么是核武器？

核武器是利用核反应（核裂变或核聚变）释放巨大能量的武器。与常规武器相比，核武器的破坏力要大得多。

## 核武器的类型

### 1. 原子弹（裂变武器）

原子弹利用重原子核（如铀-235或钚-239）的核裂变反应释放能量。

**工作原理：**
1. 当中子撞击重原子核时，原子核分裂成两个较轻的原子核
2. 同时释放出更多中子和大量能量
3. 释放的中子继续引发更多裂变，形成链式反应

**代表武器：**
- 小男孩（广岛，铀弹）
- 胖子（长崎，钚弹）

### 2. 氢弹（聚变武器/热核武器）

氢弹利用轻原子核（如氢的同位素氘和氚）的核聚变反应释放能量。

**工作原理：**
1. 首先通过核裂变产生极高温度
2. 高温引发核聚变反应
3. 聚变释放的能量远超裂变

**代表武器：**
- 沙皇炸弹（5000万吨当量）
- 常春藤麦克（美国第一颗氢弹）

## 核武器的当量

核武器的威力用"TNT当量"来衡量，即爆炸释放的能量相当于多少吨TNT炸药。

**典型当量：**
- 战术核武器：0.01-100千吨
- 战略核武器：100千吨-50百万吨

## 核武器的效应

### 1. 冲击波
核爆炸产生的冲击波是主要的破坏因素，可以摧毁建筑物和杀伤人员。

### 2. 热辐射
核爆炸产生的高温可以导致大面积火灾和严重烧伤。

### 3. 电离辐射
核爆炸释放的辐射可以导致急性辐射病和长期健康影响。

### 4. 电磁脉冲（EMP）
核爆炸产生的电磁脉冲可以破坏电子设备。

## 核不扩散

为防止核武器扩散，国际社会建立了以下机制：

- 《不扩散核武器条约》（NPT）
- 国际原子能机构（IAEA）
- 全面禁止核试验条约（CTBT）

## 思考题

1. 核裂变和核聚变有什么区别？
2. 为什么核武器的破坏力如此巨大？
3. 国际社会如何防止核武器扩散？
                `,
                quiz: 'nuclear_basics_quiz'
            },

            effects: {
                id: 'effects',
                title: '核爆炸效应详解',
                category: '效应',
                tags: ['冲击波', '热辐射', '辐射', '效应'],
                content: `
# 核爆炸效应详解

核爆炸会产生多种破坏效应，每种效应都有不同的影响范围和持续时间。

## 1. 火球

核爆炸首先形成一个高温火球。

**特点：**
- 温度：超过1亿度
- 直径：取决于当量
- 持续时间：几秒钟

**计算公式：**
火球半径 ≈ 0.145 × 当量^0.4 公里

## 2. 冲击波

冲击波是核爆炸最主要的破坏因素。

### 压力等级

| 压力 | 效应 |
|------|------|
| 20 psi | 重度破坏，几乎所有建筑倒塌 |
| 5 psi | 中度破坏，大部分建筑严重损坏 |
| 2 psi | 轻度破坏，窗户破碎，部分建筑损坏 |
| 1 psi | 玻璃破碎，轻微损坏 |

### 计算公式
冲击波半径 ≈ k × 当量^(1/3) 公里

## 3. 热辐射

热辐射可以导致火灾和烧伤。

### 烧伤等级

| 热通量 | 效应 |
|--------|------|
| 50 cal/cm² | 三度烧伤 |
| 25 cal/cm² | 二度烧伤 |
| 10 cal/cm² | 一度烧伤 |

### 计算公式
热辐射半径 ≈ 1.9 × 当量^0.41 公里

## 4. 电离辐射

核爆炸释放的辐射对生物体有严重影响。

### 辐射剂量

| 剂量 | 效应 |
|------|------|
| 500 rem | 50%死亡率 |
| 200 rem | 严重辐射病 |
| 100 rem | 轻度辐射病 |
| 25 rem | 血液变化 |

### 计算公式
辐射半径 ≈ 1.2 × 当量^0.19 公里

## 5. 放射性沉降

核爆炸后，放射性物质会随风向扩散。

**影响因素：**
- 风向和风速
- 爆炸高度
- 地形

**危害：**
- 急性辐射病
- 长期癌症风险
- 环境污染

## 6. 电磁脉冲（EMP）

高空核爆炸产生的EMP可以影响大范围的电子设备。

**影响范围：**
- 地面爆炸：几公里
- 高空爆炸：数千公里

**危害：**
- 电子设备损坏
- 电网瘫痪
- 通信中断

## 防护措施

### 个人防护
1. 寻找坚固的掩体
2. 远离窗户
3. 横卧在地，保护头部
4. 爆炸后待在室内至少24小时

### 建筑防护
1. 加固建筑结构
2. 安装防冲击波门窗
3. 建设地下掩体

## 思考题

1. 哪种效应的影响范围最大？
2. 如何在不同效应下进行防护？
3. 放射性沉降如何影响长期健康？
                `,
                quiz: 'effects_quiz'
            },

            radiation: {
                id: 'radiation',
                title: '辐射与健康',
                category: '健康',
                tags: ['辐射', '健康', '癌症', '辐射病'],
                content: `
# 辐射与健康

## 什么是辐射？

辐射是能量以波或粒子的形式传播。核爆炸产生的电离辐射具有足够的能量，可以破坏原子和分子。

## 辐射类型

### 1. α粒子
- 穿透力弱，可被纸张阻挡
- 吸入或摄入后危害大
- 主要来自重元素衰变

### 2. β粒子
- 穿透力中等，可被铝板阻挡
- 可导致皮肤烧伤
- 主要来自放射性衰变

### 3. γ射线
- 穿透力强，需要铅或混凝土阻挡
- 可穿透人体
- 主要来自核爆炸和放射性衰变

### 4. 中子辐射
- 穿透力最强
- 可使其他物质具有放射性
- 主要来自核爆炸

## 辐射剂量单位

### 戈瑞（Gy）
吸收剂量的国际单位
1 Gy = 1 焦耳/千克

### 希沃特（Sv）
当量剂量的国际单位
考虑了不同辐射的生物学效应

### 雷姆（rem）
旧单位，1 Sv = 100 rem

## 急性辐射病

### 症状分级

| 剂量 | 症状 | 预后 |
|------|------|------|
| 0-1 Gy | 无明显症状 | 良好 |
| 1-2 Gy | 恶心、呕吐 | 可恢复 |
| 2-4 Gy | 严重症状 | 需治疗 |
| 4-8 Gy | 危及生命 | 死亡率高 |
| >8 Gy | 致命 | 几乎无存活 |

### 治疗方法
1. 去除污染
2. 支持治疗
3. 骨髓移植
4. 细胞因子治疗

## 长期健康影响

### 癌症风险
- 白血病：潜伏期2-5年
- 实体肿瘤：潜伏期10-40年
- 风险与剂量成正比

### 遗传影响
- 基因突变
- 后代先天缺陷
- 风险存在但较低

## 辐射防护原则

### 时间
减少暴露时间

### 距离
增加与辐射源的距离

### 屏蔽
使用防护材料

## 日常辐射

| 来源 | 年剂量 |
|------|--------|
| 自然本底 | 2.4 mSv |
| 医疗检查 | 0.4 mSv |
| 核工业 | 0.005 mSv |
| 职业暴露 | 视情况 |

## 思考题

1. 不同类型的辐射有什么区别？
2. 如何诊断和治疗急性辐射病？
3. 辐射防护的三个原则是什么？
                `,
                quiz: 'radiation_quiz'
            },

            history: {
                id: 'history',
                title: '核武器发展史',
                category: '历史',
                tags: ['历史', '曼哈顿计划', '冷战', '核军备'],
                content: `
# 核武器发展史

## 早期研究（1930年代）

### 科学发现
- 1932年：查德威克发现中子
- 1938年：哈恩和斯特拉斯曼发现核裂变
- 1939年：爱因斯坦致信罗斯福总统

## 曼哈顿计划（1942-1945）

### 背景
担心纳粹德国首先研制出原子弹

### 主要人物
- 罗伯特·奥本海默 - 科学主管
- 莱斯利·格罗夫斯 - 军事主管
- 恩里科·费米 - 首个核反应堆

### 里程碑
- 1942年：芝加哥一号堆首次可控链式反应
- 1945年7月：三位一体试验
- 1945年8月：广岛和长崎

## 冷战时期（1945-1991）

### 核军备竞赛
- 1949年：苏联首次核试验
- 1952年：美国氢弹试验
- 1953年：苏联氢弹试验
- 1964年：中国首次核试验

### 核危机
- 1962年：古巴导弹危机
- 1983年：苏联核预警误报

### 军控条约
- 1963年：《部分禁止核试验条约》
- 1968年：《不扩散核武器条约》
- 1972年：《反弹道导弹条约》
- 1979年：《SALT II》

## 后冷战时期（1991-至今）

### 核裁军
- 1991年：《START I》
- 2010年：《新START》
- 核武器数量大幅减少

### 核扩散
- 1998年：印度和巴基斯坦核试验
- 2006年：朝鲜首次核试验

## 核武器数量变化

| 年份 | 美国 | 苏联/俄罗斯 | 全球总数 |
|------|------|-------------|----------|
| 1945 | 2 | 0 | 2 |
| 1960 | 18,000 | 1,600 | 20,000 |
| 1986 | 23,000 | 40,000 | 65,000 |
| 2020 | 5,550 | 6,375 | 13,000 |

## 思考题

1. 曼哈顿计划的历史意义是什么？
2. 冷战期间为什么没有发生核战争？
3. 核裁军取得了哪些进展？
                `,
                quiz: 'history_quiz'
            }
        };
    }

    loadTutorials() {
        return {
            intro: {
                id: 'intro',
                title: '核武器入门',
                description: '了解核武器的基本概念和原理',
                difficulty: '初级',
                duration: '15分钟',
                steps: [
                    {
                        id: 'step_1',
                        title: '什么是核武器？',
                        content: '核武器是利用核反应释放巨大能量的武器。',
                        action: 'read',
                        nextStep: 'step_2'
                    },
                    {
                        id: 'step_2',
                        title: '核武器的类型',
                        content: '核武器主要分为原子弹（裂变武器）和氢弹（聚变武器）。',
                        action: 'read',
                        nextStep: 'step_3'
                    },
                    {
                        id: 'step_3',
                        title: '尝试模拟',
                        content: '让我们尝试一次简单的模拟。选择"小男孩"武器，然后点击北京。',
                        action: 'simulate',
                        target: { weapon: 'littleBoy', city: '北京' },
                        nextStep: 'step_4'
                    },
                    {
                        id: 'step_4',
                        title: '分析结果',
                        content: '观察模拟结果，了解不同效应的影响范围。',
                        action: 'analyze',
                        nextStep: 'step_5'
                    },
                    {
                        id: 'step_5',
                        title: '完成',
                        content: '恭喜你完成了核武器入门教程！',
                        action: 'complete'
                    }
                ]
            }
        };
    }

    loadQuizzes() {
        return {
            nuclear_basics_quiz: {
                id: 'nuclear_basics_quiz',
                title: '核武器基础测验',
                questions: [
                    {
                        id: 'q1',
                        question: '原子弹利用的是哪种核反应？',
                        options: ['核裂变', '核聚变', '核衰变', '核俘获'],
                        correct: 0,
                        explanation: '原子弹利用重原子核的裂变反应释放能量。'
                    },
                    {
                        id: 'q2',
                        question: '氢弹的威力通常比原子弹？',
                        options: ['小', '相同', '大', '无法比较'],
                        correct: 2,
                        explanation: '氢弹利用核聚变反应，释放的能量远超裂变反应。'
                    },
                    {
                        id: 'q3',
                        question: '核武器的威力用什么单位衡量？',
                        options: ['千瓦', 'TNT当量', '焦耳', '贝克勒尔'],
                        correct: 1,
                        explanation: '核武器的威力用TNT当量衡量，即相当于多少吨TNT炸药。'
                    }
                ]
            },

            effects_quiz: {
                id: 'effects_quiz',
                title: '核爆炸效应测验',
                questions: [
                    {
                        id: 'q1',
                        question: '核爆炸最主要的破坏因素是？',
                        options: ['热辐射', '冲击波', '辐射', 'EMP'],
                        correct: 1,
                        explanation: '冲击波是核爆炸最主要的破坏因素，造成大部分建筑破坏和人员伤亡。'
                    },
                    {
                        id: 'q2',
                        question: '20 psi冲击波会导致什么后果？',
                        options: ['窗户破碎', '轻度损坏', '建筑倒塌', '无影响'],
                        correct: 2,
                        explanation: '20 psi的冲击波会导致几乎所有建筑倒塌。'
                    },
                    {
                        id: 'q3',
                        question: '热辐射主要导致什么伤害？',
                        options: ['骨折', '烧伤和火灾', '辐射病', '窒息'],
                        correct: 1,
                        explanation: '热辐射可以导致严重烧伤和大面积火灾。'
                    }
                ]
            },

            radiation_quiz: {
                id: 'radiation_quiz',
                title: '辐射与健康测验',
                questions: [
                    {
                        id: 'q1',
                        question: '哪种辐射的穿透力最强？',
                        options: ['α粒子', 'β粒子', 'γ射线', '中子'],
                        correct: 3,
                        explanation: '中子辐射穿透力最强，可以使其他物质具有放射性。'
                    },
                    {
                        id: 'q2',
                        question: '急性辐射病的阈值大约是？',
                        options: ['0.1 Gy', '1 Gy', '10 Gy', '100 Gy'],
                        correct: 1,
                        explanation: '1 Gy以上剂量可能出现急性辐射病症状。'
                    },
                    {
                        id: 'q3',
                        question: '辐射防护的三个原则是？',
                        options: ['时间、距离、屏蔽', '速度、距离、方向', '时间、空间、能量', '质量、能量、动量'],
                        correct: 0,
                        explanation: '辐射防护的三个原则是时间、距离和屏蔽。'
                    }
                ]
            }
        };
    }

    getArticle(articleId) {
        return this.articles[articleId] || null;
    }

    getAllArticles() {
        return Object.values(this.articles).map(article => ({
            id: article.id,
            title: article.title,
            category: article.category,
            tags: article.tags
        }));
    }

    getArticlesByCategory(category) {
        return Object.values(this.articles).filter(a => a.category === category);
    }

    getTutorial(tutorialId) {
        return this.tutorials[tutorialId] || null;
    }

    getAllTutorials() {
        return Object.values(this.tutorials).map(tutorial => ({
            id: tutorial.id,
            title: tutorial.title,
            description: tutorial.description,
            difficulty: tutorial.difficulty,
            duration: tutorial.duration,
            progress: this.tutorialProgress[tutorial.id] || 0
        }));
    }

    async startTutorial(tutorialId) {
        const tutorial = this.tutorials[tutorialId];
        if (!tutorial) return null;

        this.currentTutorial = tutorial;
        this.currentStep = 0;

        return {
            tutorial: tutorial,
            currentStep: tutorial.steps[0],
            progress: {
                step: 1,
                total: tutorial.steps.length
            }
        };
    }

    async completeStep(stepId) {
        if (!this.currentTutorial) return null;

        const currentIndex = this.currentTutorial.steps.findIndex(s => s.id === stepId);
        
        if (currentIndex === -1) return null;

        this.currentStep = currentIndex + 1;

        if (this.currentStep >= this.currentTutorial.steps.length) {
            this.tutorialProgress[this.currentTutorial.id] = 100;
            return {
                type: 'complete',
                tutorial: this.currentTutorial
            };
        }

        const progress = Math.round((this.currentStep / this.currentTutorial.steps.length) * 100);
        this.tutorialProgress[this.currentTutorial.id] = progress;

        return {
            type: 'continue',
            nextStep: this.currentTutorial.steps[this.currentStep],
            progress: {
                step: this.currentStep + 1,
                total: this.currentTutorial.steps.length,
                percent: progress
            }
        };
    }

    getQuiz(quizId) {
        return this.quizzes[quizId] || null;
    }

    startQuiz(quizId) {
        const quiz = this.quizzes[quizId];
        if (!quiz) return null;

        return {
            quiz: quiz,
            currentQuestion: 0,
            score: 0,
            answers: []
        };
    }

    submitAnswer(quizId, questionId, answerIndex) {
        const quiz = this.quizzes[quizId];
        if (!quiz) return null;

        const question = quiz.questions.find(q => q.id === questionId);
        if (!question) return null;

        const isCorrect = question.correct === answerIndex;

        return {
            isCorrect: isCorrect,
            correctAnswer: question.correct,
            explanation: question.explanation
        };
    }

    calculateQuizResult(quizId, answers) {
        const quiz = this.quizzes[quizId];
        if (!quiz) return null;

        let correct = 0;
        answers.forEach((answer, index) => {
            if (quiz.questions[index].correct === answer) {
                correct++;
            }
        });

        const score = Math.round((correct / quiz.questions.length) * 100);

        return {
            total: quiz.questions.length,
            correct: correct,
            score: score,
            passed: score >= 60
        };
    }

    async saveProgress() {
        if (window.electronAPI) {
            await window.electronAPI.db.run(
                `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
                ['tutorial_progress', JSON.stringify(this.tutorialProgress)]
            );
        }
    }

    async loadProgress() {
        if (window.electronAPI) {
            const result = await window.electronAPI.db.get(
                'SELECT value FROM settings WHERE key = ?',
                ['tutorial_progress']
            );
            
            if (result && result.value) {
                this.tutorialProgress = JSON.parse(result.value);
            }
        }
    }
}

window.EducationSystem = new EducationSystem();

console.log('Education System initialized');
