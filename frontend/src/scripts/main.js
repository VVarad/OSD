/**
 * Entry point. Each feature is a small module that finds its own markup
 * (via data-* attributes) and does nothing if that markup is missing.
 */
import { EVENT } from '../config/event.js';
import { initCountdown } from './countdown.js';
import { initFaq } from './faq.js';
import { initSessions } from './sessions.js';
import { initEventCards } from './event-cards.js';
import { initHeroParallax } from './hero-parallax.js';
import { initOffscreenPause } from './motion.js';
import { initFog } from './fog/fog.js';
import { initGallery } from './gallery.js';
import { prefersReducedMotion, isLowPowerDevice } from './device.js';

function applyLinks() {
  document.querySelectorAll('[data-register-link]').forEach((link) => {
    link.setAttribute('href', EVENT.registerUrl);
  });
  document.querySelectorAll('[data-social]').forEach((link) => {
    const url = EVENT.socials[link.dataset.social];
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
    }
  });
}

function init() {
  applyLinks();
  initCountdown(document.querySelector('[data-countdown]'), EVENT.startsAt);
  initFaq(document.querySelector('[data-faq]'));
  initSessions(document.querySelector('[data-sessions]'));
  initEventCards();
  initGallery(document.querySelector('[data-gallery]'));
  initOffscreenPause(document.querySelectorAll('main > section'));

  const hero = document.querySelector('[data-hero]');
  const reduced = prefersReducedMotion();
  if (!reduced) initHeroParallax(hero);

  // The fog is the heaviest effect: skip it for reduced motion and weak devices,
  // and start it after first paint so it never delays the page.
  if (!reduced && !isLowPowerDevice()) {
    const start = () => initFog(document.querySelector('[data-fog]'), hero);
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 300);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
