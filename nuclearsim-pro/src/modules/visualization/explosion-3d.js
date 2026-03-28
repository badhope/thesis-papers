class Explosion3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.fireball = null;
        this.shockwave = null;
        this.isAnimating = false;
        this.animationId = null;
        this.clock = null;
    }

    init() {
        if (!this.container || typeof THREE === 'undefined') {
            console.warn('Three.js not loaded or container not found');
            return false;
        }

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, 5, 20);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff6600, 1, 100);
        pointLight.position.set(0, 10, 10);
        this.scene.add(pointLight);

        this.clock = new THREE.Clock();

        window.addEventListener('resize', () => this.onResize());

        return true;
    }

    createExplosion(yieldKt) {
        if (!this.scene) return;

        this.clearExplosion();

        const scale = Math.pow(yieldKt, 0.4) * 0.1;

        this.createFireball(scale);
        this.createShockwave(scale);
        this.createParticles(scale);
        this.createMushroomCloud(scale);

        this.isAnimating = true;
        this.animate();
    }

    createFireball(scale) {
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                colorInner: { value: new THREE.Color(0xffffff) },
                colorMiddle: { value: new THREE.Color(0xffff00) },
                colorOuter: { value: new THREE.Color(0xff3300) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 colorInner;
                uniform vec3 colorMiddle;
                uniform vec3 colorOuter;
                
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    
                    float noise = sin(vPosition.x * 10.0 + time) * 
                                  cos(vPosition.y * 10.0 + time * 0.5) * 
                                  sin(vPosition.z * 10.0 + time * 0.3) * 0.1;
                    
                    vec3 color = mix(colorInner, colorMiddle, vUv.y + noise);
                    color = mix(color, colorOuter, intensity);
                    
                    float alpha = 1.0 - intensity * 0.3;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true
        });

        this.fireball = new THREE.Mesh(geometry, material);
        this.fireball.scale.set(scale, scale, scale);
        this.fireball.position.set(0, scale, 0);
        this.scene.add(this.fireball);
    }

    createShockwave(scale) {
        const geometry = new THREE.RingGeometry(0.1, 1, 64);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffffff) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                
                void main() {
                    float alpha = (1.0 - vUv.x) * (1.0 - time * 0.5);
                    gl_FragColor = vec4(color, alpha * 0.8);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.shockwave = new THREE.Mesh(geometry, material);
        this.shockwave.scale.set(scale, scale, 1);
        this.shockwave.rotation.x = -Math.PI / 2;
        this.shockwave.position.set(0, 0.1, 0);
        this.scene.add(this.shockwave);
    }

    createParticles(scale) {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const r = Math.random() * scale * 0.5;
            
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.cos(phi) + scale;
            positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
            
            velocities[i * 3] = (Math.random() - 0.5) * 0.5;
            velocities[i * 3 + 1] = Math.random() * 0.5;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
            
            const colorChoice = Math.random();
            if (colorChoice < 0.3) {
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 1;
            } else if (colorChoice < 0.6) {
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 0.8;
                colors[i * 3 + 2] = 0;
            } else {
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 0.3;
                colors[i * 3 + 2] = 0;
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.userData.velocities = velocities;
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(geometry, material);
        this.particles.push(particles);
        this.scene.add(particles);
    }

    createMushroomCloud(scale) {
        const geometry = new THREE.CylinderGeometry(
            scale * 0.3,
            scale * 0.5,
            scale * 3,
            32,
            10,
            true
        );
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                colorBottom: { value: new THREE.Color(0x333333) },
                colorTop: { value: new THREE.Color(0x666666) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 colorBottom;
                uniform vec3 colorTop;
                
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vec3 color = mix(colorBottom, colorTop, vUv.y);
                    
                    float noise = sin(vPosition.x * 5.0 + time) * 
                                  cos(vPosition.z * 5.0 + time * 0.5) * 0.1;
                    
                    float alpha = 0.3 + noise;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const mushroom = new THREE.Mesh(geometry, material);
        mushroom.position.set(0, scale * 2, 0);
        this.scene.add(mushroom);
        this.mushroomCloud = mushroom;
    }

    animate() {
        if (!this.isAnimating) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        if (this.fireball) {
            const growth = 1 + elapsedTime * 0.5;
            this.fireball.scale.set(
                this.fireball.scale.x + deltaTime * 2,
                this.fireball.scale.y + deltaTime * 2,
                this.fireball.scale.z + deltaTime * 2
            );
            
            this.fireball.material.uniforms.time.value = elapsedTime;
            
            if (elapsedTime > 2) {
                this.fireball.material.opacity = Math.max(0, 1 - (elapsedTime - 2) * 0.5);
            }
        }

        if (this.shockwave) {
            const shockwaveGrowth = 1 + elapsedTime * 3;
            this.shockwave.scale.set(shockwaveGrowth, shockwaveGrowth, 1);
            this.shockwave.material.uniforms.time.value = elapsedTime;
            
            if (elapsedTime > 1) {
                this.shockwave.material.opacity = Math.max(0, 0.8 - (elapsedTime - 1) * 0.8);
            }
        }

        this.particles.forEach(particles => {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.userData.velocities;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i] * deltaTime * 10;
                positions[i + 1] += velocities[i + 1] * deltaTime * 10;
                positions[i + 2] += velocities[i + 2] * deltaTime * 10;
                
                velocities[i + 1] -= deltaTime * 0.5;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
        });

        if (this.mushroomCloud) {
            this.mushroomCloud.material.uniforms.time.value = elapsedTime;
            
            if (elapsedTime > 1) {
                this.mushroomCloud.scale.y = 1 + (elapsedTime - 1) * 0.5;
            }
        }

        this.renderer.render(this.scene, this.camera);

        if (elapsedTime > 5) {
            this.stopAnimation();
        }
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    clearExplosion() {
        this.stopAnimation();

        if (this.fireball) {
            this.scene.remove(this.fireball);
            this.fireball.geometry.dispose();
            this.fireball.material.dispose();
            this.fireball = null;
        }

        if (this.shockwave) {
            this.scene.remove(this.shockwave);
            this.shockwave.geometry.dispose();
            this.shockwave.material.dispose();
            this.shockwave = null;
        }

        this.particles.forEach(particles => {
            this.scene.remove(particles);
            particles.geometry.dispose();
            particles.material.dispose();
        });
        this.particles = [];

        if (this.mushroomCloud) {
            this.scene.remove(this.mushroomCloud);
            this.mushroomCloud.geometry.dispose();
            this.mushroomCloud.material.dispose();
            this.mushroomCloud = null;
        }

        if (this.clock) {
            this.clock = new THREE.Clock();
        }
    }

    onResize() {
        if (!this.container || !this.camera || !this.renderer) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    destroy() {
        this.clearExplosion();
        
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    captureScreenshot() {
        if (!this.renderer) return null;
        
        this.renderer.render(this.scene, this.camera);
        return this.renderer.domElement.toDataURL('image/png');
    }
}

window.Explosion3D = Explosion3D;

console.log('3D Explosion System initialized');
