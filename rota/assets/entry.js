// Progressive enhancement: the commands stay readable without JavaScript.
(function () {
  "use strict";
  var choice = document.querySelector(".harness-choice");
  if (!choice) return;
  choice.hidden = false;
  choice.addEventListener("click", function (event) {
    var button = event.target.closest("[data-harness]");
    if (!button) return;
    var prefix = button.dataset.harness === "codex" ? "$" : "/";
    choice.querySelectorAll("button").forEach(function (item) {
      item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelectorAll("[data-skill]").forEach(function (code) {
      code.textContent = prefix + code.dataset.skill;
    });
  });
}());
