/* Motion shared by the Calendar, Milestones and Reports pages. Each of those pages puts .motion-on on
   <html> in its <head> when motion is allowed; the styles are in style.css under "Inner pages: shared motion".
   - Content marked .reveal eases in as it enters the screen.
   - The title moves slower than the page and the brand bars beside it drift at their own speeds.
   - On Milestones and Reports those layers also follow the cursor a little.
   - Where the page has a column of .spine-node elements (the calendar's dots, the report icons), the thick
     line (assets/line.js) leaves the end of the title, curves into that column and runs down through them,
     drawing as the page scrolls.
   With reduced motion, or if GSAP did not load, everything is simply shown and the line is fully drawn. */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const main = $("#main"), page = document.body.dataset.page;
  const title = $(".page-title"), h1 = $("h1", title), sub = $("p", title);
  const bars = $$(".title-shapes span"), sideBars = $$(".margin-shapes span"), nodes = $$(".spine-node", main);
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const live = () => hasGsap && !reduce.matches;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  /* ---------- Content eases in ---------- */
  // Elements that arrive together get a small stagger (--i); the transition itself is in the CSS.
  const io = "IntersectionObserver" in window && new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e, k) => {
      e.target.style.setProperty("--i", Math.min(k, 8));
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("is-in")));

  /* ---------- The line through the column of nodes ---------- */
  const line = nodes.length && window.defiroLine ? defiroLine(main) : null;
  if (!line) nodes.forEach((n) => n.classList.add("is-reached"));
  const list = line && nodes[0].closest(".tl, .doc-list");
  if (list) list.classList.add("has-line");   // the calendar hides its plain fallback spine
  // Zero-width marker at the end of the title: the line starts there.
  const endTitle = line && (h1.lastElementChild || h1).appendChild(Object.assign(document.createElement("span"), { className: "line-anchor" }));
  if (endTitle) endTitle.setAttribute("aria-hidden", "true");
  const FOCUS = page === "reports" ? 0.85 : 0.62;   // how far down the screen the front of the line stays
  const K = 0.5523;   // control-point factor that makes a cubic curve look like a quarter circle

  // Works out the path from where things are on the page right now. Positions come from layout offsets,
  // so the transforms used for the reveals and the parallax never skew them.
  function plan() {
    const at = (el) => defiroLine.at(el, main), c = nodes.map((n) => defiroLine.centre(n, main)), N = c[0];
    const fs = parseFloat(getComputedStyle(h1).fontSize), a = at(endTitle);
    const S = { x: a.x + fs * 0.3, y: a.y + endTitle.offsetHeight - fs * 0.3 }, endY = at(list).y + list.offsetHeight + 14;
    // The line joins the column at the first node, or higher up when something sits in the way: on phones
    // the first milestone's name is above its week, so the swing has to finish above that name.
    const cap = $(".tl-label", list), capAt = cap && at(cap);
    const J = cap && capAt.y < N.y - 8 && capAt.x > N.x ? { x: N.x, y: capAt.y - 12 } : N;
    let d = `M${S.x},${S.y}`;
    if (sub) {
      // A subtitle sits between the title and the column: go down past its right-hand end, run back along
      // the gap under it and drop into the column, with rounded corners.
      const text = defiroLine.textBoxes(sub, main), under = Math.max(...text.map((b) => b.b));
      const x = Math.max(S.x + 30, Math.max(...text.map((b) => b.r)) + 28), y = (under + at(list).y) / 2;
      const r = Math.max(0, Math.min(26, (y - S.y) / 2, (x - S.x) / 2, (x - J.x) / 2, (J.y - y) / 2));
      d += `L${x - r},${S.y}Q${x},${S.y} ${x},${S.y + r}L${x},${y - r}Q${x},${y} ${x - r},${y}L${J.x + r},${y}Q${J.x},${y} ${J.x},${y + r}L${J.x},${J.y}`;
    } else if (S.x > J.x + 40) {
      // The title ends to the right of the column: turn down, then swing left into it in one S.
      const R = Math.max(12, Math.min(34, (J.y - S.y) / 3)), dy = J.y - (S.y + R);
      d += `C${S.x + R * K},${S.y} ${S.x + R},${S.y + R - R * K} ${S.x + R},${S.y + R}C${S.x + R},${S.y + R + dy * 0.6} ${J.x},${J.y - dy * 0.6} ${J.x},${J.y}`;
    } else {
      const dy = J.y - S.y;
      d += `C${S.x},${S.y + dy * 0.5} ${J.x},${J.y - dy * 0.5} ${J.x},${J.y}`;
    }
    d += (J === N ? c.slice(1) : c).map((p) => `L${p.x},${p.y}`).join("") + `L${c[c.length - 1].x},${endY}`;
    line.set(d, { size: [main.offsetWidth, main.offsetHeight], width: defiroLine.width(), grad: [0, S.y, 0, endY], start: S });
    // The line only ever travels down, so "how much is drawn" can follow a height on the page.
    const sy = [], sl = [];
    for (let l = 0; l <= line.length; l += 6) { sy.push(line.pointAt(l).y); sl.push(l); }
    const lengthAt = (y) => { let i = 0, j = sy.length - 1; while (i < j) { const k = (i + j) >> 1; if (sy[k] < y) i = k + 1; else j = k; } return sl[i]; };
    return { S, endY, lengthAt, ys: c.map((p) => p.y) };
  }

  // state.y: the height the scroll has brought the line to. intro.k: 0 to 1 while it draws in on arrival.
  const state = { y: 0 }, intro = { k: 1 };
  function render() {
    const len = geo.lengthAt(state.y) * intro.k;
    line.show(len);
    const tip = line.pointAt(len).y + 2;
    nodes.forEach((n, i) => n.classList.toggle("is-reached", geo.ys[i] <= tip));   // each node lights up as the line gets there
  }

  /* ---------- Scroll choreography ---------- */
  function animate() {
    const top = main.getBoundingClientRect().top + scrollY;
    if (line) {
      const focus = innerHeight * FOCUS, from = top + geo.S.y - focus;
      const to = Math.max(from + 200, Math.min(top + geo.endY - focus, ScrollTrigger.maxScroll(window)));
      state.y = geo.S.y;
      gsap.to(state, { y: geo.endY, ease: "none", onUpdate: render, scrollTrigger: { start: from, end: to, scrub: 0.5 } });
    }
    // Depth near the title: until it has left the screen, the title moves slower than the page and fades.
    const gone = title.offsetHeight + 40;
    gsap.to(h1, { y: gone * 0.2, opacity: 0.35, ease: "none", scrollTrigger: { start: 0, end: gone, scrub: true } });
    if (sub) gsap.to(sub, { y: gone * 0.3, opacity: 0.2, ease: "none", scrollTrigger: { start: 0, end: gone, scrub: true } });
    // The bars beside it drift at their own speeds: one lags behind the page, the other runs ahead of it.
    bars.forEach((el, k) => gsap.to(el, { y: [70, -36][k] || 0, ease: "none", scrollTrigger: { start: 0, end: innerHeight * 0.8, scrub: 0.6 } }));
    // Calendar: the bars in the right margin do the same while each one crosses the screen.
    sideBars.forEach((el, k) => {
      if (!el.offsetParent) return;   // hidden on narrower screens
      const y = top + el.offsetParent.offsetTop + el.offsetTop, s = [70, -90, 50, -60][k % 4];
      gsap.fromTo(el, { y: -s }, { y: s, ease: "none", scrollTrigger: { start: y - innerHeight, end: y + el.offsetHeight, scrub: 0.6 } });
    });
  }

  /* ---------- Layers that follow the cursor (Milestones and Reports, with a mouse) ---------- */
  // The line and anything clickable stay where they are, so targets never move under the pointer.
  if (hasGsap && (page === "milestones" || page === "reports")) {
    const layers = [[bars[0], 14], [bars[1], 9], [h1, 4], [sub, 3], [$(".embed", main), -6]].filter(([el]) => el);
    layers.forEach(([el]) => el.classList.add("mouse-layer"));
    const pos = { x: 0, y: 0 };
    const put = () => layers.forEach(([el, depth]) => {
      el.style.setProperty("--mx", (pos.x * depth).toFixed(2) + "px");
      el.style.setProperty("--my", (pos.y * depth * 0.6).toFixed(2) + "px");
    });
    const toX = gsap.quickTo(pos, "x", { duration: 0.8, ease: "power3.out", onUpdate: put }), toY = gsap.quickTo(pos, "y", { duration: 0.8, ease: "power3.out", onUpdate: put });
    addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || reduce.matches) return;
      toX((e.clientX / innerWidth) * 2 - 1);
      toY((e.clientY / innerHeight) * 2 - 1);
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => { toX(0); toY(0); });
  }

  /* ---------- Build (and rebuild when the layout changes) ---------- */
  let ctx = null, geo = null;
  function build() {
    if (ctx) ctx.revert();
    ctx = null;
    if (line) geo = plan();
    if (live()) ctx = gsap.context(animate);
    else if (line) { state.y = geo.endY; render(); }
  }
  let timer, lastW = innerWidth;
  addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth === lastW) return;   // phones fire resize when the address bar hides; only the width matters
      lastW = innerWidth;
      build();
    }, 150);
  });
  reduce.addEventListener("change", build);
  if (document.fonts) document.fonts.ready.then(build);   // text widths change when the web font arrives
  // On arrival the line draws in up to where the scroll has it; it is kept out of build() so a rebuild cannot cut it short.
  if (line && live()) gsap.fromTo(intro, { k: 0 }, { k: 1, duration: 1.1, ease: "power2.out", onUpdate: () => geo && render() });
  build();
  window.DEFIRO_PAGE = true;   // the page falls back to showing everything at once if this never gets set
})();
