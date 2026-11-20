/* ================================================
   DHRUV PRAJAPATI PORTFOLIO - ANIMATION JS
   Particle System, Mouse Glow, Counters, etc.
   ================================================ */

'use strict';

// ---- PARTICLE SYSTEM ----
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationId = null;

        this.colors = ['#00E5FF', '#8B5CF6', '#00FF99', '#ffffff'];
        this.particleCount = window.innerWidth < 768 ? 60 : 120;

        this.init();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: Math.random() * 0.6 + 0.1,
            pulseSpeed: Math.random() * 0.02 + 0.005,
            pulsePhase: Math.random() * Math.PI * 2,
            connections: [],
        };
    }

    init() {
        this.resize();

        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push(this.createParticle());
            }
        });

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }

        this.animate();
    }

    drawConnections() {
        const maxDist = 120;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawConnections();

        this.particles.forEach((p) => {
            // Move
            p.x += p.speedX;
            p.y += p.speedY;

            // Bounce
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            // Mouse interaction
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                const force = (100 - dist) / 100;
                p.x += (dx / dist) * force * 1.5;
                p.y += (dy / dist) * force * 1.5;
            }

            // Pulse opacity
            p.pulsePhase += p.pulseSpeed;
            const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulsePhase));

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color.replace(')', `, ${currentOpacity})`).replace('rgb', 'rgba');

            // If it's a hex color, convert differently
            this.ctx.globalAlpha = currentOpacity;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 4;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
            this.ctx.shadowBlur = 0;
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ---- MOUSE GLOW EFFECT ----
class MouseGlow {
    constructor() {
        this.glow = document.createElement('div');
        this.glow.className = 'mouse-glow';
        document.body.appendChild(this.glow);

        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;

        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });

        this.animate();
    }

    animate() {
        this.x += (this.targetX - this.x) * 0.08;
        this.y += (this.targetY - this.y) * 0.08;

        this.glow.style.left = this.x + 'px';
        this.glow.style.top = this.y + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ---- COUNTER ANIMATION ----
class CounterAnimation {
    static animate(el, start, end, duration, suffix = '') {
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * eased);

            el.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }

    static initAll() {
        const counters = document.querySelectorAll('[data-counter]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';

                    const target = parseInt(entry.target.dataset.counter);
                    const suffix = entry.target.dataset.suffix || '';
                    const duration = parseInt(entry.target.dataset.duration || '2000');

                    CounterAnimation.animate(entry.target, 0, target, duration, suffix);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }
}

// ---- SCROLL REVEAL (upgraded — now includes reveal-blur) ----
class ScrollReveal {
    static init() {
        const reveals = document.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-blur'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }
}

// ---- SKILL BAR ANIMATION ----
class SkillBars {
    static init() {
        const bars = document.querySelectorAll('.skill-fill');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    const width = entry.target.dataset.width;
                    setTimeout(() => {
                        entry.target.style.width = width + '%';
                    }, 200);
                }
            });
        }, { threshold: 0.3 });

        bars.forEach(bar => observer.observe(bar));
    }
}

// ---- TYPING EFFECT (i18n aware) ----
class TypingEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.typeSpeed = options.typeSpeed || 80;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.timeoutId = null;

        this.start();
    }

    /** Called by i18n.js when language changes */
    updateTexts(newTexts) {
        if (!newTexts || !newTexts.length) return;
        this.texts = newTexts;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = true;
    }

    start() { this.tick(); }

    tick() {
        const currentText = this.texts[this.currentTextIndex];

        if (this.isDeleting) {
            this.currentCharIndex--;
        } else {
            this.currentCharIndex++;
        }

        if (this.element) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex);
        }

        let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            delay = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            delay = 400;
        }

        this.timeoutId = setTimeout(() => this.tick(), delay);
    }
}

// ---- INITIALIZE ----
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    new ParticleSystem('particles-canvas');

    // Mouse glow (desktop only)
    if (window.innerWidth > 768) {
        new MouseGlow();
    }

    // Scroll reveal
    ScrollReveal.init();

    // Counters
    CounterAnimation.initAll();

    // Skill bars
    SkillBars.init();

    // Typing effect (hero page) — stored globally so i18n can update texts
    const typingEl = document.getElementById('heroTyping');
    if (typingEl) {
        const typingInstance = new TypingEffect(typingEl, [
            'Third Year BCA Student',
            'Future Full Stack Developer',
            'Learning Python & AI',
            'Passionate Programmer',
            'Always Building Things',
        ], { typeSpeed: 80, deleteSpeed: 40, pauseTime: 2500 });
        // Expose so i18n.js can call updateTexts()
        window._typingEffect = typingInstance;
    }

    // Progress rings
    const rings = document.querySelectorAll('.progress-circle[data-progress]');
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = parseInt(entry.target.dataset.progress);
                const circumference = 283;
                const offset = circumference - (progress / 100) * circumference;
                entry.target.style.strokeDashoffset = offset;
                ringObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    rings.forEach(ring => ringObserver.observe(ring));
});
