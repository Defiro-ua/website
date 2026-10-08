/* Calendar page: the thick line (assets/line.js) starts at the end of the title and snakes from one
   side of the table to the other as the page scrolls, passing behind the words. It is drawn soft and
   the table text has a halo of the page colour (both in style.css under "Calendar"), so the words over
   it stay as readable as anywhere else. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const main = $("#main"), table = $(".cal"), h1 = $(".page-title h1");
  if (!table || !h1 || !window.defiroLine) return;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  const line = defiroLine(main);
  line.svg.classList.add("is-soft");
  // Zero-width marker at the end of the title: the line starts there.
  const endTitle = (h1.lastElementChild || h1).appendChild(Object.assign(document.createElement("span"), { className: "line-anchor" }));
  endTitle.setAttribute("aria-hidden", "true");

  // Works out the path from where the title and the table are right now. Nothing on this page is
  // transformed, so plain bounding boxes relative to <main> are enough.
  function plan() {
    const m = main.getBoundingClientRect(), t = table.getBoundingClientRect(), a = endTitle.getBoundingClientRect();
    const top = t.top - m.top, bottom = t.bottom - m.top, left = t.left - m.left;
    const w = defiroLine.width(), fs = parseFloat(getComputedStyle(h1).fontSize);
    const S = { x: a.left - m.left + fs * 0.3, y: a.bottom - m.top - fs * 0.3 }, endY = bottom + 36;

    // Turning points: one every `step` px down the table, alternating between its right and left sides.
    const step = Math.max(SWING[0], Math.min(SWING[1], innerHeight * SWING[2])), P = [];
    for (let y = top + step * 0.5; y < bottom - step * 0.3; y += step) P.push({ x: left + t.width * (P.length % 2 ? 0.08 : 0.92), y });
    if (!P.length) P.push({ x: left + t.width * 0.92, y: (top + bottom) / 2 });

    // Leave the title heading right and bend down; if the first turning point is not to the right, just head down.
    const dy = P[0].y - S.y;
    let d = `M${S.x},${S.y}` + (P[0].x > S.x + 40
      ? `C${S.x + (P[0].x - S.x) * 0.75},${S.y} ${P[0].x},${S.y + dy * 0.25} ${P[0].x},${P[0].y}`
      : `C${S.x},${S.y + dy * 0.5} ${P[0].x},${P[0].y - dy * 0.5} ${P[0].x},${P[0].y}`);
    // Then one S-curve per turning point, straight down at both ends, and a short drop under the table.
    for (let k = 1; k < P.length; k++) { const h = (P[k].y - P[k - 1].y) / 2; d += `C${P[k - 1].x},${P[k - 1].y + h} ${P[k].x},${P[k].y - h} ${P[k].x},${P[k].y}`; }
    d += `L${P[P.length - 1].x},${endY}`;

    line.set(d, { size: [main.offsetWidth, main.offsetHeight], width: w, grad: [0, S.y, 0, endY], start: S });
    // The line only ever travels down, so "how much is drawn" can follow a height on the page.
    const sy = [], sl = [];
    for (let l = 0; l <= line.length; l += 6) { sy.push(line.pointAt(l).y); sl.push(l); }
    const lengthAt = (y) => { let i = 0, j = sy.length - 1; while (i < j) { const k = (i + j) >> 1; if (sy[k] < y) i = k + 1; else j = k; } return sl[i]; };
    return { S, endY, lengthAt };
  }
  // Height of one swing of the line: at least, at most, and as a share of the window height.
  const SWING = [280, 460, 0.5];

  // Ties the line to the scroll: its front end stays a little below the middle of the screen.
  function animate() {
    const top = main.getBoundingClientRect().top + scrollY, focus = innerHeight * 0.62;
    const from = top + geo.S.y - focus, to = Math.max(from + 200, Math.min(top + geo.endY - focus, ScrollTrigger.maxScroll(window)));
    const state = { y: geo.S.y };
    line.show(0);
    gsap.to(state, { y: geo.endY, ease: "none", onUpdate: () => line.show(geo.lengthAt(state.y)), scrollTrigger: { start: from, end: to, scrub: 0.5 } });
  }

  /* ---------- Build (and rebuild when the layout changes) ---------- */
  let ctx = null, geo = null;
  function build() {
    if (ctx) ctx.revert();
    ctx = null;
    geo = plan();
    if (hasGsap && !reduce.matches) ctx = gsap.context(animate);
    else line.show(line.length);
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
  build();
})();
