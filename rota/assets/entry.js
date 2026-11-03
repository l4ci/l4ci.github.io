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
