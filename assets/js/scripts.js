/* ═══════════════════════════════════════════
   ROMAIN RINCÉ — Professional Website
   Neural network animation, modals, theme, etc.
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
      t._category = /python/i.test(t.category) ? 'python' : 'ml';
      return t;
    }).sort((a, b) => a.id.localeCompare(b.id));
  } catch (e) {
    console.warn('Failed to parse training data:', e);
  }
}


// ── ASCII Field Animation (hero background) ──
const ASCII_RAMP = ' .·:-=+*';

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
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  }

  readColor() {
    this.color = getComputedStyle(document.documentElement).getPropertyValue('--ascii-ink').trim() || 'rgba(0,0,0,0.2)';
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;

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
    this.resize();
    this.readColor();

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
function renderCards(filter = 'all') {
  const grid = document.getElementById('formationsGrid');
  if (!grid) return;

  const filtered = filter === 'all' ? TRAININGS : TRAININGS.filter(t => t._category === filter);

  grid.innerHTML = '';

  filtered.forEach((t, idx) => {
    const card = document.createElement('div');
    card.className = 'formation-card';
    card.setAttribute('data-reveal', '');
    card.style.transitionDelay = `${idx * 0.06}s`;
    card.addEventListener('click', () => openModal(t));

    card.innerHTML = `
      <div class="formation-id ${t._category}">${t.id}</div>
      <h3>${esc(t.title)}</h3>
      <p>${esc(t.short)}</p>
      <div class="formation-meta">
        <span><b>durée ──</b> ${esc(t.duration)}</span>
        <span><b>tarif ──</b> ${formatPrice(t.price)} € HT / pers.</span>
      </div>
    `;

    grid.appendChild(card);
  });

  // Re-observe for scroll reveal
  observeRevealElements();
}


// ── Modal ──
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

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}


// ── Theme Toggle ──
function initTheme() {
  // data-theme is already set inline in <head> (defaults to 'light') to avoid a flash.
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
    links.classList.toggle('open');
  });

  // Close on link click
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });
}


// ── Nav scroll effect & active state ──
function initNavScroll() {
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');

  window.addEventListener('scroll', () => {
    // Nav shadow on scroll
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
  return str.replace(/[&<>"'']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
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
}

document.addEventListener('DOMContentLoaded', init);