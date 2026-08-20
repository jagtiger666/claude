// SANTI — minimal interaction layer

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const form = document.getElementById('newsletter-form');
  const note = document.getElementById('newsletter-note');

  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      if (!email) return;

      note.textContent = `[ ACCESS GRANTED — ${email.toUpperCase()} ADDED TO LIST ]`;
      note.classList.add('success');
      form.reset();
    });
  }
});
