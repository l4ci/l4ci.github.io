// An illustrative round. All decisions and releases below are demo data.
(function () {
  "use strict";
  var demo = document.querySelector("[data-round-demo]");
  if (!demo) return;
  var steps = [
    { title: "Capture the work", chapter: 0, states: ["queued", "queued", "queued"], route: "YOU → Backlog", text: "You describe the work: fix login, add CSV export and handle empty search. It becomes issues #12, #13 and #14." },
    { title: "Start your orchestrator", chapter: 0, states: ["queued", "queued", "queued"], route: "Backlog → Orchestrator", text: "You start rota-orchestrate in your Claude Code session and choose the issues. This session becomes the orchestrator." },
    { title: "Spawn worker sessions", chapter: 1, states: ["building", "building", "building"], route: "Orchestrator → Workers", text: "Your orchestrator starts Claude Code, Codex and OpenCode workers. Each gets one issue, its own worktree and a configured account." },
    { title: "Open a pull request", chapter: 1, states: ["building", "pr", "building"], route: "Worker #13 → PR #42", text: "Codex opens a PR for #13. The other workers keep working; workers do not merge their own changes." },
    { title: "Worker raises a question", chapter: 2, states: ["pr", "review", "question"], route: "Worker #14 → Orchestrator", text: "OpenCode asks: \"Should an empty search show all results or an empty state?\" It pauses #14 for that decision." },
    { title: "Orchestrator asks you", chapter: 2, states: ["review", "gate", "question"], route: "Orchestrator → YOU", text: "The question reaches your session: \"For #14, should an empty search show all results or an empty state?\" Other issues continue.", duration: 8000 },
    { title: "You answer", chapter: 2, states: ["bounced", "merged", "question"], route: "YOU → Orchestrator", text: "Your example answer: \"{answer}\" Meanwhile, #13 passes the merge gate and merges; review sends #12 back for a fix." },
    { title: "Relay the answer", chapter: 2, states: ["fixing", "merged", "building"], route: "Orchestrator → Worker #14", text: "The orchestrator relays your answer: \"{answer}\" OpenCode resumes #14. A fresh Claude session takes the review feedback for #12.", duration: 5500 },
    { title: "Submit updated work", chapter: 3, states: ["pr", "merged", "pr"], route: "Workers → PRs", text: "Claude updates PR #41 with the login fix. OpenCode opens PR #43 with the empty-search behavior you chose." },
    { title: "Review the changes", chapter: 3, states: ["review", "merged", "review"], route: "PRs → Reviews", text: "The orchestrator coordinates reviews of both PRs. The fix for #12 is reviewed again on its updated code." },
    { title: "Run the merge gate", chapter: 3, states: ["gate", "merged", "approved"], route: "Orchestrator → Merge gate for #12", text: "Your Claude orchestrator runs the gate for #12: it checks reviews and tests the PR combined with current main. #14 waits its turn." },
    { title: "Check against updated main", chapter: 3, states: ["merged", "merged", "gate"], route: "Orchestrator → Merge gate for #14", text: "#12 passes and merges. The orchestrator now runs the gate for #14 against the updated main, including #12 and #13." },
    { title: "Prepare the release", chapter: 4, states: ["merged", "merged", "merged"], route: "main → Release preparation", text: "All three issues are on main. You ask for a release; the agent checks the release checklist and prepares the notes." },
    { title: "You approve the release", chapter: 4, states: ["merged", "merged", "merged"], route: "Agent → YOU → Release", text: "You review the release notes and approve publishing. A finished round does not publish a release by itself." },
    { title: "Publish the release", chapter: 4, states: ["merged", "merged", "merged"], route: "Your approval → Release", text: "The agent tags and publishes the release. Your issues, product decision and approved changes are now in the release.", duration: 6500 }
  ];
  var states = {
    queued: { work: "waiting", pr: "waiting", review: "waiting", gate: "waiting", label: "Queued" },
    building: { work: "active", pr: "waiting", review: "waiting", gate: "waiting", label: "Working" },
    question: { work: "question", pr: "waiting", review: "waiting", gate: "waiting", label: "Needs you" },
    pr: { work: "done", pr: "active", review: "waiting", gate: "waiting", label: "Submitted" },
    review: { work: "done", pr: "done", review: "active", gate: "waiting", label: "Submitted" },
    bounced: { work: "done", pr: "done", review: "bounced", gate: "waiting", label: "Returned" },
    fixing: { work: "fixing", pr: "done", review: "bounced", gate: "waiting", label: "Fixing" },
    approved: { work: "done", pr: "done", review: "done", gate: "waiting", label: "Reviewed" },
    gate: { work: "done", pr: "done", review: "done", gate: "active", label: "Reviewed" },
    merged: { work: "done", pr: "done", review: "done", gate: "done", label: "Done" }
  };
  var chapters = [{ title: "Backlog", step: 0 }, { title: "Workers", step: 2 }, { title: "Decision", step: 4 }, { title: "Checks", step: 8 }, { title: "Release", step: 12 }];
  var lanes = demo.querySelectorAll(".round-lane");
  var eventText = demo.querySelector("[data-round-event]");
  var toggle = demo.querySelector("[data-round-toggle]");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var index = 0, paused = motion.matches, visible = false, timer;
  var answer = "Show all results.";
  var buttons = chapters.map(function (chapter) {
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = chapter.title;
    button.setAttribute("aria-label", "Jump to " + chapter.title.toLowerCase());
    button.addEventListener("click", function () { paused = true; syncPlayback(); render(chapter.step); });
    demo.querySelector(".round-chapters").appendChild(button);
    return button;
  });

  // Measure the cards so the same connected paths work at every screen size.
  var map = demo.querySelector(".round-map");
  var wires = demo.querySelector(".round-wires");
  function drawConnections() {
    var bounds = map.getBoundingClientRect();
    if (!bounds.width) return;
    wires.setAttribute("viewBox", "0 0 " + bounds.width + " " + bounds.height);
    function rect(selector) {
      var r = map.querySelector(selector).getBoundingClientRect();
      return { left: r.left - bounds.left, right: r.right - bounds.left, top: r.top - bounds.top, bottom: r.bottom - bounds.top, x: (r.left + r.right) / 2 - bounds.left, y: (r.top + r.bottom) / 2 - bounds.top };
    }
    function connect(name, points, active, show) {
      var group = wires.querySelector('[data-wire="' + name + '"]');
      var d = points.map(function (p, i) { return (i ? "L" : "M") + p.map(function (n) { return n.toFixed(1); }).join(" "); }).join(" ");
      group.dataset.active = String(active);
      group.style.display = show === false ? "none" : "";
      group.querySelectorAll("path").forEach(function (path) { path.setAttribute("d", d); });
    }
    var orchestrator = rect('[data-node="orchestrator"]');
    var you = rect('[data-node="you"]');
    var mobile = window.matchMedia("(max-width: 620px)").matches;
    var left = mobile ? 18 : 28;
    var right = bounds.width - left;
    var backlog = rect('[data-node="backlog"]');
    var intakeGap = (backlog.bottom + orchestrator.top) / 2;
    var inputOffset = (orchestrator.right - orchestrator.left) / 4;
    connect("backlog", [[backlog.x, backlog.bottom], [backlog.x, intakeGap], [orchestrator.right - inputOffset, intakeGap], [orchestrator.right - inputOffset, orchestrator.top]], index === 1);
    [12, 13, 14].forEach(function (issue, i) {
      var worker = rect('[data-issue="' + issue + '"] .round-session');
      var workerPath = [[orchestrator.left, orchestrator.y], [left, orchestrator.y], [left, worker.y], [worker.left, worker.y]];
      if (issue === 14 && (index === 4 || index === 5)) workerPath.reverse();
      connect("worker-" + issue, workerPath, index === 2 || (issue === 14 && (index === 4 || index === 7)));
      var gate = rect('[data-issue="' + issue + '"] [data-stage="gate"] .stage-mark');
      connect("gate-" + issue, [[orchestrator.right, orchestrator.y], [right, orchestrator.y], [right, gate.y], [gate.right, gate.y]], steps[index].states[i] === "gate");
    });
    var humanPath = [[orchestrator.left + inputOffset, orchestrator.top], [orchestrator.left + inputOffset, intakeGap], [you.x, intakeGap], [you.x, you.bottom]];
    if (index >= 6) humanPath.reverse();
    connect("human", humanPath, index === 5 || index === 6 || (index === 7 && motion.matches), index >= 4 && index <= 7);
  }
  var drawFrame;
  function queueConnections() {
    window.cancelAnimationFrame(drawFrame);
    drawFrame = window.requestAnimationFrame(drawConnections);
  }
  if ("ResizeObserver" in window) new ResizeObserver(queueConnections).observe(map);
  window.addEventListener("resize", queueConnections);
  if (document.fonts) document.fonts.ready.then(queueConnections);

  function render(nextIndex) {
    index = nextIndex;
    var step = steps[index];
    demo.dataset.step = String(index);
    demo.dataset.phase = step.title;
    ["you", "backlog", "orchestrator"].forEach(function (node) {
      var active = node === "you" ? [0, 5, 6, 13].includes(index) : node === "backlog" ? index === 1 : index >= 1 && index < 14;
      demo.querySelector('[data-node="' + node + '"]').dataset.status = active ? "active" : "waiting";
    });
    demo.querySelector("[data-you-status]").textContent = index === 5 ? "Decision needed" : index === 6 ? "Answer the question" : index === 13 ? "Approve the release" : "Scope & decisions";
    var gatingIssue = step.states.indexOf("gate");
    demo.querySelector("[data-orchestrator-duty]").textContent = index === 4 ? "Receives #14's question" : index === 5 ? "Asks you for a decision" : index === 6 ? "Receives your answer" : index === 7 ? "Relays your answer to #14" : gatingIssue >= 0 ? "Runs merge gate · #" + (12 + gatingIssue) : "Spawns workers · runs merge gates";
    demo.querySelector('[data-intake-link="backlog"]').dataset.status = index === 0 ? "active" : "waiting";
    lanes.forEach(function (lane, i) {
      var state = states[step.states[i]];
      lane.dataset.state = step.states[i];
      lane.dataset.returned = String(i === 0 && state.review === "bounced");
      var feedback = lane.querySelector(".round-return");
      if (feedback) feedback.setAttribute("aria-hidden", String(state.review !== "bounced"));
      lane.querySelector("[data-session-status]").textContent = state.label;
      if (i === 0) lane.querySelector("[data-session-account]").textContent = index >= 7 ? "Account D" : "Account A";
      ["work", "pr", "review", "gate"].forEach(function (stage) {
        var node = lane.querySelector('[data-stage="' + stage + '"]');
        node.dataset.status = state[stage];
        if (stage === "work") return;
        var labels = stage === "pr" ? { waiting: "Waiting", active: "#" + (41 + i), done: "#" + (41 + i) } :
          stage === "review" ? { waiting: "Waiting", active: "Reviewing", done: "Approved", bounced: "Changes" } :
          { waiting: "Waiting", active: "Testing", done: "Merged" };
        node.querySelector(".stage-status").textContent = labels[state[stage]];
        lane.querySelector('[data-link="' + stage + '"]').dataset.status = state[stage];
      });
    });
    drawConnections();
    var merged = step.states.filter(function (state) { return state === "merged"; }).length;
    demo.querySelector("[data-main-status]").textContent = "main · " + merged + "/3 merged";
    demo.querySelector("[data-release]").dataset.release = index === 14 ? "done" : index >= 12 ? "active" : "waiting";
    demo.querySelector("[data-release-status]").textContent = index === 14 ? "Published" : index === 13 ? "You approve" : index === 12 ? "Notes & checklist" : "On your approval";
    demo.querySelector("[data-round-route]").textContent = step.route;
    eventText.textContent = step.text.replace("{answer}", answer);
    demo.querySelector(".round-example-answer").hidden = index !== 5;
    buttons.forEach(function (button, i) {
      if (i === step.chapter) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }
  function syncPlayback() {
    window.clearTimeout(timer);
    var playing = !paused && visible && !document.hidden;
    demo.dataset.playing = String(playing);
    toggle.textContent = paused ? "Play" : "Pause";
    toggle.setAttribute("aria-label", paused ? "Play example round" : "Pause example round");
    eventText.setAttribute("aria-live", paused ? "polite" : "off");
    if (playing) timer = window.setTimeout(function () { render((index + 1) % steps.length); syncPlayback(); }, steps[index].duration || 4500);
  }
  demo.querySelectorAll("[data-answer]").forEach(function (button) {
    button.addEventListener("click", function () {
      answer = button.dataset.answer;
      // Let the answer visibly travel through the orchestrator before work resumes.
      paused = motion.matches;
      render(motion.matches ? 7 : 6);
      syncPlayback();
      // The answer buttons disappear; keep keyboard focus in the demo.
      demo.querySelector("[data-round-next]").focus({ preventScroll: true });
    });
  });
  toggle.addEventListener("click", function () { paused = !paused; syncPlayback(); });
  demo.querySelector("[data-round-next]").addEventListener("click", function () { paused = true; syncPlayback(); render((index + 1) % steps.length); });
  motion.addEventListener("change", function () { paused = motion.matches; syncPlayback(); });
  document.addEventListener("visibilitychange", syncPlayback);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; syncPlayback(); }, { threshold: 0.1 }).observe(demo);
  } else visible = true;
  demo.querySelector(".round-playback").hidden = false;
  render(0);
  syncPlayback();
}());
