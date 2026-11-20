/**
 * Theme Manager — Dark / Light Mode
 * Auto-detects system preference, saves to localStorage
 */
'use strict';

const ThemeManager = (() => {
    const STORAGE_KEY = 'dp-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    const getSystemPreference = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;

    const getSavedTheme = () => localStorage.getItem(STORAGE_KEY);

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);

        // Update toggle button icon
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        const icon = btn.querySelector('.theme-icon');
        const label = btn.querySelector('.theme-label');
        if (theme === DARK) {
            if (icon) icon.className = 'theme-icon fas fa-sun';
            if (label) label.textContent = window._i18n?.get('nav.theme_light') || 'Light Mode';
            btn.setAttribute('aria-label', 'Switch to Light Mode');
        } else {
            if (icon) icon.className = 'theme-icon fas fa-moon';
            if (label) label.textContent = window._i18n?.get('nav.theme_dark') || 'Dark Mode';
            btn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
    };

    const toggle = () => {
        const current = document.documentElement.getAttribute('data-theme') || DARK;
        applyTheme(current === DARK ? LIGHT : DARK);
    };

    const init = () => {
        const theme = getSavedTheme() || getSystemPreference();
        applyTheme(theme);

        // Listen to system changes if no manual override
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!getSavedTheme()) applyTheme(e.matches ? DARK : LIGHT);
        });

        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.addEventListener('click', () => {
                btn.classList.add('theme-animating');
                toggle();
                setTimeout(() => btn.classList.remove('theme-animating'), 500);
            });
        }
    };

    return { init, toggle, applyTheme };
})();

document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
