/* render.js — builds all sections from data.js */
(function () {
  const { $, icon, data: D } = App;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const head = (num, eyebrow, title, sub) => `
    <header class="sec-head" data-reveal>
      <span class="eyebrow">${num} <i></i> ${eyebrow}</span>
      <h2 class="sec-title"><span class="title-text" data-agent-anchor>${title}</span></h2>
      ${sub ? `<p class="sec-sub">${sub}</p>` : ''}
    </header>`;
  const splitChars = (t) => [...t].map((c, i) => c === ' ' ? `<span class="ch sp" style="--i:${i}"></span>` : `<span class="ch" style="--i:${i}">${esc(c)}</span>`).join('');

  /* ---------- HERO ---------- */
  const navCards = [
    ['about', '01', 'About'], ['education', '02', 'Education'], ['experience', '03', 'Experience'],
    ['projects', '04', 'Projects'], ['achievements', '05', 'Achievements'], ['hobbies', '06', 'Hobbies'], ['contact', '07', 'Contact']
  ];
  const cards = [];
  navCards.forEach((n, i) => { cards.push({ type: 'nav', n }); cards.push({ type: 'hl', h: D.hero.highlights[i % D.hero.highlights.length] }); });
  const orbit = cards.map((c, i) => {
    const a = (360 / cards.length) * i;
    if (c.type === 'nav')
      return `<button class="o-card o-nav" style="--a:${a}deg;--h:${(i * 26) % 360}" data-go="${c.n[0]}" aria-label="Go to ${c.n[2]}">
        <span class="o-num">${c.n[1]}</span><span class="o-name">${c.n[2]}</span><span class="o-arrow">${icon('arrow')}</span></button>`;
    return `<div class="o-card o-hl" style="--a:${a}deg;--h:${(i * 26) % 360}"><span class="o-k">${esc(c.h.k)}</span><span class="o-v">${esc(c.h.v)}</span></div>`;
  }).join('');

  const hero = `
  <section id="home" class="hero" data-section>
    <div class="hero-video" id="heroVideo"></div>
    <div class="hero-top">
      <span class="mono">WELCOME<br>TO MY</span>
      <span class="mono hero-year">PORTFOLIO · ${new Date().getFullYear()}</span>
    </div>
    <div class="hero-stage">
      <h1 class="hero-title" aria-label="${esc(D.name)}">
        <span class="line line-1"><span class="solid">${splitChars(D.nameLine1)}</span><span class="outline" aria-hidden="true">${splitChars(D.nameLine1)}</span></span>
        <span class="line line-2"><span class="solid">${splitChars(D.nameLine2)}</span><span class="outline" aria-hidden="true">${splitChars(D.nameLine2)}</span></span>
      </h1>
      <button class="profile" id="profileBtn" aria-label="Play or pause music" data-agent-anchor>
        <span class="eq" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</span>
        <span class="profile-ring"></span>
        <span class="profile-img" id="profileImg"></span>
        <span class="profile-hint"><b class="h-off">Tap to play music</b><b class="h-on">Now playing · tap to pause</b></span>
      </button>
    </div>
    <div class="hero-meta">
      <span class="mono">${esc(D.role.toUpperCase())}</span>
      <span class="role-type"><span id="typed"></span><i class="caret"></i></span>
      <span class="mono">${esc(D.location.toUpperCase())}</span>
    </div>
    <div class="orbit" aria-label="Section navigation wheel"><div class="orbit-ring" id="orbitRing">${orbit}</div><span class="orbit-me">ME</span></div>
    <div class="scroll-hint mono" aria-hidden="true"><i></i>SCROLL</div>
  </section>`;

  /* ---------- ABOUT ---------- */
  const about = `
  <section id="about" class="sec about" data-section>
    ${head('01', 'About', 'Who I am')}
    <div class="bento">
      <article class="card glass b-main" data-reveal data-tilt>
        <h3 class="b-title">${D.about.title}</h3>
        ${D.about.paragraphs.map((p) => `<p>${p}</p>`).join('')}
        <div class="btn-row">
          <a class="btn btn-primary btn-mag" href="${D.links.resume}" download>${icon('download')}<span>Download Resume</span></a>
          <a class="btn btn-ghost btn-mag" href="${D.links.linkedin}" target="_blank" rel="noopener">${icon('linkedin')}<span>LinkedIn</span></a>
        </div>
      </article>
      ${D.about.stats.map((s, i) => `
        <article class="card glass b-stat" data-reveal style="--d:${0.08 * (i + 1)}s" data-tilt>
          <span class="stat-num"><span data-count="${s.value}" data-dec="${s.decimals || 0}">0</span>${s.suffix || ''}</span>
          <span class="stat-label">${s.label}</span>
        </article>`).join('')}
      <article class="card glass b-skills" data-reveal>
        <div class="tabs" role="tablist">${D.about.skills.map((g, i) => `<button role="tab" class="tab ${i ? '' : 'on'}" data-tab="${i}">${g.group}</button>`).join('')}</div>
        <div class="tab-panels">${D.about.skills.map((g, i) => `<div class="chips ${i ? '' : 'on'}" data-panel="${i}">${g.items.map((it, k) => `<span class="chip" style="--k:${k}">${it}</span>`).join('')}</div>`).join('')}</div>
        <p class="langs">${icon('compass')} Languages: ${D.about.languages.join(' · ')}</p>
      </article>
    </div>
  </section>`;

  /* ---------- EDUCATION ---------- */
  const education = `
  <section id="education" class="sec edu" data-section>
    ${head('02', 'Education', 'Where I learned')}
    <div class="timeline" id="timeline">
      <div class="tl-line"><i id="tlFill"></i></div>
      ${D.education.map((e, i) => `
        <article class="tl-item ${i % 2 ? 'right' : 'left'}" data-reveal>
          <span class="tl-dot">${icon(e.icon)}</span>
          <div class="card glass tl-card" data-tilt>
            <span class="tl-years mono">${e.years}</span>
            <h3>${e.degree}</h3>
            <p class="tl-school">${e.school}</p>
            <p class="tl-place">${icon('pin')} ${e.place}</p>
            <span class="tl-score">${e.score}</span>
          </div>
        </article>`).join('')}
    </div>
  </section>`;

  /* ---------- EXPERIENCE ---------- */
  const experience = `
  <section id="experience" class="sec exp" data-section>
    <div class="exp-glow" aria-hidden="true"></div>
    ${head('03', 'Experience & Training', 'What I’ve done', 'Drag, swipe or use the arrows — the card in the centre lights up.')}
    <div class="carousel">
      <div class="car-track" id="carTrack">
        ${D.experience.map((x, i) => `
        <article class="car-card glass">
          <div class="car-top"><span class="car-n mono">${pad(i + 1)}</span><span class="car-date">${x.date}</span></div>
          <h3>${x.role}</h3>
          <p class="car-org">${icon('briefcase')} ${x.org} <span>· ${x.place}</span></p>
          <ul>${x.points.map((p) => `<li>${p}</li>`).join('')}</ul>
          <div class="tags">${x.tags.map((t) => `<span>${t}</span>`).join('')}</div>
          <a class="btn btn-ghost btn-sm" href="${x.link}" target="_blank" rel="noopener">${icon('linkedin')}<span>View on LinkedIn</span>${icon('arrow')}</a>
        </article>`).join('')}
      </div>
      <div class="car-ctrl">
        <button class="round glass" id="carPrev" aria-label="Previous">${icon('chevL')}</button>
        <div class="car-dots" id="carDots">${D.experience.map(() => '<i></i>').join('')}</div>
        <button class="round glass" id="carNext" aria-label="Next">${icon('chevR')}</button>
      </div>
    </div>
  </section>`;

  /* ---------- PROJECTS (3D ribbon) ---------- */
  const projects = `
  <section id="projects" class="arc-wrap" data-section style="--n:${D.projects.length}">
    <div class="arc-sticky">
      <div class="arc-info">
        ${head('04', 'Projects', 'Things I built', 'Scroll to roll the ribbon · click a card for details')}
        <div class="arc-now glass">
          <span class="arc-count mono"><b id="arcIdx">01</b> / ${pad(D.projects.length)}</span>
          <h3 id="arcTitle"></h3>
          <p id="arcSum"></p>
          <div class="tags" id="arcTags"></div>
          <div class="arc-dots" id="arcDots">${D.projects.map((_, i) => `<button aria-label="Project ${i + 1}"></button>`).join('')}</div>
        </div>
      </div>
      <div class="arc-stage" aria-label="Project ribbon">
        <div class="arc-tilt"><div class="arc-ring" id="arcRing">
          ${D.projects.map((p, i) => `
            <button class="arc-card" data-i="${i}" aria-label="${esc(p.title)}">
              <img src="${p.image}" alt="" loading="lazy" draggable="false" />
              <span class="arc-label"><b>${pad(i + 1)}</b>${p.title}</span>
              <span class="arc-badge ${p.status === 'In progress' ? 'wip' : ''}">${p.status}</span>
            </button>`).join('')}
        </div></div>
      </div>
    </div>
  </section>`;

  /* ---------- ACHIEVEMENTS (3D tunnel) ---------- */
  const achievements = `
  <section id="achievements" class="tun-wrap" data-section style="--n:${D.achievements.length}">
    <div class="tun-sticky">
      <div class="tun-title">
        <span class="eyebrow">05 <i></i> Achievements</span>
        <h2 class="sec-title"><span class="title-text" data-agent-anchor>Welcome to<br>my wins</span></h2>
        <p class="sec-sub">Scroll to fly through · click a card to zoom in</p>
      </div>
      <div class="tun-scene" id="tunScene"></div>
      <div class="tun-meter"><i id="tunBar"></i></div>
    </div>
  </section>`;

  /* ---------- HOBBIES ---------- */
  const hobbies = `
  <section id="hobbies" class="sec hob" data-section>
    ${head('06', 'Hobbies', 'Beyond the lab')}
    <div class="hob-grid">
      ${D.hobbies.map((h, i) => `
        <article class="hob-tile glass" data-reveal style="--d:${i * 0.07}s;--h:${i * 52}" data-tilt="strong">
          <span class="hob-ic">${icon(h.icon)}</span>
          <h3>${h.title}</h3><p>${h.text}</p><i class="glare"></i>
        </article>`).join('')}
    </div>
  </section>`;

  /* ---------- CONTACT ---------- */
  const contact = `
  <section id="contact" class="sec contact" data-section>
    ${head('07', 'Contact', 'Let’s build<br>something electric')}
    <div class="contact-grid">
      <div class="contact-links" data-reveal>
        <a class="c-link glass btn-mag" href="mailto:${D.email}">${icon('mail')}<span><small>Email</small>${D.email}</span>${icon('arrow')}</a>
        <a class="c-link glass btn-mag" href="tel:${D.phone.replace(/\s/g, '')}">${icon('phone')}<span><small>Phone</small>${D.phone}</span>${icon('arrow')}</a>
        <a class="c-link glass btn-mag" href="${D.links.linkedin}" target="_blank" rel="noopener">${icon('linkedin')}<span><small>LinkedIn</small>sayan-de-karmakar</span>${icon('arrow')}</a>
        ${D.links.github ? `<a class="c-link glass btn-mag" href="${D.links.github}" target="_blank" rel="noopener">${icon('github')}<span><small>GitHub</small>${D.links.github.replace('https://', '')}</span>${icon('arrow')}</a>` : ''}
        <a class="c-link glass btn-mag" href="${D.links.resume}" download>${icon('download')}<span><small>Resume</small>Download PDF</span>${icon('arrow')}</a>
      </div>
      <form class="card glass c-form" id="contactForm" data-reveal>
        <h3>Send a message</h3>
        <label><span>Your name</span><input name="name" required autocomplete="name" placeholder="Jane Doe" /></label>
        <label><span>Your email</span><input name="email" type="email" required autocomplete="email" placeholder="jane@company.com" /></label>
        <label><span>Message</span><textarea name="msg" rows="5" required placeholder="Hi Sayan, …"></textarea></label>
        <button class="btn btn-primary btn-mag" type="submit">${icon('send')}<span>Send via email</span></button>
        <p class="form-note">Opens your email app with the message ready to send.</p>
      </form>
    </div>
    <footer class="foot">
      <span>© ${new Date().getFullYear()} ${D.name}</span>
      <button class="btn btn-ghost btn-sm" data-go="home">${icon('up')}<span>Back to top</span></button>
    </footer>
  </section>`;

  $('#app').innerHTML = hero + about + education + experience + projects + achievements + hobbies + contact;

  /* contact form -> mailto */
  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = `${f.get('msg')}\n\n— ${f.get('name')} (${f.get('email')})`;
    location.href = `mailto:${D.email}?subject=${encodeURIComponent('Portfolio message from ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
  });

  /* skill tabs */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.tab'); if (!t) return;
    const i = t.dataset.tab;
    document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x === t));
    document.querySelectorAll('.chips').forEach((x) => x.classList.toggle('on', x.dataset.panel === i));
  });

  App.esc = esc; App.pad = pad;
})();
