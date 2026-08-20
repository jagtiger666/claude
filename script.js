const CONTACT_EMAIL = 'antoinesanti@orange.fr';

const revealTargets = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => observer.observe(el));

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
