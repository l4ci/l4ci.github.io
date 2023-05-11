"use strict";
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

