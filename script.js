/* ===== Birthday Wish Website - JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCountdown();
  initMemoryGallery();
  initLetterReveal();
  initSurprise();
  initScrollAnimations();
  initFloatingParticles();
});

/* ----- Mobile Navigation ----- */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
}

/* ----- Birthday Countdown (hours left in the day) ----- */
function initCountdown() {
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const diff = endOfDay - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ----- Memory Gallery Modal ----- */
function initMemoryGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('memoryModal');
  const modalMessage = document.getElementById('modalMessage');
  const modalClose = document.querySelector('.modal-close');

  if (!galleryItems.length || !modal) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const message = item.dataset.message;
      if (modalMessage) modalMessage.textContent = message;
      modal.classList.add('active');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
    }
  });
}

/* ----- Letter Reveal ----- */
function initLetterReveal() {
  const revealBtn = document.getElementById('revealLetter');
  const letterContent = document.getElementById('letterContent');

  if (!revealBtn || !letterContent) return;

  revealBtn.addEventListener('click', () => {
    letterContent.classList.add('revealed');
    revealBtn.textContent = '💌 Letter Opened';
    revealBtn.disabled = true;
    revealBtn.style.opacity = '0.6';
    revealBtn.style.cursor = 'default';
  });
}

/* ----- Surprise Page ----- */
function initSurprise() {
  const giftBox = document.getElementById('giftBox');
  const surpriseBox = document.getElementById('surpriseBox');
  const surpriseReveal = document.getElementById('surpriseReveal');
  const celebrateBtn = document.getElementById('celebrateBtn');

  if (!giftBox) return;

  let confettiInstance = null;

  giftBox.addEventListener('click', () => {
    giftBox.classList.add('open');

    setTimeout(() => {
      if (surpriseBox) surpriseBox.style.display = 'none';
      if (surpriseReveal) surpriseReveal.classList.remove('hidden');
      confettiInstance = startConfetti();
    }, 800);
  });

  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      if (confettiInstance) {
        confettiInstance.burst();
      } else {
        confettiInstance = startConfetti();
        confettiInstance.burst();
      }
    });
  }
}

/* ----- Confetti Animation ----- */
function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return { burst: () => {} };

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#e84393', '#6c5ce7', '#fdcb6e', '#00cec9', '#ff6b9d', '#a29bfe', '#fd79a8'];

  function createParticle(x, y) {
    return {
      x: x ?? Math.random() * canvas.width,
      y: y ?? -10,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 6,
      speedY: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    };
  }

  for (let i = 0; i < 150; i++) {
    particles.push(createParticle());
  }

  let animationId;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.speedY += 0.05;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      if (p.y > canvas.height + 20) {
        particles[index] = createParticle();
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  return {
    burst() {
      for (let i = 0; i < 80; i++) {
        particles.push(createParticle(canvas.width / 2, canvas.height / 3));
      }
    },
    stop() {
      cancelAnimationFrame(animationId);
    },
  };
}

/* ----- Scroll Animations ----- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.timeline-item, .wish-card, .gallery-item');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}

/* ----- Floating Particles (Home page) ----- */
function initFloatingParticles() {
  const container = document.querySelector('.floating-hearts');
  if (!container) return;

  const emojis = ['✨', '💕', '🎈', '⭐', '🎀', '💖'];
  const particleCount = 12;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.cssText = `
      position: absolute;
      font-size: ${Math.random() * 1 + 0.8}rem;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.15 + 0.05};
      animation: floatParticle ${Math.random() * 6 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      pointer-events: none;
    `;
    container.appendChild(particle);
  }

  if (!document.getElementById('particleStyles')) {
    const style = document.createElement('style');
    style.id = 'particleStyles';
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-20px) rotate(5deg); }
        50% { transform: translateY(-10px) rotate(-5deg); }
        75% { transform: translateY(-25px) rotate(3deg); }
      }
    `;
    document.head.appendChild(style);
  }
}
