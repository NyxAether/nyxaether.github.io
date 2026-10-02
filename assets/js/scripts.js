/* ═══════════════════════════════════════════
   ROMAIN RINCÉ — Professional Website
   ASCII hero field, training cards & modal, theme, reviews log, etc.
   Training data loaded from server-side JSON (Jekyll _data)
   ═══════════════════════════════════════════ */


// ── Training Data Loader (from embedded JSON blob via Jekyll) ──
let TRAININGS = [];

function loadTrainings() {
  const el = document.getElementById('training-data');
  if (!el) {
    console.warn('No training data found.');
    return;
  }
  try {
    const data = JSON.parse(el.textContent);
    // data is an object keyed by filename stem (bda, dlt, …)
    TRAININGS = Object.values(data).map(t => {
      // Normalize category for filtering
      t._category = /agent|générative/i.test(t.category)
        ? 'ia'
        : /python/i.test(t.category)
          ? 'python'
          : /deep learning/i.test(t.category)
            ? 'dl'
            : 'ml';
      return t;
    }).sort((a, b) => a.id.localeCompare(b.id));
  } catch (e) {
    console.warn('Failed to parse training data:', e);
  }
}


// ── Testimonials Loader (random subset picked on each page load) ──
const TESTIMONIALS_SHOWN = 9;
const TESTIMONIALS_SPEED = 28; // px per second
let TESTIMONIALS = [];

function loadTestimonials() {
  const el = document.getElementById('testimonials-data');
  if (!el) return;
  try {
    const data = JSON.parse(el.textContent) || [];
    // Fisher-Yates shuffle
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
    TESTIMONIALS = data.slice(0, TESTIMONIALS_SHOWN);
  } catch (e) {
    console.warn('Failed to parse testimonials data:', e);
  }
}


// ── Reduced Motion ──
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ── ASCII Field Animation (hero background) ──
const ASCII_RAMP = ' .·:-=+*';
const ASCII_VARIANTS = ['drawField', 'drawPlasma', 'drawLife'];

