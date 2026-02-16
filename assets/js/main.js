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
        helloHeading.style.transition = GREETING_TRANSITION;
        helloHeading.style.opacity = 0;
        setTimeout(() => {
            helloHeading.textContent = greet;
            helloHeading.style.opacity = 1;
        }, GREETING_FADE_DURATION);
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

    const experienceElement = document.getElementById("years-of-experience");
    if (experienceElement) {
        experienceElement.textContent = yearsOfExperience;
    }
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

