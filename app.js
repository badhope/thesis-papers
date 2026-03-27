const App = {
    currentCountryData: null,

    init() {
        MapHandler.init();
        this.populateCitySelect();
        this.setupEventListeners();
    },

    populateCitySelect() {
        const select = document.getElementById('citySelect');
        
        const grouped = {};
        WorldCities.forEach(city => {
            if (!grouped[city.country]) {
                grouped[city.country] = [];
            }
            grouped[city.country].push(city);
        });

        Object.keys(grouped).sort().forEach(country => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = country;
            
            grouped[country].sort((a, b) => b.population - a.population).forEach(city => {
                const option = document.createElement('option');
                option.value = city.name;
                option.textContent = `${city.name} (${NuclearCalculator.formatNumber(city.population)})`;
                option.dataset.density = city.density;
                option.dataset.population = city.population;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });
    },

    setupEventListeners() {
        document.getElementById('weaponType').addEventListener('change', (e) => {
            const customGroup = document.getElementById('customYieldGroup');
            customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });

        document.getElementById('citySelect').addEventListener('change', (e) => {
            const cityName = e.target.value;
            if (cityName) {
                const city = WorldCities.find(c => c.name === cityName);
                if (city) {
                    MapHandler.selectCity(city);
                }
            }
        });

        document.getElementById('searchCity').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const select = document.getElementById('citySelect');
            
            if (query.length > 0) {
                const match = WorldCities.find(c => 
                    c.name.toLowerCase().includes(query) || 
                    c.country.toLowerCase().includes(query)
                );
                if (match) {
                    select.value = match.name;
                    MapHandler.selectCity(match);
                }
            }
        });

        document.getElementById('simulateBtn').addEventListener('click', () => {
            this.runSimulation();
        });
    },

    onCitySelected(city) {
        const countryCode = this.getCountryCode(city.country);
        if (countryCode && CountryData[countryCode]) {
            this.currentCountryData = CountryData[countryCode];
            this.displayCountryInfo(this.currentCountryData);
        } else {
            this.currentCountryData = null;
            document.getElementById('countryInfo').style.display = 'none';
        }
    },

    getCountryCode(countryName) {
        const mapping = {
            '中国': 'CN',
            '中国台湾': 'TW',
            '日本': 'JP',
            '韩国': 'KR',
            '朝鲜': 'KP',
            '新加坡': 'SG',
            '泰国': 'TH',
            '印度尼西亚': 'ID',
            '菲律宾': 'PH',
            '马来西亚': 'MY',
            '越南': 'VN',
            '印度': 'IN',
            '孟加拉国': 'BD',
            '巴基斯坦': 'PK',
            '阿联酋': 'AE',
            '伊朗': 'IR',
            '土耳其': 'TR',
            '埃及': 'EG',
            '尼日利亚': 'NG',
            '南非': 'ZA',
            '俄罗斯': 'RU',
            '英国': 'GB',
            '法国': 'FR',
            '德国': 'DE',
            '西班牙': 'ES',
            '意大利': 'IT',
            '荷兰': 'NL',
            '奥地利': 'AT',
            '波兰': 'PL',
            '捷克': 'CZ',
            '希腊': 'GR',
            '瑞典': 'SE',
            '挪威': 'NO',
            '丹麦': 'DK',
            '芬兰': 'FI',
            '美国': 'US',
            '加拿大': 'CA',
            '墨西哥': 'MX',
            '巴西': 'BR',
            '阿根廷': 'AR',
            '秘鲁': 'PE',
            '哥伦比亚': 'CO',
            '智利': 'CL',
            '澳大利亚': 'AU',
            '新西兰': 'NZ',
            '香港': 'HK',
            '台北': 'TW',
            '以色列': 'IL',
            '沙特阿拉伯': 'SA'
        };
        return mapping[countryName];
    },

    displayCountryInfo(data) {
        const panel = document.getElementById('countryInfo');
        panel.style.display = 'block';

        document.getElementById('statUrbanization').textContent = data.urbanizationRate + '%';
        document.getElementById('statMedical').textContent = Math.round(data.medicalCapacity * 100) + '%';
        document.getElementById('statShelter').textContent = Math.round(data.shelterCapacity * 100) + '%';
        document.getElementById('statBuilding').textContent = NuclearCalculator.buildingTypes[data.buildingType]?.name || data.buildingType;
        document.getElementById('statGDP').textContent = '$' + NuclearCalculator.formatNumber(data.gdpPerCapita);
    },

    getYield() {
        const weaponType = document.getElementById('weaponType').value;
        
        if (weaponType === 'custom') {
            return parseFloat(document.getElementById('customYield').value) || 100;
        }
        
        return NuclearCalculator.weaponPresets[weaponType]?.yield || 100;
    },

    runSimulation() {
        if (!MapHandler.selectedCoords) {
            alert('请先在地图上选择目标位置或选择一个城市');
            return;
        }

        const yieldKt = this.getYield();
        const populationDensity = parseInt(document.getElementById('population').value) || 5000;
        const timeOfDay = document.getElementById('timeOfDay').value;
        const burstHeight = document.getElementById('burstHeight').value;

        const results = NuclearCalculator.calculate(yieldKt, burstHeight);
        const casualties = NuclearCalculator.estimateCasualties(
            results, 
            populationDensity, 
            this.currentCountryData, 
            timeOfDay
        );
        const details = NuclearCalculator.getImpactDetails(yieldKt, this.currentCountryData);
        const longTerm = NuclearCalculator.calculateLongTermEffects(results, this.currentCountryData);

        this.displayResults(results, casualties, details, longTerm);
        MapHandler.drawImpactCircles(results);
    },

    displayResults(results, casualties, details, longTerm) {
        const panel = document.getElementById('resultsPanel');
        panel.classList.add('show');

        if (MapHandler.selectedCity) {
            document.getElementById('targetName').textContent = 
                `${MapHandler.selectedCity.name}, ${MapHandler.selectedCity.country}`;
        } else {
            document.getElementById('targetName').textContent = '自定义坐标';
        }
        document.getElementById('targetCoords').textContent = 
            `${MapHandler.selectedCoords.lat.toFixed(4)}°, ${MapHandler.selectedCoords.lng.toFixed(4)}°`;

        document.getElementById('fireballRadius').textContent = results.fireball.toFixed(2);
        document.getElementById('heavyBlastRadius').textContent = results.heavyBlast.toFixed(2);
        document.getElementById('moderateBlastRadius').textContent = results.moderateBlast.toFixed(2);
        document.getElementById('thermalRadius').textContent = results.thermal.toFixed(2);
        
        document.getElementById('deaths').textContent = NuclearCalculator.formatNumber(casualties.deaths);
        document.getElementById('injuries').textContent = NuclearCalculator.formatNumber(casualties.injuries);

        document.getElementById('effectiveDensity').textContent = 
            casualties.effectiveDensity.toLocaleString() + ' 人/km²';
        document.getElementById('buildingFactor').textContent = 
            ((1 - casualties.factors.buildingFactor) * 100).toFixed(0) + '% 防护';
        document.getElementById('shelterFactor').textContent = 
            ((1 - casualties.factors.shelterFactor) * 100).toFixed(0) + '% 避难';

        document.getElementById('economicLoss').textContent = 
            NuclearCalculator.formatCurrency(longTerm.economicLoss.total);
        document.getElementById('recoveryTime').textContent = 
            longTerm.recoveryTime.years + ' 年';
        document.getElementById('falloutArea').textContent = 
            longTerm.falloutArea.toFixed(0) + ' km²';

        const tbody = document.querySelector('#impactTable tbody');
        tbody.innerHTML = '';
        
        details.forEach(detail => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="color:${detail.color}">●</span> ${detail.type}</td>
                <td>${detail.radius.toFixed(2)}</td>
                <td>${detail.area.toFixed(1)}</td>
                <td>${detail.description}</td>
            `;
            tbody.appendChild(row);
        });

        panel.scrollIntoView({ behavior: 'smooth' });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