class AsciiField {
  constructor(canvasId) {
    this.canvas = document.querySelector(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mouse = { x: null, y: null };
    this.raf = null;
    this.resizeTimer = null;
    this.cell = 16;
    this.t = 0;
    this.lastFrame = 0;
    this.running = false;
    this.reduced = REDUCED;
    this.init();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = rect.width;
    this.h = rect.height;
    this.cols = Math.ceil(this.w / this.cell) + 1;
    this.rows = Math.ceil(this.h / this.cell) + 1;
    this.life = null;
  }

  readColor() {
    this.color = getComputedStyle(document.documentElement).getPropertyValue('--ascii-ink').trim() || 'rgba(0,0,0,0.2)';
  }

  // Variante tirée au hasard à chaque chargement, jamais deux fois de suite la même
  pickVariant() {
    let last = null;
    try { last = localStorage.getItem('asciiVariant'); } catch (e) {}
    const pool = ASCII_VARIANTS.filter(v => v !== last);
    const v = pool[Math.floor(Math.random() * pool.length)];
    try { localStorage.setItem('asciiVariant', v); } catch (e) {}
    return v;
  }

  readAccent() {
    this.accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7A2E4F';
  }

  put(col, row, ch, accent) {
    this.ctx.fillStyle = accent ? this.accent : this.color;
    this.ctx.globalAlpha = accent ? 0.45 : 1;
    this.ctx.fillText(ch, col * this.cell, row * this.cell);
    this.ctx.globalAlpha = 1;
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;
    this[this.variant]();
  }

  // Mouse position in grid cells, or null
  mouseCell() {
    return this.mouse.x === null ? null : { c: this.mouse.x / this.cell, r: this.mouse.y / this.cell };
  }

  drawPlasma() {
    const { cols, rows, t } = this;
    const m = this.mouseCell();
    const cx = cols / 2, cy = rows / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let v = Math.sin(c * 0.13 + t) + Math.sin(r * 0.3 + t * 1.3)
          + Math.sin((c + r) * 0.1 - t) + Math.sin(Math.hypot((c - cx) * 0.5, r - cy) * 0.5 - t * 1.6);
        if (m) v += Math.max(0, 1 - Math.hypot((c - m.c) * 0.5, r - m.r) / 8) * 3;
        const n = (v + 4) / 8;
        const idx = Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.floor(n * ASCII_RAMP.length)));
        if (idx > 0) this.put(c, r, ASCII_RAMP[idx], idx >= ASCII_RAMP.length - 1);
      }
    }
  }

  lifeSeed() {
    const n = this.cols * this.rows;
    this.life = { g: new Uint8Array(n), age: new Uint8Array(n), still: 0, tick: 0 };
    for (let i = 0; i < n; i++) this.life.g[i] = Math.random() < 0.22 ? 1 : 0;
  }

  lifeStep() {
    const { cols, rows } = this;
    const L = this.life, next = new Uint8Array(L.g.length);
    let pop = 0, diff = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let s = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr || dc) s += L.g[((r + dr + rows) % rows) * cols + (c + dc + cols) % cols];
          }
        }
        const i = r * cols + c;
        const alive = L.g[i] ? (s === 2 || s === 3) : s === 3;
        next[i] = alive ? 1 : 0;
        L.age[i] = alive ? Math.min(255, L.g[i] ? L.age[i] + 1 : 0) : 0;
        pop += next[i];
        if (next[i] !== L.g[i]) diff++;
      }
    }
    L.g = next;
    L.still = diff < 4 ? L.still + 1 : 0;
    if (pop < cols * rows * 0.02 || L.still > 12) this.lifeSeed();
  }

  drawLife() {
    const { cols, rows } = this;
    if (!this.life) this.lifeSeed();
    const m = this.mouseCell();
    if (m) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = Math.floor(m.r) + dr, c = Math.floor(m.c) + dc;
          if (r >= 0 && r < rows && c >= 0 && c < cols && Math.random() < 0.5) this.life.g[r * cols + c] = 1;
        }
      }
    }
    if (!this.reduced && ++this.life.tick % 3 === 0) this.lifeStep();
    const { g, age } = this.life;
    for (let i = 0; i < g.length; i++) {
      if (!g[i]) continue;
      const a = age[i];
      this.put(i % cols, Math.floor(i / cols), a < 1 ? '·' : a < 4 ? 'o' : a < 10 ? 'O' : '@', a < 1);
    }
  }

  drawField() {
    const ctx = this.ctx;
    for (let row = 0; row < this.rows; row++) {
      const y = row * this.cell;
      for (let col = 0; col < this.cols; col++) {
        const x = col * this.cell;

        let v = Math.sin(col * 0.35 + this.t) + Math.cos(row * 0.35 - this.t * 0.8);

        if (this.mouse.x !== null) {
          const dx = x - this.mouse.x;
          const dy = y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) v += (1 - dist / 160) * 2.2;
        }

        // normalize roughly to [0, ramp.length)
        const n = (v + 2.4) / 4.8;
        const idx = Math.max(0, Math.min(ASCII_RAMP.length - 1, Math.floor(n * ASCII_RAMP.length)));
        const ch = ASCII_RAMP[idx];
        if (ch !== ' ') ctx.fillText(ch, x, y);
      }
    }
  }

  loop(now) {
    if (!this.running) return;
    if (now - this.lastFrame >= 50) { // ~20fps
      this.lastFrame = now;
      this.t += 0.05;
      this.draw();
    }
    this.raf = requestAnimationFrame(ts => this.loop(ts));
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(ts => this.loop(ts));
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  init() {
    this.variant = this.pickVariant();
    this.resize();
    this.readColor();
    this.readAccent();

    if (this.reduced) {
      this.draw();
    } else {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !document.hidden) this.start();
          else this.stop();
        });
      }, { threshold: 0.01 });
      observer.observe(this.canvas);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stop();
        else if (this.canvas.getBoundingClientRect().bottom > 0) this.start();
      });
    }

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.resize();
        if (this.reduced || !this.running) this.draw();
      }, 250);
    });

    this.canvas.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    document.addEventListener('themechange', () => {
      this.readColor();
      this.readAccent();
      if (this.reduced || !this.running) this.draw();
    });
  }
}


