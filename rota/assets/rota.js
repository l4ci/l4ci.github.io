// rota site: theme toggle, docs nav drawer, heading anchors, on-page toc, copy buttons, mermaid.
(function () {
  "use strict";
  var root = document.documentElement;

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try { localStorage.setItem("rota-theme", next); } catch (e) {}
      });
    }

    var navBtn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("docnav");
    if (navBtn && nav) {
      navBtn.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        navBtn.setAttribute("aria-expanded", String(open));
      });
    }

    var prose = document.querySelector(".prose");
    if (prose) {
      var heads = prose.querySelectorAll("h2[id], h3[id], h4[id]");
      heads.forEach(function (h) {
        var a = document.createElement("a");
        a.className = "anchor";
        a.href = "#" + h.id;
        a.setAttribute("aria-label", "Link to this section");
        a.textContent = "#";
        h.appendChild(a);
      });

      var toc = document.querySelector(".toc");
      var tocHeads = prose.querySelectorAll("h2[id], h3[id]");
      if (toc && tocHeads.length > 1) {
        var title = document.createElement("h2");
        title.textContent = "On this page";
        var ol = document.createElement("ol");
        var links = [];
        tocHeads.forEach(function (h) {
          var li = document.createElement("li");
          li.className = h.tagName === "H3" ? "l3" : "l2";
          var a = document.createElement("a");
          a.href = "#" + h.id;
          var clone = h.cloneNode(true);
          var anchor = clone.querySelector(".anchor");
          if (anchor) anchor.remove();
          a.innerHTML = clone.innerHTML;
          li.appendChild(a);
          ol.appendChild(li);
          links.push({ a: a, h: h });
        });
        toc.appendChild(title);
        toc.appendChild(ol);

        if ("IntersectionObserver" in window) {
          var visible = new Set();
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
            });
            var first = links.find(function (l) { return visible.has(l.h); });
            if (!first) return;
            links.forEach(function (l) {
              if (l === first) l.a.setAttribute("aria-current", "true");
              else l.a.removeAttribute("aria-current");
            });
          }, { rootMargin: "-64px 0px -60% 0px" });
          links.forEach(function (l) { io.observe(l.h); });
        }
      }
    }

    document.querySelectorAll("pre").forEach(function (pre) {
      if (pre.closest(".mermaid")) return;
      var code = pre.querySelector("code");
      if (!code || !navigator.clipboard) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(code.innerText.replace(/\n$/, "")).then(function () {
          btn.textContent = "Copied";
          btn.dataset.done = "";
          setTimeout(function () { btn.textContent = "Copy"; delete btn.dataset.done; }, 1600);
        });
      });
      pre.appendChild(btn);
    });

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Terminal playback: type the command, then print the output a line at a time.
    function prepTerm(term) {
      if (term.dataset.ready) return;
      term.dataset.ready = "";
      term.querySelectorAll(".t-you").forEach(function (el) { el.dataset.text = el.textContent; });
      term.querySelectorAll(".t-agent").forEach(function (pre) {
        var lines = pre.textContent.replace(/\n$/, "").split("\n");
        pre.textContent = "";
        lines.forEach(function (l) {
          var span = document.createElement("span");
          span.className = "t-line";
          span.textContent = l + "\n";
          pre.appendChild(span);
        });
      });
      var replay = term.querySelector(".term-replay");
      if (replay) {
        replay.hidden = false;
        replay.addEventListener("click", function () { play(term); });
      }
    }

    function play(term) {
      prepTerm(term);
      var token = (term._token = {});
      var parts = term.querySelectorAll(".t-you, .t-line");
      if (reduce) {
        parts.forEach(function (p) { if (p.dataset.text) p.textContent = p.dataset.text; p.classList.add("on"); });
        return;
      }
      parts.forEach(function (p) { p.classList.remove("on"); if (p.dataset.text) p.textContent = ""; });
      var i = 0;
      (function next() {
        if (term._token !== token || i >= parts.length) return;
        var p = parts[i++];
        p.classList.add("on");
        if (p.dataset.text) {
          var text = p.dataset.text, n = 0;
          (function type() {
            if (term._token !== token) return;
            p.textContent = text.slice(0, ++n);
            if (n < text.length) setTimeout(type, 22);
            else setTimeout(next, 380);
          })();
        } else {
          setTimeout(next, 90);
        }
      })();
    }

    // Static terminals on skill pages play once when scrolled into view.
    var pageTerms = document.querySelectorAll(".prose [data-term]");
    if (pageTerms.length && "IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { tio.unobserve(e.target); play(e.target); }
        });
      }, { threshold: 0.4 });
      pageTerms.forEach(function (t) { prepTerm(t); tio.observe(t); });
    }

    // Explorer: tabs pick a chain, steps pick a skill inside it.
    document.querySelectorAll("[data-explorer]").forEach(function (ex) {
      ex.classList.add("js");
      var tabs = Array.prototype.slice.call(ex.querySelectorAll('[role="tab"]'));
      var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
      var seen = false;

      function showStep(panel, idx, animate) {
        var steps = panel.querySelectorAll(".ex-step");
        idx = Math.max(0, Math.min(steps.length - 1, idx));
        panel._idx = idx;
        steps.forEach(function (s, i) { s.hidden = i !== idx; });
        panel.querySelectorAll("[data-goto]").forEach(function (b, i) {
          b.setAttribute("aria-current", i === idx ? "step" : "false");
          b.parentNode.classList.toggle("past", i < idx);
        });
        panel.querySelector("[data-prev]").disabled = idx === 0;
        var nextBtn = panel.querySelector("[data-next]");
        nextBtn.disabled = idx === steps.length - 1;
        var term = steps[idx].querySelector("[data-term]");
        prepTerm(term);
        if (animate) play(term); else if (!term._token) { term._token = {}; term.querySelectorAll(".t-you, .t-line").forEach(function (p) { if (p.dataset.text) p.textContent = p.dataset.text; p.classList.add("on"); }); }
      }

      function select(i, focus) {
        tabs.forEach(function (t, j) {
          t.setAttribute("aria-selected", String(i === j));
          t.tabIndex = i === j ? 0 : -1;
          panels[j].hidden = i !== j;
        });
        if (focus) tabs[i].focus();
        showStep(panels[i], 0, seen);
      }

      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { select(i, false); });
        t.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
          if (e.key === "Home") { e.preventDefault(); select(0, true); }
          else if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
          else if (d) { e.preventDefault(); select((i + d + tabs.length) % tabs.length, true); }
        });
      });

      panels.forEach(function (panel) {
        panel.querySelectorAll("[data-goto]").forEach(function (b) {
          b.addEventListener("click", function () { showStep(panel, +b.dataset.goto, true); });
        });
        panel.querySelector("[data-prev]").addEventListener("click", function () { showStep(panel, panel._idx - 1, true); });
        panel.querySelector("[data-next]").addEventListener("click", function () { showStep(panel, panel._idx + 1, true); });
      });

      select(0, false);

      // The first chain plays once, when the explorer comes into view.
      if ("IntersectionObserver" in window) {
        var eio = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          eio.disconnect();
          seen = true;
          var cur = panels.find(function (p) { return !p.hidden; });
          play(cur.querySelectorAll(".ex-step")[cur._idx].querySelector("[data-term]"));
        }, { threshold: 0.35 });
        eio.observe(ex);
      } else {
        seen = true;
      }
    });

    var diagrams = document.querySelectorAll("code.language-mermaid");
    if (diagrams.length) {
      diagrams.forEach(function (code) {
        var wrap = code.closest("div.highlighter-rouge") || code.closest("pre");
        var div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = code.textContent;
        wrap.replaceWith(div);
      });
      import("https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs").then(function (m) {
        var dark = currentTheme() === "dark";
        m.default.initialize({
          startOnLoad: false,
          theme: "base",
          fontFamily: "Martian Mono, ui-monospace, monospace",
          themeVariables: dark
            ? { background: "#0D1117", primaryColor: "#161B22", primaryTextColor: "#F0F6FC", primaryBorderColor: "#9198A1", lineColor: "#9198A1", fontSize: "13px" }
            : { background: "#F7F8FA", primaryColor: "#EEF0F3", primaryTextColor: "#1F2328", primaryBorderColor: "#59636E", lineColor: "#59636E", fontSize: "13px" }
        });
        m.default.run({ querySelector: ".mermaid" });
      }).catch(function () {});
    }
  });
})();
