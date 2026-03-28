/**
 * Nuclear.js - 核武器效应计算引擎 (优化版)
 * 修复：参数验证、错误处理、边界条件
 */

const NuclearCalculator = {
    weaponPresets: {
        littleBoy: { yield: 15, name: '小男孩 (Little Boy)', year: 1945, country: '美国', description: '广岛原子弹，铀弹' },
        fatMan: { yield: 21, name: '胖子 (Fat Man)', year: 1945, country: '美国', description: '长崎原子弹，钚弹' },
        tsarBomba: { yield: 50000, name: '沙皇炸弹', year: 1961, country: '苏联', description: '人类史上最大核弹' },
        w76: { yield: 100, name: 'W76', year: 1978, country: '美国', description: '三叉戟导弹弹头' },
        w78: { yield: 335, name: 'W78', year: 1979, country: '美国', description: '民兵III导弹弹头' },
        w87: { yield: 300, name: 'W87', year: 1986, country: '美国', description: '和平卫士导弹弹头' },
        w88: { yield: 475, name: 'W88', year: 1989, country: '美国', description: '三叉戟II导弹弹头' },
        b61: { yield: 50, name: 'B61', year: 1968, country: '美国', description: '战术核弹' },
        b83: { yield: 1200, name: 'B83', year: 1983, country: '美国', description: '美国现役最强核弹' },
        ss18: { yield: 24000, name: 'SS-18 撒旦', year: 1974, country: '苏联', description: '洲际导弹弹头' },
        topolM: { yield: 800, name: '白杨-M', year: 1997, country: '俄罗斯', description: '机动洲际导弹' },
        sarmat: { yield: 5000, name: '萨尔马特', year: 2022, country: '俄罗斯', description: '重型洲际导弹' },
        df41: { yield: 300, name: '东风-41', year: 2019, country: '中国', description: '洲际弹道导弹' },
        davyCrockett: { yield: 0.02, name: '大卫·克罗克特', year: 1961, country: '美国', description: '最小核武器' },
        w54: { yield: 0.001, name: 'W54', year: 1961, country: '美国', description: '微型核弹头' }
    },

    buildingTypes: {
        wood_frame: { name: '木结构', blastResistance: 0.3, fireResistance: 0.2 },
        brick: { name: '砖结构', blastResistance: 0.5, fireResistance: 0.4 },
        concrete: { name: '混凝土', blastResistance: 0.7, fireResistance: 0.6 },
        modern: { name: '现代建筑', blastResistance: 0.6, fireResistance: 0.5 },
        earthquake_resistant: { name: '抗震建筑', blastResistance: 0.75, fireResistance: 0.55 },
        high_rise: { name: '高层建筑', blastResistance: 0.65, fireResistance: 0.5 },
        low_rise: { name: '低层建筑', blastResistance: 0.35, fireResistance: 0.3 },
        mixed: { name: '混合结构', blastResistance: 0.5, fireResistance: 0.45 }
    },

    /**
     * 主计算函数
     * @param {number} yieldKt - 当量（千吨）
     * @param {string} burstHeight - 爆炸高度
     * @returns {object} 计算结果
     */
    calculate(yieldKt, burstHeight = 'air') {
        // 参数验证
        if (typeof yieldKt !== 'number' || isNaN(yieldKt) || yieldKt <= 0) {
            console.error('Invalid yieldKt:', yieldKt);
            return this.getDefaultResults();
        }

        const results = {};

        // 计算各区域半径（公里）
        results.fireball = this.calculateFireballRadius(yieldKt);
        results.heavyBlast = this.calculateBlastRadius(yieldKt, 20);
        results.moderateBlast = this.calculateBlastRadius(yieldKt, 5);
        results.lightBlast = this.calculateBlastRadius(yieldKt, 2);
        results.thermal = this.calculateThermalRadius(yieldKt);
        results.radiation = this.calculateRadiationRadius(yieldKt);
        results.electromagnetic = this.calculateEMPRadius(yieldKt, burstHeight);

        // 计算各区域面积（平方公里）
        results.areas = {
            fireball: Math.PI * Math.pow(Math.max(0, results.fireball), 2),
            heavyBlast: Math.PI * Math.pow(Math.max(0, results.heavyBlast), 2),
            moderateBlast: Math.PI * Math.pow(Math.max(0, results.moderateBlast), 2),
            lightBlast: Math.PI * Math.pow(Math.max(0, results.lightBlast), 2),
            thermal: Math.PI * Math.pow(Math.max(0, results.thermal), 2),
            radiation: Math.PI * Math.pow(Math.max(0, results.radiation), 2),
            electromagnetic: Math.PI * Math.pow(Math.max(0, results.electromagnetic), 2)
        };

        // 确保 areas 中的值都是有效数字
        for (const key in results.areas) {
            if (typeof results.areas[key] !== 'number' || isNaN(results.areas[key])) {
                results.areas[key] = 0;
            }
        }

        return results;
    },

    /**
     * 获取默认结果（用于错误情况）
     */
    getDefaultResults() {
        return {
            fireball: 0,
            heavyBlast: 0,
            moderateBlast: 0,
            lightBlast: 0,
            thermal: 0,
            radiation: 0,
            electromagnetic: 0,
            areas: {
                fireball: 0,
                heavyBlast: 0,
                moderateBlast: 0,
                lightBlast: 0,
                thermal: 0,
                radiation: 0,
                electromagnetic: 0
            }
        };
    },

    /**
     * 计算火球半径（公里）
     */
    calculateFireballRadius(yieldKt) {
        if (yieldKt <= 0) return 0;
        return 0.145 * Math.pow(yieldKt, 0.4);
    },

    /**
     * 计算冲击波半径（公里）
     */
    calculateBlastRadius(yieldKt, psi) {
        if (yieldKt <= 0) return 0;
        
        let radius;
        if (psi >= 20) {
            radius = 0.28 * Math.pow(yieldKt, 1/3);
        } else if (psi >= 5) {
            radius = 0.6 * Math.pow(yieldKt, 1/3);
        } else {
            radius = 1.0 * Math.pow(yieldKt, 1/3);
        }
        
        return Math.max(0, radius);
    },

    /**
     * 计算热辐射半径（公里）
     */
    calculateThermalRadius(yieldKt) {
        if (yieldKt <= 0) return 0;
        return 1.9 * Math.pow(yieldKt, 0.41);
    },

    /**
     * 计算辐射半径（公里）
     */
    calculateRadiationRadius(yieldKt) {
        if (yieldKt <= 0) return 0;
        return 1.2 * Math.pow(yieldKt, 0.19);
    },

    /**
     * 计算 EMP 影响半径（公里）
     */
    calculateEMPRadius(yieldKt, burstHeight) {
        if (yieldKt <= 0) return 0;
        
        if (burstHeight === 'high') {
            return 100 + yieldKt * 0.5;
        } else if (burstHeight === 'air') {
            return 30 + yieldKt * 0.2;
        }
        return 10 + yieldKt * 0.1;
    },

    /**
     * 估算伤亡人数
     */
    estimateCasualties(results, populationDensity, countryData = null, timeOfDay = 'day') {
        // 参数验证
        if (!results || !results.areas) {
            console.error('Invalid results in estimateCasualties');
            return { deaths: 0, injuries: 0, details: {}, factors: {}, effectiveDensity: 0 };
        }

        if (typeof populationDensity !== 'number' || isNaN(populationDensity) || populationDensity < 0) {
            populationDensity = 1000; // 默认值
        }

        let effectiveDensity = populationDensity;
        
        if (countryData) {
            effectiveDensity = this.adjustDensityForTime(populationDensity, timeOfDay, countryData);
        }

        const factors = this.calculateFactors(countryData);

        // 确保所有面积值有效
        const areas = results.areas;
        const safeArea = (area) => Math.max(0, area || 0);

        const fireballDeaths = safeArea(areas.fireball) * effectiveDensity;

        const heavyBlastDeaths = Math.max(0, safeArea(areas.heavyBlast) - safeArea(areas.fireball)) * 
                                 effectiveDensity * 0.85 * factors.shelterFactor * factors.buildingFactor;
        
        const moderateBlastDeaths = Math.max(0, safeArea(areas.moderateBlast) - safeArea(areas.heavyBlast)) * 
                                    effectiveDensity * 0.35 * factors.shelterFactor * factors.buildingFactor;
        
        const lightBlastDeaths = Math.max(0, safeArea(areas.lightBlast) - safeArea(areas.moderateBlast)) * 
                                 effectiveDensity * 0.08 * factors.shelterFactor * factors.buildingFactor;

        const thermalDeaths = Math.max(0, safeArea(areas.thermal) - safeArea(areas.lightBlast)) * 
                              effectiveDensity * 0.12 * factors.shelterFactor * factors.fireFactor;

        const radiationDeaths = Math.max(0, safeArea(areas.radiation) - safeArea(areas.thermal)) * 
                                effectiveDensity * 0.15 * factors.shelterFactor;

        let totalDeaths = Math.round(fireballDeaths + heavyBlastDeaths + 
                                     moderateBlastDeaths + lightBlastDeaths + 
                                     thermalDeaths + radiationDeaths);

        const heavyBlastInjuries = Math.max(0, safeArea(areas.heavyBlast) - safeArea(areas.fireball)) * 
                                   effectiveDensity * 0.12 * factors.shelterFactor;
        
        const moderateBlastInjuries = Math.max(0, safeArea(areas.moderateBlast) - safeArea(areas.heavyBlast)) * 
                                      effectiveDensity * 0.45 * factors.shelterFactor;
        
        const lightBlastInjuries = Math.max(0, safeArea(areas.lightBlast) - safeArea(areas.moderateBlast)) * 
                                   effectiveDensity * 0.35 * factors.shelterFactor;
        
        const thermalInjuries = Math.max(0, safeArea(areas.thermal) - safeArea(areas.lightBlast)) * 
                                effectiveDensity * 0.25 * factors.shelterFactor;

        const radiationInjuries = Math.max(0, safeArea(areas.radiation) - safeArea(areas.thermal)) * 
                                  effectiveDensity * 0.35 * factors.shelterFactor;

        let totalInjuries = Math.round(heavyBlastInjuries + moderateBlastInjuries + 
                                       lightBlastInjuries + thermalInjuries + radiationInjuries);

        const medicalCapacity = countryData?.medicalCapacity || 0.5;
        const survivableInjuries = Math.round(totalInjuries * medicalCapacity);
        const fatalInjuries = Math.round(totalInjuries * (1 - medicalCapacity) * 0.3);
        
        totalDeaths += fatalInjuries;
        totalInjuries = survivableInjuries;

        // 确保死亡人数不为负
        totalDeaths = Math.max(0, totalDeaths);
        totalInjuries = Math.max(0, totalInjuries);

        return {
            deaths: totalDeaths,
            injuries: totalInjuries,
            details: {
                fireball: Math.round(fireballDeaths),
                heavyBlast: Math.round(heavyBlastDeaths + heavyBlastInjuries),
                moderateBlast: Math.round(moderateBlastDeaths + moderateBlastInjuries),
                lightBlast: Math.round(lightBlastDeaths + lightBlastInjuries),
                thermal: Math.round(thermalDeaths + thermalInjuries),
                radiation: Math.round(radiationDeaths + radiationInjuries)
            },
            factors: factors,
            effectiveDensity: Math.round(effectiveDensity)
        };
    },

    /**
     * 计算影响因素
     */
    calculateFactors(countryData) {
        if (!countryData) {
            return {
                shelterFactor: 0.7,
                buildingFactor: 0.8,
                fireFactor: 0.9,
                evacuationFactor: 0.5,
                medicalFactor: 0.5
            };
        }

        const shelterCapacity = countryData.shelterCapacity || 0.3;
        const shelterFactor = Math.max(0.1, 1 - shelterCapacity * 0.8);

        const buildingType = countryData.buildingType || 'mixed';
        const buildingData = this.buildingTypes[buildingType] || this.buildingTypes.mixed;
        const buildingFactor = Math.max(0.1, 1 - buildingData.blastResistance * 0.5);
        const fireFactor = Math.max(0.1, 1 - buildingData.fireResistance * 0.4);

        const evacuationFactor = Math.max(0.1, 1 - (countryData.evacuationCapacity || 0.3) * 0.3);

        return {
            shelterFactor,
            buildingFactor,
            fireFactor,
            evacuationFactor,
            medicalFactor: countryData.medicalCapacity || 0.5,
            buildingTypeName: buildingData.name
        };
    },

    /**
     * 根据时间调整人口密度
     */
    adjustDensityForTime(baseDensity, timeOfDay, countryData) {
        if (typeof baseDensity !== 'number' || isNaN(baseDensity)) return 1000;
        
        const urbanizationRate = countryData?.urbanizationRate || 50;
        const urbanFactor = urbanizationRate / 100;
        
        switch (timeOfDay) {
            case 'day':
                return baseDensity * (1 + urbanFactor * 0.3);
            case 'night':
                return baseDensity * (1 - urbanFactor * 0.2);
            case 'rush':
                return baseDensity * (1 + urbanFactor * 0.5);
            default:
                return baseDensity;
        }
    },

    /**
     * 计算长期影响
     */
    calculateLongTermEffects(results, countryData = null) {
        if (!results || !results.areas) {
            return {
                falloutArea: 0,
                longTermDeaths: 0,
                cancerIncrease: 0,
                economicLoss: { direct: 0, indirect: 0, total: 0, currency: 'USD' },
                recoveryTime: { years: 10, description: '预计需要 10 年恢复' }
            };
        }

        const baseArea = results.areas.moderateBlast || 0;
        const radiationArea = results.areas.radiation || 0;
        
        const falloutFactor = countryData?.climate === 'arid' ? 1.3 : 
                             countryData?.climate === 'tropical' ? 0.7 : 1.0;
        
        return {
            falloutArea: radiationArea * falloutFactor,
            longTermDeaths: Math.round(radiationArea * 0.05 * (countryData?.populationDensity || 1000)),
            cancerIncrease: Math.round(radiationArea * 0.15),
            economicLoss: this.calculateEconomicLoss(results, countryData),
            recoveryTime: this.estimateRecoveryTime(results, countryData)
        };
    },

    /**
     * 计算经济损失
     */
    calculateEconomicLoss(results, countryData) {
        if (!results || !results.areas) {
            return { direct: 0, indirect: 0, total: 0, currency: 'USD' };
        }

        const gdpPerCapita = countryData?.gdpPerCapita || 10000;
        const affectedArea = results.areas.moderateBlast || 0;
        const density = countryData?.populationDensity || 1000;
        
        const directLoss = affectedArea * density * gdpPerCapita * 0.5;
        const indirectLoss = directLoss * 0.3;
        
        return {
            direct: Math.round(directLoss),
            indirect: Math.round(indirectLoss),
            total: Math.round(directLoss + indirectLoss),
            currency: 'USD'
        };
    },

    /**
     * 估算恢复时间
     */
    estimateRecoveryTime(results, countryData) {
        const medicalCapacity = countryData?.medicalCapacity || 0.5;
        const gdpPerCapita = countryData?.gdpPerCapita || 10000;
        
        let baseYears = 10;
        
        if (gdpPerCapita > 30000) baseYears *= 0.6;
        else if (gdpPerCapita > 15000) baseYears *= 0.8;
        else if (gdpPerCapita < 5000) baseYears *= 1.5;
        
        if (medicalCapacity > 0.8) baseYears *= 0.8;
        else if (medicalCapacity < 0.4) baseYears *= 1.3;
        
        baseYears = Math.max(1, Math.round(baseYears));
        
        return {
            years: baseYears,
            description: `预计需要 ${baseYears} 年恢复基础设施`
        };
    },

    /**
     * 计算基础设施影响
     */
    calculateInfrastructureImpact(results, populationDensity, countryData = null) {
        if (!results || !results.areas) {
            return { hospitals: 0, schools: 0, transport: 0, power: 0, details: {} };
        }

        const affectedArea = results.areas.moderateBlast || 0;
        const urbanizationRate = countryData?.urbanizationRate || 50;
        const urbanFactor = urbanizationRate / 100;
        
        const hospitalsPerKm2 = urbanFactor * 0.02;
        const schoolsPerKm2 = urbanFactor * 0.15;
        const transportPerKm2 = urbanFactor * 0.01;
        const powerPerKm2 = urbanFactor * 0.005;
        
        const hospitals = Math.round(affectedArea * hospitalsPerKm2);
        const schools = Math.round(affectedArea * schoolsPerKm2);
        const transport = Math.round(affectedArea * transportPerKm2);
        const power = Math.round(affectedArea * powerPerKm2);
        
        return {
            hospitals: hospitals,
            schools: schools,
            transport: transport,
            power: power,
            details: {
                hospitalBeds: Math.round(hospitals * 200),
                schoolCapacity: Math.round(schools * 800),
                transportCapacity: Math.round(transport * 50000),
                powerCapacity: Math.round(power * 500)
            }
        };
    },

    /**
     * 计算环境影响
     */
    calculateEnvironmentImpact(results, countryData = null) {
        if (!results || !results.areas) {
            return { falloutArea: 0, landContamination: 0, waterAffected: 0, carbonEmission: 0, radiationLevel: 0 };
        }

        const radiationArea = results.areas.radiation || 0;
        const thermalArea = results.areas.thermal || 0;
        const climate = countryData?.climate || 'temperate';
        
        let falloutMultiplier = 1;
        if (climate === 'arid') falloutMultiplier = 1.3;
        else if (climate === 'tropical') falloutMultiplier = 0.7;
        else if (climate === 'cold') falloutMultiplier = 1.1;
        
        const falloutArea = radiationArea * falloutMultiplier;
        const landContamination = radiationArea * 0.8;
        const waterAffected = radiationArea * 50;
        const carbonEmission = thermalArea * 1000;
        
        return {
            falloutArea: falloutArea,
            landContamination: landContamination,
            waterAffected: waterAffected,
            carbonEmission: carbonEmission,
            radiationLevel: Math.min(100, (radiationArea / 100) * 100),
            landPollution: Math.min(100, (landContamination / 500) * 100),
            waterPollution: Math.min(100, (waterAffected / 10000) * 100),
            airPollution: Math.min(100, (thermalArea / 50) * 100),
            ecologyDamage: Math.min(100, (radiationArea + thermalArea) / 100)
        };
    },

    /**
     * 计算健康影响
     */
    calculateHealthImpact(results, casualties, countryData = null) {
        if (!results || !results.areas || !casualties) {
            return { acuteRadiation: 0, burns: 0, trauma: 0, psychological: 0, homeless: 0 };
        }

        const radiationArea = results.areas.radiation || 0;
        const thermalArea = results.areas.thermal || 0;
        const density = casualties.effectiveDensity || 1000;
        const medicalCapacity = countryData?.medicalCapacity || 0.5;
        
        const acuteRadiation = Math.round(radiationArea * density * 0.3);
        const burns = Math.round(thermalArea * density * 0.25);
        const trauma = Math.round((casualties.injuries || 0) * 0.4);
        const psychological = Math.round((casualties.deaths || 0) + (casualties.injuries || 0)) * 2;
        const homeless = Math.round((results.areas.moderateBlast || 0) * density * 0.6);
        
        const cancerBase = radiationArea * density * 0.1;
        const geneticBase = radiationArea * density * 0.02;
        const chronicBase = radiationArea * density * 0.15;
        
        return {
            acuteRadiation: acuteRadiation,
            burns: burns,
            trauma: trauma,
            psychological: psychological,
            homeless: homeless,
            cancerProjection: [
                Math.round(cancerBase * 0.2),
                Math.round(cancerBase * 0.4),
                Math.round(cancerBase * 0.7),
                Math.round(cancerBase * 0.9),
                Math.round(cancerBase)
            ],
            geneticProjection: [
                Math.round(geneticBase * 0.1),
                Math.round(geneticBase * 0.2),
                Math.round(geneticBase * 0.4),
                Math.round(geneticBase * 0.6),
                Math.round(geneticBase)
            ],
            chronicProjection: [
                Math.round(chronicBase * 0.3),
                Math.round(chronicBase * 0.5),
                Math.round(chronicBase * 0.7),
                Math.round(chronicBase * 0.85),
                Math.round(chronicBase)
            ]
        };
    },

    /**
     * 计算 GDP 损失
     */
    calculateGDPLoss(results, casualties, countryData = null) {
        if (!results || !results.areas || !casualties) {
            return { direct: 0, indirect: 0, total: 0, gdpPerCapitaLoss: 0 };
        }

        const gdpPerCapita = countryData?.gdpPerCapita || 10000;
        const affectedPopulation = (casualties.deaths || 0) + (casualties.injuries || 0);
        const affectedArea = results.areas.moderateBlast || 0;
        
        const productivityLoss = affectedPopulation * gdpPerCapita * 0.5;
        const infrastructureLoss = affectedArea * gdpPerCapita * 100;
        const businessLoss = affectedArea * 50000000;
        
        const directLoss = productivityLoss + infrastructureLoss * 0.3;
        const indirectLoss = businessLoss + infrastructureLoss * 0.2;
        
        return {
            direct: Math.round(directLoss),
            indirect: Math.round(indirectLoss),
            total: Math.round(directLoss + indirectLoss),
            gdpPerCapitaLoss: Math.round((directLoss + indirectLoss) / Math.max(1, affectedPopulation))
        };
    },

    /**
     * 格式化数字
     */
    formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        if (num >= 1000000000) return (num / 1000000000).toFixed(2) + '十亿';
        if (num >= 100000000) return (num / 100000000).toFixed(2) + '亿';
        if (num >= 10000) return (num / 10000).toFixed(2) + '万';
        return num.toLocaleString();
    },

    /**
     * 获取影响详情
     */
    getImpactDetails(yieldKt, countryData = null) {
        const results = this.calculate(yieldKt);
        if (!results || !results.areas) {
            return [];
        }

        const buildingType = countryData?.buildingType || 'mixed';
        const buildingData = this.buildingTypes[buildingType] || this.buildingTypes.mixed;
        
        return [
            {
                type: '火球区域',
                radius: results.fireball,
                area: results.areas.fireball,
                description: '所有物质完全气化，100%致死率',
                color: '#ff0000'
            },
            {
                type: '重度破坏区 (20 psi)',
                radius: results.heavyBlast,
                area: results.areas.heavyBlast,
                description: `${buildingData.name}建筑严重损坏，死亡率95%以上`,
                color: '#ff4500'
            },
            {
                type: '中度破坏区 (5 psi)',
                radius: results.moderateBlast,
                area: results.areas.moderateBlast,
                description: '大多数建筑倒塌，死亡率50%，严重伤害率40%',
                color: '#ff8c00'
            },
            {
                type: '轻度破坏区 (2 psi)',
                radius: results.lightBlast,
                area: results.areas.lightBlast,
                description: '窗户破碎，轻度结构损坏，伤害率15%',
                color: '#ffd700'
            },
            {
                type: '热辐射区 (三度烧伤)',
                radius: results.thermal,
                area: results.areas.thermal,
                description: '可造成三度烧伤，引发大规模火灾',
                color: '#ff6347'
            },
            {
                type: '辐射区 (500 rem)',
                radius: results.radiation,
                area: results.areas.radiation,
                description: '急性辐射病，无治疗情况下死亡率50%',
                color: '#9400d3'
            },
            {
                type: 'EMP影响区',
                radius: results.electromagnetic,
                area: results.areas.electromagnetic,
                description: '电子设备可能损坏，电力系统受影响',
                color: '#00bfff'
            }
        ];
    }
};

// 导出到全局
window.NuclearCalculator = NuclearCalculator;
