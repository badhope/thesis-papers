const ChartManager = {
    charts: {},
    initialized: false,
    darkTheme: {
        backgroundColor: 'transparent',
        textStyle: {
            color: '#e0e0e0'
        },
        title: {
            textStyle: {
                color: '#ff6b6b'
            }
        },
        legend: {
            textStyle: {
                color: '#aaa'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(20, 20, 40, 0.95)',
            borderColor: 'rgba(255, 80, 80, 0.5)',
            textStyle: {
                color: '#e0e0e0'
            }
        }
    },

    init() {
        if (this.initialized) {
            console.log('ChartManager already initialized');
            return;
        }

        if (typeof echarts === 'undefined') {
            console.error('ECharts library not loaded');
            return;
        }

        console.log('ChartManager initializing...');
        this.initCharts();
        this.initialized = true;
        console.log('ChartManager initialized successfully');
    },

    initCharts() {
        const chartIds = [
            'basicChart',
            'economicChart',
            'healthChart'
        ];
        
        let successCount = 0;
        chartIds.forEach(id => {
            try {
                const container = document.getElementById(id);
                if (container) {
                    if (this.charts[id]) {
                        this.charts[id].dispose();
                    }
                    this.charts[id] = echarts.init(container);
                    successCount++;
                }
            } catch (err) {
                console.error(`Error initializing chart ${id}:`, err);
            }
        });

        console.log(`Initialized ${successCount}/${chartIds.length} charts`);
    },

    resize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                try {
                    chart.resize();
                } catch (err) {
                    console.error('Error resizing chart:', err);
                }
            }
        });
    },

    dispose() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.dispose === 'function') {
                try {
                    chart.dispose();
                } catch (err) {
                    console.error('Error disposing chart:', err);
                }
            }
        });
        this.charts = {};
        this.initialized = false;
    },

    renderCasualtyPieChart(casualties) {
        const chart = this.charts.basicChart;
        if (!chart) {
            console.warn('basicChart not initialized');
            return;
        }

        if (!casualties || !casualties.details) {
            console.warn('Invalid casualties data for pie chart');
            return;
        }

        try {
            const data = [
                { value: casualties.details.fireball || 0, name: '火球区域', itemStyle: { color: '#ff0000' } },
                { value: casualties.details.heavyBlast || 0, name: '重度破坏', itemStyle: { color: '#ff4500' } },
                { value: casualties.details.moderateBlast || 0, name: '中度破坏', itemStyle: { color: '#ff8c00' } },
                { value: casualties.details.lightBlast || 0, name: '轻度破坏', itemStyle: { color: '#ffd700' } },
                { value: casualties.details.thermal || 0, name: '热辐射', itemStyle: { color: '#ff6347' } },
                { value: casualties.details.radiation || 0, name: '辐射区', itemStyle: { color: '#9400d3' } }
            ];

        const option = {
            ...this.darkTheme,
            title: {
                text: '伤亡分布',
                left: 'center',
                top: 5,
                textStyle: { color: '#ff6b6b', fontSize: 12 }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}人 ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: 0,
                textStyle: { color: '#aaa', fontSize: 10 }
            },
            series: [{
                type: 'pie',
                radius: ['35%', '60%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 4,
                    borderColor: 'rgba(0,0,0,0.3)',
                    borderWidth: 1
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 11,
                        fontWeight: 'bold'
                    }
                },
                data: data
            }]
        };

            chart.setOption(option);
        } catch (err) {
            console.error('Error rendering casualty pie chart:', err);
        }
    },

    renderRadiusBarChart(results) {
        const chart = this.charts.basicChart;
        if (!chart) {
            console.warn('basicChart not initialized');
            return;
        }

        if (!results) {
            console.warn('Invalid results data for bar chart');
            return;
        }

        try {
            const option = {
                ...this.darkTheme,
                title: {
                    text: '影响半径对比',
                    left: 'center',
                    top: 5,
                    textStyle: { color: '#ff6b6b', fontSize: 12 }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    top: '18%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['火球', '重度', '中度', '轻度', '热辐射', '辐射'],
                    axisLabel: { color: '#888', fontSize: 9 },
                    axisLine: { lineStyle: { color: 'rgba(255,80,80,0.3)' } }
                },
                yAxis: {
                    type: 'value',
                    name: 'km',
                    nameTextStyle: { color: '#888' },
                    axisLabel: { color: '#888' },
                    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
                },
                series: [{
                    type: 'bar',
                    barWidth: '60%',
                    data: [
                        { value: (results.fireball || 0).toFixed(2), itemStyle: { color: '#ff0000' } },
                        { value: (results.heavyBlast || 0).toFixed(2), itemStyle: { color: '#ff4500' } },
                        { value: (results.moderateBlast || 0).toFixed(2), itemStyle: { color: '#ff8c00' } },
                        { value: (results.lightBlast || 0).toFixed(2), itemStyle: { color: '#ffd700' } },
                        { value: (results.thermal || 0).toFixed(2), itemStyle: { color: '#ff6347' } },
                        { value: (results.radiation || 0).toFixed(2), itemStyle: { color: '#9400d3' } }
                    ],
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0]
                    }
                }]
            };

            chart.setOption(option);
        } catch (err) {
            console.error('Error rendering radius bar chart:', err);
        }
    },

    renderEconomicBarChart(economicData, gdpPerCapita) {
        const chart = this.charts.economicChart;
        if (!chart) return;

        if (!economicData) {
            console.warn('Invalid economicData for chart');
            return;
        }

        const option = {
            ...this.darkTheme,
            title: {
                text: '经济损失构成',
                left: 'center',
                top: 5,
                textStyle: { color: '#ff6b6b', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function(params) {
                    const value = params[0].value;
                    return `${params[0].name}<br/>${ChartManager.formatCurrency(value)}`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                top: '18%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['直接损失', '间接损失'],
                axisLabel: { color: '#888' },
                axisLine: { lineStyle: { color: 'rgba(255,80,80,0.3)' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#888',
                    formatter: function(value) {
                        if (value >= 1e12) return (value / 1e12).toFixed(1) + '万亿';
                        if (value >= 1e9) return (value / 1e9).toFixed(1) + '十亿';
                        if (value >= 1e6) return (value / 1e6).toFixed(1) + '百万';
                        return value;
                    }
                },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
            },
            series: [{
                type: 'bar',
                barWidth: '50%',
                data: [
                    { value: economicData.direct, itemStyle: { color: '#ff6b6b' } },
                    { value: economicData.indirect, itemStyle: { color: '#ffa500' } }
                ],
                itemStyle: {
                    borderRadius: [4, 4, 0, 0]
                }
            }]
        };

        chart.setOption(option);
    },

    renderRecoveryTimelineChart(recoveryYears) {
        const chart = this.charts.economicChart;
        if (!chart) return;

        if (!recoveryYears || recoveryYears <= 0) {
            recoveryYears = 10;
        }

        const years = [];
        const recovery = [];
        for (let i = 0; i <= recoveryYears; i++) {
            years.push(`第${i}年`);
            const progress = Math.min(100, (i / recoveryYears) * 100);
            recovery.push(progress.toFixed(0));
        }

        const option = {
            ...this.darkTheme,
            title: {
                text: '恢复时间线',
                left: 'center',
                top: 5,
                textStyle: { color: '#ff6b6b', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b}<br/>恢复进度: {c}%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                top: '18%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: years,
                axisLabel: { color: '#888', fontSize: 9, interval: Math.floor(recoveryYears / 5) },
                axisLine: { lineStyle: { color: 'rgba(255,80,80,0.3)' } }
            },
            yAxis: {
                type: 'value',
                max: 100,
                axisLabel: { color: '#888', formatter: '{value}%' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
            },
            series: [{
                type: 'line',
                data: recovery,
                smooth: true,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 107, 107, 0.5)' },
                            { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
                        ]
                    }
                },
                lineStyle: { color: '#ff6b6b', width: 2 },
                itemStyle: { color: '#ff6b6b' }
            }]
        };

        chart.setOption(option);
    },

    renderInfrastructureChart(infrastructure) {
        const chart = this.charts.basicChart;
        if (!chart) return;

        if (!infrastructure) {
            console.warn('Invalid infrastructure data for chart');
            return;
        }

        const option = {
            ...this.darkTheme,
            title: {
                text: '基础设施影响',
                left: 'center',
                top: 5,
                textStyle: { color: '#ff6b6b', fontSize: 12 }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}座'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                top: '18%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['医院', '学校', '交通枢纽', '电力设施'],
                axisLabel: { color: '#888', fontSize: 10 },
                axisLine: { lineStyle: { color: 'rgba(255,80,80,0.3)' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#888' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
            },
            series: [{
                type: 'bar',
                barWidth: '60%',
                data: [
                    { value: infrastructure.hospitals, itemStyle: { color: '#ff4444' } },
                    { value: infrastructure.schools, itemStyle: { color: '#44a3ff' } },
                    { value: infrastructure.transport, itemStyle: { color: '#44ff88' } },
                    { value: infrastructure.power, itemStyle: { color: '#ffaa44' } }
                ],
                itemStyle: {
                    borderRadius: [4, 4, 0, 0]
                }
            }]
        };

        chart.setOption(option);
    },

    renderEnvironmentChart(environment) {
        const chart = this.charts.basicChart;
        if (!chart) return;

        if (!environment) {
            console.warn('Invalid environment data for chart');
            return;
        }

        const option = {
            ...this.darkTheme,
            title: {
                text: '环境影响分析',
                left: 'center',
                top: 5,
                textStyle: { color: '#ff6b6b', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            radar: {
                indicator: [
                    { name: '放射性污染', max: 100 },
                    { name: '土地污染', max: 100 },
                    { name: '水源污染', max: 100 },
                    { name: '空气污染', max: 100 },
                    { name: '生态破坏', max: 100 }
                ],
                center: ['50%', '55%'],
                radius: '60%',
                axisName: {
                    color: '#aaa',
                    fontSize: 10
                },
                splitArea: {
                    areaStyle: {
                        color: ['rgba(255, 80, 80, 0.05)', 'rgba(255, 80, 80, 0.1)']
                    }
                },
                axisLine: {
                    lineStyle: { color: 'rgba(255, 80, 80, 0.3)' }
                },
                splitLine: {
                    lineStyle: { color: 'rgba(255, 80, 80, 0.2)' }
                }
            },
            series: [{
                type: 'radar',
                data: [{
                    value: [
                        environment.radiationLevel || 0,
                        environment.landPollution || 0,
                        environment.waterPollution || 0,
                        environment.airPollution || 0,
                        environment.ecologyDamage || 0
                    ],
                    name: '影响程度',
                    areaStyle: {
                        color: 'rgba(255, 107, 107, 0.4)'
                    },
                    lineStyle: {
                        color: '#ff6b6b'
                    },
                    itemStyle: {
                        color: '#ff6b6b'
                    }
                }]
            }]
        };

        chart.setOption(option);
    },

    renderHealthChart(health) {
        const chart = this.charts.healthChart;
        if (!chart) return;

        if (!health) {
            console.warn('Invalid health data for chart');
            return;
        }

        const option = {
            ...this.darkTheme,
            title: {
                text: '健康影响分布',
                left: 'center',
                top: 5,
                textStyle: { color: '#ff6b6b', fontSize: 12 }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}人'
            },
            legend: {
                orient: 'horizontal',
                bottom: 0,
                textStyle: { color: '#aaa', fontSize: 10 }
            },
            series: [{
                type: 'pie',
                radius: ['35%', '60%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 4,
                    borderColor: 'rgba(0,0,0,0.3)',
                    borderWidth: 1
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 11,
                        fontWeight: 'bold'
                    }
                },
                data: [
                    { value: health.acuteRadiation || 0, name: '急性辐射病', itemStyle: { color: '#9400d3' } },
                    { value: health.burns || 0, name: '烧伤', itemStyle: { color: '#ff4500' } },
                    { value: health.trauma || 0, name: '外伤', itemStyle: { color: '#ff8c00' } },
                    { value: health.psychological || 0, name: '心理创伤', itemStyle: { color: '#4169e1' } }
                ]
            }]
        };

        chart.setOption(option);
    },

    renderLongTermHealthChart(health) {
        const chart = this.charts.healthChart;
        if (!chart) return;

        if (!health) {
            console.warn('Invalid health data for long term chart');
            return;
        }

        const option = {
            ...this.darkTheme,
            title: {
                text: '长期健康风险预测',
                left: 'center',
                top: 5,
                textStyle: { color: '#ff6b6b', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['癌症', '遗传缺陷', '慢性病'],
                bottom: 0,
                textStyle: { color: '#aaa', fontSize: 10 }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '18%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['5年', '10年', '20年', '30年', '终身'],
                axisLabel: { color: '#888', fontSize: 10 },
                axisLine: { lineStyle: { color: 'rgba(255,80,80,0.3)' } }
            },
            yAxis: {
                type: 'value',
                name: '增加人数',
                nameTextStyle: { color: '#888' },
                axisLabel: { color: '#888' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
            },
            series: [
                {
                    name: '癌症',
                    type: 'line',
                    data: health.cancerProjection || [0, 0, 0, 0, 0],
                    smooth: true,
                    lineStyle: { color: '#ff6b6b' },
                    itemStyle: { color: '#ff6b6b' }
                },
                {
                    name: '遗传缺陷',
                    type: 'line',
                    data: health.geneticProjection || [0, 0, 0, 0, 0],
                    smooth: true,
                    lineStyle: { color: '#9400d3' },
                    itemStyle: { color: '#9400d3' }
                },
                {
                    name: '慢性病',
                    type: 'line',
                    data: health.chronicProjection || [0, 0, 0, 0, 0],
                    smooth: true,
                    lineStyle: { color: '#ffa500' },
                    itemStyle: { color: '#ffa500' }
                }
            ]
        };

        chart.setOption(option);
    },

    formatCurrency(value) {
        if (value >= 1e12) return '$' + (value / 1e12).toFixed(2) + '万亿';
        if (value >= 1e9) return '$' + (value / 1e9).toFixed(2) + '十亿';
        if (value >= 1e6) return '$' + (value / 1e6).toFixed(2) + '百万';
        if (value >= 1e3) return '$' + (value / 1e3).toFixed(2) + '千';
        return '$' + value.toFixed(2);
    },

    formatNumber(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + '十亿';
        if (num >= 1e8) return (num / 1e8).toFixed(2) + '亿';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + '百万';
        if (num >= 1e4) return (num / 1e4).toFixed(2) + '万';
        return num.toLocaleString();
    }
};

window.ChartManager = ChartManager;

function switchResultTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    setTimeout(() => {
        ChartManager.resize();
    }, 100);
}

window.switchResultTab = switchResultTab;

function exportReport() {
    if (typeof App !== 'undefined' && App.lastSimulationResult) {
        const result = App.lastSimulationResult;
        let report = `核武器模拟报告\n`;
        report += `================\n\n`;
        report += `目标位置: ${result.targetName}\n`;
        report += `坐标: ${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}\n`;
        report += `武器当量: ${result.yieldKt} kt\n`;
        report += `爆炸方式: ${result.burstHeight}\n\n`;
        report += `=== 基础影响 ===\n`;
        report += `火球半径: ${result.results.fireball.toFixed(2)} km\n`;
        report += `重度破坏半径: ${result.results.heavyBlast.toFixed(2)} km\n`;
        report += `中度破坏半径: ${result.results.moderateBlast.toFixed(2)} km\n`;
        report += `热辐射半径: ${result.results.thermal.toFixed(2)} km\n\n`;
        report += `=== 伤亡统计 ===\n`;
        report += `死亡人数: ${ChartManager.formatNumber(result.casualties.deaths)}\n`;
        report += `受伤人数: ${ChartManager.formatNumber(result.casualties.injuries)}\n\n`;
        report += `=== 经济影响 ===\n`;
        report += `直接损失: ${ChartManager.formatCurrency(result.economic.direct)}\n`;
        report += `间接损失: ${ChartManager.formatCurrency(result.economic.indirect)}\n`;
        report += `总损失: ${ChartManager.formatCurrency(result.economic.total)}\n`;
        report += `恢复时间: ${result.recovery.years} 年\n\n`;
        report += `生成时间: ${new Date().toLocaleString()}\n`;
        
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `核武器模拟报告_${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert('请先运行模拟！');
    }
}

function shareResult() {
    if (typeof App !== 'undefined' && App.lastSimulationResult) {
        const result = App.lastSimulationResult;
        const text = `核武器模拟结果\n目标: ${result.targetName}\n当量: ${result.yieldKt}kt\n死亡: ${ChartManager.formatNumber(result.casualties.deaths)}\n受伤: ${ChartManager.formatNumber(result.casualties.injuries)}\n经济损失: ${ChartManager.formatCurrency(result.economic.total)}`;
        
        if (navigator.share) {
            navigator.share({
                title: '核武器模拟结果',
                text: text
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert('结果已复制到剪贴板！');
            });
        }
    } else {
        alert('请先运行模拟！');
    }
}

window.exportReport = exportReport;
window.shareResult = shareResult;
