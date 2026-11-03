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

// Each non-space character is an independent stroke of the CLI artwork.
(function () {
  "use strict";
  var artwork = document.querySelector(".closing-ascii");
  if (!artwork) return;
  var art = artwork.querySelector("pre");
  var toggle = document.querySelector("[data-glow-toggle]");
  var pieces = [];
  var fragment = document.createDocumentFragment();
  Array.from(art.textContent.trimEnd()).forEach(function (character) {
    if (/\s/.test(character)) {
      fragment.appendChild(document.createTextNode(character));
      return;
    }
    var span = document.createElement("span");
    span.className = "ascii-piece";
    span.textContent = character;
    pieces.push(span);
    fragment.appendChild(span);
  });
  art.replaceChildren(fragment);
  artwork.dataset.enhanced = "true";
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var paused = false;
  var visible = !("IntersectionObserver" in window);
  var timers = new Map();
  try { paused = localStorage.getItem("rota-glow") === "paused"; } catch (e) {}

  function clearGlow() {
    timers.forEach(function (timer) { window.clearTimeout(timer); });
    timers.clear();
    pieces.forEach(function (piece) { piece.classList.remove("is-glowing"); });
  }
  function schedule(piece, initial) {
    timers.set(piece, window.setTimeout(function () {
      piece.classList.add("is-glowing");
      timers.set(piece, window.setTimeout(function () {
        piece.classList.remove("is-glowing");
        schedule(piece, false);
      }, 1200 + Math.random() * 4300));
    }, (initial ? 0 : 1800) + Math.random() * 9000));
  }
  function sync() {
    clearGlow();
    if (toggle) {
      toggle.hidden = motion.matches;
      toggle.textContent = paused ? "Resume glow" : "Pause glow";
    }
    if (paused || motion.matches || document.hidden || !visible) return;
    pieces.forEach(function (piece) { schedule(piece, true); });
  }
  if (toggle) toggle.addEventListener("click", function () {
    paused = !paused;
    try { localStorage.setItem("rota-glow", paused ? "paused" : "playing"); } catch (e) {}
    sync();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var next = entries[0].isIntersecting;
      if (next !== visible) { visible = next; sync(); }
    }).observe(artwork.closest(".ascii-reveal") || artwork);
  }
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
}());
