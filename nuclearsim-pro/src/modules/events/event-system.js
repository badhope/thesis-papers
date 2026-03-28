class EventSystem {
    constructor() {
        this.currentEvent = null;
        this.currentPhase = 0;
        this.decisions = [];
        this.startTime = null;
        this.events = this.loadEvents();
    }

    loadEvents() {
        return {
            hiroshima: {
                id: 'hiroshima',
                type: 'historical',
                title: '广岛原子弹爆炸',
                subtitle: '人类历史上第一次核武器实战',
                date: '1945-08-06T08:15:00',
                location: {
                    city: '广岛',
                    country: '日本',
                    lat: 34.3948,
                    lng: 132.4536
                },
                weapon: {
                    name: '小男孩',
                    yield: 15,
                    type: 'gun-type',
                    material: 'uranium-235'
                },
                context: {
                    weather: {
                        condition: '晴朗',
                        wind: { speed: 10, direction: 'NE' },
                        temperature: 26
                    },
                    population: 350000,
                    buildingTypes: ['wood', 'brick'],
                    militaryImportance: 'high',
                    background: '二战末期，美国为加速日本投降，决定使用新研发的原子弹。广岛是日本重要的军事工业城市，被选为首选目标。'
                },
                timeline: [
                    {
                        time: '08:00:00',
                        event: 'B-29轰炸机"艾诺拉·盖"号从提尼安岛起飞',
                        type: 'preparation'
                    },
                    {
                        time: '08:15:00',
                        event: '原子弹在广岛上空约600米处爆炸',
                        type: 'explosion',
                        details: '闪光强度是太阳的10倍，火球直径约280米，温度超过100万度'
                    },
                    {
                        time: '08:15:01',
                        event: '冲击波摧毁半径2公里内的建筑物',
                        type: 'blast'
                    },
                    {
                        time: '08:15:10',
                        event: '火灾开始蔓延',
                        type: 'fire'
                    },
                    {
                        time: '08:30:00',
                        event: '救援工作开始',
                        type: 'rescue'
                    },
                    {
                        time: '12:00:00',
                        event: '广岛90%的建筑物被摧毁',
                        type: 'aftermath'
                    }
                ],
                outcomes: {
                    immediate: {
                        deaths: 70000,
                        injuries: 70000,
                        buildingsDestroyed: '90%'
                    },
                    longTerm: {
                        deathsBy1945: 140000,
                        radiationSickness: 200000,
                        cancerDeaths: '持续增加'
                    }
                },
                educationalContent: {
                    background: '1945年8月6日，美国B-29轰炸机"艾诺拉·盖"号在广岛上空投下代号为"小男孩"的原子弹。这是人类历史上第一次在战争中使用核武器。',
                    significance: '广岛原子弹爆炸标志着核时代的开始，彻底改变了战争的性质和国际政治格局。',
                    lessons: '核武器的毁灭性后果警示人类，必须防止核战争的再次发生。',
                    quotes: [
                        {
                            author: '哈里·杜鲁门',
                            text: '我们发现了历史上最可怕的炸弹。'
                        },
                        {
                            author: '罗伯特·奥本海默',
                            text: '现在我变成了死神，世界的毁灭者。'
                        }
                    ]
                },
                sources: [
                    '美国国家档案馆',
                    '广岛和平纪念资料馆',
                    '《广岛》约翰·赫西'
                ]
            },

            nagasaki: {
                id: 'nagasaki',
                type: 'historical',
                title: '长崎原子弹爆炸',
                subtitle: '人类历史上第二次核武器实战',
                date: '1945-08-09T11:02:00',
                location: {
                    city: '长崎',
                    country: '日本',
                    lat: 32.7637,
                    lng: 129.8844
                },
                weapon: {
                    name: '胖子',
                    yield: 21,
                    type: 'implosion',
                    material: 'plutonium-239'
                },
                context: {
                    weather: {
                        condition: '多云',
                        wind: { speed: 15, direction: 'SW' },
                        temperature: 28
                    },
                    population: 240000,
                    buildingTypes: ['wood', 'concrete'],
                    militaryImportance: 'medium',
                    background: '长崎原本不是首选目标，由于小仓天气恶劣，轰炸机转向长崎。'
                },
                timeline: [
                    {
                        time: '10:50:00',
                        event: 'B-29轰炸机"博克斯卡"号飞抵小仓上空',
                        type: 'preparation'
                    },
                    {
                        time: '10:58:00',
                        event: '因天气原因转向长崎',
                        type: 'decision'
                    },
                    {
                        time: '11:02:00',
                        event: '原子弹在长崎上空约500米处爆炸',
                        type: 'explosion'
                    }
                ],
                outcomes: {
                    immediate: {
                        deaths: 40000,
                        injuries: 25000,
                        buildingsDestroyed: '40%'
                    },
                    longTerm: {
                        deathsBy1945: 80000,
                        radiationSickness: 150000
                    }
                },
                educationalContent: {
                    background: '1945年8月9日，美国在长崎投下第二颗原子弹"胖子"。由于地形原因，长崎的伤亡比广岛小。',
                    significance: '长崎原子弹爆炸加速了日本的投降，结束了第二次世界大战。',
                    lessons: '两颗原子弹的爆炸展示了核武器的可怕威力，推动了国际核不扩散努力。'
                }
            },

            cuban: {
                id: 'cuban',
                type: 'crisis',
                title: '古巴导弹危机',
                subtitle: '人类最接近核战争的时刻',
                date: '1962-10-16',
                duration: '13天',
                location: {
                    city: '古巴',
                    country: '古巴',
                    lat: 21.5218,
                    lng: -77.7812
                },
                context: {
                    background: '1962年10月，美国发现苏联在古巴部署核导弹，引发冷战时期最严重的核危机。',
                    keyPlayers: ['约翰·肯尼迪', '尼基塔·赫鲁晓夫', '菲德尔·卡斯特罗'],
                    stakes: '全球核战争的风险'
                },
                timeline: [
                    {
                        date: '1962-10-14',
                        event: 'U-2侦察机拍摄到苏联导弹基地',
                        type: 'discovery'
                    },
                    {
                        date: '1962-10-16',
                        event: '肯尼迪总统召开紧急会议',
                        type: 'decision'
                    },
                    {
                        date: '1962-10-22',
                        event: '肯尼迪电视讲话，宣布海上封锁',
                        type: 'escalation'
                    },
                    {
                        date: '1962-10-24',
                        event: '苏联船只开始返航',
                        type: 'de-escalation'
                    },
                    {
                        date: '1962-10-28',
                        event: '赫鲁晓夫同意撤走导弹',
                        type: 'resolution'
                    }
                ],
                outcomes: {
                    avoided: '全面核战争',
                    result: '苏联撤走导弹，美国承诺不入侵古巴',
                    lessons: '大国之间的直接沟通渠道（热线）建立'
                },
                educationalContent: {
                    background: '古巴导弹危机是冷战时期美苏对抗的最高峰，世界一度处于核战争边缘。',
                    significance: '这次危机促使美苏两国建立直接沟通机制，避免未来类似危机。',
                    lessons: '外交谈判和妥协可以避免灾难性的核战争。'
                }
            },

            chernobyl: {
                id: 'chernobyl',
                type: 'accident',
                title: '切尔诺贝利核事故',
                subtitle: '历史上最严重的核事故',
                date: '1986-04-26T01:23:40',
                location: {
                    city: '普里皮亚季',
                    country: '苏联（现乌克兰）',
                    lat: 51.3870,
                    lng: 30.0942
                },
                context: {
                    reactor: 'RBMK-1000',
                    powerLevel: '测试期间',
                    background: '切尔诺贝利核电站4号反应堆在进行安全测试时发生爆炸。'
                },
                timeline: [
                    {
                        time: '01:23:04',
                        event: '安全测试开始',
                        type: 'test'
                    },
                    {
                        time: '01:23:40',
                        event: '反应堆功率急剧上升',
                        type: 'critical'
                    },
                    {
                        time: '01:24:00',
                        event: '反应堆爆炸',
                        type: 'explosion'
                    },
                    {
                        time: '01:28:00',
                        event: '消防队到达',
                        type: 'response'
                    },
                    {
                        time: '05:00:00',
                        event: '火势基本控制',
                        type: 'control'
                    }
                ],
                outcomes: {
                    immediate: {
                        deaths: 31,
                        evacuations: 50000
                    },
                    longTerm: {
                        deaths: '4000-93000（估计）',
                        exclusionZone: '2600 km²',
                        economicLoss: '数千亿美元'
                    }
                },
                educationalContent: {
                    background: '切尔诺贝利事故是由于设计缺陷和操作失误共同导致的。',
                    significance: '这次事故改变了全球核安全标准，推动了核安全文化的建立。',
                    lessons: '核安全必须放在首位，透明和信息公开至关重要。'
                }
            }
        };
    }

    async loadEvent(eventId) {
        const event = this.events[eventId];
        if (!event) {
            throw new Error(`Event not found: ${eventId}`);
        }

        this.currentEvent = event;
        this.currentPhase = 0;
        this.decisions = [];
        this.startTime = Date.now();

        return event;
    }

    getEventInfo(eventId) {
        return this.events[eventId] || null;
    }

    getAllEvents() {
        return Object.values(this.events).map(event => ({
            id: event.id,
            type: event.type,
            title: event.title,
            subtitle: event.subtitle,
            date: event.date,
            location: event.location
        }));
    }

    async startHistoricalSimulation(eventId) {
        const event = await this.loadEvent(eventId);
        
        return {
            type: 'historical',
            event: event,
            canInteract: false,
            showTimeline: true,
            showEducationalContent: true
        };
    }

    async saveProgress() {
        if (!this.currentEvent) return;

        const progress = {
            eventId: this.currentEvent.id,
            currentPhase: this.currentPhase,
            decisions: this.decisions,
            duration: Date.now() - this.startTime
        };

        if (window.electronAPI) {
            await window.electronAPI.db.run(
                `INSERT INTO event_history (event_id, event_type, decisions, outcome, duration_seconds)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    progress.eventId,
                    this.currentEvent.type,
                    JSON.stringify(progress.decisions),
                    this.currentPhase >= (this.currentEvent.phases?.length || 0) ? 'completed' : 'in_progress',
                    Math.floor(progress.duration / 1000)
                ]
            );
        }

        return progress;
    }

    getEducationalContent(eventId) {
        const event = this.events[eventId];
        if (!event || !event.educationalContent) return null;

        return {
            title: event.title,
            content: event.educationalContent,
            sources: event.sources || [],
            quotes: event.quotes || []
        };
    }

    getTimeline(eventId) {
        const event = this.events[eventId];
        if (!event || !event.timeline) return [];

        return event.timeline;
    }

    getOutcomes(eventId) {
        const event = this.events[eventId];
        if (!event || !event.outcomes) return null;

        return event.outcomes;
    }

    formatEventForDisplay(event) {
        return {
            id: event.id,
            title: event.title,
            subtitle: event.subtitle,
            date: new Date(event.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            location: `${event.location.city}, ${event.location.country}`,
            type: this.getEventTypeLabel(event.type),
            weapon: event.weapon ? `${event.weapon.name} (${event.weapon.yield}kt)` : null
        };
    }

    getEventTypeLabel(type) {
        const labels = {
            historical: '📜 历史事件',
            crisis: '⚠️ 核危机',
            accident: '☢️ 核事故',
            scenario: '🎯 假设场景'
        };
        return labels[type] || type;
    }
}

class StorySystem {
    constructor() {
        this.currentStory = null;
        this.currentPhase = 0;
        this.decisions = [];
        this.startTime = null;
        this.stories = this.loadStories();
    }

    loadStories() {
        return {
            cuban_crisis: {
                id: 'cuban_crisis',
                title: '古巴导弹危机',
                subtitle: '人类最接近核战争的时刻',
                description: '1962年10月，你将扮演美国总统约翰·肯尼迪，面对苏联在古巴部署核导弹的危机。你的每一个决定都可能改变历史。',
                difficulty: 'hard',
                duration: '30分钟',
                roles: ['美国总统约翰·肯尼迪'],
                
                phases: [
                    {
                        id: 'phase_1',
                        title: '发现导弹',
                        date: '1962年10月14日',
                        description: 'U-2侦察机拍摄的照片显示，苏联正在古巴建造核导弹基地。这些导弹可以在几分钟内打击美国大部分城市。',
                        
                        situation: {
                            text: '情报部门确认，古巴境内至少有3个中程弹道导弹基地正在建设中。每个基地配备有核弹头。估计导弹将在两周内具备作战能力。',
                            map: {
                                center: [21.5, -77.8],
                                markers: [
                                    { lat: 21.5, lng: -77.8, label: '导弹基地A' },
                                    { lat: 22.0, lng: -80.0, label: '导弹基地B' },
                                    { lat: 20.5, lng: -75.0, label: '导弹基地C' }
                                ]
                            }
                        },
                        
                        decisions: [
                            {
                                id: 'decision_1_1',
                                text: '立即空袭摧毁导弹基地',
                                description: '发动突然袭击，摧毁导弹基地。这可能导致苏联报复，但能消除直接威胁。',
                                consequences: {
                                    military: '可能成功摧毁部分导弹',
                                    diplomatic: '国际社会谴责美国先发制人',
                                    risk: '苏联可能从其他地方发动核报复',
                                    outcome: 'high_risk'
                                },
                                stats: {
                                    military: +20,
                                    diplomatic: -30,
                                    risk: +50
                                }
                            },
                            {
                                id: 'decision_1_2',
                                text: '实施海上封锁',
                                description: '宣布对古巴实施海上封锁，阻止更多苏联武器运入。这是较为温和的选择。',
                                consequences: {
                                    military: '暂时阻止导弹部署',
                                    diplomatic: '获得国际支持',
                                    risk: '苏联可能挑战封锁线',
                                    outcome: 'moderate_risk'
                                },
                                stats: {
                                    military: +5,
                                    diplomatic: +20,
                                    risk: +20
                                }
                            },
                            {
                                id: 'decision_1_3',
                                text: '外交谈判',
                                description: '通过外交渠道与苏联直接对话，寻求和平解决方案。',
                                consequences: {
                                    military: '导弹继续部署',
                                    diplomatic: '显示美国寻求和平',
                                    risk: '可能被视为软弱',
                                    outcome: 'low_risk'
                                },
                                stats: {
                                    military: -10,
                                    diplomatic: +30,
                                    risk: +10
                                }
                            }
                        ]
                    },
                    {
                        id: 'phase_2',
                        title: '紧张升级',
                        date: '1962年10月22日',
                        description: '你选择了海上封锁。苏联船只正在接近封锁线，局势高度紧张。',
                        
                        situation: {
                            text: '苏联船只继续向古巴航行，一些船只似乎携带军事物资。同时，古巴的导弹基地建设加速进行。',
                            events: [
                                '苏联潜艇在加勒比海活动增加',
                                '古巴军队进入高度戒备状态',
                                '美国公众恐慌情绪上升'
                            ]
                        },
                        
                        decisions: [
                            {
                                id: 'decision_2_1',
                                text: '警告并准备拦截',
                                description: '向苏联发出最后通牒，准备拦截任何试图突破封锁的船只。',
                                consequences: {
                                    outcome: 'escalate'
                                }
                            },
                            {
                                id: 'decision_2_2',
                                text: '私下与赫鲁晓夫沟通',
                                description: '通过秘密渠道与苏联领导人直接对话，寻求妥协方案。',
                                consequences: {
                                    outcome: 'negotiate'
                                }
                            }
                        ]
                    },
                    {
                        id: 'phase_3',
                        title: '关键时刻',
                        date: '1962年10月27日',
                        description: '一架美国U-2侦察机在古巴上空被击落，飞行员死亡。军方强烈要求报复性打击。',
                        
                        situation: {
                            text: '这是最危险的时刻。军方将领要求立即对古巴发动空袭。苏联方面则表示，任何对古巴的攻击都将导致全面核战争。',
                            tension: 'maximum'
                        },
                        
                        decisions: [
                            {
                                id: 'decision_3_1',
                                text: '批准报复性空袭',
                                description: '对击落U-2的古巴防空阵地进行打击。',
                                consequences: {
                                    outcome: 'war'
                                }
                            },
                            {
                                id: 'decision_3_2',
                                text: '保持克制，继续外交努力',
                                description: '尽管压力巨大，但选择不升级冲突，继续寻求外交解决。',
                                consequences: {
                                    outcome: 'peace'
                                }
                            }
                        ]
                    }
                ],
                
                endings: {
                    best: {
                        title: '和平解决',
                        description: '通过耐心和外交智慧，你成功化解了这场危机。苏联同意撤走导弹，美国承诺不入侵古巴，并秘密同意从土耳其撤走导弹。',
                        stats: {
                            saved: '数亿人的生命',
                            legacy: '你被誉为和平的缔造者'
                        }
                    },
                    good: {
                        title: '妥协解决',
                        description: '经过艰难的谈判，双方都做出让步。危机得以和平解决，但美苏关系长期紧张。',
                        stats: {
                            saved: '避免了核战争',
                            legacy: '冷战继续，但建立了热线'
                        }
                    },
                    bad: {
                        title: '局部冲突',
                        description: '冲突升级为局部战争，双方都遭受损失。最终在国际调停下停火，但代价惨重。',
                        stats: {
                            casualties: '数千人伤亡',
                            legacy: '世界对核战争有了更深的恐惧'
                        }
                    },
                    worst: {
                        title: '全面核战争',
                        description: '冲突失控，导致全面核战争。数亿人在最初的打击中丧生，人类文明遭受毁灭性打击。',
                        stats: {
                            casualties: '数亿人死亡',
                            legacy: '世界末日'
                        }
                    }
                },
                
                educationalContent: {
                    historicalOutcome: '肯尼迪选择了海上封锁和外交谈判相结合的策略。最终，苏联同意撤走导弹，危机和平解决。',
                    lessons: [
                        '耐心和克制可以避免灾难',
                        '直接沟通渠道的重要性',
                        '核威慑的双刃剑效应'
                    ]
                }
            }
        };
    }

    async loadStory(storyId) {
        const story = this.stories[storyId];
        if (!story) {
            throw new Error(`Story not found: ${storyId}`);
        }

        this.currentStory = story;
        this.currentPhase = 0;
        this.decisions = [];
        this.startTime = Date.now();

        return {
            story: story,
            currentPhase: story.phases[0],
            progress: {
                phase: 1,
                total: story.phases.length
            }
        };
    }

    makeDecision(decisionId) {
        if (!this.currentStory) return null;

        const phase = this.currentStory.phases[this.currentPhase];
        const decision = phase.decisions.find(d => d.id === decisionId);
        
        if (!decision) return null;

        this.decisions.push({
            phaseId: phase.id,
            decisionId: decisionId,
            timestamp: Date.now()
        });

        const outcome = decision.consequences.outcome;
        
        if (outcome === 'war' || outcome === 'high_risk') {
            return {
                type: 'ending',
                ending: this.currentStory.endings.worst
            };
        }

        this.currentPhase++;
        
        if (this.currentPhase >= this.currentStory.phases.length) {
            return {
                type: 'ending',
                ending: this.determineEnding()
            };
        }

        return {
            type: 'continue',
            nextPhase: this.currentStory.phases[this.currentPhase],
            progress: {
                phase: this.currentPhase + 1,
                total: this.currentStory.phases.length
            }
        };
    }

    determineEnding() {
        const riskDecisions = this.decisions.filter(d => {
            return d.decisionId.includes('1_1') || d.decisionId.includes('3_1');
        }).length;

        if (riskDecisions === 0) {
            return this.currentStory.endings.best;
        } else if (riskDecisions === 1) {
            return this.currentStory.endings.good;
        } else {
            return this.currentStory.endings.bad;
        }
    }

    getAllStories() {
        return Object.values(this.stories).map(story => ({
            id: story.id,
            title: story.title,
            subtitle: story.subtitle,
            description: story.description,
            difficulty: story.difficulty,
            duration: story.duration
        }));
    }

    async saveProgress() {
        if (!this.currentStory) return;

        const progress = {
            storyId: this.currentStory.id,
            currentPhase: this.currentPhase,
            decisions: this.decisions,
            duration: Date.now() - this.startTime
        };

        if (window.electronAPI) {
            await window.electronAPI.db.run(
                `INSERT INTO event_history (event_id, event_type, decisions, outcome, duration_seconds)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    progress.storyId,
                    'story',
                    JSON.stringify(progress.decisions),
                    this.currentPhase >= this.currentStory.phases.length ? 'completed' : 'in_progress',
                    Math.floor(progress.duration / 1000)
                ]
            );
        }

        return progress;
    }
}

window.EventSystem = new EventSystem();
window.StorySystem = new StorySystem();

console.log('Event System initialized');
