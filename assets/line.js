/* The thick gradient line used on the home, calendar and team pages. Each page works out its own path;
   this file only knows how to show one: a path that can be drawn up to any length, an optional dot at
   its start, and an arrowhead that rides the front end and turns with the curve. It also holds the
   small measuring helpers those pages share. Styled by .flow-line in style.css. */
window.defiroLine = function (host) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "flow-line");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <linearGradient id="lineGrad" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:var(--yellow)"/><stop offset="1" style="stop-color:var(--orange)"/></linearGradient>
    <path class="line-measure"/><path class="line-path" stroke="url(#lineGrad)"/>
    <circle class="line-start" fill="url(#lineGrad)"/><polygon class="line-tip" fill="url(#lineGrad)" stroke="url(#lineGrad)"/>`;
  host.appendChild(svg);
  const get = (s) => svg.querySelector(s);
  const grad = get("linearGradient"), meas = get(".line-measure"), path = get(".line-path"), dot = get(".line-start"), tip = get(".line-tip");
  let d = "", L = 0, w = 12;
  // Runs `fn` with the measuring path set to some other path, then puts the real one back.
  const withPath = (pathData, fn) => { meas.setAttribute("d", pathData); const out = fn(); meas.setAttribute("d", d); return out; };

  return {
    svg,
    get length() { return L; },
    // Length of any path, e.g. the part of the line up to some point.
    measure: (pathData) => withPath(pathData, () => meas.getTotalLength()),
    // True when `pathData` stays at least `pad` px away from every box ({ l, t, r, b }).
    clears: (pathData, boxes, pad) => withPath(pathData, () => {
      for (let l = 0, n = meas.getTotalLength(); l <= n; l += 6) {
        const p = meas.getPointAtLength(l);
        if (boxes.some((b) => p.x > b.l - pad && p.x < b.r + pad && p.y > b.t - pad && p.y < b.b + pad)) return false;
      }
      return true;
    }),
    pointAt: (len) => meas.getPointAtLength(len),
    // First length, looking forward from `from`, where `test(point)` is true. The full length if never.
    lengthWhere(test, from = 0) {
      for (let l = from; l <= L; l += 3) if (test(meas.getPointAtLength(l))) return l;
      return L;
    },
    // pathData: in px of `host`. size: [width, height] of `host`. width: thickness of the line.
    // grad: [x1, y1, x2, y2], yellow to orange. start: { x, y } for the dot, or null for none.
    set(pathData, { size, width, grad: g, start }) {
      d = pathData;
      w = width;
      svg.setAttribute("width", size[0]);
      svg.setAttribute("height", size[1]);
      svg.setAttribute("viewBox", `0 0 ${size[0]} ${size[1]}`);
      ["x1", "y1", "x2", "y2"].forEach((k, i) => grad.setAttribute(k, g[i]));
      path.setAttribute("d", d);
      meas.setAttribute("d", d);
      L = meas.getTotalLength();
      path.style.strokeWidth = w + "px";
      path.style.strokeDasharray = `${L} ${L}`;
      dot.style.display = start ? "" : "none";
      if (start) { dot.setAttribute("cx", start.x); dot.setAttribute("cy", start.y); dot.setAttribute("r", w * 0.85); }
      tip.style.strokeWidth = w * 0.35 + "px";
    },
    // Draws the first `len` px of the line, with the arrowhead at the front, turned along the curve.
    show(len) {
      const l = Math.max(0, Math.min(L, len));
      path.style.strokeDashoffset = L - l;
      const a = meas.getPointAtLength(Math.max(0, l - 2)), b = meas.getPointAtLength(l);
      const n = Math.hypot(b.x - a.x, b.y - a.y) || 1, ux = (b.x - a.x) / n, uy = (b.y - a.y) / n;
      const f = w * 1.5, k = w * 0.6, s = w * 1.05;   // tip ahead of the line end, base behind it, half width
      tip.setAttribute("points", `${b.x + ux * f},${b.y + uy * f} ${b.x - ux * k - uy * s},${b.y - uy * k + ux * s} ${b.x - ux * k + uy * s},${b.y - uy * k - ux * s}`);
      tip.style.opacity = l > 6 ? 1 : 0;
    },
  };
};

// Position of `el` inside `root`, from layout offsets, so transforms (camera, parallax) never skew it.
// `root` must be positioned.
defiroLine.at = (el, root) => {
  let x = 0, y = 0;
  for (let n = el; n && n !== root; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
  return { x, y };
};
defiroLine.centre = (el, root) => {
  const p = defiroLine.at(el, root);
  return { x: p.x + el.offsetWidth / 2, y: p.y + el.offsetHeight / 2 };
};
// One box per line of text inside `el`, relative to `root`. Only valid while nothing is transformed.
defiroLine.textBoxes = (el, root) => {
  const c = root.getBoundingClientRect(), out = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node; (node = walker.nextNode());) {
    const r = document.createRange();
    r.selectNodeContents(node);
    for (const b of r.getClientRects()) if (b.width > 0.5) out.push({ l: b.left - c.left, t: b.top - c.top, r: b.right - c.left, b: b.bottom - c.top });
  }
  return out;
};
// Thickness of the line for the current window: 12px on a laptop, thinner on phones.
defiroLine.width = () => Math.max(7, Math.min(12, 4 + innerWidth * 0.0055));
