/**
 * Neural Network Particle Animation
 * Draws a network of connected particles on a canvas element.
 * Usage: new NeuralNetwork('#neural-canvas').init()
 */
class NeuralNetwork {
  #canvas;
  #ctx;
  #particles = [];
  #mouse = { x: null, y: null };
  #config = {};
  #animationId = null;
  #resizeTimeout = null;

  constructor(selector) {
    this.#canvas = document.querySelector(selector);
    if (!this.#canvas) {
      console.warn('NeuralNetwork: canvas not found for selector', selector);
      return;
    }
    this.#ctx = this.#canvas.getContext('2d');
  }

  getConfig() {
    const w = window.innerWidth;
    return {
      particleCount: w < 640 ? 25 : w < 1024 ? 40 : 60,
      connectionDistance: 150,
      baseSpeed: 0.1,
      particleRadius: w < 640 ? 1.5 : 2,
      mouseRadius: 180,
      isDark: document.body.classList.contains('dark-theme'),
    };
  }

  resize() {
    const header = this.#canvas.parentElement;
    this.#canvas.width = header.offsetWidth;
    this.#canvas.height = header.offsetHeight;
  }

  createParticles(count) {
    this.#particles = [];
    for (let i = 0; i < count; i++) {
      this.#particles.push({
        x: Math.random() * this.#canvas.width,
        y: Math.random() * this.#canvas.height,
        vx: (Math.random() - 0.5),
        vy: (Math.random() - 0.5),
        radius: Math.random() * 1.5 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
  }

  drawParticle(particle, color) {
    this.#ctx.beginPath();
    this.#ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    this.#ctx.fillStyle = color.replace('ALPHA', particle.opacity.toFixed(2));
    this.#ctx.fill();

    this.#ctx.beginPath();
    this.#ctx.arc(particle.x, particle.y, particle.radius * 2.5, 0, Math.PI * 2);
    this.#ctx.fillStyle = color.replace('ALPHA', (particle.opacity * 0.15).toFixed(2));
    this.#ctx.fill();
  }

  drawConnections(color) {
    for (let i = 0; i < this.#particles.length; i++) {
      for (let j = i + 1; j < this.#particles.length; j++) {
        const dx = this.#particles[i].x - this.#particles[j].x;
        const dy = this.#particles[i].y - this.#particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.#config.connectionDistance) {
          const opacity = (1 - distance / this.#config.connectionDistance) * 0.3;
          this.#ctx.beginPath();
          this.#ctx.moveTo(this.#particles[i].x, this.#particles[i].y);
          this.#ctx.lineTo(this.#particles[j].x, this.#particles[j].y);
          this.#ctx.strokeStyle = color.replace('ALPHA', opacity.toFixed(2));
          this.#ctx.lineWidth = 0.8;
          this.#ctx.stroke();
        }
      }
    }
  }

  handleMouseInteraction() {
    if (this.#mouse.x === null) return;
    for (let i = 0; i < this.#particles.length; i++) {
      const dx = this.#particles[i].x - this.#mouse.x;
      const dy = this.#particles[i].y - this.#mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.#config.mouseRadius) {
        const force = (this.#config.mouseRadius - distance) / this.#config.mouseRadius;
        const angle = Math.atan2(dy, dx);
        this.#particles[i].vx += Math.cos(angle) * force * 0.3;
        this.#particles[i].vy += Math.sin(angle) * force * 0.3;
      }
    }
  }

  updateParticles() {
    const speed = this.#config.baseSpeed;
    for (let i = 0; i < this.#particles.length; i++) {
      const p = this.#particles[i];

      const maxSpeed = 2;
      const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (vel > maxSpeed) {
        p.vx = (p.vx / vel) * maxSpeed;
        p.vy = (p.vy / vel) * maxSpeed;
      }

      p.vx *= 0.999;
      p.vy *= 0.999;

      const minVel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (minVel < speed) {
        p.vx += (Math.random() - 0.5);
        p.vy += (Math.random() - 0.5);
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.#canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.#canvas.height) p.vy *= -1;

      p.x = Math.max(0, Math.min(this.#canvas.width, p.x));
      p.y = Math.max(0, Math.min(this.#canvas.height, p.y));
    }
  }

  animate() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    const color = this.#config.isDark
      ? 'rgba(0, 168, 225, ALPHA)'
      : 'rgba(0, 168, 225, ALPHA)';

    this.handleMouseInteraction();
    this.updateParticles();
    this.drawConnections(color);

    for (let i = 0; i < this.#particles.length; i++) {
      this.drawParticle(this.#particles[i], color);
    }

    this.#animationId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    if (this.#animationId) {
      cancelAnimationFrame(this.#animationId);
      this.#animationId = null;
    }
  }

  init() {
    this.resize();
    this.#config = this.getConfig();
    this.createParticles(this.#config.particleCount);
    this.animate();

    window.addEventListener('resize', () => {
      clearTimeout(this.#resizeTimeout);
      this.#resizeTimeout = setTimeout(() => {
        this.resize();
        this.#config = this.getConfig();
        this.createParticles(this.#config.particleCount);
      }, 200);
    });

    this.#canvas.addEventListener('mousemove', (e) => {
      const rect = this.#canvas.getBoundingClientRect();
      this.#mouse.x = e.clientX - rect.left;
      this.#mouse.y = e.clientY - rect.top;
    });

    this.#canvas.addEventListener('mouseleave', () => {
      this.#mouse.x = null;
      this.#mouse.y = null;
    });

    const observer = new MutationObserver(() => {
      this.#config = this.getConfig();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    setTimeout(() => { this.#config = this.getConfig(); }, 100);
  }
}