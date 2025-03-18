"use strict";
/*
// Yeah, lets forget about the dark mode switcher for a second

var currentTheme = localStorage.getItem("theme");

if (currentTheme == "dark") {
  document.body.classList.add("dark");
}

function toggleDarkMode() {

  document.body.classList.toggle("dark");
  var theme = document.body.classList.contains("dark") ? "dark" : "light";

  localStorage.setItem("theme", theme);
  return false;
}
*/

// Fancy title greeting
var greetings = [
    "Hallo", "Hello", "Bonjour", "Hola", "Ciao",
    "Привет", "こんにちは", "안녕하세요", "你好"
];

(function changeTitle() {
    document.title = greetings[Math.random() * greetings.length | 0]; // bitwise rounding instead of Math.floor(), uh how fancy
    setTimeout(changeTitle, 2345); // just because
})();

