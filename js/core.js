/* core.js — helpers, icons, theme switch, music, nav, smooth-scroll, background, modal */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICONS = {
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    arrow: '<path d="M7 17L17 7"/><path d="M7 7h10v10"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
    award: '<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    graduation: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    chevL: '<path d="M15 18l-6-6 6-6"/>',
    chevR: '<path d="M9 18l6-6-6-6"/>',
    up: '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>',
    play: '<polygon points="6 4 20 12 6 20 6 4"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>'
  };
  const icon = (n, cls = '') =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  const App = (window.App = { $, $$, clamp, lerp, icon, reduced, data: window.PORTFOLIO, bus: new EventTarget() });

  /* ------------------------------------------------------------ THEME */
  const root = document.documentElement;
  const tt = $('#themeToggle');
  function applyTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    tt.setAttribute('aria-checked', String(t === 'dark'));
    App.bus.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  }
  App.setTheme = function (t, x, y) {
    if (t === root.dataset.theme) return;
    if (x == null) { const r = tt.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
    if (!document.startViewTransition || reduced) return applyTheme(t);
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => applyTheme(t));
    vt.ready.then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }
      )
    ).catch(() => {});
  };
  App.toggleTheme = (e) => App.setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', e && e.clientX, e && e.clientY);
  tt.setAttribute('aria-checked', String(root.dataset.theme === 'dark'));
  tt.addEventListener('click', (e) => App.toggleTheme(e.clientX ? e : null));

  /* ------------------------------------------------------------ MUSIC */
  const audio = $('#bgm');
  audio.src = App.data.music;
  audio.loop = true;
  audio.volume = 0.55;
  const musicUI = () => {
    document.body.classList.toggle('music-on', !audio.paused);
    App.bus.dispatchEvent(new CustomEvent('musicchange', { detail: !audio.paused }));
  };
  audio.addEventListener('play', musicUI);
  audio.addEventListener('pause', musicUI);
  App.music = {
    get playing() { return !audio.paused; },
    toggle() {
      if (audio.paused) audio.play().catch(() => {}); else audio.pause();
      return !audio.paused;
    },
    play() { if (audio.paused) audio.play().catch(() => {}); },
    pause() { audio.pause(); }
  };

  /* ------------------------------------------------------------ SCROLL (custom, cancellable) */
  let scrollAnim = null;
  function cancelScroll() { if (scrollAnim) { cancelAnimationFrame(scrollAnim); scrollAnim = null; } }
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((ev) => addEventListener(ev, cancelScroll, { passive: true }));
  App.scrollToY = function (y, ms) {
    cancelScroll();
    const start = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    y = clamp(y, 0, max);
    const dist = y - start;
    if (reduced || Math.abs(dist) < 2) { scrollTo(0, y); return Promise.resolve(); }
    ms = ms || clamp(500 + Math.abs(dist) * 0.25, 600, 1600);
    return new Promise((res) => {
      const t0 = performance.now();
      const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      (function step(now) {
        const t = clamp((now - t0) / ms, 0, 1);
        scrollTo(0, start + dist * ease(t));
        if (t < 1) scrollAnim = requestAnimationFrame(step); else { scrollAnim = null; res(); }
      })(t0);
    });
  };
  App.sectionTop = (id) => { const el = document.getElementById(id); return el ? el.getBoundingClientRect().top + scrollY : 0; };
  App.goto = (id, ms) => App.scrollToY(App.sectionTop(id), ms);
  /* scroll to a progress (0..1) inside a tall sticky section */
  App.gotoProgress = (id, p, ms) => {
    const el = document.getElementById(id); if (!el) return Promise.resolve();
    const top = el.getBoundingClientRect().top + scrollY;
    return App.scrollToY(top + clamp(p, 0, 1) * (el.offsetHeight - innerHeight), ms);
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-link],[data-go]');
    if (!a) return;
    e.preventDefault();
    App.goto(a.dataset.link || a.dataset.go);
  });

  /* ------------------------------------------------------------ SECTION TRACKING + PROGRESS */
  let currentSection = 'home';
  App.section = () => currentSection;
  function onScroll() {
    const bar = $('.scroll-progress i');
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    const mid = innerHeight * 0.5;
    let found = currentSection;
    $$('[data-section]').forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) found = s.id;
    });
    if (found !== currentSection) {
      currentSection = found;
      $$('.nav [data-link]').forEach((a) => a.classList.toggle('active', a.dataset.link === found));
      App.bus.dispatchEvent(new CustomEvent('sectionchange', { detail: found }));
    }
    document.body.classList.toggle('scrolled', scrollY > 40);
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  App.refreshScroll = onScroll;

  /* ------------------------------------------------------------ CURSOR + POINTER */
  App.pointer = { x: innerWidth / 2, y: innerHeight / 2, moved: false, last: 0 };
  const glow = $('.cursor-glow');
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    App.pointer.x = e.clientX; App.pointer.y = e.clientY; App.pointer.moved = true; App.pointer.last = performance.now();
    glow.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
    glow.style.opacity = 1;
  }, { passive: true });

  /* ------------------------------------------------------------ BACKGROUND (electric grid) */
  (function bg() {
    const c = $('#bg'), g = c.getContext('2d');
    let W, H, dpr, nodes = [], pulses = [], running = true;
    const css = () => getComputedStyle(root);
    let col = [111, 92, 255], col2 = [25, 227, 255];
    const readColors = () => {
      const s = css();
      const p = (v) => (v.trim().split(',').map(Number));
      col = p(s.getPropertyValue('--bg-rgb-1')); col2 = p(s.getPropertyValue('--bg-rgb-2'));
    };
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr;
      c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
      const gap = innerWidth < 700 ? 90 : 120;
      nodes = [];
      for (let x = 0; x < innerWidth + gap; x += gap)
        for (let y = 0; y < innerHeight + gap; y += gap)
          nodes.push({ x: x + (Math.random() - .5) * 34, y: y + (Math.random() - .5) * 34, ox: 0, oy: 0 });
      nodes.forEach((n) => { n.ox = n.x; n.oy = n.y; });
    }
    function spawn() {
      if (pulses.length > 14) return;
      const a = nodes[(Math.random() * nodes.length) | 0];
      const b = nodes.filter((n) => n !== a && Math.hypot(n.x - a.x, n.y - a.y) < 190);
      if (!b.length) return;
      pulses.push({ a, b: b[(Math.random() * b.length) | 0], t: 0, s: 0.008 + Math.random() * 0.012 });
    }
    let last = 0;
    function draw(now) {
      if (!running) return;
      requestAnimationFrame(draw);
      if (now - last < 32) return; last = now;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, innerWidth, innerHeight);
      const px = App.pointer.x, py = App.pointer.y;
      const sy = scrollY * 0.12;
      nodes.forEach((n) => {
        const dx = n.ox - px, dy = n.oy - sy * 0 - py, d = Math.hypot(dx, dy);
        const f = d < 160 ? (160 - d) / 160 : 0;
        n.x = n.ox + (dx / (d || 1)) * f * 22; n.y = n.oy + (dy / (d || 1)) * f * 22;
      });
      g.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 150) {
            g.strokeStyle = `rgba(${col},${(1 - d / 150) * 0.16})`;
            g.beginPath();
            // circuit-style right-angle traces
            g.moveTo(a.x, a.y); g.lineTo(b.x, a.y); g.lineTo(b.x, b.y); g.stroke();
          }
        }
        g.fillStyle = `rgba(${col},.35)`;
        g.fillRect(a.x - 1.5, a.y - 1.5, 3, 3);
      }
      if (Math.random() < 0.08) spawn();
      pulses = pulses.filter((p) => {
        p.t += p.s;
        const cx = lerp(p.a.x, p.b.x, Math.min(p.t * 2, 1));
        const cy = p.t < .5 ? p.a.y : lerp(p.a.y, p.b.y, (p.t - .5) * 2);
        g.fillStyle = `rgba(${col2},${1 - p.t})`;
        g.shadowColor = `rgba(${col2},1)`; g.shadowBlur = 10;
        g.beginPath(); g.arc(cx, cy, 2.6, 0, 7); g.fill(); g.shadowBlur = 0;
        return p.t < 1;
      });
    }
    size(); readColors();
    addEventListener('resize', size);
    App.bus.addEventListener('themechange', () => setTimeout(readColors, 30));
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden; if (running) requestAnimationFrame(draw);
    });
    if (!reduced) requestAnimationFrame(draw);
    else { readColors(); }
  })();

  /* ------------------------------------------------------------ MODAL */
  const modal = $('#modal');
  App.modal = {
    open(html) {
      $('.modal-body', modal).innerHTML = html;
      modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    },
    close() {
      modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }
  };
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) App.modal.close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') App.modal.close(); });
})();
