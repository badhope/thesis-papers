let mapHandler = null;
let currentResults = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('NuclearSim Pro initializing...');
    
    await initApp();
    setupEventListeners();
    await loadHistory();
    
    console.log('NuclearSim Pro initialized successfully');
});

async function initApp() {
    try {
        const version = await window.electronAPI.app.getVersion();
        document.getElementById('appVersion').textContent = 'v' + version;
    } catch (error) {
        console.error('Failed to get app version:', error);
    }
    
    initMap();
    populateCitySelect();
    setupUpdateListener();
}

function initMap() {
    if (typeof MapHandler === 'undefined') {
        console.error('MapHandler not loaded');
        return;
    }
    MapHandler.init();
    mapHandler = MapHandler;
}

function populateCitySelect() {
    const citySelect = document.getElementById('citySelect');
    if (!citySelect || !window.CitiesData) return;
    
    const cities = window.CitiesData.cities;
    
    const grouped = {};
    cities.forEach(city => {
        if (!grouped[city.continent]) {
            grouped[city.continent] = {};
        }
        if (!grouped[city.continent][city.country]) {
            grouped[city.continent][city.country] = [];
        }
        grouped[city.continent][city.country].push(city);
    });
    
    citySelect.innerHTML = '<option value="">选择城市...</option>';
    
    for (const [continent, countries] of Object.entries(grouped)) {
        const continentGroup = document.createElement('optgroup');
        continentGroup.label = continent;
        
        for (const [country, cityList] of Object.entries(countries)) {
            cityList.forEach(city => {
                const option = document.createElement('option');
                option.value = city.name;
                option.textContent = `${city.name} (${city.country})`;
                continentGroup.appendChild(option);
            });
        }
        
        citySelect.appendChild(continentGroup);
    }
}

function setupEventListeners() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const section = item.dataset.section;
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`${section}-panel`).classList.add('active');
        });
    });
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    const weaponSelect = document.getElementById('weaponType');
    const customYieldGroup = document.getElementById('customYieldGroup');
    const weaponInfo = document.getElementById('weaponInfo');
    const weaponDesc = document.getElementById('weaponDescription');
    
    if (weaponSelect) {
        weaponSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            
            if (customYieldGroup) {
                customYieldGroup.style.display = value === 'custom' ? 'block' : 'none';
            }
            
            if (window.NuclearCalculator && window.NuclearCalculator.weaponPresets) {
                const weapon = window.NuclearCalculator.weaponPresets[value];
                if (weapon && weapon.description && weaponInfo && weaponDesc) {
                    weaponDesc.innerHTML = `<strong>${weapon.name}</strong><br>` +
                        `📅 年份: ${weapon.year}<br>` +
                        `🌍 国家: ${weapon.country}<br>` +
                        `📝 ${weapon.description}`;
                    weaponInfo.style.display = 'block';
                } else if (weaponInfo) {
                    weaponInfo.style.display = 'none';
                }
            }
        });
    }
    
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.addEventListener('change', (e) => {
            const cityName = e.target.value;
            if (cityName) {
                jumpToCity(cityName);
            }
        });
    }
    
    const citySearch = document.getElementById('citySearch');
    if (citySearch) {
        citySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchCity();
            }
        });
    }
    
    const customYield = document.getElementById('customYield');
    const customYieldSlider = document.getElementById('customYieldSlider');
    
    if (customYield && customYieldSlider) {
        customYield.addEventListener('input', (e) => {
            customYieldSlider.value = e.target.value;
        });
        
        customYieldSlider.addEventListener('input', (e) => {
            customYield.value = e.target.value;
        });
    }
    
    const densitySlider = document.getElementById('densityMultiplier');
    const densityValue = document.getElementById('densityValue');
    
    if (densitySlider && densityValue) {
        densitySlider.addEventListener('input', (e) => {
            densityValue.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
        });
    }
    
    if (window.electronAPI && window.electronAPI.menu) {
        window.electronAPI.menu.onNewSimulation(() => {
            document.querySelector('[data-section="simulator"]').click();
        });
        
        window.electronAPI.menu.onSaveScenario(() => {
            saveSimulation();
        });
        
        window.electronAPI.menu.onExportReport(() => {
            exportPDF();
        });
        
        window.electronAPI.menu.onHistory(() => {
            document.querySelector('[data-section="data"]').click();
        });
        
        window.electronAPI.menu.onSettings(() => {
            document.querySelector('[data-section="settings"]').click();
        });
    }
}

