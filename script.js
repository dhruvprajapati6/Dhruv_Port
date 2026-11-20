/* ================================================
   DHRUV PRAJAPATI PORTFOLIO — MAIN JS (UPGRADED)
   Navigation · Loader · Cursor · Form · Scroll
   Magnetic Buttons · Mouse Trail · Lang Switcher
   ================================================ */

'use strict';

// ---- PAGE LOADER WITH PERCENTAGE ----
window.addEventListener('load', () => {
    const loader   = document.getElementById('pageLoader');
    const percent  = document.getElementById('loaderPercent');
    const progress = document.getElementById('loaderProgress');

    if (!loader) return;

    let pct = 0;
    const interval = setInterval(() => {
        pct = Math.min(pct + Math.random() * 15, 95);
        if (percent)  percent.textContent  = Math.floor(pct) + '%';
        if (progress) progress.style.width = pct + '%';
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        if (percent)  percent.textContent  = '100%';
        if (progress) progress.style.width = '100%';

        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => { loader.style.display = 'none'; }, 600);
        }, 300);
    }, 1800);
});

// ---- SCROLL PROGRESS BAR ----
class ScrollProgress {
    constructor() {
        this.bar = document.getElementById('scrollProgress');
        if (!this.bar) return;
        window.addEventListener('scroll', () => this.update(), { passive: true });
    }
    update() {
        const scrolled = window.scrollY;
        const total    = document.documentElement.scrollHeight - window.innerHeight;
        const pct      = total > 0 ? (scrolled / total) * 100 : 0;
        this.bar.style.width = pct + '%';
    }
}

// ---- CUSTOM CURSOR ----
class CustomCursor {
    constructor() {
        this.dot     = document.getElementById('cursorDot');
        this.outline = document.getElementById('cursorOutline');

        if (!this.dot || !this.outline || window.innerWidth < 768) {
            if (this.dot)     this.dot.style.display     = 'none';
            if (this.outline) this.outline.style.display = 'none';
            return;
        }

        this.dotX = 0; this.dotY = 0;
        this.outX = 0; this.outY = 0;
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            this.dotX = e.clientX;
            this.dotY = e.clientY;
        }, { passive: true });

        const interactives = document.querySelectorAll(
            'a, button, .btn, input, textarea, select, .project-card, .skill-category, .nav-link, .lang-option, .theme-toggle'
        );
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => this.outline.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => this.outline.classList.remove('cursor-hover'));
        });

        this.animate();
    }

    animate() {
        this.dot.style.left = this.dotX + 'px';
        this.dot.style.top  = this.dotY + 'px';

        this.outX += (this.dotX - this.outX) * 0.12;
        this.outY += (this.dotY - this.outY) * 0.12;
        this.outline.style.left = this.outX + 'px';
        this.outline.style.top  = this.outY + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ---- MOUSE TRAIL ----
class MouseTrail {
    constructor() {
        if (window.innerWidth < 992) return;
        this.dots   = [];
        this.max    = 12;
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        for (let i = 0; i < this.max; i++) {
            const d = document.createElement('div');
            d.className = 'mouse-trail-dot';
            d.style.opacity = (1 - i / this.max) * 0.5;
            d.style.width  = Math.max(2, 6 - i * 0.4) + 'px';
            d.style.height = d.style.width;
            d.style.pointerEvents = 'none';
            document.body.appendChild(d);
            this.dots.push({ el: d, x: 0, y: 0 });
        }

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        }, { passive: true });

        this.animate();
    }

    animate() {
        let px = this.mouseX, py = this.mouseY;

        this.dots.forEach((dot, i) => {
            const speed = 0.3 - i * 0.02;
            dot.x += (px - dot.x) * speed;
            dot.y += (py - dot.y) * speed;
            dot.el.style.left = dot.x + 'px';
            dot.el.style.top  = dot.y + 'px';
            px = dot.x; py = dot.y;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ---- NAVBAR — HIDE ON SCROLL DOWN, SHOW ON SCROLL UP ----
class Navbar {
    constructor() {
        this.navbar    = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks  = document.getElementById('navLinks');
        this.lastScroll = 0;
        this.ticking   = false;

        if (!this.navbar) return;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => { this.onScroll(); this.ticking = false; });
                this.ticking = true;
            }
        }, { passive: true });

        if (this.hamburger && this.navLinks) {
            this.hamburger.addEventListener('click', () => {
                this.hamburger.classList.toggle('active');
                this.navLinks.classList.toggle('active');
                document.body.style.overflow =
                    this.navLinks.classList.contains('active') ? 'hidden' : '';
            });

            this.navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.hamburger.classList.remove('active');
                    this.navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target)) {
                    this.hamburger.classList.remove('active');
                    this.navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    onScroll() {
        const scrollY = window.scrollY;

        // Glassmorphism effect
        if (scrollY > 60) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (scrollY > 300) {
            if (scrollY > this.lastScroll) {
                // scrolling down
                this.navbar.classList.add('nav-hidden');
                this.navbar.classList.remove('nav-visible');
            } else {
                // scrolling up
                this.navbar.classList.remove('nav-hidden');
                this.navbar.classList.add('nav-visible');
            }
        } else {
            this.navbar.classList.remove('nav-hidden');
        }

        this.lastScroll = Math.max(scrollY, 0);
    }
}

