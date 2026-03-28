/**
 * ExplosionEffects.js - 高性能爆炸效果引擎
 * 优化：粒子池、GPU加速、性能监控
 */

const ExplosionEffects = {
    canvas: null,
    ctx: null,
    
    // 粒子池 - 避免频繁创建对象
    particlePool: [],
    maxPoolSize: 5000,
    
    // 活动粒子
    activeParticles: [],
    shockwaves: [],
    
    // 状态
    isAnimating: false,
    animationId: null,
    lastTime: 0,
    deltaTime: 0,
    
    // 性能监控
    fps: 0,
    frameCount: 0,
    fpsTime: 0,
    
    // 配置
    config: {
        particleLimit: 3000,
        trailLength: 5,
        glowIntensity: 1.5,
        useGlow: true
    },
    
    /**
     * 初始化
     */
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Explosion container not found');
            return false;
        }
        
        // 创建Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'explosionCanvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d', {
            alpha: true,
            desynchronized: true // GPU加速
        });
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 初始化粒子池
        this.initParticlePool();
        
        return true;
    },
    
    /**
     * 初始化粒子池
     */
    initParticlePool() {
        for (let i = 0; i < this.maxPoolSize; i++) {
            this.particlePool.push(this.createParticle());
        }
    },
    
    /**
     * 创建粒子对象
     */
    createParticle() {
        return {
            x: 0, y: 0,
            vx: 0, vy: 0,
            radius: 0,
            color: { r: 255, g: 255, b: 255 },
            alpha: 0,
            decay: 0,
            type: 'none',
            life: 0,
            active: false
        };
    },
    
    /**
     * 从池中获取粒子
     */
    getParticle() {
        for (let i = 0; i < this.particlePool.length; i++) {
            if (!this.particlePool[i].active) {
                return this.particlePool[i];
            }
        }
        // 池满了，创建新粒子
        if (this.particlePool.length < this.maxPoolSize) {
            const p = this.createParticle();
            this.particlePool.push(p);
            return p;
        }
        return null;
    },
    
    /**
     * 调整大小
     */
    resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = parent.clientWidth * dpr;
        this.canvas.height = parent.clientHeight * dpr;
        this.canvas.style.width = parent.clientWidth + 'px';
        this.canvas.style.height = parent.clientHeight + 'px';
        
        this.ctx.scale(dpr, dpr);
        this.width = parent.clientWidth;
        this.height = parent.clientHeight;
    },
    
    /**
     * 创建爆炸效果
     */
    createExplosion(x, y, yieldKt, options = {}) {
        const scale = Math.pow(Math.max(0.01, yieldKt), 0.4) * 0.5;
        
        // 火球
        this.createFireball(x, y, scale);
        
        // 冲击波
        this.createShockwave(x, y, scale);
        
        // 碎片
        this.createDebris(x, y, scale);
        
        // 蘑菇云
        this.createMushroomCloud(x, y, scale);
        
        // 启动动画
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.lastTime = performance.now();
            this.animate();
        }
        
        // 完成回调
        if (options.onComplete) {
            setTimeout(options.onComplete, 3000);
        }
    },
    
    /**
     * 创建火球
     */
    createFireball(x, y, scale) {
        const particleCount = Math.min(100, Math.floor(50 * scale));
        
        for (let i = 0; i < particleCount; i++) {
            const p = this.getParticle();
            if (!p) break;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const tempRatio = Math.random();
            
            p.active = true;
            p.x = x;
            p.y = y;
            p.vx = Math.cos(angle) * speed * scale;
            p.vy = Math.sin(angle) * speed * scale;
            p.radius = Math.random() * 8 * scale + 4;
            
            // 温度决定颜色
            if (tempRatio > 0.8) {
                p.color = { r: 255, g: 255, b: 255 }; // 白热
            } else if (tempRatio > 0.6) {
                p.color = { r: 255, g: 255, b: 200 }; // 黄白
            } else if (tempRatio > 0.4) {
                p.color = { r: 255, g: 200, b: 100 }; // 橙黄
            } else if (tempRatio > 0.2) {
                p.color = { r: 255, g: 150, b: 50 }; // 橙色
            } else {
                p.color = { r: 255, g: 100, b: 0 }; // 红橙
            }
            
            p.alpha = 1;
            p.decay = Math.random() * 0.02 + 0.01;
            p.type = 'fireball';
            p.life = 1;
        }
    },
    
    /**
     * 创建冲击波
     */
    createShockwave(x, y, scale) {
        // 主冲击波
        this.shockwaves.push({
            x: x,
            y: y,
            radius: 10,
            maxRadius: 200 * scale,
            alpha: 0.8,
            speed: 8 * scale,
            color: { r: 255, g: 200, b: 100 },
            lineWidth: 3
        });
        
        // 次级冲击波
        this.shockwaves.push({
            x: x,
            y: y,
            radius: 10,
            maxRadius: 150 * scale,
            alpha: 0.6,
            speed: 5 * scale,
            color: { r: 255, g: 150, b: 50 },
            lineWidth: 2,
            delay: 5
        });
        
        // 第三冲击波
        this.shockwaves.push({
            x: x,
            y: y,
            radius: 5,
            maxRadius: 100 * scale,
            alpha: 0.4,
            speed: 3 * scale,
            color: { r: 255, g: 100, b: 50 },
            lineWidth: 1,
            delay: 10
        });
    },
    
    /**
     * 创建碎片
     */
    createDebris(x, y, scale) {
        const count = Math.min(50, Math.floor(30 * scale));
        
        for (let i = 0; i < count; i++) {
            const p = this.getParticle();
            if (!p) break;
            
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
            const speed = Math.random() * 15 + 5;
            
            p.active = true;
            p.x = x;
            p.y = y;
            p.vx = Math.cos(angle) * speed * scale;
            p.vy = Math.sin(angle) * speed * scale;
            p.radius = Math.random() * 3 + 1;
            p.color = { r: 80, g: 60, b: 40 };
            p.alpha = 1;
            p.decay = 0.01;
            p.type = 'debris';
            p.gravity = 0.3;
            p.life = 1;
        }
    },
    
    /**
     * 创建蘑菇云
     */
    createMushroomCloud(x, y, scale) {
        // 蘑菇云茎
        const stemCount = Math.min(30, Math.floor(20 * scale));
        for (let i = 0; i < stemCount; i++) {
            const p = this.getParticle();
            if (!p) break;
            
            p.active = true;
            p.x = x + (Math.random() - 0.5) * 20 * scale;
            p.y = y;
            p.vx = (Math.random() - 0.5) * 2;
            p.vy = -Math.random() * 8 - 3;
            p.radius = Math.random() * 10 * scale + 5;
            p.color = {
                r: 100 + Math.random() * 50,
                g: 100 + Math.random() * 50,
                b: 100 + Math.random() * 50
            };
            p.alpha = 0.7;
            p.decay = 0.005;
            p.type = 'smoke';
            p.life = 1;
        }
        
        // 蘑菇云顶
        const cloudCount = Math.min(80, Math.floor(50 * scale));
        for (let i = 0; i < cloudCount; i++) {
            const p = this.getParticle();
            if (!p) break;
            
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 50 * scale;
            
            p.active = true;
            p.x = x + Math.cos(angle) * dist;
            p.y = y - 100 * scale - Math.random() * 50 * scale;
            p.vx = Math.cos(angle) * (Math.random() * 2 + 1);
            p.vy = -Math.random() * 2;
            p.radius = Math.random() * 20 * scale + 10;
            p.color = {
                r: 80 + Math.random() * 40,
                g: 80 + Math.random() * 40,
                b: 80 + Math.random() * 40
            };
            p.alpha = 0.5;
            p.decay = 0.003;
            p.type = 'smoke';
            p.life = 1;
        }
    },
    
    /**
     * 动画循环
     */
    animate() {
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // FPS计算
        this.frameCount++;
        if (currentTime - this.fpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = currentTime;
        }
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 更新和绘制
        this.updateAndDrawShockwaves();
        this.updateAndDrawParticles();
        
        // 继续动画
        if (this.hasActiveElements()) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
        }
    },
    
    /**
     * 检查是否有活动元素
     */
    hasActiveElements() {
        // 检查粒子池
        for (let i = 0; i < this.particlePool.length; i++) {
            if (this.particlePool[i].active) return true;
        }
        return this.shockwaves.length > 0;
    },
    
    /**
     * 更新并绘制冲击波
     */
    updateAndDrawShockwaves() {
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            
            if (sw.delay && sw.delay > 0) {
                sw.delay--;
                continue;
            }
            
            sw.radius += sw.speed;
            sw.alpha -= 0.015;
            
            if (sw.alpha > 0 && sw.radius < sw.maxRadius) {
                // 绘制冲击波
                this.ctx.beginPath();
                this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(${sw.color.r}, ${sw.color.g}, ${sw.color.b}, ${sw.alpha})`;
                this.ctx.lineWidth = sw.lineWidth;
                this.ctx.stroke();
                
                // 填充渐变
                const gradient = this.ctx.createRadialGradient(
                    sw.x, sw.y, sw.radius * 0.8,
                    sw.x, sw.y, sw.radius
                );
                gradient.addColorStop(0, `rgba(${sw.color.r}, ${sw.color.g}, ${sw.color.b}, 0)`);
                gradient.addColorStop(1, `rgba(${sw.color.r}, ${sw.color.g}, ${sw.color.b}, ${sw.alpha * 0.3})`);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            } else {
                this.shockwaves.splice(i, 1);
            }
        }
    },
    
    /**
     * 更新并绘制粒子
     */
    updateAndDrawParticles() {
        const gravity = 0.1;
        
        for (let i = 0; i < this.particlePool.length; i++) {
            const p = this.particlePool[i];
            if (!p.active) continue;
            
            // 更新位置
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.life -= p.decay;
            
            // 类型特定更新
            if (p.type === 'fireball') {
                p.vy += gravity;
                p.radius *= 0.98;
            } else if (p.type === 'smoke') {
                p.vy -= 0.05;
                p.radius *= 1.01;
                p.vx *= 0.99;
            } else if (p.type === 'debris') {
                p.vy += (p.gravity || 0.3);
            }
            
            // 检查生命周期
            if (p.alpha <= 0 || p.radius <= 0.5 || p.life <= 0 || p.y > this.height + 50) {
                p.active = false;
                continue;
            }
            
            // 绘制粒子
            if (p.radius > 0) {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, Math.max(0.1, p.radius), 0, Math.PI * 2);
                
                const gradient = this.ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, Math.max(0.1, p.radius)
                );
                gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`);
                gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        }
    },
    
    /**
     * 地图爆炸效果
     */
    createMapExplosion(map, lat, lng, yieldKt, options = {}) {
        if (!map) return;
        
        const scale = Math.pow(Math.max(0.01, yieldKt), 0.4) * 0.3;
        
        // 创建爆炸标记
        const explosionIcon = L.divIcon({
            className: 'explosion-marker',
            html: `
                <div class="explosion-container" style="
                    width: 100px;
                    height: 100px;
                    position: relative;
                ">
                    <div class="explosion-ring" style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: radial-gradient(circle, #fff 0%, #ff0 30%, #f80 60%, #f00 100%);
                        animation: explosionPulse 0.5s ease-out forwards;
                    "></div>
                    <div class="explosion-flash" style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 0;
                        height: 0;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.8);
                        animation: explosionFlash 0.3s ease-out forwards;
                    "></div>
                </div>
                <style>
                    @keyframes explosionPulse {
                        0% { width: 10px; height: 10px; opacity: 1; }
                        50% { width: 80px; height: 80px; opacity: 0.8; }
                        100% { width: 100px; height: 100px; opacity: 0; }
                    }
                    @keyframes explosionFlash {
                        0% { width: 0; height: 0; opacity: 1; }
                        100% { width: 200px; height: 200px; opacity: 0; }
                    }
                </style>
            `,
            iconSize: [100, 100],
            iconAnchor: [50, 50]
        });
        
        const marker = L.marker([lat, lng], { icon: explosionIcon }).addTo(map);
        
        setTimeout(() => {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }, 1000);
        
        return this.createImpactCircle(map, lat, lng, scale, options);
    },
    
    /**
     * 创建影响圈
     */
    createImpactCircle(map, lat, lng, scale, options = {}) {
        if (!map) return [];
        
        const colors = [
            { radius: 0.5, color: '#ff0000', name: '火球', fillOpacity: 0.4 },
            { radius: 2, color: '#ff4500', name: '重度破坏', fillOpacity: 0.3 },
            { radius: 5, color: '#ff8c00', name: '中度破坏', fillOpacity: 0.25 },
            { radius: 10, color: '#ffd700', name: '轻度破坏', fillOpacity: 0.2 }
        ];
        
        const circles = [];
        
        colors.forEach((c, i) => {
            const circle = L.circle([lat, lng], {
                radius: c.radius * scale * 1000,
                color: c.color,
                fillColor: c.color,
                fillOpacity: c.fillOpacity,
                weight: 2,
                opacity: 0.8
            }).addTo(map);
            
            circle.bindTooltip(`${c.name}: ${(c.radius * scale).toFixed(1)} km`, {
                permanent: false,
                direction: 'center'
            });
            
            circles.push(circle);
        });
        
        if (options.autoFit && circles.length > 0) {
            const bounds = L.latLngBounds([[lat, lng]]);
            const maxRadius = colors[colors.length - 1].radius * scale * 1000;
            
            // 扩展边界
            bounds.extend([
                [lat + maxRadius / 111000, lng],
                [lat - maxRadius / 111000, lng],
                [lat, lng + maxRadius / 111000],
                [lat, lng - maxRadius / 111000]
            ]);
            
            map.fitBounds(bounds, { padding: [50, 50] });
        }
        
        return circles;
    },
    
    /**
     * 清空所有效果
     */
    clear() {
        // 重置所有粒子
        for (let i = 0; i < this.particlePool.length; i++) {
            this.particlePool[i].active = false;
        }
        
        // 清空冲击波
        this.shockwaves = [];
        
        // 取消动画
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.isAnimating = false;
        
        // 清空画布
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    },
    
    /**
     * 销毁
     */
    destroy() {
        this.clear();
        
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
        
        this.canvas = null;
        this.ctx = null;
        this.particlePool = [];
    },
    
    /**
     * 获取性能信息
     */
    getPerformanceInfo() {
        let activeCount = 0;
        for (let i = 0; i < this.particlePool.length; i++) {
            if (this.particlePool[i].active) activeCount++;
        }
        
        return {
            fps: this.fps,
            activeParticles: activeCount,
            poolSize: this.particlePool.length,
            shockwaves: this.shockwaves.length
        };
    }
};

window.ExplosionEffects = ExplosionEffects;
