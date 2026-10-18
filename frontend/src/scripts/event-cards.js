import { prefersReducedMotion } from './device.js';

/**
 * "Our other haunts": each card starts closed (picture + title). Tapping it
 * rattles the frame like something unseen knocked it, then opens the details.
 * Tapping again closes it. Reduced-motion users get the open/close without the rattle.
 *
 * The full card surface is the click target (via a ::after overlay on .event-card).
 * Clicks anywhere on the card — including the image well, tag, and hint — are
 * forwarded to the toggle button so that aria-expanded stays in sync.
 */
export function initEventCards(root = document) {
  const cards = root.querySelectorAll('[data-event-card]');

  cards.forEach((card) => {
    const toggle = card.querySelector('.event-card__toggle');
    if (!toggle) return;

    card.addEventListener('animationend', (e) => {
      if (e.animationName === 'frame-rattle') card.classList.remove('is-rattling');
    });

    function activateToggle() {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      card.classList.toggle('is-open', open);

      if (open && !prefersReducedMotion()) {
        card.classList.remove('is-rattling');
        void card.offsetWidth; // restart the animation if tapped again quickly
        card.classList.add('is-rattling');
      }
    }

    // The toggle button handles its own clicks (keyboard, direct click).
    toggle.addEventListener('click', activateToggle);

    // The card ::after overlay catches clicks that land outside the toggle button
    // (on the image well, tag badge, hint text, etc.).  We check that the click
    // did NOT originate from inside the toggle itself to avoid double-firing.
    card.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && e.target !== toggle) {
        activateToggle();
      }
    });
  });
}