// ---- BACK TO TOP ----
class BackToTop {
    constructor() {
        this.btn = document.getElementById('backToTop');
        if (!this.btn) return;
        window.addEventListener('scroll', () => {
            this.btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        this.btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

// ---- RIPPLE EFFECT ----
class RippleEffect {
    static init() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rect   = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size   = Math.max(rect.width, rect.height);

                ripple.className = 'ripple';
                ripple.style.cssText = `
                    width:${size}px; height:${size}px;
                    left:${e.clientX - rect.left - size/2}px;
                    top:${e.clientY - rect.top - size/2}px;
                `;
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
}

// ---- SMOOTH SCROLL ----
class SmoothScroll {
    static init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }
}

// ---- MAGNETIC BUTTONS ----
class MagneticButtons {
    static init() {
        if (window.innerWidth < 992) return;

        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect   = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width  / 2;
                const y = e.clientY - rect.top  - rect.height / 2;
                btn.style.transform = `translateY(-3px) translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
}

// ---- 3D CARD TILT ----
class CardTilt {
    static init() {
        if (window.innerWidth < 992) return;

        document.querySelectorAll('.project-card, .skill-category, .journey-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width  - 0.5;
                const y = (e.clientY - rect.top)  / rect.height - 0.5;

                card.style.transform =
                    `translateY(-8px) perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// ---- CONTACT FORM VALIDATION ----
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) { e.preventDefault(); return; }
            const btn = this.form.querySelector('.form-submit');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                btn.disabled  = true;
            }
        });

        this.form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('blur',  () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const val = field.value.trim();
        const err = document.getElementById(field.id + 'Error');
        let msg = '';

        if (!val) { msg = 'This field is required.'; }
        else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            msg = 'Please enter a valid email address.';
        } else if (field.id === 'name'    && val.length < 2)  { msg = 'Name must be at least 2 characters.'; }
        else if (field.id === 'message' && val.length < 10) { msg = 'Message must be at least 10 characters.'; }

        if (msg) {
            field.classList.add('error');
            if (err) { err.textContent = msg; err.style.display = 'block'; }
            return false;
        }
        return true;
    }

    clearError(field) {
        field.classList.remove('error');
        const err = document.getElementById(field.id + 'Error');
        if (err) err.style.display = 'none';
    }

    validate() {
        let ok = true;
        this.form.querySelectorAll('.form-input, .form-textarea').forEach(f => {
            if (!this.validateField(f)) ok = false;
        });
        return ok;
    }
}

