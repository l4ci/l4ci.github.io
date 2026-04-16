"use strict";

// Typewriter timing (ms)
const TYPE_SPEED = 100;
const DELETE_SPEED = 60;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

/**
 * Fade-in observer: triggers CSS animations when elements enter the viewport
 * Elements start hidden (opacity: 0) and animate in once via .is-visible class
 */
(function initFadeInObserver() {
    const els = document.querySelectorAll(".section .fade-in, .section .fade-in-delay-1, .section .fade-in-delay-2, .section .fade-in-delay-3");
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    els.forEach(el => observer.observe(el));
})();

// Available greetings in different languages
const greetings = [
    "Hallo", "Hello", "Bonjour", "Hola", "Ciao", "Hej", "Namaste", "Zdravím", "Ahoj",
    "こんにちは", "안녕하세요", "你好", "Moin", "Hi", "Hey", "Salü"
];

/**
 * Typewriter effect for the greeting heading
 * Types out a greeting, pauses, deletes it, then types the next one
 */
(function initTypewriter() {
    const el = document.getElementById("hello");
    if (!el) return;

    let index = Math.floor(Math.random() * greetings.length);

    function typeGreeting(text, charIndex) {
        if (charIndex <= text.length) {
            el.textContent = text.slice(0, charIndex);
            document.title = document.title.replace(/^.*?(?=@)/, "👋 " + text.slice(0, charIndex) + " ");
            setTimeout(() => typeGreeting(text, charIndex + 1), TYPE_SPEED);
        } else {
            setTimeout(() => deleteGreeting(text, text.length), PAUSE_AFTER_TYPE);
        }
    }

    function deleteGreeting(text, charIndex) {
        if (charIndex >= 0) {
            el.textContent = text.slice(0, charIndex);
            setTimeout(() => deleteGreeting(text, charIndex - 1), DELETE_SPEED);
        } else {
            index = (index + 1) % greetings.length;
            setTimeout(() => typeGreeting(greetings[index], 0), PAUSE_AFTER_DELETE);
        }
    }

    typeGreeting(greetings[index], 0);
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
 * Stores preference in localStorage only on manual toggle
 */
(function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const THEME_KEY = "theme-preference";

    function getSystemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
    }

    function toggleTheme() {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    }

    // Initialize: use saved preference or fall back to system preference
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved || getSystemTheme());

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    // Follow system theme changes when no manual preference is stored
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });
})();


/**
 * Logo slider: clone items for seamless infinite scroll
 * Duplicates all track children so translateX(-50%) loops smoothly
 */
(function initLogoSlider() {
    const track = document.querySelector(".client-logos__track");
    if (!track) return;

    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        const links = clone.querySelectorAll("a");
        links.forEach(link => link.setAttribute("tabindex", "-1"));
        const imgs = clone.querySelectorAll("img");
        imgs.forEach(img => img.removeAttribute("alt"));
        track.appendChild(clone);
    });
})();
