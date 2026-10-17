/* agent.js — "Volt", the hologram AI guide
   - follows your cursor, docks beside whichever section you hover, looks up & comments
   - blue flame in Sleep (dark) mode, yellow flame in Work (light) mode — expression changes too
   - click it (or the "Ask Volt" button, or press "/") to chat: it understands requests and DRIVES the site
     (scroll to sections, open projects, switch theme, play music, download resume, run a guided tour)
   Edit comments & greeting in js/data.js → agent. Edit the "brain" (intents) at the bottom of this file. */
(function () {
  const { $, $$, clamp, lerp, icon, data: D, reduced } = App;
  const cfg = D.agent, NAME = cfg.name;
  const hasMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const W = 92, H = 116;

  /* ---------------------------------------------------------------- DOM */
  const root = document.createElement('div');
  root.id = 'agent';
  root.innerHTML = `
    <div class="agent-body" id="agentBody" role="button" tabindex="0" aria-label="Open ${NAME}, the AI guide">
      <div class="agent-bubble" id="agentBubble" aria-live="polite"></div>
      <div class="agent-holo">
        <svg class="agent-svg" viewBox="0 -34 200 284" aria-hidden="true">
          <defs>
            <path id="agOuter" d="M100 14 C121 42 152 66 168 106 C186 150 168 204 100 212 C34 216 12 162 34 114 C46 88 68 76 76 52 C80 36 90 26 100 14Z"/>
            <clipPath id="agClip"><use href="#agOuter"/></clipPath>
            <pattern id="agScan" width="10" height="6" patternUnits="userSpaceOnUse"><rect width="10" height="1.6" fill="#fff" opacity=".28"/></pattern>
          </defs>
          <g class="flame">
            <use href="#agOuter" class="fl-outer"/>
            <g clip-path="url(#agClip)"><rect class="scan" x="0" y="-40" width="200" height="300" fill="url(#agScan)"/></g>
            <path class="fl-mid" d="M100 62 C112 88 140 102 150 134 C160 168 142 198 100 200 C60 202 42 172 52 140 C60 114 84 104 100 62Z"/>
            <path class="fl-core" d="M100 110 C128 108 148 134 144 164 C140 192 116 202 98 200 C70 198 54 178 58 152 C62 126 80 112 100 110Z"/>
            <g class="face" id="agFace">
              <g class="eyes">
                <ellipse class="eye-dot" cx="83" cy="158" rx="4" ry="5.5"/><ellipse class="eye-dot" cx="117" cy="158" rx="4" ry="5.5"/>
                <path class="eye-arc" d="M76 161 Q83 151 90 161"/><path class="eye-arc" d="M110 161 Q117 151 124 161"/>
              </g>
              <ellipse class="cheek" cx="71" cy="173" rx="7" ry="4"/><ellipse class="cheek" cx="129" cy="173" rx="7" ry="4"/>
              <g class="mouth"><path class="m-calm" d="M92 175 Q100 183 108 175"/><path class="m-happy" d="M90 172 Q100 193 110 172Z"/></g>
            </g>
          </g>
          <ellipse class="drop d1" cx="100" cy="-14" rx="15" ry="9"/>
          <ellipse class="drop d2" cx="70" cy="-2" rx="4" ry="6"/>
          <ellipse class="drop d3" cx="134" cy="-20" rx="3.5" ry="5"/>
        </svg>
      </div>
      <div class="agent-base"><i></i><i></i></div>
    </div>`;
  document.body.appendChild(root);
  const body = $('#agentBody'), bubble = $('#agentBubble'), holo = $('.agent-holo', root), face = $('#agFace');

  const fab = document.createElement('button');
  fab.className = 'agent-fab glass'; fab.id = 'agentFab';
  fab.innerHTML = `<span class="fab-dot"></span><span>Ask ${NAME}</span><kbd>/</kbd>`;
  document.body.appendChild(fab);

  const panel = document.createElement('section');
  panel.className = 'agent-panel glass'; panel.setAttribute('aria-label', `${NAME} AI guide chat`);
  panel.innerHTML = `
    <div class="ap-head"><span class="ap-av"></span><div><b>${NAME}</b><small>AI guide · I can navigate for you</small></div><button class="ap-x" aria-label="Close chat">×</button></div>
    <div class="ap-msgs" role="log" aria-live="polite"></div>
    <div class="ap-chips"></div>
    <form class="ap-form"><input type="text" placeholder="Try: “show me projects”, “dark mode”, “tour”…" autocomplete="off" aria-label="Message ${NAME}"/><button aria-label="Send">${icon('send')}</button></form>`;
  document.body.appendChild(panel);
  const msgs = $('.ap-msgs', panel), chipsEl = $('.ap-chips', panel), form = $('.ap-form', panel), input = $('input', form);

  /* ---------------------------------------------------------------- state */
  let x = innerWidth - W - 40, y = innerHeight - H - 110, tx = x, ty = y;
  let mode = 'follow', dockSec = null, dockPt = null, dockedFor = null, frozen = false, chatOpen = false, tour = null;
  let vx = 0, mood = '', headup = false;
  const lastSaid = {};

  /* ---------------------------------------------------------------- speech bubble */
  let sayT, typeI;
  function say(text, ms) {
    clearTimeout(sayT); clearInterval(typeI);
    bubble.textContent = ''; bubble.classList.add('show'); root.classList.add('talking');
    let i = 0;
    typeI = setInterval(() => {
      bubble.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(typeI); root.classList.remove('talking'); }
    }, 16);
    sayT = setTimeout(() => { bubble.classList.remove('show'); headup = false; root.classList.remove('headup'); }, ms || Math.max(4200, text.length * 62));
  }
  function setMood(m, ms) {
    root.classList.remove('mood-wow', 'mood-think'); if (m) root.classList.add('mood-' + m);
    if (m && ms) setTimeout(() => root.classList.remove('mood-' + m), ms);
  }
  function lookUp(on) { headup = on; root.classList.toggle('headup', on); }

  /* ---------------------------------------------------------------- docking */
  function dockTarget(id) {
    const sec = document.getElementById(id), a = sec && sec.querySelector('[data-agent-anchor]');
    if (!a) return null;
    const r = a.getBoundingClientRect();
    if (r.bottom < 70 || r.top > innerHeight - 90) return null;
    let px = r.right + 18;
    if (px + W > innerWidth - 8) px = r.left - W - 18;
    if (px < 8) px = clamp(r.right - W - 6, 8, innerWidth - W - 8);
    return { x: px, y: clamp(r.top + r.height / 2 - H / 2, 76, innerHeight - H - 14) };
  }
  function dockFor(id, comment) {
    if (!dockTarget(id)) return;
    mode = 'dock'; dockSec = id; dockedFor = id; dockPt = { x: App.pointer.x, y: App.pointer.y };
    lookUp(true);
    const now = performance.now();
    if (comment !== false && cfg.sections[id] && (!lastSaid[id] || now - lastSaid[id] > 25000)) { lastSaid[id] = now; say(cfg.sections[id]); }
  }
  App.agent = { say, dockFor, setMood };

  /* hover detection → dock beside the section the cursor dwells on */
  let hoverId = null, ticks = 0;
  setInterval(() => {
    if (!hasMouse || chatOpen || tour || !App.pointer.moved) return;
    if (performance.now() - App.pointer.last > 12000) return;
    const el = document.elementFromPoint(App.pointer.x, App.pointer.y);
    const sec = el && el.closest && el.closest('[data-section]');
    const id = sec ? sec.id : null;
    if (id !== hoverId) { hoverId = id; ticks = 0; return; }
    if (++ticks === 3 && id && id !== dockedFor) dockFor(id);
  }, 200);
  /* touch devices (no cursor): comment as you scroll into each section */
  App.bus.addEventListener('sectionchange', (e) => {
    if (hasMouse || chatOpen || tour) return;
    const id = e.detail, now = performance.now();
    if (cfg.sections[id] && (!lastSaid[id] || now - lastSaid[id] > 30000)) { lastSaid[id] = now; lookUp(true); say(cfg.sections[id]); }
  });

  body.addEventListener('pointerenter', () => (frozen = true));
  body.addEventListener('pointerleave', () => (frozen = false));

  /* ---------------------------------------------------------------- motion loop */
  const looks = { x: 0, y: 0 };
  function frame(now) {
    requestAnimationFrame(frame);
    const idle = hasMouse && App.pointer.moved && now - App.pointer.last > 14000;
    if (chatOpen) {
      const r = panel.getBoundingClientRect();
      tx = innerWidth < 700 ? -200 : r.left - W - 4; ty = innerWidth < 700 ? -200 : r.top + 30;
    } else if (!hasMouse || !App.pointer.moved) {
      tx = innerWidth - W - 24 - Math.sin(now / 900) * 4; ty = innerHeight - H - (innerWidth < 1100 ? 130 : 96) + Math.sin(now / 700) * 6;
    } else if (mode === 'dock') {
      const d = dockTarget(dockSec);
      if (d) { tx = d.x; ty = d.y; } else { mode = 'follow'; lookUp(false); }
      if (!tour && dockPt && Math.hypot(App.pointer.x - dockPt.x, App.pointer.y - dockPt.y) > 280) { mode = 'follow'; lookUp(false); }
    } else if (idle) {
      tx = innerWidth - W - 30 + Math.sin(now / 1200) * 18; ty = innerHeight - H - 100 + Math.cos(now / 900) * 12;
    } else if (!frozen) {
      tx = clamp(App.pointer.x + 52, 8, innerWidth - W - 8); ty = clamp(App.pointer.y + 34, 72, innerHeight - H - 8);
    }
    const k = reduced ? 1 : mode === 'dock' ? 0.075 : 0.09;
    const nx = lerp(x, tx, k), ny = lerp(y, ty, k);
    vx = lerp(vx, nx - x, 0.3); const vy = ny - y; x = nx; y = ny;
    body.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    const speed = Math.hypot(vx, vy), stretch = clamp(speed / 30, 0, 0.3);
    holo.style.transform = `rotate(${clamp(vx * 1.4, -20, 20).toFixed(1)}deg) scale(${(1 - stretch * 0.3).toFixed(3)},${(1 + stretch * 0.45).toFixed(3)})`;
    /* eyes follow the cursor */
    const cx = x + W / 2, cy = y + H * 0.62;
    const lx = clamp((App.pointer.x - cx) / 30, -5, 5), ly = headup ? -5 : clamp((App.pointer.y - cy) / 30, -4, 4);
    looks.x = lerp(looks.x, lx, 0.2); looks.y = lerp(looks.y, ly, 0.2);
    face.style.transform = `translate(${looks.x.toFixed(2)}px,${looks.y.toFixed(2)}px)`;
    /* bubble placement keeps it on-screen */
    if (bubble.classList.contains('show')) {
      const bw = bubble.offsetWidth, bh = bubble.offsetHeight;
      bubble.style.left = clamp(x + W / 2 - bw / 2, 10, innerWidth - bw - 10) - x + 'px';
      root.classList.toggle('below', y < bh + 84);
    }
  }
  requestAnimationFrame(frame);
  /* blink */
  (function blink() { root.classList.add('blink'); setTimeout(() => root.classList.remove('blink'), 140); setTimeout(blink, 2600 + Math.random() * 3200); })();

  /* ---------------------------------------------------------------- reactions */
  App.bus.addEventListener('themechange', (e) => {
    setMood('wow', 900);
    if (!chatOpen) say(e.detail === 'dark' ? 'Sleep mode — night-blue glow on. I feel calm.' : 'Work mode — sunny yellow and wide awake!', 3200);
  });
  App.bus.addEventListener('musicchange', (e) => {
    if (chatOpen || tour) return;
    say(e.detail ? 'Music on! Swap assets/audio/music.mp3 with your own track.' : 'Music paused.', 3000);
  });

  /* ---------------------------------------------------------------- chat UI */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function addMsg(html, who) {
    const m = document.createElement('div'); m.className = 'msg ' + who; m.innerHTML = html; msgs.appendChild(m);
    msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' }); return m;
  }
  async function bot(html, delay = 520) {
    const t = addMsg('<span class="dots"><i></i><i></i><i></i></span>', 'bot'); setMood('think');
    root.classList.add('talking'); await sleep(delay);
    t.innerHTML = html; root.classList.remove('talking'); setMood('');
    msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });
  }
  function setChips(list) {
    chipsEl.innerHTML = list.map((c) => `<button type="button" data-q="${App.esc(c[1] || c[0])}">${c[0]}</button>`).join('');
  }
  const DEFAULT_CHIPS = [['🧭 Take the tour', 'tour'], ['Projects', 'show projects'], ['Experience', 'show experience'], ['Achievements', 'achievements'], ['Toggle theme', 'switch theme'], ['Play music', 'play music'], ['Resume', 'resume'], ['Contact', 'contact']];
  function openPanel() {
    if (chatOpen) return;
    chatOpen = true; panel.classList.add('open'); fab.classList.add('hide'); root.classList.add('chat'); lookUp(false);
    bubble.classList.remove('show');
    if (!msgs.children.length) {
      bot(`Hi! I'm <b>${NAME}</b>, Sayan's AI guide. I can <b>take you anywhere</b> on this site, open projects, switch Sleep/Work mode, play music or run a guided tour. What would you like?`, 400);
      setChips(DEFAULT_CHIPS);
    }
    setTimeout(() => input.focus({ preventScroll: true }), 350);
  }
  function closePanel() { chatOpen = false; panel.classList.remove('open'); fab.classList.remove('hide'); root.classList.remove('chat'); }
  fab.addEventListener('click', openPanel);
  body.addEventListener('click', () => { setMood('wow', 700); openPanel(); });
  body.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(); } });
  $('.ap-x', panel).addEventListener('click', closePanel);
  addEventListener('keydown', (e) => {
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); chatOpen ? closePanel() : openPanel(); }
    if (e.key === 'Escape') { if (chatOpen) closePanel(); stopTour(); }
  });
  chipsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ask(b.dataset.q, b.textContent); });
  form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value.trim(); if (v) { input.value = ''; ask(v); } });

  /* ---------------------------------------------------------------- tour (agentic multi-step) */
  function stopTour() { if (tour) { tour.stopped = true; tour = null; mode = 'follow'; lookUp(false); } }
  ['wheel', 'touchstart'].forEach((ev) => addEventListener(ev, () => { if (tour) { stopTour(); say('Tour paused — you have the controls. Ask me to resume any time.', 3500); } }, { passive: true }));
  async function startTour() {
    stopTour(); const t = (tour = { stopped: false });
    closePanel(); await sleep(450);
    const wait = async (ms) => { await sleep(ms); return !t.stopped; };
    const order = ['home', 'about', 'education', 'experience', 'projects', 'achievements', 'hobbies', 'contact'];
    for (const id of order) {
      if (t.stopped) return;
      await App.goto(id); if (t.stopped) return;
      await sleep(350); dockFor(id, false); lookUp(true);
      if (id === 'projects') {
        say(cfg.sections.projects, 4200); if (!(await wait(1600))) return;
        for (let i = 0; i < D.projects.length; i++) {
          await App.arcGoto(i); if (t.stopped) return;
          say(`${i + 1}/${D.projects.length}: ${D.projects[i].title} — ${D.projects[i].summary}`, 3600);
          if (!(await wait(2600))) return;
        }
      } else if (id === 'achievements') {
        say(cfg.sections.achievements, 4200); if (!(await wait(1500))) return;
        await App.gotoProgress('achievements', 0.96, 9000); if (t.stopped) return;
        if (!(await wait(900))) return;
      } else {
        say(cfg.sections[id], 5200);
        if (!(await wait(id === 'experience' ? 4600 : 4200))) return;
      }
    }
    if (t.stopped) return;
    tour = null; mode = 'follow'; lookUp(false);
    say('That’s the tour! Tap me any time if you want to look something up.', 5000);
  }

  /* ---------------------------------------------------------------- the "brain": intent → action */
  const PROJECT_KEYS = [/arduino|\bcar\b|robo/, /location|esp32|track|gps/, /raspberry|virtual|\bpi\b|mobaxterm/, /heart|health|monitor|biomed/, /\bev\b|pfc|charging|power factor|converter/];
  const SECTIONS = [
    ['home', /\b(home|top|start|beginning|hero|welcome)\b/],
    ['about', /\b(about|who|bio|story|yourself|introduc)/],
    ['education', /(educat|school|college|study|studied|degree|cgpa|marks|universit|b\.?tech)/],
    ['experience', /(experience|intern|training|career|siemens|c&s|company|mechatronic|job)/],
    ['projects', /(project|built|build|made|prototype)/],
    ['achievements', /(achiev|award|certif|scholar|\bwins?\b|honou?r|medal|gallery)/],
    ['hobbies', /(hobb|interest|free time|passion|beyond)/],
    ['contact', /(contact|hire|email|mail|phone|call|reach|message|connect|talk to)/]
  ];
  const label = (id) => ({ home: 'the top', about: 'About', education: 'Education', experience: 'Experience', projects: 'Projects', achievements: 'Achievements', hobbies: 'Hobbies', contact: 'Contact' }[id]);
  async function go(id, say_) {
    await bot(say_ || `Taking you to <b>${label(id)}</b> →`, 380);
    closeIfNarrow(); await App.goto(id); await sleep(300); dockFor(id);
  }
  function closeIfNarrow() { if (innerWidth < 760) closePanel(); }

  async function ask(text, shown) {
    const q = text.toLowerCase().trim();
    addMsg(App.esc(shown || text), 'me'); chipsEl.innerHTML = '';
    let handled = true;

    if (/^(hi|hello|hey|yo|namaste|hola)\b/.test(q)) await bot(`Hey there! I can guide you around — try “<b>tour</b>”, “<b>projects</b>” or “<b>dark mode</b>”.`);
    else if (/thank/.test(q)) await bot('Anytime! ⚡');
    else if (/\b(tour|guide me|walk me|show me around|explore|overview|surprise)\b/.test(q)) { await bot('Great — buckle up! I’ll walk you through everything. Scroll or press Esc to stop me.', 400); startTour(); return; }
    else if (/\b(stop|pause)\b.*\btour\b|^stop$/.test(q)) { stopTour(); await bot('Tour stopped.'); }
    else if (/(resume|\bcv\b|download)/.test(q)) {
      await bot(`Here’s the résumé — <a class="ap-link" href="${D.links.resume}" download>${icon('download')} Download PDF</a>`);
    }
    else if (/(music|song|sound|audio|play|pause|mute)/.test(q)) {
      const on = App.music.toggle(); await bot(on ? 'Music <b>on</b> 🎵 (replace <code>assets/audio/music.mp3</code> with your own track).' : 'Music <b>paused</b>.');
    }
    else if (/(dark|night|sleep|moon)/.test(q)) { await bot('Switching to <b>Sleep</b> (dark) mode 🌙'); App.setTheme('dark'); }
    else if (/(light|\bday\b|work mode|sunny|bright|white|yellow)/.test(q)) { await bot('Switching to <b>Work</b> (light) mode ☀️'); App.setTheme('light'); }
    else if (/(theme|mode|switch|toggle)/.test(q)) { await bot('Flipping the theme!'); App.toggleTheme(); }
    else if (/(linkedin)/.test(q)) {
      await bot(`Sayan’s LinkedIn: <a class="ap-link" href="${D.links.linkedin}" target="_blank" rel="noopener">${icon('linkedin')} Open profile</a>`);
    }
    else if (/(skill|tech stack|tools|know|language|programming|good at)/.test(q)) {
      const s = D.about.skills.map((g) => `<b>${g.group}:</b> ${g.items.slice(0, 5).join(', ')}`).join('<br>');
      await bot(`Here’s the snapshot:<br>${s}`, 600); await sleep(400); App.goto('about'); closeIfNarrow();
    }
    else {
      const pi = PROJECT_KEYS.findIndex((re) => re.test(q));
      if (pi >= 0 && !/\b(projects|show projects)\b/.test(q)) {
        const p = D.projects[pi];
        await bot(`<b>${p.title}</b> — ${p.summary}<br><small>${p.stack.join(' · ')}</small>`, 450);
        closeIfNarrow(); await App.arcGoto(pi); dockFor('projects', false);
      } else {
        const hit = SECTIONS.find(([, re]) => re.test(q));
        if (hit) await go(hit[0]);
        else handled = false;
      }
    }
    if (!handled) await bot(`Hmm, I’m not sure about that one. I can <b>navigate</b> (About, Education, Experience, Projects, Achievements, Hobbies, Contact), open a specific project, change theme, play music or give a <b>tour</b>.`);
    setChips(DEFAULT_CHIPS);
  }

  /* ---------------------------------------------------------------- hello */
  setTimeout(() => { if (!chatOpen && !tour) { lookUp(true); say(cfg.greeting, 7000); } }, 1800);
  setTimeout(() => { if (!chatOpen && !tour && App.section() === 'home') say('Psst — flip the Sleep / Work switch at the top right!', 4200); }, 14000);
})();