// ---- NOTIFICATION ----
class Notification {
    static show(message, type = 'success') {
        document.querySelector('.notification')?.remove();

        const n = document.createElement('div');
        n.className = `notification ${type}`;
        n.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>`;
        document.body.appendChild(n);

        setTimeout(() => n.classList.add('show'), 10);
        setTimeout(() => {
            n.classList.remove('show');
            setTimeout(() => n.remove(), 400);
        }, 4000);
    }
}

// ---- LANGUAGE SWITCHER EXTRAS ----
class LangSwitcherUI {
    static init() {
        const trigger  = document.getElementById('langTrigger');
        const dropdown = document.getElementById('langDropdown');
        const flagEl   = document.querySelector('.lang-current-flag');
        const nameEl   = document.querySelector('.lang-current-name');

        const flagMap = { en: '🇬🇧', hi: '🇮🇳', gu: '🇮🇳' };
        const nameMap = { en: 'EN',  hi: 'HI',  gu: 'GU' };

        // Update trigger display when lang changes
        const observer = new MutationObserver(() => {
            const active = dropdown?.querySelector('.lang-option.active');
            if (active && flagEl && nameEl) {
                flagEl.textContent = flagMap[active.dataset.lang] || '🌐';
                nameEl.textContent = nameMap[active.dataset.lang] || 'EN';
            }
        });

        if (dropdown) observer.observe(dropdown, { attributes: true, subtree: true });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') dropdown?.classList.remove('open');
        });
    }
}

// ---- CHECK URL MESSAGE PARAMS ----
function checkURLMessages() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const msg    = params.get('message');

    if (status && msg) {
        Notification.show(decodeURIComponent(msg), status === 'success' ? 'success' : 'error');
        window.history.replaceState(null, '', window.location.pathname);
    }
}

// ---- PARALLAX ----
class ParallaxEffect {
    static init() {
        const els = document.querySelectorAll('[data-parallax]');
        if (!els.length) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            els.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.3;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }, { passive: true });
    }
}

// ---- INITIALIZE ALL ----
document.addEventListener('DOMContentLoaded', () => {
    new ScrollProgress();
    new CustomCursor();
    new MouseTrail();
    new Navbar();
    new BackToTop();
    new ContactForm();

    RippleEffect.init();
    SmoothScroll.init();
    MagneticButtons.init();
    CardTilt.init();
    ParallaxEffect.init();
    LangSwitcherUI.init();
    ProfileSpeech.init();
    checkURLMessages();

    // Page visibility title change
    document.addEventListener('visibilitychange', () => {
        document.title = document.hidden
            ? '👋 Come Back! — Dhruv Prajapati'
            : (document.querySelector('title')?.textContent || 'Dhruv Prajapati — Portfolio');
    });
});

/* ================================================================
   13. TEXT TO SPEECH (Profile Intro)
   ================================================================ */
const ProfileSpeech = {
    init() {
        this.btn = document.getElementById('profileSpeakBtn');
        this.badge = document.getElementById('speakIconBadge');
        if (!this.btn || !window.speechSynthesis) return;

        this.textToSpeak = "Hi I am Dhruv Prajapati, a third-year BCA student at Smt. B. K. Mehta IT Center, Palanpur. My journey into programming began with curiosity, and it quickly turned into a deep passion for building meaningful applications. I'm currently mastering HTML, CSS, JavaScript, PHP, C, C#, Java, SQL, and beginning my exploration of Python. My ultimate goal is to become a skilled Full Stack Developer who bridges the worlds of AI and web technology.";

        this.speaking = false;
        
        this.btn.addEventListener('click', () => {
            if (this.speaking) {
                window.speechSynthesis.cancel();
                this.stopAnim();
                return;
            }
            this.speak();
        });

        // Handle case where speech finishes naturally
        window.speechSynthesis.onvoiceschanged = () => {
            // Some browsers require this to load voices properly
            window.speechSynthesis.getVoices();
        };
    },

    speak() {
        window.speechSynthesis.cancel(); // cancel any ongoing speech
        
        const utterance = new SpeechSynthesisUtterance(this.textToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            this.speaking = true;
            if (this.badge) this.badge.classList.add('speaking');
            if (this.badge) this.badge.innerHTML = '<i class="fas fa-volume-up"></i>';
        };

        utterance.onend = () => {
            this.stopAnim();
        };

        utterance.onerror = (e) => {
            console.warn("Speech synthesis error", e);
            this.stopAnim();
        };

        window.speechSynthesis.speak(utterance);
    },

    stopAnim() {
        this.speaking = false;
        if (this.badge) this.badge.classList.remove('speaking');
        if (this.badge) this.badge.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
};
