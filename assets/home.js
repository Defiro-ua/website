/* Home page scene: a thick curved line runs from the headline through the three steps.
   The layout, the start states and the modes (pinned / free / static) are described in style.css under
   "Home scene". This file measures the page, builds the path and, when motion is allowed, ties the line
   (assets/line.js) and the parallax layers to the scroll with GSAP ScrollTrigger (no scroll listeners of our own). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const root = document.documentElement, scene = $("#scene");
  if (!scene) return;
  const pin = $(".scene-pin", scene), canvas = $(".scene-canvas", scene);
  const h1 = $("h1", scene), lede = $(".lede", scene), h2 = $("h2", scene);
  const steps = [...scene.querySelectorAll(".step")];
  const dots = steps.map((s) => $(".step-n", s)), ghosts = steps.map((s) => $(".step-ghost", s));
  const shapes = [...scene.querySelectorAll(".scene-shapes span")];
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const pinMq = matchMedia("(min-width: 900px) and (min-height: 620px)");   // keep in sync with style.css
  const zigMq = matchMedia("(max-width: 800px)");                           // steps stacked, the line zigzags
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  /* ---------- The path ---------- */
  const line = defiroLine(canvas);
  const at = (el) => defiroLine.at(el, canvas), centre = (el) => defiroLine.centre(el, canvas), textBoxes = (el) => defiroLine.textBoxes(el, canvas);
  // Zero-width markers at the end of the headline and of the subtitle: the line starts at one of them.
  const mark = (el) => { const m = document.createElement("span"); m.className = "line-anchor"; m.setAttribute("aria-hidden", "true"); return el.appendChild(m); };
  const endH1 = mark($(".hl", h1) || h1), endLede = mark(lede);

  const K = 0.5523;   // control-point factor that makes a cubic curve look like a quarter circle
  // Works out the path from where things are on the page right now.
  function plan() {
    const W = canvas.offsetWidth, Hc = canvas.offsetHeight, zig = zigMq.matches;
    const wrap = $(".wrap", scene), left = at(wrap).x + parseFloat(getComputedStyle(wrap).paddingLeft), right = W - left;
    const w = defiroLine.width();
    const N = dots.map(centre);
    const fsH = parseFloat(getComputedStyle(h1).fontSize), fsL = parseFloat(getComputedStyle(lede).fontSize);
    const aH = at(endH1), aL = at(endLede), ledeLines = textBoxes(lede);
    const ledeRight = Math.max(...ledeLines.map((b) => b.r)), ledeBottom = Math.max(...ledeLines.map((b) => b.b));

    // Entry. "Sweep": leave the end of the headline, turn down and swing left into step 1 in one big S.
    // It needs room beside the text; otherwise drop from the end of the subtitle and run along the gap
    // under it, with rounded corners.
    const R = Math.max(36, Math.min(84, fsH * 0.9));
    let S = { x: aH.x + fsH * 0.3, y: aH.y + endH1.offsetHeight - fsH * 0.3 }, entry;
    if (!zig && S.x + R + w <= right && S.x + R >= ledeRight + 28) {
      const dy = N[0].y - (S.y + R);
      entry = `C${S.x + R * K},${S.y} ${S.x + R},${S.y + R - R * K} ${S.x + R},${S.y + R}` +
        `C${S.x + R},${S.y + R + dy * 0.6} ${N[0].x},${N[0].y - dy * 0.6} ${N[0].x},${N[0].y}`;
    } else {
      S = { x: Math.min(aL.x + fsL * 0.7, right - w), y: aL.y + endLede.offsetHeight - fsL * 0.3 };
      const yc = (ledeBottom + at(h2).y) / 2, r = Math.max(0, Math.min(28, (yc - S.y) / 2, (S.x - N[0].x) / 2, (N[0].y - yc) / 2));
      entry = `L${S.x},${yc - r}Q${S.x},${yc} ${S.x - r},${yc}L${N[0].x + r},${yc}Q${N[0].x},${yc} ${N[0].x},${yc + r}L${N[0].x},${N[0].y}`;
    }

    let segC, segD, exit, E;
    if (!zig) {
      // Wave: S-curves with level ends between the circles. The falling one starts its drop later and
      // later until it clears the text under step 2.
      const mid = (N[0].x + N[1].x) / 2, dx = N[2].x - N[1].x, under = [$("h3", steps[1]), $("p", steps[1])].flatMap(textBoxes);
      segC = `C${mid},${N[0].y} ${mid},${N[1].y} ${N[1].x},${N[1].y}`;
      for (const k of [0.5, 0.62, 0.74, 0.86]) {
        segD = `C${N[1].x + dx * k},${N[1].y} ${N[2].x - dx * (1 - k)},${N[2].y} ${N[2].x},${N[2].y}`;
        if (line.clears(`M${N[1].x},${N[1].y}${segD}`, under, w / 2 + 10)) break;
      }
      E = { x: right - w, y: N[2].y - (N[2].y - N[1].y) * 0.5 };
      const d = E.x - N[2].x;
      exit = `C${N[2].x + d * 0.5},${N[2].y} ${E.x - d * 0.45},${E.y} ${E.x},${E.y}`;
    } else {
      // Zigzag: straight down from each circle, across in the gap between two rows, down into the next.
      const top = steps.map((s) => at(s).y), bottom = steps.map((s, i) => top[i] + s.offsetHeight);
      const cross = (a, b, i) => {
        const y = (bottom[i] + top[i + 1]) / 2, r = Math.max(0, Math.min(24, (top[i + 1] - bottom[i]) / 2 - 4)), s = Math.sign(b.x - a.x);
        return `L${a.x},${y - r}Q${a.x},${y} ${a.x + s * r},${y}L${b.x - s * r},${y}Q${b.x},${y} ${b.x},${y + r}L${b.x},${b.y}`;
      };
      segC = cross(N[0], N[1], 0);
      segD = cross(N[1], N[2], 1);
      E = { x: N[2].x, y: bottom[2] + 40 };
      exit = `L${E.x},${E.y}`;
    }

    // Lengths up to each circle, so each step can appear exactly when the line reaches it.
    const head = `M${S.x},${S.y}`, parts = [entry, segC, segD, exit];
    const len = parts.map((_, i) => line.measure(head + parts.slice(0, i + 1).join("")));
    // The gradient follows the direction the line travels through the steps.
    line.set(head + parts.join(""), { size: [W, Hc], width: w, grad: zig ? [0, S.y, 0, E.y] : [left, 0, right, 0], start: S });
    return { at: len.slice(0, 3).map((l) => l / len[3]), E };
  }

  // Shows the first `p` (0 to 1) of the line.
  const render = (p) => line.show(line.length * p);

  /* ---------- Scroll choreography ---------- */
  // One timeline, 0 to 100, scrubbed by the scroll. The line draws from T0 to T1; everything else is
  // placed on it by how far along the line each step is.
  function animate() {
    const pinned = pinMq.matches, headerH = parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 76;
    // Free mode: the line finishes when its end is about two thirds down the screen.
    const dist = Math.max(260, Math.min(scene.getBoundingClientRect().top + scrollY + geo.E.y - innerHeight * 0.68, ScrollTrigger.maxScroll(window)));
    const T0 = 3, T1 = 94, time = (f) => T0 + f * (T1 - T0);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: scene, start: `top ${headerH}px`, end: pinned ? "bottom bottom" : `+=${dist}`, scrub: pinned ? 0.6 : 0.4 },
    });
    const state = { p: 0 };
    render(0);
    tl.to(state, { p: 1, duration: T1 - T0, onUpdate: () => render(state.p) }, T0)
      .to({}, { duration: 100 - T1 }, T1);   // short hold before the page moves on

    if (pinned) {
      // Camera: the canvas is two screens tall. Start panning when the tip passes 60% of the first
      // screen and arrive as it reaches step 1, so the tip stays near the middle of the screen.
      const H = pin.offsetHeight;
      let f = 0;
      while (f < geo.at[0] * 0.5 && line.pointAt(f * line.length).y < H * 0.6) f += geo.at[0] / 100;
      const from = time(f), span = time(geo.at[0]) - from;
      tl.to(canvas, { y: -H, duration: span, ease: "sine.inOut" }, from)
        .to(lede, { y: H * 0.1, duration: span }, from);   // the subtitle lags behind the headline
    }

    // Parallax: brand bars drift at their own speeds for the whole sequence. In free mode the headline
    // screen is short, so they move less and the small top bar slides up, away from the headline.
    const drift = pinned ? [0.3, 0.55, -0.12, -0.2].map((k) => k * pin.offsetHeight) : [60, -40, 0, 0];
    shapes.forEach((el, i) => tl.to(el, { y: drift[i], duration: 100 }, 0));

    const first = time(geo.at[0]);
    tl.fromTo(h2, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 9, ease: "power2.out" }, Math.max(0, first - 15));
    steps.forEach((s, i) => {
      const t = time(geo.at[i]), drift = 34 + i * 12;
      // The circle is in place just before the line arrives; the text follows it.
      tl.fromTo(dots[i], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 4, ease: "back.out(2)" }, t - 3.4)
        .fromTo([$("h3", s), $("p", s)], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 5, ease: "power2.out", stagger: 1.2 }, t - 0.6)
        .from(ghosts[i], { opacity: 0, duration: 6 }, t - 3)
        .fromTo(ghosts[i], { y: drift }, { y: -drift, duration: 110 - t }, t - 10);
    });
  }

  /* ---------- Build (and rebuild when the layout changes) ---------- */
  let ctx = null, geo = null;
  function build() {
    if (ctx) ctx.revert();
    ctx = null;
    const live = hasGsap && !reduce.matches;
    root.classList.toggle("scene-on", live);
    scene.classList.add("is-ready");
    geo = plan();
    if (live) ctx = gsap.context(animate);
    else render(1);
  }

  let timer, lastW = innerWidth, lastH = innerHeight;
  addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Phones fire resize when the address bar hides: only a width change matters, or any change while pinned.
      if (innerWidth === lastW && !(pinMq.matches && innerHeight !== lastH)) return;
      lastW = innerWidth;
      lastH = innerHeight;
      build();
    }, 150);
  });
  reduce.addEventListener("change", build);
  pinMq.addEventListener("change", build);   // e.g. the window became too short to pin
  if (document.fonts) document.fonts.ready.then(build);   // the headline width changes when the web font arrives
  build();
  window.DEFIRO_SCENE = true;   // index.html falls back to the plain layout if this never gets set
})();
