"use strict";
var dmToggle = document.getElementById("darkmode-toggle");
var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
var currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
    document.body.classList.toggle("dark");
}
else if (currentTheme == "light") {
    document.body.classList.toggle("light");
}
dmToggle.addEventListener("click", function () {
    if (prefersDarkScheme.matches) {
        document.body.classList.toggle("light");
        var theme = document.body.classList.contains("light")
            ? "light"
            : "dark";
    }
    else {
        document.body.classList.toggle("dark");
        var theme = document.body.classList.contains("dark") ? "dark" : "light";
    }
    localStorage.setItem("theme", theme);
});
