/* Milestones page: the tabs are dots on a line (built by site.js, styled in style.css under "Milestones").
   This file draws the thick line (assets/line.js) from the first dot to the selected one, with the
   arrowhead pointing at the next, and moves it when another milestone is chosen. The presentation frame
   eases in again on each change. With reduced motion, or without GSAP, the line just jumps into place. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const nav = $("#msTabs"), embed = $("#msEmbed");
  if (!nav || !window.defiroLine) return;
  const links = [...nav.querySelectorAll("a")], dots = links.map((a) => $(".ms-dot", a)), n = links.length;
  if (n < 2) return;
  const hasGsap = !!window.gsap, reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const live = () => hasGsap && !reduce.matches;
  const line = defiroLine(nav);
  const current = () => Math.max(0, links.findIndex((a) => a.getAttribute("aria-current") === "true"));

  // rest[i]: how much of the line is drawn when milestone i is selected.
  let rest = [];
  function plan() {
    const c = dots.map((d) => defiroLine.centre(d, nav)), r = dots[0].offsetWidth / 2, w = defiroLine.width(), gap = c[1].x - c[0].x;
    line.set(`M${c[0].x},${c[0].y}` + c.slice(1).map((p) => `L${p.x},${p.y}`).join(""), { size: [nav.offsetWidth, nav.offsetHeight], width: w, grad: [c[0].x, 0, c[n - 1].x, 0], start: null });
    // A little past the dot, pointing at the next one. On the last dot the arrowhead stops just short of it.
    const past = Math.min(r + 22, gap * 0.3);
    rest = c.map((p, i) => (i === n - 1 ? line.length - r * 1.25 - w * 1.5 - 4 : p.x - c[0].x + past));
  }

  const state = { l: 0 }, draw = () => line.show(state.l);
  function go(animate) {
    const l = rest[current()];
    if (hasGsap) gsap.killTweensOf(state);
    if (animate && live()) gsap.to(state, { l, duration: 0.6, ease: "power2.inOut", onUpdate: draw });
    else { state.l = l; draw(); }
  }

  addEventListener("hashchange", () => {   // site.js has already updated the tabs by now
    go(true);
    if (live() && embed) gsap.fromTo(embed, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", clearProps: "opacity,transform" });
  });
  let timer, lastW = innerWidth;
  addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth === lastW) return;
      lastW = innerWidth;
      plan();
      go(false);
    }, 150);
  });
  plan();
  draw();        // start empty...
  go(true);      // ...and draw in up to the selected milestone
})();
