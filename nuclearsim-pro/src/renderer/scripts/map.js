const MapHandler = {
    map: null,
    targetMarker: null,
    impactCircles: [],
    selectedCoords: null,
    selectedCity: null,
    cityMarkers: null,
    militaryMarkers: null,
    showMilitaryBases: true,
    initialized: false,
    initAttempts: 0,
    maxInitAttempts: 5,
    
    init() {
        if (this.initialized) {
            console.log('MapHandler already initialized');
            return true;
        }

        if (this.initAttempts >= this.maxInitAttempts) {
            console.error('MapHandler: Max initialization attempts reached');
            return false;
        }

        this.initAttempts++;
        console.log(`MapHandler initializing... (attempt ${this.initAttempts}/${this.maxInitAttempts})`);

        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Map container not found');
            return false;
        }

        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            return false;
        }

        try {
            this.map = L.map('map', {
                center: [35, 105],
                zoom: 4,
                minZoom: 2,
                maxZoom: 18,
                worldCopyJump: true,
                zoomControl: true
            });

            const gaodeLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
                subdomains: ['1', '2', '3', '4'],
                attribution: '&copy; 高德地图',
                maxZoom: 18
            });

            const gaodeSatellite = L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
                subdomains: ['1', '2', '3', '4'],
                attribution: '&copy; 高德地图',
                maxZoom: 18
            });

            const gaodeSatelliteLabel = L.layerGroup([
                gaodeSatellite,
                L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}', {
                    subdomains: ['1', '2', '3', '4']
                })
            ]);

            const geoqLayer = L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; GeoQ',
                maxZoom: 16
            });

            const geoqDarkLayer = L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplish/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; GeoQ',
                maxZoom: 16
            });

            const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap',
                maxZoom: 18
            });

            gaodeLayer.addTo(this.map);

            if (typeof L.markerClusterGroup === 'function') {
                this.cityMarkers = L.markerClusterGroup({
                    maxClusterRadius: 50,
                    spiderfyOnMaxZoom: true,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: true,
                    iconCreateFunction: function(cluster) {
                        return L.divIcon({
                            html: '<div class="cluster-icon">' + cluster.getChildCount() + '</div>',
                            className: 'city-cluster',
                            iconSize: [40, 40]
                        });
                    }
                });
            } else {
                console.warn('MarkerCluster not loaded, using layerGroup instead');
                this.cityMarkers = L.layerGroup();
            }

            this.militaryMarkers = L.layerGroup();

            const baseLayers = {
                '高德地图': gaodeLayer,
                '高德卫星': gaodeSatelliteLabel,
                'GeoQ 彩色版': geoqLayer,
                'GeoQ 深色版': geoqDarkLayer,
                'OpenStreetMap': osmLayer
            };

            const overlayLayers = {
                '城市': this.cityMarkers,
                '军事基地': this.militaryMarkers
            };

            L.control.layers(baseLayers, overlayLayers, { position: 'topright' }).addTo(this.map);

            this.createTargetIcon();
            this.createCityMarkers();
            this.createMilitaryMarkers();

            this.cityMarkers.addTo(this.map);
            this.militaryMarkers.addTo(this.map);

            this.map.on('click', (e) => {
                this.selectLocation(e.latlng.lat, e.latlng.lng);
            });

            this.initialized = true;
            this.initAttempts = 0;
            console.log('MapHandler initialized successfully');
            return true;
        } catch (error) {
            console.error('MapHandler initialization error:', error);
            return false;
        }
    },

    createTargetIcon() {
        this.targetIcon = L.divIcon({
            className: 'target-marker',
            html: '<div class="target-cross">+</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    },

    createCityMarkers() {
        if (!this.cityMarkers) {
            console.error('cityMarkers cluster group not initialized');
            return;
        }

        if (!window.CitiesData) {
            console.error('CitiesData not loaded');
            return;
        }

        const cities = window.CitiesData.cities || window.CitiesData;
        
        if (!Array.isArray(cities)) {
            console.error('CitiesData.cities is not an array:', typeof cities);
            return;
        }

        if (cities.length === 0) {
            console.warn('CitiesData is empty');
            return;
        }

        console.log('Creating city markers for', cities.length, 'cities');

        let markerCount = 0;
        let errorCount = 0;

        cities.forEach((city, index) => {
            try {
                if (!city) {
                    console.warn(`City at index ${index} is null/undefined`);
                    return;
                }

                if (typeof city.lat !== 'number' || typeof city.lng !== 'number') {
                    console.warn(`Invalid coordinates for city: ${city.name || index}`, city);
                    return;
                }

                if (isNaN(city.lat) || isNaN(city.lng)) {
                    console.warn(`NaN coordinates for city: ${city.name || index}`);
                    return;
                }

                const population = city.population || 1000000;
                
                const marker = L.divIcon({
                    className: 'city-marker-icon',
                    html: '<div style="font-size: 16px;">📍</div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 20]
                });

                const cityMarker = L.marker([city.lat, city.lng], { icon: marker });

                const cityName = city.name || '未知';
                const countryName = city.country || '未知';
                const popStr = this.formatPopulation(population);
                const density = city.density || 0;

                cityMarker.bindPopup(`
                    <strong>${cityName}</strong><br>
                    国家: ${countryName}<br>
                    人口: ${popStr}<br>
                    密度: ${density} 人/km²
                `);

                cityMarker.on('click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    this.selectCity(city);
                });

                this.cityMarkers.addLayer(cityMarker);
                markerCount++;
            } catch (err) {
                errorCount++;
                if (errorCount <= 5) {
                    console.error(`Error creating marker for city at index ${index}:`, err);
                }
            }
        });

        console.log(`Created ${markerCount} city markers, ${errorCount} errors`);
    },

    createMilitaryMarkers() {
        if (!window.MilitaryBases || !Array.isArray(window.MilitaryBases) || window.MilitaryBases.length === 0) {
            console.log('No military bases data available, skipping military markers');
            return;
        }

        console.log('Creating military markers for', window.MilitaryBases.length, 'bases');

        const typeIcons = {
            command: '🏛️',
            navy: '⚓',
            airforce: '✈️',
            missile: '🚀',
            nuclear: '☢️',
            space: '🛰️'
        };

        const importanceColors = {
            critical: '#ff0000',
            high: '#ff6600',
            medium: '#ffcc00'
        };

        const importanceText = {
            critical: '关键',
            high: '重要',
            medium: '中等'
        };

        const typeText = {
            command: '指挥中心',
            navy: '海军基地',
            airforce: '空军基地',
            missile: '导弹基地',
            nuclear: '核设施',
            space: '航天设施'
        };

        window.MilitaryBases.forEach(base => {
            if (!base || typeof base.lat !== 'number' || typeof base.lng !== 'number') {
                return;
            }

            const icon = typeIcons[base.type] || '📍';
            const color = importanceColors[base.importance] || '#ffffff';

            const marker = L.divIcon({
                className: 'military-marker',
                html: `<div style="font-size: 16px; filter: drop-shadow(0 0 3px ${color});">${icon}</div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const baseMarker = L.marker([base.lat, base.lng], { icon: marker });

            baseMarker.bindPopup(`
                <strong>${base.name || '未知基地'}</strong><br>
                国家: ${base.country || '未知'}<br>
                类型: ${typeText[base.type] || base.type || '未知'}<br>
                重要性: ${importanceText[base.importance] || base.importance || '未知'}
            `);

            baseMarker.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                this.selectLocation(base.lat, base.lng);
                this.updateCoordDisplay(base.lat, base.lng, base.name);
            });

            this.militaryMarkers.addLayer(baseMarker);
        });
    },

    flyTo(lat, lng, zoom = 10) {
        if (!this.map) return;
        this.map.flyTo([lat, lng], zoom, { duration: 1.5 });
    },

    goToLocation(lat, lng, name) {
        this.selectLocation(lat, lng);
        if (name) {
            this.updateCoordDisplay(lat, lng, name);
        }
        if (this.map) {
            this.map.flyTo([lat, lng], 10, { duration: 1.5 });
        }
    },

    selectCity(city) {
        if (!city) {
            console.error('selectCity: city is null');
            return;
        }
        
        if (!this.map) {
            console.error('selectCity: map not initialized');
            return;
        }

        if (typeof city.lat !== 'number' || typeof city.lng !== 'number') {
            console.error('selectCity: invalid coordinates', city);
            return;
        }

        console.log('Selecting city:', city.name, 'at', city.lat, city.lng);

        this.selectedCity = city;
        this.selectedCoords = { lat: city.lat, lng: city.lng };

        if (this.targetMarker) {
            this.map.removeLayer(this.targetMarker);
        }

        if (!this.targetIcon) {
            this.createTargetIcon();
        }

        this.targetMarker = L.marker([city.lat, city.lng], {
            icon: this.targetIcon,
            zIndexOffset: 1000
        }).addTo(this.map);

        this.map.flyTo([city.lat, city.lng], 10, { duration: 1.5 });

        this.updateCoordDisplay(city.lat, city.lng, city.name);

        const countryCode = this.getCountryCode(city.country);
        const countryData = countryCode && window.CountryData ? window.CountryData[countryCode] : null;

        if (window.App && typeof window.App.updateCountryInfo === 'function') {
            window.App.updateCountryInfo(countryData, city);
        }
    },

    selectLocation(lat, lng) {
        if (!this.map) {
            console.error('selectLocation: map not initialized');
            return;
        }

        if (typeof lat !== 'number' || typeof lng !== 'number') {
            console.error('selectLocation: invalid coordinates', lat, lng);
            return;
        }

        if (isNaN(lat) || isNaN(lng)) {
            console.error('selectLocation: NaN coordinates');
            return;
        }

        lat = Math.max(-90, Math.min(90, lat));
        lng = Math.max(-180, Math.min(180, lng));

        console.log('Selecting location:', lat, lng);

        this.selectedCity = null;
        this.selectedCoords = { lat, lng };

        if (this.targetMarker) {
            this.map.removeLayer(this.targetMarker);
        }

        if (!this.targetIcon) {
            this.createTargetIcon();
        }

        this.targetMarker = L.marker([lat, lng], {
            icon: this.targetIcon,
            zIndexOffset: 1000
        }).addTo(this.map);

        this.updateCoordDisplay(lat, lng, '自定义位置');

        const countryCode = this.getCountryByCoords(lat, lng);
        const countryData = countryCode && window.CountryData ? window.CountryData[countryCode] : null;

        if (window.App && typeof window.App.updateCountryInfo === 'function') {
            window.App.updateCountryInfo(countryData, {
                name: '自定义目标',
                lat, lng
            });
        }
    },

    updateCoordDisplay(lat, lng, name) {
        const latEl = document.getElementById('coordsLat') || document.getElementById('targetLat');
        const lngEl = document.getElementById('coordsLng') || document.getElementById('targetLng');
        const nameEl = document.getElementById('targetName');

        if (latEl) latEl.textContent = lat.toFixed(4);
        if (lngEl) lngEl.textContent = lng.toFixed(4);
        if (nameEl) nameEl.textContent = name;

        const toast = document.getElementById('coordToast');
        const toastLat = document.getElementById('toastLat');
        const toastLng = document.getElementById('toastLng');

        if (toast && toastLat && toastLng) {
            toastLat.textContent = lat.toFixed(4);
            toastLng.textContent = lng.toFixed(4);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    },

    getCountryCode(countryName) {
        const countryMap = {
            '中国': 'CN', '中国台湾': 'CN', '日本': 'JP', '韩国': 'KR', '朝鲜': 'KP',
            '印度': 'IN', '巴基斯坦': 'PK', '孟加拉国': 'BD', '印度尼西亚': 'ID',
            '泰国': 'TH', '越南': 'VN', '菲律宾': 'PH', '马来西亚': 'MY',
            '新加坡': 'SG', '缅甸': 'MM', '柬埔寨': 'KH', '老挝': 'LA',
            '美国': 'US', '加拿大': 'CA', '墨西哥': 'MX', '巴西': 'BR',
            '阿根廷': 'AR', '智利': 'CL', '哥伦比亚': 'CO', '秘鲁': 'PE',
            '英国': 'GB', '法国': 'FR', '德国': 'DE', '意大利': 'IT',
            '西班牙': 'ES', '波兰': 'PL', '荷兰': 'NL', '比利时': 'BE',
            '瑞士': 'CH', '瑞典': 'SE', '挪威': 'NO', '丹麦': 'DK',
            '芬兰': 'FI', '奥地利': 'AT', '希腊': 'GR', '葡萄牙': 'PT',
            '捷克': 'CZ', '俄罗斯': 'RU', '乌克兰': 'UA', '白俄罗斯': 'BY',
            '哈萨克斯坦': 'KZ', '乌兹别克斯坦': 'UZ', '土耳其': 'TR',
            '伊朗': 'IR', '伊拉克': 'IQ', '沙特阿拉伯': 'SA', '阿联酋': 'AE',
            '以色列': 'IL', '埃及': 'EG', '南非': 'ZA', '尼日利亚': 'NG',
            '埃塞俄比亚': 'ET', '肯尼亚': 'KE', '澳大利亚': 'AU', '新西兰': 'NZ'
        };
        return countryMap[countryName] || null;
    },

    getCountryByCoords(lat, lng) {
        if (lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135) return 'CN';
        if (lat >= 30 && lat <= 46 && lng >= 129 && lng <= 146) return 'JP';
        if (lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132) return 'KR';
        if (lat >= 38 && lat <= 43 && lng >= 124 && lng <= 131) return 'KP';
        if (lat >= 6 && lat <= 36 && lng >= 68 && lng <= 98) return 'IN';
        if (lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66) return 'US';
        if (lat >= 41 && lat <= 83 && lng >= -141 && lng <= -52) return 'CA';
        if (lat >= 35 && lat <= 72 && lng >= -10 && lng <= 60) return 'EU';
        if (lat >= 41 && lat <= 82 && lng >= 19 && lng <= 180) return 'RU';
        if (lat >= -44 && lat <= -10 && lng >= 113 && lng <= 154) return 'AU';
        return null;
    },

    drawImpactCircles(results) {
        this.clearImpactCircles();

        if (!this.selectedCoords || !this.map) return;

        const lat = this.selectedCoords.lat;
        const lng = this.selectedCoords.lng;

        const circles = [
            { radius: results.fireball, color: '#ff0000', opacity: 0.6, name: '火球' },
            { radius: results.heavyBlast, color: '#ff0000', opacity: 0.5, name: '重度破坏' },
            { radius: results.moderateBlast, color: '#ff0000', opacity: 0.4, name: '中度破坏' },
            { radius: results.lightBlast, color: '#ff0000', opacity: 0.3, name: '轻度破坏' }
        ];

        circles.forEach(c => {
            if (c.radius > 0) {
                const circle = L.circle([lat, lng], {
                    radius: c.radius * 1000,
                    color: c.color,
                    fillColor: c.color,
                    fillOpacity: c.opacity,
                    weight: 2
                }).addTo(this.map);

                circle.bindTooltip(`${c.name}: ${c.radius.toFixed(2)} km`, {
                    permanent: false,
                    direction: 'center'
                });

                this.impactCircles.push(circle);
            }
        });

        const maxRadius = results.lightBlast;
        if (maxRadius > 0) {
            const bounds = L.circle([lat, lng], { radius: maxRadius * 1000 }).getBounds();
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    },

    clearImpactCircles() {
        if (!this.map) return;
        this.impactCircles.forEach(circle => {
            this.map.removeLayer(circle);
        });
        this.impactCircles = [];
    },

    formatPopulation(pop) {
        if (pop >= 100000000) return (pop / 100000000).toFixed(1) + '亿';
        if (pop >= 10000000) return (pop / 10000000).toFixed(1) + '千万';
        if (pop >= 10000) return (pop / 10000).toFixed(0) + '万';
        return pop.toLocaleString();
    },

    searchCities(query) {
        if (!query || query.length < 1 || !window.CitiesData) return [];

        const q = query.toLowerCase();
        return window.CitiesData.filter(city =>
            city.name.toLowerCase().includes(q) ||
            city.country.toLowerCase().includes(q)
        ).slice(0, 10);
    },

    toggleMilitaryBases() {
        if (!this.map || !this.militaryMarkers) return;
        
        this.showMilitaryBases = !this.showMilitaryBases;
        
        if (this.showMilitaryBases) {
            this.militaryMarkers.addTo(this.map);
        } else {
            this.map.removeLayer(this.militaryMarkers);
        }
        
        return this.showMilitaryBases;
    },

    clearSelection() {
        if (this.targetMarker && this.map) {
            this.map.removeLayer(this.targetMarker);
            this.targetMarker = null;
        }
        this.selectedCoords = null;
        this.selectedCity = null;
        this.clearImpactCircles();
        
        const latEl = document.getElementById('coordsLat');
        const lngEl = document.getElementById('coordsLng');
        if (latEl) latEl.textContent = '--';
        if (lngEl) lngEl.textContent = '--';
    },

    async captureScreenshot() {
        if (!this.map) return null;
        
        return new Promise((resolve) => {
            if (typeof L.simpleMapScreenshoter !== 'undefined') {
                this.map.once('rendercomplete', () => {
                    const canvas = document.querySelector('.leaflet-container canvas');
                    if (canvas) {
                        resolve(canvas.toDataURL('image/png'));
                    } else {
                        resolve(null);
                    }
                });
            } else {
                const container = document.getElementById('map');
                if (container) {
                    resolve(null);
                }
            }
        });
    }
};

window.MapHandler = MapHandler;
