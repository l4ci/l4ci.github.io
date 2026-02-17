"use strict";

// Constants for timing and animations
const GREETING_CHANGE_INTERVAL = 3456; // Time between greeting changes (ms)
const GREETING_FADE_DURATION = 456; // Fade animation duration (ms)
const GREETING_TRANSITION = "opacity 0.4s ease";

// Available greetings in different languages
const greetings = [
    "Hallo", "Hello", "Bonjour", "Hola", "Ciao", "Hej", "Namaste", "Zdravím", "Ahoj",
    "こんにちは", "안녕하세요", "你好", "Moin", "Hi", "Hey", "Salü"
];

/**
 * Changes the page title and heading with a random greeting from different languages
 * Continuously cycles through greetings with a fade animation
 */
(function changeTitle() {
    const greet = greetings[Math.floor(Math.random() * greetings.length)];
    document.title = document.title.replace(/^.*?(?=@)/, "👋 " + greet + ' ');

    const helloHeading = document.getElementById("hello");
    if (helloHeading) {
        // Set initial greeting without fade on first load
        if (!helloHeading.dataset.initialized) {
            helloHeading.textContent = greet;
            helloHeading.dataset.initialized = "true";
        } else {
            // Fade animation for subsequent changes
            helloHeading.style.transition = GREETING_TRANSITION;
            helloHeading.style.opacity = 0;
            setTimeout(() => {
                helloHeading.textContent = greet;
                helloHeading.style.opacity = 1;
            }, GREETING_FADE_DURATION);
        }
    }

    setTimeout(changeTitle, GREETING_CHANGE_INTERVAL);
})();

/**
 * Calculate and display years of experience
 * Based on start year 2008
 */
(function updateYearsOfExperience() {
    const startYear = 2008;
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - startYear;

    document.querySelectorAll("#years-of-experience, #years-of-experience-ref").forEach(el => {
        el.textContent = yearsOfExperience;
    });
})();

/**
 * Update copyright year in footer
 */
(function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightYearElement = document.getElementById("copyright-year");

    if (copyrightYearElement) {
        copyrightYearElement.textContent = currentYear;
    }
})();

/**
 * Theme toggle functionality
 * Allows manual switching between light and dark modes
 * Stores preference in localStorage
 */
(function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const THEME_KEY = "theme-preference";

    // Get saved theme preference or default to system preference
    function getThemePreference() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) {
            return saved;
        }
        // Check system preference
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    // Toggle between light and dark themes
    function toggleTheme() {
        const currentTheme = document.body.getAttribute("data-theme") || getThemePreference();
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
    }

    // Initialize theme on page load
    const initialTheme = getThemePreference();
    applyTheme(initialTheme);

    // Add click handler to toggle button
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    // Listen for system theme changes (optional: only if no manual preference is set)
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        // Only auto-update if user hasn't manually set a preference
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });
})();


/**
 * CV Tabs functionality
 * Handles tab switching with keyboard navigation and ARIA attributes
 */
(function initCVTabs() {
    const tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

    /**
     * Switch to a specific tab
     * @param {HTMLElement} newTab - The tab to activate
     */
    function switchTab(newTab) {
        // Deactivate all tabs and hide all panels
        tabs.forEach(tab => {
            tab.setAttribute('aria-selected', 'false');
            tab.classList.remove('cv-tab--active');
            tab.tabIndex = -1;
        });

        panels.forEach(panel => {
            panel.classList.remove('cv-panel--active');
            panel.setAttribute('hidden', '');
        });

        // Activate new tab and show corresponding panel
        newTab.setAttribute('aria-selected', 'true');
        newTab.classList.add('cv-tab--active');
        newTab.tabIndex = 0;

        const panelId = newTab.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.add('cv-panel--active');
            panel.removeAttribute('hidden');
        }
    }

    // Click handler
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab);
        });
    });

    // Keyboard navigation (Arrow keys)
    tablist.addEventListener('keydown', (e) => {
        const currentTab = document.activeElement;
        const currentIndex = tabs.indexOf(currentTab);

        let nextIndex;

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % tabs.length;
                tabs[nextIndex].focus();
                switchTab(tabs[nextIndex]);
                break;

            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                tabs[nextIndex].focus();
                switchTab(tabs[nextIndex]);
                break;

            case 'Home':
                e.preventDefault();
                tabs[0].focus();
                switchTab(tabs[0]);
                break;

            case 'End':
                e.preventDefault();
                tabs[tabs.length - 1].focus();
                switchTab(tabs[tabs.length - 1]);
                break;
        }
    });
})();
