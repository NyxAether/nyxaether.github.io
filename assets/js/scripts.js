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


// ── Neural Network Canvas Animation ──
class NeuralNetwork {
  constructor(canvasId) {
    this.canvas = document.querySelector(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.raf = null;
    this.resizeTimer = null;
    this.init();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.w = rect.width;
    this.h = rect.height;
  }

  getParticleCount() {
    const w = window.innerWidth;
    if (w < 640) return 20;
    if (w < 1024) return 35;
    return 50;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.getParticleCount(); i++) {
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  update(dt) {
    for (const p of this.particles) {
      // Mouse repulsion
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.4;
          p.vy += Math.sin(angle) * force * 0.4;
        }
      }

      // Clamp speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }

      // Slow down + random drift
      p.vx *= 0.998;
      p.vy *= 0.998;
      const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (currentSpeed < 0.15) {
        p.vx += (Math.random() - 0.5) * 0.3;
        p.vy += (Math.random() - 0.5) * 0.3;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > this.w) p.vx *= -1;
      if (p.y < 0 || p.y > this.h) p.vy *= -1;
      p.x = Math.max(0, Math.min(this.w, p.x));
      p.y = Math.max(0, Math.min(this.h, p.y));

      // Pulse
      p.pulsePhase += 0.02;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    const dark = this.isDark();

    // Connection color
    const r = 0, g = 168, b = 255;

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b_ = this.particles[j];
        const dx = a.x - b_.x;
        const dy = a.y - b_.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 140;

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b_.x, b_.y);
          this.ctx.strokeStyle = `rgba(${r},${g},${b},${opacity.toFixed(3)})`;
          this.ctx.lineWidth = 0.7;
          this.ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of this.particles) {
      const pulse = Math.sin(p.pulsePhase) * 0.1 + p.opacity;

      // Glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r},${g},${b},${(pulse * 0.12).toFixed(3)})`;
      this.ctx.fill();

      // Core
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r},${g},${b},${pulse.toFixed(3)})`;
      this.ctx.fill();
    }
  }

  loop() {
    this.update(1);
    this.draw();
    this.raf = requestAnimationFrame(() => this.loop());
  }

  init() {
    this.resize();
    this.createParticles();
    this.loop();

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.resize();
        this.createParticles();
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

    const catColor = t._category === 'python' ? '#fbbf24' : '#00c8ff';

    card.innerHTML = `
      <div class="formation-id" style="color:${catColor}">${t.id}</div>
      <h3>${esc(t.title)}</h3>
      <p>${esc(t.short)}</p>
      <div class="formation-meta">
        <span>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${esc(t.duration)}
        </span>
        <span>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M16 8l-8 8"/></svg>
          ${formatPrice(t.price)} € HT / pers.
        </span>
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
  const stored = localStorage.getItem('theme');
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  const btn = document.getElementById('themeToggle');
  btn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
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
    a.addEventListener('link.click', () => {
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
  // Neural network animation
  new NeuralNetwork('#neuralCanvas');

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