const MapHandler = {
    svg: null,
    mapGroup: null,
    countriesGroup: null,
    citiesGroup: null,
    labelsGroup: null,
    impactGroup: null,
    width: 1000,
    height: 500,
    scale: 1,
    translateX: 0,
    translateY: 0,
    selectedCity: null,
    selectedCoords: null,
    showLabels: true,
    hoveredCountry: null,

    projection(lat, lng) {
        const x = (lng + 180) * (this.width / 360);
        const latRad = lat * Math.PI / 180;
        const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
        const y = (this.height / 2) - (this.width * mercN / (2 * Math.PI));
        
        return {
            x: x * this.scale + this.translateX,
            y: y * this.scale + this.translateY
        };
    },

    init() {
        this.svg = document.getElementById('worldMap');
        this.mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.countriesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.citiesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.impactGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        this.svg.appendChild(this.mapGroup);
        this.svg.appendChild(this.countriesGroup);
        this.svg.appendChild(this.impactGroup);
        this.svg.appendChild(this.citiesGroup);
        this.svg.appendChild(this.labelsGroup);
        
        this.drawGrid();
        this.drawCountries();
        this.drawCities();
        this.setupControls();
        this.setupClickHandler();
    },

    drawGrid() {
        for (let lat = -60; lat <= 80; lat += 20) {
            const y = (this.height / 2) - (this.width * Math.log(Math.tan(Math.PI/4 + lat * Math.PI/360)) / (2 * Math.PI));
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', this.width);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'rgba(255,255,255,0.03)');
            line.setAttribute('stroke-width', '0.5');
            this.mapGroup.appendChild(line);
        }
        
        for (let lng = -180; lng <= 180; lng += 30) {
            const x = (lng + 180) * (this.width / 360);
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', x);
            line.setAttribute('y2', this.height);
            line.setAttribute('stroke', 'rgba(255,255,255,0.03)');
            line.setAttribute('stroke-width', '0.5');
            this.mapGroup.appendChild(line);
        }
    },

    drawCountries() {
        WorldMapData.countries.forEach(country => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', country.path);
            path.setAttribute('class', 'country-path');
            path.setAttribute('data-country-id', country.id);
            path.setAttribute('data-country-name', country.name);
            path.setAttribute('fill', this.getCountryColor(country.id));
            path.setAttribute('stroke', 'rgba(255,255,255,0.15)');
            path.setAttribute('stroke-width', '0.5');
            path.setAttribute('cursor', 'pointer');
            
            path.addEventListener('mouseenter', (e) => {
                this.hoveredCountry = country;
                path.setAttribute('fill', this.getCountryColor(country.id, true));
                this.showTooltip(e, country.name);
            });
            
            path.addEventListener('mouseleave', () => {
                this.hoveredCountry = null;
                path.setAttribute('fill', this.getCountryColor(country.id));
                this.hideTooltip();
            });
            
            path.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            
            this.countriesGroup.appendChild(path);
        });
    },

    getCountryColor(countryId, isHovered = false) {
        const colors = {
            CN: '#2d5a4a',
            RU: '#3d4a5a',
            US: '#4a3d5a',
            JP: '#5a4a3d',
            KR: '#4a5a3d',
            KP: '#5a3d4a',
            IN: '#3d5a4a',
            GB: '#4a4a5a',
            FR: '#5a5a3d',
            DE: '#3d3d5a',
            BR: '#5a3d3d',
            AU: '#3d5a5a',
            CA: '#4a5a5a',
            default: '#2d4a3e'
        };
        
        let baseColor = colors[countryId] || colors.default;
        
        if (isHovered) {
            return this.lightenColor(baseColor, 30);
        }
        
        return baseColor;
    },

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return '#' + (0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    },

    drawCities() {
        const majorCities = WorldCities.filter(c => c.population > 5000000);
        const otherCities = WorldCities.filter(c => c.population <= 5000000);
        
        otherCities.forEach(city => {
            this.drawCityMarker(city, 'small');
        });
        
        majorCities.forEach(city => {
            this.drawCityMarker(city, 'large');
        });
    },

    drawCityMarker(city, size) {
        const pos = this.projection(city.lat, city.lng);
        
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        marker.setAttribute('cx', pos.x);
        marker.setAttribute('cy', pos.y);
        marker.setAttribute('r', size === 'large' ? 3 : 2);
        marker.setAttribute('class', 'city-marker');
        marker.setAttribute('data-city', city.name);
        marker.setAttribute('data-country', city.country);
        marker.setAttribute('data-lat', city.lat);
        marker.setAttribute('data-lng', city.lng);
        marker.setAttribute('data-population', city.population);
        marker.setAttribute('data-density', city.density);
        marker.setAttribute('fill', size === 'large' ? '#ffd93d' : '#ffaa00');
        marker.setAttribute('stroke', 'rgba(255,255,255,0.5)');
        marker.setAttribute('stroke-width', '0.5');
        marker.setAttribute('cursor', 'pointer');
        
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectCity(city);
        });
        
        marker.addEventListener('mouseenter', (e) => {
            marker.setAttribute('r', size === 'large' ? 5 : 4);
            this.showTooltip(e, `${city.name}, ${city.country}\n人口: ${NuclearCalculator.formatNumber(city.population)}`);
        });
        
        marker.addEventListener('mouseleave', () => {
            marker.setAttribute('r', size === 'large' ? 3 : 2);
            this.hideTooltip();
        });
        
        this.citiesGroup.appendChild(marker);
        
        if (size === 'large' || city.population > 10000000) {
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', pos.x);
            label.setAttribute('y', pos.y - 6);
            label.setAttribute('class', 'city-label');
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '7px');
            label.setAttribute('fill', 'rgba(255,255,255,0.8)');
            label.setAttribute('pointer-events', 'none');
            label.textContent = city.name;
            this.labelsGroup.appendChild(label);
        }
    },

    showTooltip(e, text) {
        let tooltip = document.getElementById('mapTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'mapTooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0,0,0,0.85);
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                white-space: pre-line;
                border: 1px solid rgba(255,255,255,0.2);
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
        tooltip.style.display = 'block';
    },

    hideTooltip() {
        const tooltip = document.getElementById('mapTooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    },

    selectCity(city) {
        this.selectedCity = city;
        this.selectedCoords = { lat: city.lat, lng: city.lng };
        
        document.querySelectorAll('.city-marker').forEach(m => {
            const isSelected = m.getAttribute('data-city') === city.name;
            const isLarge = m.getAttribute('r') >= 3;
            m.setAttribute('r', isSelected ? (isLarge ? 6 : 5) : (isLarge ? 3 : 2));
            m.setAttribute('stroke', isSelected ? '#ff6b6b' : 'rgba(255,255,255,0.5)');
            m.setAttribute('stroke-width', isSelected ? 2 : 0.5);
        });
        
        const citySelect = document.getElementById('citySelect');
        citySelect.value = city.name;
        
        document.getElementById('population').value = city.density;
        
        this.showExplosionMarker(city.lat, city.lng);
        
        if (window.App) {
            App.onCitySelected(city);
        }
    },

    selectCoords(lat, lng) {
        this.selectedCity = null;
        this.selectedCoords = { lat, lng };
        
        document.querySelectorAll('.city-marker').forEach(m => {
            const isLarge = parseFloat(m.getAttribute('r')) >= 3;
            m.setAttribute('r', isLarge ? 3 : 2);
            m.setAttribute('stroke', 'rgba(255,255,255,0.5)');
            m.setAttribute('stroke-width', 0.5);
        });
        
        document.getElementById('citySelect').value = '';
        
        this.showExplosionMarker(lat, lng);
    },

    showExplosionMarker(lat, lng) {
        const pos = this.projection(lat, lng);
        const marker = document.getElementById('explosionMarker');
        const mapContainer = document.querySelector('.map-container');
        const rect = mapContainer.getBoundingClientRect();
        const svgRect = this.svg.getBoundingClientRect();
        
        const scaleX = svgRect.width / this.width;
        const scaleY = svgRect.height / this.height;
        
        marker.style.left = (pos.x * scaleX) + 'px';
        marker.style.top = (pos.y * scaleY) + 'px';
        marker.style.display = 'block';
    },

    drawImpactCircles(results) {
        while (this.impactGroup.firstChild) {
            this.impactGroup.removeChild(this.impactGroup.firstChild);
        }

        if (!this.selectedCoords) return;

        const center = this.projection(this.selectedCoords.lat, this.selectedCoords.lng);
        
        const kmToPixels = (km) => km * 8 * this.scale;

        const circles = [
            { radius: results.electromagnetic, class: 'impact-emp', label: 'EMP', color: '#00bfff' },
            { radius: results.radiation, class: 'impact-radiation', label: '辐射', color: '#9400d3' },
            { radius: results.thermal, class: 'impact-thermal', label: '热辐射', color: '#ff6347' },
            { radius: results.lightBlast, class: 'impact-light', label: '轻度破坏', color: '#ffd700' },
            { radius: results.moderateBlast, class: 'impact-moderate', label: '中度破坏', color: '#ff8c00' },
            { radius: results.heavyBlast, class: 'impact-heavy', label: '重度破坏', color: '#ff4500' },
            { radius: results.fireball, class: 'impact-fireball', label: '火球', color: '#ff0000' }
        ];

        circles.forEach(c => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', center.x);
            circle.setAttribute('cy', center.y);
            circle.setAttribute('r', kmToPixels(c.radius));
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', c.color);
            circle.setAttribute('stroke-width', 2);
            circle.setAttribute('stroke-dasharray', c.class === 'impact-emp' ? '5,5' : 'none');
            circle.setAttribute('opacity', '0.7');
            this.impactGroup.appendChild(circle);
        });
    },

    clearImpactCircles() {
        while (this.impactGroup.firstChild) {
            this.impactGroup.removeChild(this.impactGroup.firstChild);
        }
    },

    setupControls() {
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.scale *= 1.3;
            this.updateTransform();
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.scale = Math.max(0.5, this.scale / 1.3);
            this.updateTransform();
        });

        document.getElementById('resetView').addEventListener('click', () => {
            this.scale = 1;
            this.translateX = 0;
            this.translateY = 0;
            this.updateTransform();
        });

        let isDragging = false;
        let startX, startY;

        this.svg.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('city-marker')) return;
            isDragging = true;
            startX = e.clientX - this.translateX;
            startY = e.clientY - this.translateY;
            this.svg.style.cursor = 'grabbing';
        });

        this.svg.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.translateX = e.clientX - startX;
                this.translateY = e.clientY - startY;
                this.updateTransform();
            }
        });

        this.svg.addEventListener('mouseup', () => {
            isDragging = false;
            this.svg.style.cursor = 'grab';
        });

        this.svg.addEventListener('mouseleave', () => {
            isDragging = false;
            this.svg.style.cursor = 'grab';
        });

        this.svg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = this.scale * delta;
            
            if (newScale >= 0.5 && newScale <= 5) {
                this.scale = newScale;
                this.updateTransform();
            }
        });
    },

    setupClickHandler() {
        this.svg.addEventListener('click', (e) => {
            if (e.target.classList.contains('city-marker') || 
                e.target.classList.contains('country-path')) return;
            
            const rect = this.svg.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * this.width;
            const y = (e.clientY - rect.top) / rect.height * this.height;
            
            const lng = (x / this.scale - this.translateX / this.scale) * (360 / this.width) - 180;
            const mercN = (this.height / 2 - y / this.scale + this.translateY / this.scale) * (2 * Math.PI / this.width);
            const lat = (2 * Math.atan(Math.exp(mercN)) - Math.PI / 2) * 180 / Math.PI;
            
            this.selectCoords(lat, lng);
        });
    },

    updateTransform() {
        const transform = `translate(${this.translateX}, ${this.translateY}) scale(${this.scale})`;
        this.mapGroup.setAttribute('transform', transform);
        this.countriesGroup.setAttribute('transform', transform);
        this.citiesGroup.setAttribute('transform', transform);
        this.labelsGroup.setAttribute('transform', transform);
        this.impactGroup.setAttribute('transform', transform);
        
        const labelOpacity = this.scale > 1.2 ? 1 : (this.scale > 0.8 ? 0.7 : 0.4);
        this.labelsGroup.setAttribute('opacity', labelOpacity);
        
        if (this.selectedCoords) {
            this.showExplosionMarker(this.selectedCoords.lat, this.selectedCoords.lng);
        }
    },

    toggleLabels() {
        this.showLabels = !this.showLabels;
        this.labelsGroup.style.display = this.showLabels ? 'block' : 'none';
    }
};

window.MapHandler = MapHandler;
