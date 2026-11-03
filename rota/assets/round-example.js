// Illustrative states, not a connection to a running rota instance.
(function () {
  "use strict";
  var demo = document.querySelector("[data-round-demo]");
  if (!demo) return;
  var steps = [
    { title: "Work in parallel", states: ["building", "building", "building"], text: "Three issues start in separate worktrees, using three accounts." },
    { title: "Review starts", states: ["building", "review", "building"], text: "Codex submits #13 for review while Claude Code and OpenCode keep working." },
    { title: "Test against main", states: ["review", "tests", "review"], text: "#13 passes review. Its tests run with current main while #12 and #14 are reviewed." },
    { title: "Review bounces #12", states: ["bounced", "merged", "tests"], text: "Review catches a missing redirect check in #12. It goes back for changes; #13 merges." },
    { title: "Fresh Claude session", states: ["fixing", "merged", "merged"], text: "A fresh Claude session on account D picks up #12 and the review feedback. #14 merges after its tests pass." },
    { title: "Review the fix", states: ["rereview", "merged", "merged"], text: "The new session submits the fix for #12. Review runs again on the updated code." },
    { title: "Retest against main", states: ["retest", "merged", "merged"], text: "#12 passes review. Tests run against main again, now including #13 and #14." },
    { title: "Round complete", states: ["merged", "merged", "merged"], text: "All three issues are on main. Each passed review and tests before merging." }
  ];
  var states = {
    building: { work: "active", review: "waiting", tests: "waiting", merge: "waiting", label: "Working" },
    review: { work: "done", review: "active", tests: "waiting", merge: "waiting", label: "Submitted" },
    tests: { work: "done", review: "done", tests: "active", merge: "waiting", label: "Submitted" },
    bounced: { work: "done", review: "bounced", tests: "waiting", merge: "waiting", label: "Returned" },
    fixing: { work: "fixing", review: "bounced", tests: "waiting", merge: "waiting", label: "Fixing" },
    rereview: { work: "done", review: "active", tests: "waiting", merge: "waiting", label: "Updated" },
    retest: { work: "done", review: "done", tests: "active", merge: "waiting", label: "Updated" },
    merged: { work: "done", review: "done", tests: "done", merge: "done", label: "Done" }
  };
  var lanes = demo.querySelectorAll(".round-lane");
  var eventText = demo.querySelector("[data-round-event]");
  var playback = demo.querySelector(".round-playback");
  var toggle = demo.querySelector("[data-round-toggle]");
  var stepGroup = demo.querySelector(".round-steps");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var index = 0;
  var paused = motion.matches;
  var visible = false;
  var timer;
  var buttons = steps.map(function (step, i) {
    var button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "Step " + (i + 1) + ": " + step.title);
    button.title = step.title;
    button.addEventListener("click", function () { paused = true; syncPlayback(); render(i); });
    stepGroup.appendChild(button);
    return button;
  });

  function render(nextIndex) {
    index = nextIndex;
    var step = steps[index];
    demo.dataset.step = String(index);
    lanes.forEach(function (lane, i) {
      var state = states[step.states[i]];
      lane.dataset.state = step.states[i];
      lane.dataset.returned = String(i === 0 && index >= 3);
      lane.querySelector("[data-session-status]").textContent = state.label;
      if (i === 0) {
        lane.querySelector("[data-session-account]").textContent = index >= 4 ? "Account D · new session" : "Account A";
      }
      ["work", "review", "tests", "merge"].forEach(function (stage) {
        var node = lane.querySelector('[data-stage="' + stage + '"]');
        node.dataset.status = state[stage];
        if (stage === "work") return;
        var labels = stage === "review" ? { waiting: "Waiting", active: "Reviewing", done: "Approved", bounced: "Changes" } :
          stage === "tests" ? { waiting: "Waiting", active: "Testing", done: "Passed" } : { waiting: "main", done: "Merged" };
        node.querySelector(".stage-status").textContent = labels[state[stage]];
        var link = lane.querySelector('[data-link="' + stage + '"]');
        link.dataset.status = state[stage];
      });
    });
    demo.querySelector("[data-round-accounts]").textContent = index >= 4 ? "4 accounts" : "3 accounts";
    eventText.textContent = step.text;
    buttons.forEach(function (button, i) {
      if (i === index) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  function syncPlayback() {
    window.clearTimeout(timer);
    var playing = !paused && visible && !document.hidden;
    demo.dataset.playing = String(playing);
    toggle.textContent = paused ? "Play" : "Pause";
    toggle.setAttribute("aria-label", paused ? "Play example round" : "Pause example round");
    // Automatic updates stay quiet for screen readers. Manual steps are announced.
    eventText.setAttribute("aria-live", paused ? "polite" : "off");
    if (playing) {
      timer = window.setTimeout(function () {
        render((index + 1) % steps.length);
        syncPlayback();
      }, index === 7 ? 6000 : (index === 3 || index === 4 ? 5000 : 3800));
    }
  }

  toggle.addEventListener("click", function () { paused = !paused; syncPlayback(); });
  demo.querySelector("[data-round-next]").addEventListener("click", function () {
    paused = true;
    // Set the live region before changing its text.
    syncPlayback();
    render((index + 1) % steps.length);
  });
  motion.addEventListener("change", function () { paused = motion.matches; syncPlayback(); });
  document.addEventListener("visibilitychange", syncPlayback);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: 0.15 }).observe(demo);
  } else visible = true;
  playback.hidden = false;
  render(0);
  syncPlayback();
}());