// ── Helpers ──
function formatPrice(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function getParts(prog) {
  // program may be { parts: [...] } or plain array
  return Array.isArray(prog) ? prog : (prog && prog.parts) || [];
}


// ── Render Training Cards ──
const CATEGORY_LABELS = { python: 'python', ml: 'ml · data-science', dl: 'deep learning', ia: 'ia générative' };

// Two full rows of cards, and never fewer than 3 on a single-column layout
function visibleCardLimit(grid) {
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  return Math.max(cols * 2, 3);
}

function renderCards(filter = 'all') {
  const grid = document.getElementById('formationsGrid');
  if (!grid) return;

  const filtered = filter === 'all' ? TRAININGS : TRAININGS.filter(t => t._category === filter);
  const limit = visibleCardLimit(grid);

  grid.innerHTML = '';

  filtered.forEach((t, idx) => {
    const card = document.createElement('div');
    card.className = 'formation-card';
    card.dataset.cat = t._category;
    card.setAttribute('data-reveal', '');
    card.hidden = idx >= limit;
    card.style.transitionDelay = `${(idx % limit) * 0.06}s`;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${t.title} : voir le programme`);
    card.addEventListener('click', () => openModal(t));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(t); }
    });

    card.innerHTML = `
      <div class="formation-head">
        <span class="formation-id">${t.id}</span>
        <span class="formation-cat">${CATEGORY_LABELS[t._category]}</span>
      </div>
      <div class="formation-body">
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.short)}</p>
        <div class="formation-meta">
          <span><b>--durée=</b>${esc(t.duration)}</span>
          <span><b>--tarif=</b>${formatPrice(t.price)} € HT / pers.</span>
        </div>
        <span class="formation-cta">voir le programme</span>
      </div>
    `;

    grid.appendChild(card);
  });

  updateMoreButton(filtered.length - limit);

  // Re-observe for scroll reveal
  observeRevealElements();
}

function updateMoreButton(hiddenCount) {
  const btn = document.getElementById('formationsMore');
  if (!btn) return;
  btn.hidden = hiddenCount <= 0;
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = hiddenCount === 1
    ? 'afficher 1 autre formation'
    : `afficher les ${hiddenCount} autres formations`;
}

function toggleMoreCards() {
  const grid = document.getElementById('formationsGrid');
  const btn = document.getElementById('formationsMore');
  if (!grid || !btn) return;

  if (btn.getAttribute('aria-expanded') === 'true') {
    // Collapse back to the initial rows and bring the list header into view
    renderCards(document.querySelector('.filter-btn.active')?.dataset.filter);
    document.getElementById('formations')?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
    return;
  }

  grid.querySelectorAll('.formation-card[hidden]').forEach(card => { card.hidden = false; });
  btn.setAttribute('aria-expanded', 'true');
  btn.textContent = 'afficher moins';
  observeRevealElements();
}


// ── Modal ──
let lastFocus = null;  // element to refocus when the modal closes

function openModal(training) {
  const overlay = document.getElementById('modalOverlay');
  const body = document.getElementById('modalBody');
  if (!overlay || !body) return;

  const parts = getParts(training.program);

  body.innerHTML = `
    <h2>${esc(training.title)}</h2>
    <div class="modal-meta">
      <span><strong>Durée :</strong> ${esc(training.duration)}</span>
      <span><strong>Prix :</strong> ${formatPrice(training.price)} € HT / pers.</span>
    </div>

    <div class="modal-section">
      <h3>Description</h3>
      <p>${esc(training.short)}</p>
    </div>

    <div class="modal-section">
      <h3>Objectifs</h3>
      <ul>${Array.isArray(training.objectives) ? training.objectives.map(o => `<li>${esc(o)}</li>`).join('') : ''}</ul>
    </div>

    <div class="modal-section">
      <h3>Public visé</h3>
      <p>${esc(training.audience)}</p>
    </div>

    <div class="modal-section">
      <h3>Prérequis</h3>
      <p>${esc(training.prerequisites)}</p>
    </div>

    <div class="modal-section">
      <h3>Programme détaillé</h3>
      ${parts.map(part => `
        <div class="program-part">
          <h4>${esc(part.title || '')}</h4>
          <ul>${Array.isArray(part.items) ? part.items.map(it => `<li>${esc(it)}</li>`).join('') : ''}</ul>
          ${(part.demo || part.practice) ? `
            <div class="program-highlight">
              ${part.demo ? `<h5>Démonstration</h5><p>${esc(part.demo)}</p>` : ''}
              ${part.practice ? `<h5>Travaux pratiques</h5><p>${esc(part.practice)}</p>` : ''}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;

  lastFocus = document.activeElement;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('trainingModal')?.focus();
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    if (!overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    lastFocus?.focus();
  }
}


// ── Testimonials ──
function renderTestimonials() {
  const log = document.getElementById('testimonialsLog');
  if (!log) return;

  const items = TESTIMONIALS.map(t => `
    <li class="log-entry">
      <div class="log-meta">
        <span class="log-date">[${esc(t.date)}]</span>
        <span class="log-author">${esc(t.author)}</span>
        <span>· ${esc(t.training)} ·</span>
        <span class="log-rating">${Number(t.rating).toFixed(1).replace('.', ',')}/5</span>
      </div>
      <p class="log-comment">${esc(t.comment)}</p>
    </li>
  `).join('');

  // Rendered twice so the scroll can loop seamlessly; the copy is hidden from
  // assistive tech. With reduced motion the single list just scrolls natively.
  log.classList.toggle('static', REDUCED);
  log.innerHTML = REDUCED
    ? `<ol class="log-list">${items}</ol>`
    : `<div class="log-scroll"><ol class="log-list">${items}</ol><ol class="log-list" aria-hidden="true">${items}</ol></div>`;
}

// Scrolls the log upward continuously, like `tail -f`, while the section is
// visible. Hovering or focusing pauses it; on touch screens a tap toggles it.
function initTestimonialLog() {
  const section = document.getElementById('avis');
  const log = document.getElementById('testimonialsLog');
  if (!section || !log) return;
  if (!TESTIMONIALS.length) {
    section.hidden = true;
    return;
  }

  const status = document.getElementById('testimonialsStatus');
  const inner = log.querySelector('.log-scroll');
  if (!inner) {
    status?.remove();
    return;
  }

  const pauses = new Set();
  let pos = 0;
  let last = 0;
  let raf = null;
  let visible = false;

  function setPause(reason, on) {
    if (on) pauses.add(reason);
    else pauses.delete(reason);
    if (status) {
      status.textContent = pauses.size ? 'pause' : 'live';
      status.classList.toggle('paused', pauses.size > 0);
    }
  }

  function frame(now) {
    if (!pauses.size && last) pos += TESTIMONIALS_SPEED * Math.min(now - last, 100) / 1000;
    last = now;
    const loop = inner.firstElementChild.offsetHeight;
    if (loop) pos %= loop;
    inner.style.transform = `translateY(${-pos}px)`;
    raf = requestAnimationFrame(frame);
  }

  function update() {
    if (visible && !document.hidden) {
      if (raf === null) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    } else if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }

  log.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') setPause('hover', true); });
  log.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') setPause('hover', false); });
  log.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') setPause('tap', !pauses.has('tap')); });
  log.addEventListener('focus', () => setPause('focus', true));
  log.addEventListener('blur', () => setPause('focus', false));

  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }, { threshold: 0.1 }).observe(log);

  document.addEventListener('visibilitychange', update);
}


// ── Theme Toggle ──
function initTheme() {
  // data-theme is already set inline in <head> (stored choice, else system preference) to avoid a flash.
  const btn = document.getElementById('themeToggle');
  btn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  });
}


