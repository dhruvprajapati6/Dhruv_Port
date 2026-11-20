/**
 * Internationalization (i18n) Engine
 * Supports EN / HI / GU — no page reload
 */
'use strict';

const I18n = (() => {
    const STORAGE_KEY = 'dp-lang';
    const DEFAULT_LANG = 'en';
    const SUPPORTED = ['en', 'hi', 'gu'];

    let currentLang = DEFAULT_LANG;
    let translations = {};

    const getSaved = () => localStorage.getItem(STORAGE_KEY);

    const fetchTranslation = async (lang) => {
        if (translations[lang]) return translations[lang];
        try {
            const r = await fetch(`locales/${lang}.json?v=1`);
            if (!r.ok) throw new Error(`Failed to load ${lang}`);
            translations[lang] = await r.json();
            return translations[lang];
        } catch (e) {
            console.warn(`i18n: could not load ${lang}`, e);
            return null;
        }
    };

    const get = (key, lang) => {
        const t = translations[lang || currentLang];
        if (!t) return key;
        const parts = key.split('.');
        let val = t;
        for (const p of parts) {
            if (val == null) return key;
            val = val[p];
        }
        return val ?? key;
    };

    const applyTranslations = (lang) => {
        const t = translations[lang];
        if (!t) return;

        // Elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = get(key, lang);
            if (typeof val === 'string') el.textContent = val;
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            const val = get(key, lang);
            if (typeof val === 'string') el.setAttribute('placeholder', val);
        });

        // aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const val = get(key, lang);
            if (typeof val === 'string') el.setAttribute('aria-label', val);
        });

        // Update typing effect texts
        if (window._typingEffect && t.hero?.typing_texts) {
            window._typingEffect.updateTexts(t.hero.typing_texts);
        }

        // Update html lang
        document.documentElement.lang = t.meta?.lang || lang;
        document.documentElement.dir  = t.meta?.dir  || 'ltr';

        // Update lang switcher button display
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });

        // Update loader text
        const loaderText = document.querySelector('.loader-text');
        if (loaderText && t.loader?.text) loaderText.textContent = t.loader.text;

        // Update success popup text (if present on page)
        const popupTitle = document.querySelector('.success-popup-title');
        const popupSub   = document.querySelector('.success-popup-sub');
        const popupBtn   = document.querySelector('.success-popup-btn');
        if (popupTitle && t.contact?.success_title) popupTitle.textContent = t.contact.success_title;
        if (popupSub   && t.contact?.success_sub)   popupSub.textContent   = t.contact.success_sub;
        if (popupBtn   && t.contact?.success_btn) {
            // keep the icon, update text node only
            const icon = popupBtn.querySelector('i');
            popupBtn.textContent = t.contact.success_btn;
            if (icon) popupBtn.prepend(icon);
        }

        // Update select options with data-i18n
        document.querySelectorAll('select option[data-i18n]').forEach(opt => {
            const key = opt.getAttribute('data-i18n');
            const val = get(key, lang);
            if (typeof val === 'string') opt.textContent = val;
        });
    };

    const switchLang = async (lang) => {
        if (!SUPPORTED.includes(lang)) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);

        let t = translations[lang];
        if (!t) t = await fetchTranslation(lang);
        if (!t) return;

        applyTranslations(lang);
    };

    const init = async () => {
        const saved = getSaved() || DEFAULT_LANG;
        currentLang = SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;

        // Pre-load default + saved
        await fetchTranslation(DEFAULT_LANG);
        if (currentLang !== DEFAULT_LANG) await fetchTranslation(currentLang);

        applyTranslations(currentLang);

        // Bind language switcher buttons
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (lang) switchLang(lang);

                // Close dropdown
                const dd = document.querySelector('.lang-dropdown');
                if (dd) dd.classList.remove('open');
            });
        });

        // Toggle dropdown
        const trigger = document.getElementById('langTrigger');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const dd = document.querySelector('.lang-dropdown');
                if (dd) dd.classList.toggle('open');
            });
        }

        document.addEventListener('click', () => {
            document.querySelector('.lang-dropdown')?.classList.remove('open');
        });
    };

    // Expose get() globally so theme.js can call it
    window._i18n = { get: (key) => get(key, currentLang), switchLang, currentLang: () => currentLang };

    return { init, switchLang, get };
})();

document.addEventListener('DOMContentLoaded', () => I18n.init());
