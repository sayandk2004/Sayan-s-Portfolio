/* effects.js — all interactive visual effects */
(function () {
  const { $, $$, clamp, lerp, icon, data: D, reduced, esc, pad } = App;

  /* ======================= reveal + counters ======================= */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(count);
  }), { threshold: 0.15 });
  $$('[data-reveal]').forEach((el) => io.observe(el));
  function count(el) {
    const to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, t0 = performance.now(), ms = 1500;
    (function f(now) {
      const t = clamp((now - t0) / ms, 0, 1), e = 1 - Math.pow(1 - t, 3);
      el.textContent = (to * e).toFixed(dec);
      if (t < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ======================= HERO ======================= */
  (function hero() {
    const hero = $('#home');
    /* typed role */
    const typed = $('#typed'); let ti = 0, ci = 0, del = false;
    (function type() {
      const w = D.taglines[ti];
      typed.textContent = w.slice(0, ci);
      if (!del && ci === w.length) { del = true; return setTimeout(type, 1600); }
      if (del && ci === 0) { del = false; ti = (ti + 1) % D.taglines.length; }
      ci += del ? -1 : 1;
      setTimeout(type, del ? 28 : 70);
    })();

    /* profile: video OR step-by-step image frames */
    const box = $('#profileImg'), cfg = D.hero.frames;
    if (D.hero.video) {
      const v = document.createElement('video');
      v.src = D.hero.video; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute('playsinline', ''); box.appendChild(v); v.play().catch(() => {});
    } else {
      const urls = Array.from({ length: cfg.count }, (_, i) => `${cfg.folder}${cfg.prefix}${String(i + cfg.start).padStart(cfg.pad, '0')}.${cfg.ext}`);
      const img = document.createElement('img'); img.alt = D.name; img.draggable = false; box.appendChild(img);
      const ok = [];
      let loaded = 0;
      urls.forEach((u, i) => {
        const im = new Image();
        im.onload = () => { ok[i] = u; if (ok.filter(Boolean).length === 1) img.src = u; done(); };
        im.onerror = done; im.src = u;
      });
      function done() { loaded++; }
      let fi = 0, acc = 0, last = performance.now(), visible = true;
      new IntersectionObserver((e) => (visible = e[0].isIntersecting)).observe(hero);
      (function tick(now) {
        requestAnimationFrame(tick);
        const dt = now - last; last = now;
        if (!visible || document.hidden) return;
        acc += dt;
        if (acc >= 1000 / cfg.fps) {
          acc = 0;
          const list = ok.filter(Boolean);
          if (list.length > 1) { fi = (fi + 1) % list.length; img.src = list[fi]; }
        }
      })(last);
    }

    /* click profile = music */
    $('#profileBtn').addEventListener('click', () => App.music.toggle());

    /* orbit wheel */
    const ring = $('#orbitRing'); let ang = 0, hover = false, last = performance.now(), vis = true;
    ring.addEventListener('pointerenter', () => (hover = true));
    ring.addEventListener('pointerleave', () => (hover = false));
    new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(hero);
    (function spin(now) {
      requestAnimationFrame(spin);
      const dt = Math.min(now - last, 50); last = now;
      if (!vis) return;
      if (!hover && !reduced) ang += dt * 0.0042;
      ring.style.transform = `rotate(${ang + scrollY * 0.04}deg)`;
    })(last);

    /* title parallax */
    const stage = $('.hero-stage');
    addEventListener('pointermove', (e) => {
      if (!vis) return;
      const x = (e.clientX / innerWidth - 0.5), y = (e.clientY / innerHeight - 0.5);
      stage.style.setProperty('--px', x.toFixed(3)); stage.style.setProperty('--py', y.toFixed(3));
    }, { passive: true });
  })();

  /* ======================= EDUCATION timeline fill ======================= */
  (function timeline() {
    const tl = $('#timeline'), fill = $('#tlFill'), items = $$('.tl-item');
    function f() {
      const r = tl.getBoundingClientRect();
      const p = clamp((innerHeight * 0.6 - r.top) / r.height, 0, 1);
      fill.style.transform = `scaleY(${p})`;
      items.forEach((it) => it.classList.toggle('passed', it.getBoundingClientRect().top < innerHeight * 0.6));
    }
    addEventListener('scroll', f, { passive: true }); f();
  })();

  /* ======================= EXPERIENCE carousel ======================= */
  (function carousel() {
    const track = $('#carTrack'), cs = $$('.car-card', track), dots = $$('#carDots i');
    let active = 0;
    function update() {
      const r = track.getBoundingClientRect(), cx = r.left + r.width / 2;
      let best = 1e9;
      cs.forEach((c, i) => {
        const cr = c.getBoundingClientRect(), d = (cr.left + cr.width / 2 - cx) / (cr.width * 1.05);
        const a = Math.min(Math.abs(d), 2);
        c.style.transform = `scale(${1 - a * 0.1}) rotateY(${clamp(d, -2, 2) * -9}deg)`;
        c.style.opacity = 1 - a * 0.32;
        c.style.filter = a > 0.55 ? `blur(${Math.min(a * 1.6, 3)}px) saturate(.8)` : 'none';
        if (Math.abs(d) < best) { best = Math.abs(d); active = i; }
      });
      cs.forEach((c, i) => c.classList.toggle('active', i === active));
      dots.forEach((d, i) => d.classList.toggle('on', i === active));
    }
    const center = (i) => track.scrollTo({ left: cs[i].offsetLeft - (track.clientWidth - cs[i].offsetWidth) / 2, behavior: 'smooth' });
    track.addEventListener('scroll', update, { passive: true });
    $('#carPrev').onclick = () => center(clamp(active - 1, 0, cs.length - 1));
    $('#carNext').onclick = () => center(clamp(active + 1, 0, cs.length - 1));
    dots.forEach((d, i) => (d.onclick = () => center(i)));
    /* mouse drag */
    let down = false, sx = 0, sl = 0, moved = 0;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.target.closest('a,button')) return;
      down = true; sx = e.clientX; sl = track.scrollLeft; moved = 0; track.classList.add('drag');
    });
    addEventListener('pointermove', (e) => { if (!down) return; moved = e.clientX - sx; track.scrollLeft = sl - moved; });
    addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('drag'); center(active); });
    addEventListener('resize', update);
    update();
    new ResizeObserver(update).observe(track);
  })();

  /* ======================= PROJECTS 3D ribbon ======================= */
  (function arc() {
    const wrap = $('#projects'), ring = $('#arcRing'), cards = $$('.arc-card', ring), n = cards.length;
    const dots = $$('#arcDots button');
    const STEP = 31;
    let cur = 0, shown = -1, vis = false;
    new IntersectionObserver((e) => (vis = e[0].isIntersecting), { rootMargin: '100px' }).observe(wrap);
    function R() { return innerWidth < 800 ? 420 : 720; }
    function target() {
      const r = wrap.getBoundingClientRect();
      return clamp(-r.top / (wrap.offsetHeight - innerHeight), 0, 1);
    }
    function setInfo(i) {
      const p = D.projects[i];
      $('#arcIdx').textContent = pad(i + 1);
      $('#arcTitle').textContent = p.title; $('#arcSum').textContent = p.summary;
      $('#arcTags').innerHTML = p.stack.map((t) => `<span>${esc(t)}</span>`).join('');
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      const now = $('.arc-now'); now.classList.remove('swap'); void now.offsetWidth; now.classList.add('swap');
    }
    (function frame() {
      requestAnimationFrame(frame);
      if (!vis) return;
      cur = lerp(cur, target(), reduced ? 1 : 0.1);
      const theta = cur * (n - 1) * STEP, r = R();
      ring.style.transform = `translateZ(${-r}px) rotateX(${theta}deg)`;
      let idx = Math.round(cur * (n - 1));
      cards.forEach((c, i) => {
        const dist = Math.abs(theta - i * STEP);
        c.style.transform = `rotateX(${-i * STEP}deg) translateZ(${r}px)`;
        c.style.opacity = clamp(1 - (dist - STEP * 1.1) / (STEP * 1.4), 0, 1);
        c.style.pointerEvents = dist < STEP * 1.6 ? 'auto' : 'none';
        c.classList.toggle('active', i === idx);
      });
      if (idx !== shown) { shown = idx; setInfo(idx); }
    })();
    dots.forEach((d, i) => (d.onclick = () => App.gotoProgress('projects', i / (n - 1))));
    cards.forEach((c, i) => c.addEventListener('click', () => {
      if (i !== shown) return App.gotoProgress('projects', i / (n - 1));
      openProject(i);
    }));
    App.arcGoto = (i) => App.gotoProgress('projects', i / (n - 1));
    function openProject(i) {
      const p = D.projects[i];
      App.modal.open(`
        <img class="m-img" src="${p.image}" alt="" />
        <div class="m-pad">
          <span class="arc-badge ${p.status === 'In progress' ? 'wip' : ''} static">${p.status}</span>
          <h3>${esc(p.title)}</h3>
          <div class="tags">${p.stack.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
          <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          ${p.link ? `<a class="btn btn-primary" href="${p.link}" target="_blank" rel="noopener">${icon('arrow')}<span>View project</span></a>` : ''}
        </div>`);
    }
  })();

  /* ======================= ACHIEVEMENTS 3D tunnel ======================= */
  (function tunnel() {
    const wrap = $('#achievements'), scene = $('#tunScene'), bar = $('#tunBar');
    const A = D.achievements, n = A.length, ZSTEP = 440, Z0 = -1300;
    const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    const items = [];
    const mk = (cls, html) => { const b = document.createElement(cls === 't-card' ? 'button' : 'div'); b.className = cls; b.innerHTML = html || ''; scene.appendChild(b); return b; };
    A.forEach((a, i) => {
      const el = mk('t-card', `<img src="${a.image}" alt="${esc(a.title)}" draggable="false" loading="lazy"/><span>${esc(a.title)}</span>`);
      el.addEventListener('click', () => App.modal.open(`
        <img class="m-img contain" src="${a.image}" alt="" /><div class="m-pad"><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p></div>`));
      items.push({ el, i, z0: Z0 - i * ZSTEP, a: i * 2.39996 + 0.6, rr: 0.62 + rnd(i + 1) * 0.38, rot: (rnd(i + 9) - 0.5) * 16, ty: (rnd(i + 4) - 0.5) * 36, card: true });
    });
    const total = -Z0 + (n - 1) * ZSTEP + 120;
    for (let k = 0; k < 30; k++) {
      const s = 14 + rnd(k + 50) * 34;
      const el = mk('t-bit'); el.style.width = el.style.height = s + 'px';
      el.style.setProperty('--h', Math.floor(rnd(k + 70) * 360));
      items.push({ el, z0: Z0 - rnd(k + 20) * (total + 600), a: rnd(k + 30) * 6.283, rr: 0.4 + rnd(k + 40) * 1.2, rot: rnd(k) * 90, ty: rnd(k + 8) * 60, bit: true });
    }
    let cur = 0, vis = false, W = innerWidth, H = innerHeight;
    new IntersectionObserver((e) => (vis = e[0].isIntersecting), { rootMargin: '200px' }).observe(wrap);
    addEventListener('resize', () => { W = innerWidth; H = innerHeight; });
    let mx = 0, my = 0;
    addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
    let sx = 0, sy = 0;
    (function frame() {
      requestAnimationFrame(frame);
      if (!vis) return;
      const r = wrap.getBoundingClientRect();
      const p = clamp(-r.top / (wrap.offsetHeight - H), 0, 1);
      cur = lerp(cur, p, reduced ? 1 : 0.08);
      const cam = cur * total;
      sx = lerp(sx, mx, 0.06); sy = lerp(sy, my, 0.06);
      scene.style.transform = `rotateY(${sx * 6}deg) rotateX(${-sy * 5}deg)`;
      const rx = W * (W < 700 ? 0.34 : 0.32), ry = H * 0.3;
      items.forEach((it) => {
        const z = it.z0 + cam;
        const x = Math.cos(it.a) * rx * it.rr, y = Math.sin(it.a) * ry * it.rr + it.ty;
        const o = clamp((z + 2700) / 900, 0, 1) * clamp((680 - z) / 380, 0, 1);
        it.el.style.opacity = it.bit ? o * 0.7 : o;
        it.el.style.visibility = o <= 0.01 ? 'hidden' : 'visible';
        it.el.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateY(${(-x / rx) * 14}deg) rotateZ(${it.rot}deg)`;
        if (it.card) it.el.classList.toggle('live', z > -520 && z < 380);
      });
      bar.style.transform = `scaleX(${cur})`;
    })();
  })();

  /* ======================= tilt + magnetic ======================= */
  $$('[data-tilt]').forEach((el) => {
    const k = el.dataset.tilt === 'strong' ? 16 : 5;
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', ((0.5 - y) * k).toFixed(2) + 'deg');
      el.style.setProperty('--ry', ((x - 0.5) * k).toFixed(2) + 'deg');
      el.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
  $$('.btn-mag').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
      el.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
  });

  App.refreshScroll();
})();