// ── Mobile Menu ──
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');

  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close on link click
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}


// ── Nav scroll effect & active state ──
function initNavScroll() {
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');

  window.addEventListener('scroll', () => {
    // Nav bottom border on scroll
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }

    // Active section highlight
    let current = '';
    for (const sec of sections) {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }, { passive: true });
}


// ── Terminal Effects ──
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeCursor() {
  const span = document.createElement('span');
  span.className = 'cursor';
  span.setAttribute('aria-hidden', 'true');
  return span;
}

// Types text into el character by character, keeping a blinking cursor
// right after the last typed character.
async function typeText(el, text, speed = 20, cursor = null) {
  el.textContent = '';
  el.classList.add('typed');
  if (cursor) el.appendChild(cursor);
  for (const ch of text) {
    if (cursor) cursor.insertAdjacentText('beforebegin', ch);
    else el.textContent += ch;
    await sleep(speed + Math.random() * 20 - 10);
  }
}

// Types out the hero's Statut / Domaines / Lieu values one after another,
// like lines printing in a terminal, with a cursor following the text.
async function initHeroTerminal() {
  const dds = document.querySelectorAll('#heroMeta dd[data-type]');
  if (!dds.length) return;

  if (REDUCED) {
    dds.forEach(dd => dd.classList.add('typed'));
    return;
  }

  const cursor = makeCursor();
  await sleep(250);
  for (const dd of dds) {
    await typeText(dd, dd.textContent, 20, cursor);
    await sleep(80);
  }
  cursor.remove();
}

// Types out each section tag (Compétences, Catalogue, …) the first time it
// scrolls into view, cursor included.
function initSectionTypers() {
  const tags = document.querySelectorAll('.section-tag[data-type]');
  if (!tags.length) return;

  if (REDUCED) {
    tags.forEach(tag => {
      tag.classList.add('typed');
      tag.appendChild(makeCursor());
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tag = entry.target;
        typeText(tag, tag.textContent, 20, makeCursor());
        observer.unobserve(tag);
      }
    });
  }, { threshold: 0.6 });

  tags.forEach(tag => observer.observe(tag));
}


// ── Scroll Reveal ──
function observeRevealElements() {
  const els = document.querySelectorAll('[data-reveal]:not(.revealed)');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}


// ── HTML Escape ──
function esc(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str.replace(/[&<>"'']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
}


// ── Init ──
function init() {
  // ASCII field animation
  new AsciiField('#asciiCanvas');

  // Load training data from embedded JSON (server-side via Jekyll)
  loadTrainings();
  renderCards();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.filter);
    });
  });
  document.getElementById('formationsMore')?.addEventListener('click', toggleMoreCards);

  // Testimonials log
  loadTestimonials();
  renderTestimonials();
  initTestimonialLog();

  // Modal close
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Theme toggle
  initTheme();

  // Mobile menu
  initMobileMenu();

  // Nav scroll effects
  initNavScroll();

  // Scroll reveal
  observeRevealElements();

  // Terminal effect
  initHeroTerminal();
  initSectionTypers();
}

document.addEventListener('DOMContentLoaded', init);