function searchCity() {
    const searchInput = document.getElementById('citySearch');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query || !window.CitiesData) return;
    
    const cities = window.CitiesData.cities;
    const found = cities.find(c => c.name.toLowerCase().includes(query));
    
    if (found) {
        jumpToCity(found.name);
        showNotification(`已定位到: ${found.name}`, 'success');
    } else {
        showNotification('未找到该城市', 'error');
    }
}

function jumpToCity(cityName) {
    if (!window.CitiesData || !mapHandler) return;
    
    const city = window.CitiesData.cities.find(c => c.name === cityName);
    if (city) {
        mapHandler.goToLocation(city.lat, city.lng, city.name);
        updateCoordsDisplay(city.lat, city.lng);
    }
}

function updateCoordsDisplay(lat, lng) {
    const latEl = document.getElementById('coordsLat');
    const lngEl = document.getElementById('coordsLng');
    
    if (latEl) latEl.textContent = lat.toFixed(4);
    if (lngEl) lngEl.textContent = lng.toFixed(4);
}

async function startSimulation() {
    if (!mapHandler || !mapHandler.selectedCoords) {
        showNotification('请先选择目标位置', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const weaponType = document.getElementById('weaponType').value;
        const burstHeight = document.getElementById('burstHeight').value;
        const timeOfDay = document.getElementById('timeOfDay').value;
        const densityMultiplier = parseFloat(document.getElementById('densityMultiplier')?.value || 1);
        
        let yieldKt;
        if (weaponType === 'custom') {
            yieldKt = parseFloat(document.getElementById('customYield')?.value || 100);
        } else if (window.NuclearCalculator && window.NuclearCalculator.weaponPresets) {
            const preset = window.NuclearCalculator.weaponPresets[weaponType];
            yieldKt = preset ? preset.yield : 100;
        } else {
            yieldKt = 100;
        }
        
        const results = window.NuclearCalculator.calculate(yieldKt, burstHeight);
        
        const locationName = mapHandler.selectedCity?.name || '自定义位置';
        const populationDensity = (mapHandler.selectedCity?.density || 1000) * densityMultiplier;
        
        const casualties = window.NuclearCalculator.estimateCasualties(
            results,
            populationDensity,
            null,
            timeOfDay
        );
        
        const economicImpact = window.NuclearCalculator.calculateGDPLoss(results, casualties, null);
        const infrastructure = window.NuclearCalculator.calculateInfrastructureImpact(results, populationDensity, null);
        const environment = window.NuclearCalculator.calculateEnvironmentImpact(results, null);
        const health = window.NuclearCalculator.calculateHealthImpact(results, casualties, null);
        const recoveryTime = window.NuclearCalculator.estimateRecoveryTime(results, null);
        
        casualties.economicImpact = economicImpact;
        casualties.infrastructure = infrastructure;
        casualties.environment = environment;
        casualties.health = health;
        casualties.recoveryTime = recoveryTime;
        
        currentResults = {
            ...results,
            casualties,
            location: locationName,
            coords: mapHandler.selectedCoords,
            weapon: weaponType === 'custom' ? `自定义 (${yieldKt}kt)` : (window.NuclearCalculator.weaponPresets[weaponType]?.name || weaponType),
            yield: yieldKt,
            burstHeight,
            timeOfDay,
            timestamp: new Date().toISOString()
        };
        
        mapHandler.drawImpactCircles(results);
        displayResults(currentResults);
        
        showNotification('模拟完成', 'success');
    } catch (error) {
        console.error('Simulation error:', error);
        showNotification('模拟失败: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function displayResults(results) {
    const panel = document.getElementById('resultsPanel');
    panel.style.display = 'flex';
    
    displayBasicResults(results);
    displayEconomicResults(results);
    displayInfrastructureResults(results);
    displayEnvironmentResults(results);
    displayHealthResults(results);
    displayTimelineResults(results);
    
    if (window.ChartManager) {
        window.ChartManager.init();
        window.ChartManager.renderCasualtyPieChart(results.casualties);
        window.ChartManager.renderRadiusBarChart(results);
    }
}

function displayBasicResults(results) {
    const container = document.getElementById('basicResults');
    if (!container) return;
    
    container.innerHTML = `
        <div class="result-grid">
            <div class="result-item">
                <div class="result-label">📍 目标位置</div>
                <div class="result-value">${results.location}</div>
            </div>
            <div class="result-item">
                <div class="result-label">💣 武器</div>
                <div class="result-value">${results.weapon}</div>
            </div>
            <div class="result-item">
                <div class="result-label">💥 当量</div>
                <div class="result-value">${results.yield.toLocaleString()} kt</div>
            </div>
            <div class="result-item">
                <div class="result-label">🔥 火球半径</div>
                <div class="result-value">${results.fireball.toFixed(2)} km</div>
            </div>
            <div class="result-item">
                <div class="result-label">💥 重度破坏</div>
                <div class="result-value">${results.heavyBlast.toFixed(2)} km</div>
            </div>
            <div class="result-item">
                <div class="result-label">💥 中度破坏</div>
                <div class="result-value">${results.moderateBlast.toFixed(2)} km</div>
            </div>
            <div class="result-item">
                <div class="result-label">💥 轻度破坏</div>
                <div class="result-value">${results.lightBlast.toFixed(2)} km</div>
            </div>
            <div class="result-item">
                <div class="result-label">🌡️ 热辐射</div>
                <div class="result-value">${results.thermal.toFixed(2)} km</div>
            </div>
            <div class="result-item">
                <div class="result-label">☢️ 辐射区</div>
                <div class="result-value">${results.radiation.toFixed(2)} km</div>
            </div>
            <div class="result-item highlight">
                <div class="result-label">☠️ 死亡人数</div>
                <div class="result-value">${results.casualties.deaths.toLocaleString()}</div>
            </div>
            <div class="result-item highlight">
                <div class="result-label">🏥 受伤人数</div>
                <div class="result-value">${results.casualties.injuries.toLocaleString()}</div>
            </div>
        </div>
    `;
}

function displayEconomicResults(results) {
    const container = document.getElementById('economicResults');
    if (!container) return;
    
    const economicImpact = results.casualties.economicImpact || {};
    
    container.innerHTML = `
        <div class="result-grid">
            <div class="result-item">
                <div class="result-label">💰 直接损失</div>
                <div class="result-value">$${(economicImpact.direct || 0).toLocaleString()}</div>
            </div>
            <div class="result-item">
                <div class="result-label">📉 间接损失</div>
                <div class="result-value">$${(economicImpact.indirect || 0).toLocaleString()}</div>
            </div>
            <div class="result-item">
                <div class="result-label">📊 总损失</div>
                <div class="result-value">$${(economicImpact.total || 0).toLocaleString()}</div>
            </div>
            <div class="result-item">
                <div class="result-label">⏱️ 恢复时间</div>
                <div class="result-value">${results.casualties.recoveryTime || '--'} 年</div>
            </div>
        </div>
    `;
}

function displayInfrastructureResults(results) {
    const container = document.getElementById('infrastructureResults');
    if (!container) return;
    
    const infra = results.casualties.infrastructure || {};
    
    container.innerHTML = `
        <div class="result-grid">
            <div class="result-item">
                <div class="result-label">🏥 医院受影响</div>
                <div class="result-value">${infra.hospitals || 0} 家</div>
            </div>
            <div class="result-item">
                <div class="result-label">🏫 学校受影响</div>
                <div class="result-value">${infra.schools || 0} 所</div>
            </div>
            <div class="result-item">
                <div class="result-label">🚇 交通设施</div>
                <div class="result-value">${infra.transport || 0} 个</div>
            </div>
            <div class="result-item">
                <div class="result-label">⚡ 电力设施</div>
                <div class="result-value">${infra.power || 0} 个</div>
            </div>
        </div>
    `;
}

function displayEnvironmentResults(results) {
    const container = document.getElementById('environmentResults');
    if (!container) return;
    
    const env = results.casualties.environment || {};
    
    container.innerHTML = `
        <div class="result-grid">
            <div class="result-item">
                <div class="result-label">☢️ 辐射沉降面积</div>
                <div class="result-value">${(env.falloutArea || 0).toLocaleString()} km²</div>
            </div>
            <div class="result-item">
                <div class="result-label">🌱 土地污染</div>
                <div class="result-value">${(env.landContamination || 0).toLocaleString()} km²</div>
            </div>
            <div class="result-item">
                <div class="result-label">💨 碳排放</div>
                <div class="result-value">${(env.carbonEmission || 0).toLocaleString()} 吨</div>
            </div>
            <div class="result-item">
                <div class="result-label">💧 水源影响</div>
                <div class="result-value">${(env.waterAffected || 0).toLocaleString()} km²</div>
            </div>
        </div>
    `;
}

function displayHealthResults(results) {
    const container = document.getElementById('healthResults');
    if (!container) return;
    
    const health = results.casualties.health || {};
    
    container.innerHTML = `
        <div class="result-grid">
            <div class="result-item">
                <div class="result-label">☢️ 急性辐射病</div>
                <div class="result-value">${(health.acuteRadiation || 0).toLocaleString()}</div>
            </div>
            <div class="result-item">
                <div class="result-label">🔥 烧伤</div>
                <div class="result-value">${(health.burns || 0).toLocaleString()}</div>
            </div>
            <div class="result-item">
                <div class="result-label">💥 创伤</div>
                <div class="result-value">${(health.trauma || 0).toLocaleString()}</div>
            </div>
            <div class="result-item">
                <div class="result-label">🧠 心理创伤</div>
                <div class="result-value">${(health.psychological || 0).toLocaleString()}</div>
            </div>
            <div class="result-item">
                <div class="result-label">🏠 无家可归</div>
                <div class="result-value">${(health.homeless || 0).toLocaleString()}</div>
            </div>
        </div>
    `;
}

function displayTimelineResults(results) {
    const container = document.getElementById('timelineResults');
    if (!container) return;
    
    container.innerHTML = `
        <div class="timeline">
            <div class="timeline-item">
                <div class="timeline-time">T+0</div>
                <div class="timeline-event">爆炸发生</div>
                <div class="timeline-detail">火球形成，冲击波扩散</div>
            </div>
            <div class="timeline-item">
                <div class="timeline-time">T+1分钟</div>
                <div class="timeline-event">即时效应</div>
                <div class="timeline-detail">冲击波、热辐射造成直接伤亡</div>
            </div>
            <div class="timeline-item">
                <div class="timeline-time">T+1小时</div>
                <div class="timeline-event">早期救援</div>
                <div class="timeline-detail">救援开始，辐射病症状出现</div>
            </div>
            <div class="timeline-item">
                <div class="timeline-time">T+1天</div>
                <div class="timeline-event">急性期</div>
                <div class="timeline-detail">大量急性辐射病患</div>
            </div>
            <div class="timeline-item">
                <div class="timeline-time">T+1周</div>
                <div class="timeline-event">救援高峰</div>
                <div class="timeline-detail">国际救援到达，医疗资源紧张</div>
            </div>
            <div class="timeline-item">
                <div class="timeline-time">T+1月</div>
                <div class="timeline-event">恢复期</div>
                <div class="timeline-detail">辐射衰减，清理工作开始</div>
            </div>
            <div class="timeline-item">
                <div class="timeline-time">T+1年</div>
                <div class="timeline-event">长期影响</div>
                <div class="timeline-detail">癌症发病率上升，环境恢复</div>
            </div>
        </div>
    `;
}

function closeResults() {
    document.getElementById('resultsPanel').style.display = 'none';
}

async function saveSimulation() {
    if (!currentResults) {
        showNotification('没有可保存的模拟结果', 'error');
        return;
    }
    
    try {
        const result = await window.electronAPI.db.run(
            `INSERT INTO simulations (name, weapon_type, yield_kt, location_lat, location_lng, location_name, burst_height, results)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                `${currentResults.location} - ${currentResults.weapon}`,
                currentResults.weapon,
                currentResults.yield,
                currentResults.coords.lat,
                currentResults.coords.lng,
                currentResults.location,
                currentResults.burstHeight,
                JSON.stringify(currentResults)
            ]
        );
        
        showNotification('场景已保存', 'success');
        await loadHistory();
    } catch (error) {
        console.error('Save error:', error);
        showNotification('保存失败: ' + error.message, 'error');
    }
}

async function loadHistory() {
    const container = document.getElementById('simulationHistory');
    if (!container) return;
    
    try {
        const simulations = await window.electronAPI.db.all(
            'SELECT * FROM simulations ORDER BY created_at DESC LIMIT 20'
        );
        
        if (simulations.length === 0) {
            container.innerHTML = '<div class="empty-state">暂无历史记录</div>';
            return;
        }
        
        container.innerHTML = simulations.map(sim => `
            <div class="history-item" onclick="loadSimulation(${sim.id})">
                <div class="history-title">${sim.location_name}</div>
                <div class="history-detail">${sim.weapon_type} - ${sim.yield_kt}kt</div>
                <div class="history-date">${new Date(sim.created_at).toLocaleString()}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load history error:', error);
    }
}

async function loadSimulation(id) {
    try {
        const sim = await window.electronAPI.db.get(
            'SELECT * FROM simulations WHERE id = ?',
            [id]
        );
        
        if (sim && sim.results) {
            const results = JSON.parse(sim.results);
            currentResults = results;
            
            if (mapHandler) {
                mapHandler.goToLocation(sim.location_lat, sim.location_lng, sim.location_name);
                mapHandler.drawImpactCircles(results);
            }
            
            displayResults(results);
            showNotification('已加载历史模拟', 'success');
        }
    } catch (error) {
        console.error('Load simulation error:', error);
        showNotification('加载失败', 'error');
    }
}

async function exportPDF() {
    if (!currentResults) {
        showNotification('没有可导出的结果', 'error');
        return;
    }
    
    showNotification('正在生成PDF...', 'info');
    
    try {
        const result = await window.electronAPI.export.pdf({
            landscape: true
        });
        
        if (result.success) {
            showNotification('PDF已保存', 'success');
        }
    } catch (error) {
        console.error('Export PDF error:', error);
        showNotification('导出失败', 'error');
    }
}

async function exportImage() {
    if (!mapHandler) return;
    
    try {
        const dataUrl = await mapHandler.captureScreenshot();
        const result = await window.electronAPI.export.image(dataUrl, `nuclearsim-${Date.now()}.png`);
        
        if (result.success) {
            showNotification('图片已保存', 'success');
        }
    } catch (error) {
        console.error('Export image error:', error);
        showNotification('导出失败', 'error');
    }
}

function loadEvent(eventId) {
    const events = {
        'hiroshima': {
            name: '广岛',
            lat: 34.3853,
            lng: 132.4553,
            weapon: 'littleBoy',
            yield: 15
        },
        'nagasaki': {
            name: '长崎',
            lat: 32.7503,
            lng: 129.8777,
            weapon: 'fatMan',
            yield: 21
        },
        'cuban': {
            name: '哈瓦那',
            lat: 23.1136,
            lng: -82.3666,
            weapon: 'w87',
            yield: 300
        },
        'chernobyl': {
            name: '切尔诺贝利',
            lat: 51.3865,
            lng: 30.0956,
            weapon: 'custom',
            yield: 0.01
        }
    };
    
    const event = events[eventId];
    if (event && mapHandler) {
        mapHandler.goToLocation(event.lat, event.lng, event.name);
        document.getElementById('weaponType').value = event.weapon;
        if (event.weapon === 'custom') {
            document.getElementById('customYieldGroup').style.display = 'block';
            document.getElementById('customYield').value = event.yield;
        }
        showNotification(`已加载历史事件: ${event.name}`, 'success');
    }
}

function loadStory(storyId) {
    showNotification(`交互式故事功能开发中: ${storyId}`, 'info');
}

function openArticle(articleId) {
    const articles = {
        'nuclear_basics': '核武器基础原理',
        'effects': '核爆炸效应',
        'radiation': '辐射与健康'
    };
    showNotification(`打开文章: ${articles[articleId] || articleId}`, 'info');
}

function startTutorial(tutorialId) {
    showNotification(`开始教程: ${tutorialId}`, 'info');
}

function startQuiz() {
    showNotification('测验功能开发中', 'info');
}

async function exportData() {
    try {
        const simulations = await window.electronAPI.db.all(
            'SELECT * FROM simulations ORDER BY created_at DESC'
        );
        
        const dataStr = JSON.stringify(simulations, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `nuclearsim_export_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        showNotification('数据已导出', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('导出失败: ' + error.message, 'error');
    }
}

async function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (!Array.isArray(data)) {
                throw new Error('无效的数据格式');
            }
            
            for (const sim of data) {
                await window.electronAPI.db.run(
                    `INSERT INTO simulations (name, weapon_type, yield_kt, location_lat, location_lng, location_name, burst_height, results)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [sim.name, sim.weapon_type, sim.yield_kt, sim.location_lat, sim.location_lng, sim.location_name, sim.burst_height, sim.results]
                );
            }
            
            await loadHistory();
            showNotification(`已导入 ${data.length} 条记录`, 'success');
        } catch (error) {
            console.error('Import error:', error);
            showNotification('导入失败: ' + error.message, 'error');
        }
    };
    
    input.click();
}

async function clearData() {
    if (!confirm('确定要清除所有历史记录吗？此操作不可恢复。')) {
        return;
    }
    
    try {
        await window.electronAPI.db.run('DELETE FROM simulations');
        await loadHistory();
        showNotification('数据已清除', 'success');
    } catch (error) {
        console.error('Clear error:', error);
        showNotification('清除失败: ' + error.message, 'error');
    }
}

function setTool(tool) {
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    if (mapHandler) {
        mapHandler.currentTool = tool;
    }
    
    const toolNames = {
        'select': '选择',
        'marker': '标记',
        'measure': '测量',
        'draw': '绘图'
    };
    showNotification(`工具: ${toolNames[tool] || tool}`, 'info');
}

function toggleMilitaryBases() {
    if (mapHandler && typeof mapHandler.toggleMilitaryBases === 'function') {
        const visible = mapHandler.toggleMilitaryBases();
        showNotification(visible ? '军事基地已显示' : '军事基地已隐藏', 'info');
    }
}

function toggleLayers() {
    const layerControl = document.querySelector('.leaflet-control-layers');
    if (layerControl) {
        layerControl.click();
    }
    showNotification('请使用右上角图层控制', 'info');
}

function setupUpdateListener() {
    if (!window.electronAPI || !window.electronAPI.update) return;
    
    const statusEl = document.getElementById('updateStatus');
    
    window.electronAPI.update.onChecking(() => {
        if (statusEl) statusEl.textContent = '检查更新中...';
    });
    
    window.electronAPI.update.onAvailable((info) => {
        if (statusEl) statusEl.textContent = `发现新版本: ${info.version}`;
        showNotification('发现新版本可用', 'info');
    });
    
    window.electronAPI.update.onNotAvailable(() => {
        if (statusEl) statusEl.textContent = '已是最新版本';
    });
    
    window.electronAPI.update.onProgress((progress) => {
        if (statusEl) statusEl.textContent = `下载中: ${Math.round(progress.percent)}%`;
    });
    
    window.electronAPI.update.onDownloaded(() => {
        if (statusEl) statusEl.textContent = '更新已下载';
        showNotification('更新已下载，重启应用以安装', 'success');
    });
    
    window.electronAPI.update.onError((error) => {
        if (statusEl) statusEl.textContent = '更新检查失败';
        console.error('Update error:', error);
    });
}

async function checkForUpdates() {
    if (window.electronAPI && window.electronAPI.update) {
        showNotification('检查更新中...', 'info');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'flex' : 'none';
}

function updateCountryInfo(countryData, city) {
    const infoPanel = document.getElementById('countryInfo');
    if (!infoPanel) return;
    
    if (countryData) {
        infoPanel.innerHTML = `
            <div class="country-info">
                <h4>${city?.name || '目标位置'}</h4>
                <p>人口密度: ${countryData.populationDensity || '--'} 人/km²</p>
                <p>医疗能力: ${((countryData.medicalCapacity || 0.5) * 100).toFixed(0)}%</p>
            </div>
        `;
    }
}

window.startSimulation = startSimulation;
window.searchCity = searchCity;
window.loadEvent = loadEvent;
window.loadStory = loadStory;
window.openArticle = openArticle;
window.startTutorial = startTutorial;
window.startQuiz = startQuiz;
window.exportData = exportData;
window.importData = importData;
window.clearData = clearData;
window.checkForUpdates = checkForUpdates;
window.closeResults = closeResults;
window.exportPDF = exportPDF;
window.exportImage = exportImage;
window.saveSimulation = saveSimulation;
window.setTool = setTool;
window.toggleMilitaryBases = toggleMilitaryBases;
window.toggleLayers = toggleLayers;

window.App = {
    updateCountryInfo,
    showNotification,
    showLoading
};
