import { prefersReducedMotion } from './device.js';

/**
 * "Our other haunts": each card starts closed (picture + title). Tapping it
 * rattles the frame like something unseen knocked it, then opens the details.
 * Tapping again closes it. Reduced-motion users get the open/close without the rattle.
 */
export function initEventCards(root = document) {
  const cards = root.querySelectorAll('[data-event-card]');

  cards.forEach((card) => {
    const toggle = card.querySelector('.event-card__toggle');
    if (!toggle) return;

    card.addEventListener('animationend', (e) => {
      if (e.animationName === 'frame-rattle') card.classList.remove('is-rattling');
    });

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      card.classList.toggle('is-open', open);

      if (open && !prefersReducedMotion()) {
        card.classList.remove('is-rattling');
        void card.offsetWidth; // restart the animation if tapped again quickly
        card.classList.add('is-rattling');
      }
    });
  });
}
