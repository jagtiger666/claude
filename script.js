const CONTACT_EMAIL = 'antoinesanti@orange.fr';
const THEME_KEY = 'theme';

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  if (theme) {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
}

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

const ROLE_TEXT = "Communication globale & stratégie d'influence";
const roleTextEl = document.getElementById('role-text');
const roleCursorEl = document.getElementById('role-cursor');
const badgeEl = document.getElementById('badge');
const nameLastLetter = document.querySelector('[data-name-last]');
const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function revealBadge() {
  badgeEl.classList.add('is-visible');
}

function typeRole() {
  let i = 0;
  const step = () => {
    if (i <= ROLE_TEXT.length) {
      roleTextEl.textContent = ROLE_TEXT.slice(0, i);
      i += 1;
      setTimeout(step, 32);
    } else {
      roleCursorEl.classList.add('is-done');
      revealBadge();
    }
  };
  step();
}

if (prefersReducedMotionQuery.matches) {
  roleTextEl.textContent = ROLE_TEXT;
  roleCursorEl.classList.add('is-done');
  revealBadge();
} else if (nameLastLetter) {
  nameLastLetter.addEventListener('animationend', typeRole, { once: true });
} else {
  typeRole();
}

const revealTargets = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => revealObserver.observe(el));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    cursorGlow.classList.add('is-active');
  });
  window.addEventListener('pointerleave', () => {
    cursorGlow.classList.remove('is-active');
  });
}

const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const subject = encodeURIComponent(`Contact site personnel — ${name}`);
  const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  note.textContent = 'Votre client mail va s’ouvrir pour envoyer le message.';
});
