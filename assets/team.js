/* Team page: a row of members you move through one at a time, joined by the thick line (assets/line.js).
   The line reaches out to the next photo and that member appears when it arrives.
   - Touch screens and small windows: the row is a normal sideways-scrolling strip, so you swipe it.
   - Computers: the section sticks under the header and every scroll, strong or weak, moves the row
     sideways by exactly one member.
   Arrows, dots, the keyboard and dragging work in both. The layout is in style.css under "Team deck".
   With reduced motion, or if GSAP did not load, none of this runs and the plain grid is shown. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const root = document.documentElement, deck = $("#deck");
  if (!deck) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (!(window.gsap && window.ScrollTrigger && window.defiroLine) || reduce.matches) { root.classList.remove("deck-on"); return; }
  reduce.addEventListener("change", () => location.reload());
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const view = $(".deck-view", deck), rail = $(".deck-rail", deck), track = $("#teamGrid");
  const members = [...track.children], n = members.length;
  if (n < 2) { root.classList.remove("deck-on"); return; }
  const shapes = [...deck.querySelectorAll(".deck-shapes span")];
  const pinMq = matchMedia("(min-width: 900px) and (min-height: 620px) and (pointer: fine)");   // keep in sync with style.css
  const part = (m) => ({ photo: $(".avatar", m), info: [$("h3", m), $(".links", m)] });

  /* ---------- Controls: arrows and dots ---------- */
  const ui = document.createElement("div");
  ui.className = "deck-ui";
  const button = (cls, label) => { const b = document.createElement("button"); b.type = "button"; b.className = cls; b.setAttribute("aria-label", label); return b; };
  const prev = button("deck-arrow prev", "Previous member"), next = button("deck-arrow next", "Next member"), dotBox = document.createElement("div");
  prev.innerHTML = next.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
  dotBox.className = "deck-dots";
  const dots = members.map((m) => dotBox.appendChild(button("", "Show " + $("h3", m).textContent)));
  ui.append(prev, dotBox, next);
  view.after(ui);
  track.setAttribute("role", "group");
  track.setAttribute("aria-label", "Team members, one at a time");

  /* ---------- The path: a wave through the centre of every photo ---------- */
  const line = defiroLine(track);
  function plan() {
    deck.style.setProperty("--view", view.clientWidth + "px");   // lets the CSS centre the first and last member exactly
    const c = members.map((m) => defiroLine.centre($(".avatar", m), track)), r = $(".avatar", members[0]).offsetWidth / 2;
    const slide = members[1].offsetLeft - members[0].offsetLeft;
    // It comes in from beyond the left edge, passes behind each photo and ends just past the last one.
    let from = { x: c[0].x - Math.max(view.clientWidth * 0.75, slide), y: c[0].y + (c[1].y - c[0].y) * 0.6 }, d = `M${from.x},${from.y}`;
    c.forEach((p) => { const mid = (from.x + p.x) / 2; d += `C${mid},${from.y} ${mid},${p.y} ${p.x},${p.y}`; from = p; });
    d += `L${from.x + r + 86},${from.y}`;
    line.set(d, { size: [track.offsetWidth, track.offsetHeight], width: defiroLine.width(), grad: [c[0].x - r, 0, from.x + r, 0], start: null });
    // For each member: where the line first touches the photo, and where it rests (a little past the photo,
    // its arrowhead pointing at the next one).
    let l = 0;
    const reach = c.map((p) => (l = line.lengthWhere((q) => q.x >= p.x - r * 0.8, l)));
    l = 0;
    const rest = c.map((p, i) => (i === n - 1 ? line.length : (l = line.lengthWhere((q) => q.x >= p.x + r + 44, l))));
    return { slide, reach, rest };
  }

  /* ---------- Choreography ---------- */
  // One timeline scrubbed by the scroll: time 0 is the first member, 1 the second, and so on.
  // Pinned: the page scroll drives it and the row is moved with a transform.
  // Swipe: the row's own sideways scroll drives it.
  let tl = null, st = null, cur = -1, intro = null, nudge = null;
  const state = { l: 0 }, draw = () => line.show(state.l);
  function animate() {
    const pinned = pinMq.matches, { slide, reach, rest } = geo;
    const headerH = parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 76;
    if (pinned) view.scrollLeft = 0;
    tl = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: sync,
      scrollTrigger: pinned
        ? { trigger: deck, start: `top ${headerH}px`, end: "bottom bottom", scrub: 0.3 }
        : { scroller: view, horizontal: true, start: 0, end: (n - 1) * slide, scrub: 0.3 },
    });
    st = tl.scrollTrigger;
    state.l = rest[0];
    draw();

    members.forEach((m, i) => {
      const { photo, info } = part(m);
      if (i > 0) {
        // Step i-1 brings this member in: the line reaches out first, the photo pops when it lands, then the row follows.
        const t = i - 1;
        tl.fromTo(state, { l: rest[t] }, { l: reach[i], duration: 0.5, ease: "power1.inOut", onUpdate: draw, immediateRender: false }, t)
          .fromTo(state, { l: reach[i] }, { l: rest[i], duration: 0.5, ease: "power1.out", onUpdate: draw, immediateRender: false }, t + 0.5)
          .fromTo(photo, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 0.84, duration: 0.2, ease: "back.out(2)" }, t + 0.44)
          .fromTo(m, { "--ring": 1 }, { "--ring": 0, duration: 0.15 }, t + 0.44)   // the placeholder ring gives way to the photo
          .fromTo(photo, { scale: 0.84 }, { scale: 1, duration: 0.34, ease: "power2.out", immediateRender: false }, t + 0.66)
          .fromTo(info, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.06 }, t + 0.6);
        if (pinned) tl.to(rail, { x: -i * slide, duration: 0.8, ease: "power2.inOut" }, t + 0.2);
      }
      // A member that has been passed steps back: smaller and paler. The photo is veiled rather than made
      // see-through, so the line behind it never shows through a face.
      if (i < n - 1) {
        tl.fromTo(photo, { scale: 1, "--veil": 0 }, { scale: 0.84, "--veil": 0.5, duration: 0.6, ease: "power1.inOut", immediateRender: false }, i + 0.25)
          .fromTo(info, { opacity: 1 }, { opacity: 0.5, duration: 0.6, immediateRender: false }, i + 0.25);
      }
      // Parallax: the name runs a little ahead of the row.
      tl.fromTo(info[0], { x: -0.06 * i * slide }, { x: -0.06 * (i - n + 1) * slide, duration: n - 1 }, 0);
    });
    shapes.forEach((el, k) => tl.to(el, { x: -(40 + k * 70), duration: n - 1 }, 0));   // brand bars: the slowest layer
    gsap.set(members[0], { "--ring": 0 });
  }

  // Keeps the dots, the arrows and the "current member" in step with the row.
  function sync() {
    if (tl.time() > 0.02) settle();
    const i = Math.round(tl.time());
    if (i === cur) return;
    cur = i;
    members.forEach((m, k) => m.classList.toggle("is-current", k === i));
    dots.forEach((b, k) => b.setAttribute("aria-current", k === i));
    prev.setAttribute("aria-disabled", i === 0);
    next.setAttribute("aria-disabled", i === n - 1);
  }

  /* ---------- Moving ---------- */
  // Pinned: the page has one resting place per member and, when something sits below the deck (the
  // footer), one more at the bottom of the page. Whatever moves the row glides the page scroll from one
  // resting place to another, and the timeline follows the scroll.
  const stopCount = () => n + (ScrollTrigger.maxScroll(window) > st.end + 4 ? 1 : 0);
  const stopAt = (k) => (k < n ? st.start + ((st.end - st.start) * k) / (n - 1) : ScrollTrigger.maxScroll(window));
  const nearest = () => { let best = 0; for (let k = 1, c = stopCount(); k < c; k++) if (Math.abs(stopAt(k) - scrollY) < Math.abs(stopAt(best) - scrollY)) best = k; return best; };
  let aim = -1, glider = null, busyUntil = 0;   // aim: the resting place being glided to, -1 when still
  const halt = () => { if (glider) glider.kill(); glider = null; aim = -1; };
  function glide(k) {
    const pos = { y: scrollY }, to = stopAt(k), duration = Math.min(1.6, 0.4 + (0.3 * Math.abs(to - pos.y)) / (stopAt(1) - stopAt(0)));
    halt();
    aim = k;
    busyUntil = performance.now() + duration * 1000;
    glider = gsap.to(pos, { y: to, duration, ease: "sine.inOut", onUpdate: () => scrollTo(0, pos.y), onComplete: halt });
  }
  // The member the row is on, or on its way to.
  const where = () => (pinMq.matches ? Math.min(n - 1, aim >= 0 ? aim : nearest()) : cur);
  function goto(i) {
    i = Math.max(0, Math.min(n - 1, i));
    settle();
    if (pinMq.matches) glide(i);
    else view.scrollTo({ left: i * geo.slide, behavior: "smooth" });
  }
  // Pinned: one resting place forward or back. False when there is nothing further that way.
  function step(dir) {
    const to = (aim >= 0 ? aim : nearest()) + dir;
    if (to < 0 || to >= stopCount()) return false;
    settle();
    glide(to);
    return true;
  }
  prev.addEventListener("click", () => goto(where() - 1));
  next.addEventListener("click", () => goto(where() + 1));
  dots.forEach((b, i) => b.addEventListener("click", () => goto(i)));
  // Clicking a member at the side, or tabbing to one of their links, brings that member in.
  const bring = (e) => { const i = members.findIndex((m) => m.contains(e.target)); if (i >= 0 && i !== cur) goto(i); };
  track.addEventListener("click", bring);
  track.addEventListener("focusin", bring);

  // Pinned: any scroll, strong or weak, moves exactly one member. The first movement of the wheel or
  // trackpad starts the step; the rest of that gesture (more notches, a trackpad coasting) is swallowed.
  // A new gesture is one that starts after a pause, or speeds up again, once the step has finished.
  let wheel = { t: 0, abs: 0 };
  addEventListener("wheel", (e) => {
    if (!pinMq.matches || !st || e.ctrlKey) return;   // ctrl + wheel zooms the page
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY, abs = Math.abs(d), now = performance.now();
    if (!d) return;
    const fresh = now - wheel.t > 160 || abs > wheel.abs * 1.5 + 2;
    wheel = { t: now, abs };
    // Nothing further that way (the top of the page, or its bottom): leave the event to the browser.
    if (fresh && now >= busyUntil && !step(Math.sign(d))) return;
    e.preventDefault();
  }, { passive: false });
  // The keys: left and right always; pinned, the ones that would scroll the page step like the wheel.
  addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || (e.shiftKey && e.key !== " ")) return;
    const side = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    const down = pinMq.matches && { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, " ": e.shiftKey ? -1 : 1 }[e.key];
    if ((!side && !down) || (e.key === " " && e.target.closest("a, button"))) return;   // space presses a focused button
    const held = e.repeat && performance.now() < busyUntil;   // a held key waits for each step to finish
    if (side) { e.preventDefault(); if (!held) goto(where() + side); }
    else if (held || step(down)) e.preventDefault();
  });
  // Pinned: if the page is left between two members some other way (scrollbar, touch), glide to the nearest.
  ScrollTrigger.addEventListener("scrollEnd", () => {
    if (!pinMq.matches || drag || aim >= 0 || !st || scrollY <= st.start || scrollY >= st.end) return;
    const k = Math.round(st.progress * (n - 1));
    if (Math.abs(scrollY - stopAt(k)) > 2) glide(k);
  });

  // How far the page must scroll (pinned) to move the row by one px.
  const perPx = () => (st.end - st.start) / (n - 1) / geo.slide;
  // Dragging. Touch in swipe mode is left to the browser, which scrolls the strip natively.
  let drag = null, dragged = false;
  view.addEventListener("pointerdown", (e) => { if (e.button || (e.pointerType === "touch" && !pinMq.matches)) return; drag = { x: e.clientX, id: e.pointerId, moved: false }; });
  view.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true;
      settle();
      halt();
      view.setPointerCapture(e.pointerId);
      view.classList.add("is-dragging");
    }
    drag.x = e.clientX;
    if (pinMq.matches) scrollBy(0, -dx * perPx());
    else view.scrollLeft -= dx;
  });
  const drop = () => {
    if (drag && drag.moved) {
      dragged = true;
      setTimeout(() => (dragged = false));   // only the click that ends this drag is swallowed
      view.classList.remove("is-dragging");
      if (!pinMq.matches) goto(Math.round(view.scrollLeft / geo.slide));   // settle on the nearest member
    }
    drag = null;
  };
  view.addEventListener("pointerup", drop);
  view.addEventListener("pointercancel", drop);
  // A drag that ends on a link must not open it.
  view.addEventListener("click", (e) => { if (dragged) { e.preventDefault(); e.stopPropagation(); } dragged = false; }, true);

  /* ---------- Hints that the row moves ---------- */
  // Ends the opening animation and the nudge as soon as the visitor does anything.
  function settle() {
    if (!intro && !nudge) return;
    if (intro) intro.kill();
    if (nudge) nudge.kill();
    intro = nudge = null;
    gsap.to(track, { x: 0, duration: 0.2 });
  }
  function hint() {
    // The line draws in from the left when the page opens...
    intro = gsap.fromTo(state, { l: 0 }, { l: geo.rest[0], duration: 1, ease: "power2.out", onUpdate: draw });
    // ...and if nothing has been touched after a moment, the row slides a little and comes back, once.
    nudge = gsap.timeline({ delay: 2.4, onComplete: () => (nudge = null) })
      .to(track, { x: -40, duration: 0.45, ease: "power2.inOut" })
      .to(track, { x: 0, duration: 0.6, ease: "power2.out" });
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach((type) => addEventListener(type, settle, { once: true, passive: true }));
  }

  /* ---------- Build (and rebuild when the layout changes) ---------- */
  let ctx = null, geo = null;
  function build() {
    halt();
    if (ctx) ctx.revert();
    cur = -1;
    geo = plan();
    ctx = gsap.context(animate);
    sync();
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
  pinMq.addEventListener("change", build);
  build();
  if (tl.time() < 0.02) hint();
  window.DEFIRO_DECK = true;   // team.html falls back to the plain grid if this never gets set
})();
