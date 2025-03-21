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
// bitwise rounding instead of Math.floor()?! uh, how fancy!
var greetings = [
    "Hallo", "Hello", "Bonjour", "Hola", "Ciao", "Hej", "Namaste", "Zdravím", "Ahoj",
    "こんにちは", "안녕하세요", "你好", "Moin", "Hi", "Hey", "Salü"
];

(function changeTitle() {
    var greet = greetings[Math.random() * greetings.length | 0];
    document.title = document.title.replace(/^.*?(?=@)/, "👋 " + greet + ' ');

    var helloHeading = document.getElementById("hello");
    if (helloHeading) {
        helloHeading.style.transition = "opacity 0.4s ease";
        helloHeading.style.opacity = 0;
        setTimeout(() => {
            helloHeading.textContent = greet;
            helloHeading.style.opacity = 1;
        }, 456);
    }
  
    setTimeout(changeTitle, 3456);
})();

