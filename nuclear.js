const NuclearCalculator = {
    weaponPresets: {
        littleBoy: { yield: 15, name: '小男孩 (Little Boy)', year: 1945, country: '美国', description: '广岛原子弹，铀弹' },
        fatMan: { yield: 21, name: '胖子 (Fat Man)', year: 1945, country: '美国', description: '长崎原子弹，钚弹' },
        
        w76: { yield: 100, name: 'W76', year: 1978, country: '美国', description: '三叉戟导弹弹头' },
        w78: { yield: 335, name: 'W78', year: 1979, country: '美国', description: '民兵III导弹弹头' },
        w87: { yield: 300, name: 'W87', year: 1986, country: '美国', description: '和平卫士导弹弹头' },
        w88: { yield: 475, name: 'W88', year: 1989, country: '美国', description: '三叉戟II导弹弹头' },
        b61: { yield: 50, name: 'B61', year: 1968, country: '美国', description: '战术核弹，可变当量' },
        b83: { yield: 1200, name: 'B83', year: 1983, country: '美国', description: '美国现役最强核弹' },
        w80: { yield: 150, name: 'W80', year: 1982, country: '美国', description: '巡航导弹弹头' },
        
        tsar: { yield: 50000, name: '沙皇炸弹 (Tsar Bomba)', year: 1961, country: '苏联', description: '人类史上最大核弹' },
        rds1: { yield: 22, name: 'RDS-1', year: 1949, country: '苏联', description: '苏联第一颗原子弹' },
        rds37: { yield: 1600, name: 'RDS-37', year: 1955, country: '苏联', description: '苏联首颗氢弹' },
        ss18: { yield: 24000, name: 'SS-18 撒旦', year: 1974, country: '苏联', description: '洲际导弹弹头' },
        topolM: { yield: 800, name: '白杨-M', year: 1997, country: '俄罗斯', description: '机动洲际导弹' },
        
        minuteman: { yield: 300, name: '民兵III (Minuteman III)', year: 1970, country: '美国', description: '陆基洲际导弹' },
        trident: { yield: 100, name: '三叉戟II (Trident II)', year: 1990, country: '美国', description: '潜射弹道导弹' },
        peacekeeper: { yield: 300, name: '和平卫士 (Peacekeeper)', year: 1986, country: '美国', description: '已退役洲际导弹' },
        
        df41: { yield: 300, name: '东风-41', year: 2019, country: '中国', description: '洲际弹道导弹' },
        df31: { yield: 150, name: '东风-31AG', year: 2017, country: '中国', description: '机动洲际导弹' },
        df5: { yield: 500, name: '东风-5B', year: 2015, country: '中国', description: '井基洲际导弹' },
        jl2: { yield: 250, name: '巨浪-2', year: 2015, country: '中国', description: '潜射弹道导弹' },
        q5: { yield: 20, name: '强-5核弹', year: 1972, country: '中国', description: '战术核航弹' },
        
        bulava: { yield: 150, name: '布拉瓦 (Bulava)', year: 2013, country: '俄罗斯', description: '潜射弹道导弹' },
        yars: { yield: 500, name: '亚尔斯 (Yars)', year: 2010, country: '俄罗斯', description: '机动洲际导弹' },
        sarmat: { yield: 5000, name: '萨尔马特 (Sarmat)', year: 2022, country: '俄罗斯', description: '重型洲际导弹' },
        
        blueDanube: { yield: 15, name: '蓝多瑙河', year: 1952, country: '英国', description: '英国第一颗原子弹' },
        we177: { yield: 450, name: 'WE.177', year: 1966, country: '英国', description: '战术核弹' },
        tridentUK: { yield: 100, name: '三叉戟(英)', year: 1994, country: '英国', description: '英国核威慑力量' },
        
        an52: { yield: 60, name: 'AN-52', year: 1974, country: '法国', description: '战术核弹' },
        tn75: { yield: 100, name: 'TN-75', year: 1997, country: '法国', description: '潜射弹头' },
        
        agni5: { yield: 250, name: '烈火-5', year: 2018, country: '印度', description: '洲际弹道导弹' },
        agni3: { yield: 60, name: '烈火-3', year: 2011, country: '印度', description: '中程弹道导弹' },
        
        ghauri: { yield: 30, name: '高里', year: 1998, country: '巴基斯坦', description: '中程弹道导弹' },
        shaheen2: { yield: 35, name: '沙欣-2', year: 2004, country: '巴基斯坦', description: '中程弹道导弹' },
        
        hwasong15: { yield: 150, name: '火星-15', year: 2017, country: '朝鲜', description: '洲际弹道导弹' },
        hwasong17: { yield: 250, name: '火星-17', year: 2022, country: '朝鲜', description: '洲际弹道导弹' },
        
        davyCrockett: { yield: 0.02, name: '大卫·克罗克特', year: 1961, country: '美国', description: '最小核武器，20吨当量' },
        sADM: { yield: 0.01, name: 'SADM', year: 1964, country: '美国', description: '背包核弹，10吨当量' },
        w54: { yield: 0.001, name: 'W54', year: 1961, country: '美国', description: '微型核弹头，1吨当量' },
        
        castleBravo: { yield: 15000, name: '城堡行动-喝彩', year: 1954, country: '美国', description: '美国最大核试验' },
        ivyMike: { yield: 10400, name: '常春藤-麦克', year: 1952, country: '美国', description: '首颗氢弹试验' },
        operationGrapple: { yield: 3000, name: '格斗行动', year: 1957, country: '英国', description: '英国氢弹试验' },
        canopus: { yield: 2600, name: '老人星', year: 1968, country: '法国', description: '法国氢弹试验' },
        
        custom: { yield: 100, name: '自定义武器', year: 2024, country: '自定义', description: '用户自定义当量' }
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
    },

    calculateInfrastructureImpact(results, populationDensity, countryData = null) {
        const affectedArea = results.areas.moderateBlast;
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

    calculateEnvironmentImpact(results, countryData = null) {
        const radiationArea = results.areas.radiation;
        const thermalArea = results.areas.thermal;
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

    calculateHealthImpact(results, casualties, countryData = null) {
        const radiationArea = results.areas.radiation;
        const thermalArea = results.areas.thermal;
        const density = casualties.effectiveDensity || 1000;
        const medicalCapacity = countryData?.medicalCapacity || 0.5;
        
        const acuteRadiation = Math.round(radiationArea * density * 0.3);
        const burns = Math.round(thermalArea * density * 0.25);
        const trauma = casualties.injuries * 0.4;
        const psychological = Math.round((casualties.deaths + casualties.injuries) * 2);
        const homeless = Math.round(results.areas.moderateBlast * density * 0.6);
        
        const cancerBase = radiationArea * density * 0.1;
        const geneticBase = radiationArea * density * 0.02;
        const chronicBase = radiationArea * density * 0.15;
        
        return {
            acuteRadiation: acuteRadiation,
            burns: Math.round(burns),
            trauma: Math.round(trauma),
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

    calculateGDPLoss(results, casualties, countryData = null) {
        const gdpPerCapita = countryData?.gdpPerCapita || 10000;
        const affectedPopulation = casualties.deaths + casualties.injuries;
        const affectedArea = results.areas.moderateBlast;
        
        const productivityLoss = affectedPopulation * gdpPerCapita * 0.5;
        const infrastructureLoss = affectedArea * (countryData?.gdpPerCapita || 10000) * 100;
        const businessLoss = affectedArea * 50000000;
        
        const directLoss = productivityLoss + infrastructureLoss * 0.3;
        const indirectLoss = businessLoss + infrastructureLoss * 0.2;
        
        return {
            direct: Math.round(directLoss),
            indirect: Math.round(indirectLoss),
            total: Math.round(directLoss + indirectLoss),
            gdpPerCapitaLoss: Math.round((directLoss + indirectLoss) / Math.max(1, affectedPopulation))
        };
    }
};

window.NuclearCalculator = NuclearCalculator;
