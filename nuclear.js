const NuclearCalculator = {
    weaponPresets: {
        littleBoy: { yield: 15, name: '小男孩', year: 1945, country: '美国' },
        fatMan: { yield: 21, name: '胖子', year: 1945, country: '美国' },
        w76: { yield: 100, name: 'W76', year: 1978, country: '美国' },
        w87: { yield: 300, name: 'W87', year: 1986, country: '美国' },
        b83: { yield: 1200, name: 'B83', year: 1983, country: '美国' },
        tsar: { yield: 50000, name: '沙皇炸弹', year: 1961, country: '苏联' },
        minuteman: { yield: 300, name: '民兵III', year: 1970, country: '美国' },
        trident: { yield: 100, name: '三叉戟II', year: 1990, country: '美国' },
        df41: { yield: 300, name: '东风-41', year: 2019, country: '中国' },
        bulava: { yield: 150, name: '布拉瓦', year: 2013, country: '俄罗斯' }
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

    calculate(yieldKt, burstHeight = 'air') {
        const results = {};

        results.fireball = this.calculateFireballRadius(yieldKt);
        results.heavyBlast = this.calculateBlastRadius(yieldKt, 20);
        results.moderateBlast = this.calculateBlastRadius(yieldKt, 5);
        results.lightBlast = this.calculateBlastRadius(yieldKt, 2);
        results.thermal = this.calculateThermalRadius(yieldKt);
        results.radiation = this.calculateRadiationRadius(yieldKt);
        results.electromagnetic = this.calculateEMPRadius(yieldKt, burstHeight);

        results.areas = {
            fireball: Math.PI * Math.pow(results.fireball, 2),
            heavyBlast: Math.PI * Math.pow(results.heavyBlast, 2),
            moderateBlast: Math.PI * Math.pow(results.moderateBlast, 2),
            lightBlast: Math.PI * Math.pow(results.lightBlast, 2),
            thermal: Math.PI * Math.pow(results.thermal, 2),
            radiation: Math.PI * Math.pow(results.radiation, 2)
        };

        return results;
    },

    calculateFireballRadius(yieldKt) {
        return 0.145 * Math.pow(yieldKt, 0.4);
    },

    calculateBlastRadius(yieldKt, psi) {
        let radius;
        
        if (psi >= 20) {
            radius = 0.28 * Math.pow(yieldKt, 1/3);
        } else if (psi >= 5) {
            radius = 0.6 * Math.pow(yieldKt, 1/3);
        } else {
            radius = 1.0 * Math.pow(yieldKt, 1/3);
        }
        
        return radius;
    },

    calculateThermalRadius(yieldKt) {
        return 1.9 * Math.pow(yieldKt, 0.41);
    },

    calculateRadiationRadius(yieldKt) {
        return 1.2 * Math.pow(yieldKt, 0.19);
    },

    calculateEMPRadius(yieldKt, burstHeight) {
        if (burstHeight === 'high') {
            return 100 + yieldKt * 0.5;
        } else if (burstHeight === 'air') {
            return 30 + yieldKt * 0.2;
        }
        return 10 + yieldKt * 0.1;
    },

    estimateCasualties(results, populationDensity, countryData = null, timeOfDay = 'day') {
        let effectiveDensity = populationDensity;
        
        if (countryData) {
            effectiveDensity = this.adjustDensityForTime(populationDensity, timeOfDay, countryData);
        }

        const factors = this.calculateFactors(countryData);

        const fireballDeaths = results.areas.fireball * effectiveDensity;

        const heavyBlastDeaths = (results.areas.heavyBlast - results.areas.fireball) * 
                                 effectiveDensity * 0.85 * factors.shelterFactor * factors.buildingFactor;
        
        const moderateBlastDeaths = (results.areas.moderateBlast - results.areas.heavyBlast) * 
                                    effectiveDensity * 0.35 * factors.shelterFactor * factors.buildingFactor;
        
        const lightBlastDeaths = (results.areas.lightBlast - results.areas.moderateBlast) * 
                                 effectiveDensity * 0.08 * factors.shelterFactor * factors.buildingFactor;

        const thermalDeaths = (results.areas.thermal - results.areas.lightBlast) * 
                              effectiveDensity * 0.12 * factors.shelterFactor * factors.fireFactor;

        const radiationDeaths = (results.areas.radiation - results.areas.thermal) * 
                                effectiveDensity * 0.15 * factors.shelterFactor;

        let totalDeaths = Math.round(fireballDeaths + heavyBlastDeaths + 
                                     moderateBlastDeaths + lightBlastDeaths + 
                                     thermalDeaths + radiationDeaths);

        const heavyBlastInjuries = (results.areas.heavyBlast - results.areas.fireball) * 
                                   effectiveDensity * 0.12 * factors.shelterFactor;
        
        const moderateBlastInjuries = (results.areas.moderateBlast - results.areas.heavyBlast) * 
                                      effectiveDensity * 0.45 * factors.shelterFactor;
        
        const lightBlastInjuries = (results.areas.lightBlast - results.areas.moderateBlast) * 
                                   effectiveDensity * 0.35 * factors.shelterFactor;
        
        const thermalInjuries = (results.areas.thermal - results.areas.lightBlast) * 
                                effectiveDensity * 0.25 * factors.shelterFactor;

        const radiationInjuries = (results.areas.radiation - results.areas.thermal) * 
                                  effectiveDensity * 0.35 * factors.shelterFactor;

        let totalInjuries = Math.round(heavyBlastInjuries + moderateBlastInjuries + 
                                       lightBlastInjuries + thermalInjuries + radiationInjuries);

        const medicalCapacity = countryData?.medicalCapacity || 0.5;
        const survivableInjuries = Math.round(totalInjuries * medicalCapacity);
        const fatalInjuries = Math.round(totalInjuries * (1 - medicalCapacity) * 0.3);
        
        totalDeaths += fatalInjuries;
        totalInjuries = survivableInjuries;

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
        const shelterFactor = 1 - shelterCapacity * 0.8;

        const buildingType = countryData.buildingType || 'mixed';
        const buildingData = this.buildingTypes[buildingType] || this.buildingTypes.mixed;
        const buildingFactor = 1 - buildingData.blastResistance * 0.5;
        const fireFactor = 1 - buildingData.fireResistance * 0.4;

        const evacuationFactor = 1 - (countryData.evacuationCapacity || 0.3) * 0.3;

        return {
            shelterFactor,
            buildingFactor,
            fireFactor,
            evacuationFactor,
            medicalFactor: countryData.medicalCapacity || 0.5,
            buildingTypeName: buildingData.name
        };
    },

    adjustDensityForTime(baseDensity, timeOfDay, countryData) {
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

    getImpactDetails(yieldKt, countryData = null) {
        const results = this.calculate(yieldKt);
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
                description: `大多数建筑倒塌，死亡率50%，严重伤害率40%`,
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
                area: Math.PI * Math.pow(results.electromagnetic, 2),
                description: '电子设备可能损坏，电力系统受影响',
                color: '#00bfff'
            }
        ];
    },

    calculateLongTermEffects(results, countryData = null) {
        const baseArea = results.areas.moderateBlast;
        const radiationArea = results.areas.radiation;
        
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

    calculateEconomicLoss(results, countryData) {
        const gdpPerCapita = countryData?.gdpPerCapita || 10000;
        const affectedArea = results.areas.moderateBlast;
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

    estimateRecoveryTime(results, countryData) {
        const medicalCapacity = countryData?.medicalCapacity || 0.5;
        const gdpPerCapita = countryData?.gdpPerCapita || 10000;
        
        let baseYears = 10;
        
        if (gdpPerCapita > 30000) baseYears *= 0.6;
        else if (gdpPerCapita > 15000) baseYears *= 0.8;
        else if (gdpPerCapita < 5000) baseYears *= 1.5;
        
        if (medicalCapacity > 0.8) baseYears *= 0.8;
        else if (medicalCapacity < 0.4) baseYears *= 1.3;
        
        return {
            years: Math.round(baseYears),
            description: `预计需要 ${Math.round(baseYears)} 年恢复基础设施`
        };
    },

    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(2) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    },

    formatCurrency(num) {
        if (num >= 1000000000000) {
            return '$' + (num / 1000000000000).toFixed(2) + 'T';
        } else if (num >= 1000000000) {
            return '$' + (num / 1000000000).toFixed(2) + 'B';
        } else if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(2) + 'M';
        }
        return '$' + num.toLocaleString();
    }
};

window.NuclearCalculator = NuclearCalculator;
