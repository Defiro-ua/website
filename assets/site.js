(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  // Text in [[double brackets]] renders as a visible placeholder.
  const txt = (s) => esc(s).replace(/\[\[(.+?)\]\]/g, '<span class="ph">$1</span>');
  const fmt = (d) => d.includes("[[") ? txt(d) : new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const D = window.DEFIRO || {};
  const REPO = "https://github.com/Defiro-ua/Defiro";
  const page = document.body.dataset.page;

  /* ---------- Icon sprite ---------- */
  const S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  const icons = {
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h8"/>',
    slides: '<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M12 16v5M8 21h8"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  };
  const brands = {
    github: '<symbol id="i-github" viewBox="0 0 16 16"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></symbol>',
    linkedin: '<symbol id="i-linkedin" viewBox="0 0 16 16"><path fill="currentColor" d="M0 1.15C0 .52.52 0 1.16 0h13.68C15.48 0 16 .52 16 1.15v13.7c0 .63-.52 1.15-1.16 1.15H1.16C.52 16 0 15.48 0 14.85zm4.94 12.24V6.17H2.542v7.22zm-1.2-8.21c.84 0 1.36-.55 1.36-1.25-.01-.71-.52-1.25-1.34-1.25-.82 0-1.36.54-1.36 1.25 0 .7.52 1.25 1.33 1.25zm4.91 8.21V9.36c0-.22.02-.43.08-.59.17-.43.57-.88 1.23-.88.87 0 1.21.66 1.21 1.63v3.87h2.4V9.25c0-2.22-1.18-3.25-2.76-3.25-1.27 0-1.84.7-2.16 1.19v.03h-.02l.02-.03V6.17h-2.4c.03.68 0 7.22 0 7.22z"/></symbol>',
  };
  document.body.insertAdjacentHTML("afterbegin",
    `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${brands.github}${brands.linkedin}${Object.entries(icons).map(([k, v]) => `<symbol id="i-${k}" ${S}>${v}</symbol>`).join("")}</defs></svg>`);

  /* ---------- Header & footer (shared by every page) ---------- */
  const cur = (p) => page === p ? ' aria-current="page"' : "";
  const msLinks = (D.milestones || []).map((m, i) => `<a href="milestones.html#${m.id}">M${i + 1} · ${esc(m.name)}</a>`).join("");
  $("#site-header").outerHTML = `
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="index.html"><img src="assets/logo.png" alt="defiro" width="110" height="34"></a>
        <nav class="nav" id="nav" aria-label="Main">
          <a href="calendar.html"${cur("calendar")}>Calendar</a>
          <div class="dd${page === "milestones" ? " active" : ""}">
            <button type="button" aria-expanded="false" aria-haspopup="true">Milestones ${icon("down")}</button>
            <div class="dd-menu">${msLinks}</div>
          </div>
          <a href="reports.html"${cur("reports")}>Reports</a>
          <a href="team.html"${cur("team")}>Team</a>
        </nav>
        <div class="tools">
          <a class="icon-btn" href="${REPO}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" title="GitHub repository">${icon("github")}</a>
          <button class="icon-btn" id="themeBtn" type="button" aria-label="Switch colour theme"></button>
          <button class="icon-btn menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu">${icon("menu")}</button>
        </div>
      </div>
    </header>`;

  $("#site-footer").outerHTML = `
    <footer>
      <div class="wrap">
        <div>
          <div class="f-brand"><img src="assets/logo-branco.png" alt="defiro" width="130" height="45"></div>
          <p class="f-note">A workflow automation platform, adaptable to any scenario. Projeto em Engenharia Informática, Universidade de Aveiro.</p>
          <p class="f-note">PEI 2026/27 · Universidade de Aveiro</p>
        </div>
        <div><h4>Project advisors</h4><ul>${(D.advisors || []).map((a) => `<li><a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(a.name)}</a></li>`).join("")}</ul></div>
        <div><h4>Project</h4><ul><li><a href="team.html">Team members</a></li><li><a href="calendar.html">Calendar</a></li><li><a href="reports.html">Reports</a></li></ul></div>
        <div><h4>Other links</h4><ul><li><a href="${REPO}" target="_blank" rel="noopener noreferrer">GitHub</a></li></ul></div>
      </div>
    </footer>`;

  /* ---------- Theme ---------- */
  const root = document.documentElement, themeBtn = $("#themeBtn");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const syncTheme = () => {
    themeBtn.innerHTML = icon(isDark() ? "sun" : "moon");
    themeBtn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  };
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("defiro-theme", root.dataset.theme); } catch (e) {}
    syncTheme();
  });
  syncTheme();

  /* ---------- Menu & dropdown ---------- */
  const nav = $("#nav"), menuBtn = $("#menuBtn"), dd = $(".dd"), ddBtn = $(".dd > button");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  ddBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    ddBtn.setAttribute("aria-expanded", dd.classList.toggle("open"));
  });
  document.addEventListener("click", (e) => { if (!dd.contains(e.target)) { dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded", "false"); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && dd.classList.contains("open")) { dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded", "false"); ddBtn.focus(); } });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) { nav.classList.remove("open"); dd.classList.remove("open"); } });

  /* ---------- Calendar ---------- */
  if ($("#calBody")) {
    const list = (items) => `<ul>${items.map((t) => `<li>${txt(t)}</li>`).join("")}</ul>`;
    // The milestone label sits on the week marked `ms` (the one with the presentation), as in the team's calendar sheet.
    $("#calBody").innerHTML = D.milestones.map((m, i) => m.calendar.map((c, j) => `
      <tr${j === 0 && i > 0 ? ' class="first"' : ""}>
        <td>${c.ms ? `<a href="milestones.html#${m.id}">M${i + 1} · ${esc(m.name)}</a>` : ""}</td>
        <td>${txt(c.when)}</td>
        <td>${(c.modules || []).map((b) => `<div class="cal-mod">Module: ${esc(b.name)}</div>${list(b.tasks)}`).join("")}${c.tasks ? list(c.tasks) : ""}</td>
        <td>${c.deliverables ? list(c.deliverables) : ""}</td>
      </tr>`).join("")).join("");
  }

  /* ---------- Milestones ---------- */
  if ($("#msTabs")) {
    const show = () => {
      const id = (location.hash || "#m1").slice(1);
      const i = Math.max(0, D.milestones.findIndex((m) => m.id === id));
      const m = D.milestones[i];
      document.title = `M${i + 1} · ${m.name} | defiro`;
      $("#msTabs").innerHTML = D.milestones.map((x, k) => `<a href="#${x.id}" aria-current="${k === i}">M${k + 1} · ${esc(x.name)}</a>`).join("");
      $("#msTitle").innerHTML = `Milestone ${i + 1} - <span class="hl">${esc(m.name)}</span>`;
      $("#msMeta").textContent = m.dates;
      $("#msEmbed").innerHTML = m.slides
        ? `<iframe src="${esc(m.slides)}" title="M${i + 1} presentation" loading="lazy" allowfullscreen></iframe>`
        : `<div class="embed-empty">${icon("slides")}<span>The M${i + 1} presentation will be available soon.</span></div>`;
      const links = [
        m.slides && `<a class="btn btn-primary" href="${esc(m.slides)}" target="_blank" rel="noopener noreferrer">${icon("slides")} Open slides</a>`,
        m.report && `<a class="btn btn-ghost" href="${esc(m.report)}" target="_blank" rel="noopener noreferrer">${icon("file")} Report</a>`,
      ].filter(Boolean);
      $("#msLinks").innerHTML = links.join("");
      $("#msLinks").hidden = !links.length;
    };
    addEventListener("hashchange", () => { show(); scrollTo(0, 0); });
    show();
  }

  /* ---------- Reports ---------- */
  if ($("#repList")) {
    const openLink = (url, label) => url
      ? `<a class="open" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label} ${icon("ext")}</a>`
      : `<span class="pending">Not yet published</span>`;
    $("#repList").innerHTML = D.reports.map((r) => `
      <li class="doc">
        <div class="doc-ico">${icon("file")}</div>
        <div><div class="doc-title">${txt(r.title)}</div><div class="doc-meta">${esc(r.ms)}${r.date ? " · " + fmt(r.date) : ""}</div></div>
        <div>${openLink(r.url, "PDF")}</div>
      </li>`).join("");
  }

  /* ---------- Team ---------- */
  if ($("#teamGrid")) {
    $("#teamGrid").innerHTML = D.team.map((m) => `
      <article class="member">
        <div class="avatar" aria-hidden="true">${esc(m.initials)}</div>
        <h3>${esc(m.name)}</h3>
        <div class="links">
          ${m.github ? `<a class="icon-btn" href="https://github.com/${esc(m.github)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(m.name)} on GitHub">${icon("github")}</a>` : ""}
          ${m.linkedin ? `<a class="icon-btn" href="${esc(m.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(m.name)} on LinkedIn">${icon("linkedin")}</a>` : ""}
          ${!m.github && !m.linkedin ? '<span class="ph">GitHub / LinkedIn</span>' : ""}
        </div>
      </article>`).join("");
  }
})();
