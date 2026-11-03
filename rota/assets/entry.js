// The installation prompt remains selectable without JavaScript or clipboard access.
(function () {
  "use strict";
  var button = document.querySelector("[data-copy-install]");
  var prompt = document.getElementById("install-prompt-text");
  var status = document.querySelector(".install-copy-status");
  if (!button || !prompt || !status) return;
  var reset;
  button.hidden = false;
  button.addEventListener("click", async function () {
    window.clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(prompt.textContent);
      button.textContent = "Copied";
      status.textContent = "Installation prompt copied.";
    } catch (error) {
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(prompt);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Clipboard unavailable. The prompt is selected so you can copy it manually.";
    }
    reset = window.setTimeout(function () { button.textContent = "Copy prompt"; status.textContent = ""; }, 5000);
  });
}());

// Split the slanted CLI artwork along the strokes of r, o, t and a.
(function () {
  "use strict";
  var backdrop = document.querySelector(".ambient-ascii");
  if (!backdrop) return;
  var art = backdrop.querySelector("pre");
  var toggle = document.querySelector("[data-glow-toggle]");
  var rows = art.textContent.trimEnd().split("\n");
  var cuts = [[8, 13, 17], [8, 13, 18], [8, 13, 18], [6, 13, 17], [6, 12, 16]];
  if (rows.length !== cuts.length) return;
  var groups = [[], [], [], []];
  var fragment = document.createDocumentFragment();
  rows.forEach(function (row, line) {
    var edges = [0].concat(cuts[line], row.length);
    groups.forEach(function (group, letter) {
      var span = document.createElement("span");
      span.className = "ascii-letter";
      span.dataset.letter = "rota"[letter];
      span.textContent = row.slice(edges[letter], edges[letter + 1]);
      group.push(span);
      fragment.appendChild(span);
    });
    if (line < rows.length - 1) fragment.appendChild(document.createTextNode("\n"));
  });
  art.replaceChildren(fragment);
  backdrop.dataset.enhanced = "true";
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var paused = false, timer, fadeTimer, previous = -1;
  try { paused = localStorage.getItem("rota-glow") === "paused"; } catch (e) {}

  function clearGlow() {
    window.clearTimeout(timer);
    window.clearTimeout(fadeTimer);
    groups.forEach(function (group) { group.forEach(function (span) { span.classList.remove("is-glowing"); }); });
  }
  function schedule() {
    if (paused || motion.matches || document.hidden) return;
    timer = window.setTimeout(function () {
      var next = Math.floor(Math.random() * (previous < 0 ? 4 : 3));
      if (previous >= 0 && next >= previous) next++;
      previous = next;
      groups[next].forEach(function (span) { span.classList.add("is-glowing"); });
      fadeTimer = window.setTimeout(function () {
        groups[next].forEach(function (span) { span.classList.remove("is-glowing"); });
        schedule();
      }, 2200 + Math.random() * 1300);
    }, 2500 + Math.random() * 5000);
  }
  function sync() {
    clearGlow();
    if (toggle) {
      toggle.hidden = motion.matches;
      toggle.textContent = paused ? "Resume glow" : "Pause glow";
    }
    schedule();
  }
  if (toggle) toggle.addEventListener("click", function () {
    paused = !paused;
    try { localStorage.setItem("rota-glow", paused ? "paused" : "playing"); } catch (e) {}
    sync();
  });
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
}());
