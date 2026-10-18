/**
 * Anti-Gravity Floating Photo Wall & Lightbox Slider
 * Arranged in a pinned salon-wall composition inspired by the grand portrait gallery
 */

export const GALLERY_ITEMS = [
  // Top Row (Sirius, McGonagall/Umbridge, Bellatrix)
  {
    id: 'mem-1',
    imageSrc: '/gallery/event-1.webp',
    title: 'The Gathering',
    caption: 'Attendees kicking off the day at WCE Sangli.',
    frameSrc: '/frames/frame-square.webp',
    frameStyle: 'gold',
    width: 165,
    height: 190,
    top: '25px',
    left: '55px',
    floatDuration: 6.2,
    rotationDrift: 0.9,
  },
  {
    id: 'mem-2',
    imageSrc: '/gallery/event-2.webp',
    title: 'Microservices Workshop',
    caption: 'Hands-on microservice architectures, containers, and deployments.',
    frameSrc: '/frames/frame-oval.webp',
    frameStyle: 'gold',
    width: 200,
    height: 135,
    top: '20px',
    left: '370px',
    floatDuration: 7.2,
    rotationDrift: -0.8,
  },
  {
    id: 'mem-3',
    imageSrc: '/gallery/event-3.webp',
    title: 'Git & GitHub Labs',
    caption: 'Demystifying commits, branching, pull requests, and interactive rebasing.',
    frameSrc: '/frames/frame-gothic.webp',
    frameStyle: 'gold',
    width: 165,
    height: 190,
    top: '25px',
    left: '720px',
    floatDuration: 6.6,
    rotationDrift: 1.1,
  },

  // Middle Row (Lucius Malfoy, Grand Centerpiece Dumbledore, Severus Snape)
  {
    id: 'mem-4',
    imageSrc: '/gallery/event-4.webp',
    title: 'Terminal Sorcery',
    caption: 'Late afternoon command-line mastery and debugging puzzles.',
    frameSrc: '/frames/frame-square.webp',
    frameStyle: 'gold',
    width: 165,
    height: 215,
    top: '195px',
    left: '180px',
    floatDuration: 5.8,
    rotationDrift: -0.9,
  },
  {
    id: 'mem-5',
    imageSrc: '/gallery/event-5.webp',
    title: 'The Grand Assembly',
    caption: 'The keynote hall alive with open source passion and energy.',
    frameSrc: '/frames/frame-gothic.webp',
    frameStyle: 'silver',
    width: 220,
    height: 280,
    top: '165px',
    left: '360px',
    floatDuration: 8.0,
    rotationDrift: 0.6,
    isCenterpiece: true,
  },
  {
    id: 'mem-6',
    imageSrc: '/gallery/event-6.webp',
    title: 'Code & Collaboration',
    caption: 'Peer programming, architecture debates, and lightning hacks.',
    frameSrc: '/frames/frame-square.webp',
    frameStyle: 'gold',
    width: 165,
    height: 215,
    top: '195px',
    left: '595px',
    floatDuration: 6.5,
    rotationDrift: 0.9,
  },

  // Bottom Row (Hagrid, Rita/Hedwig, Gilderoy Lockhart)
  {
    id: 'mem-7',
    imageSrc: '/gallery/event-7.webp',
    title: 'The Mentorship Circle',
    caption: 'Senior engineers guiding newcomers through their first contributions.',
    frameSrc: '/frames/frame-square.webp',
    frameStyle: 'bronze',
    width: 165,
    height: 220,
    top: '360px',
    left: '55px',
    floatDuration: 6.4,
    rotationDrift: 1.0,
  },
  {
    id: 'mem-8',
    imageSrc: '/gallery/event-8.webp',
    title: 'Open Source Odyssey',
    caption: 'Exploring distributed systems and real-world Linux tools.',
    frameSrc: '/frames/frame-oval.webp',
    frameStyle: 'gold',
    width: 200,
    height: 125,
    top: '465px',
    left: '370px',
    floatDuration: 7.0,
    rotationDrift: -0.8,
  },
  {
    id: 'mem-9',
    imageSrc: '/gallery/event-9.webp',
    title: 'The Finale',
    caption: 'Certificates, swags, and closing open source celebrations.',
    frameSrc: '/frames/frame-gothic.webp',
    frameStyle: 'gold',
    width: 165,
    height: 220,
    top: '360px',
    left: '720px',
    floatDuration: 6.8,
    rotationDrift: -1.0,
  },
];

export function initGallery(root) {
  if (!root) return;

  const canvas = root.querySelector('[data-gallery-canvas]');
  const modal = root.querySelector('[data-gallery-modal]');
  if (!canvas || !modal) return;

  const modalMask = modal.querySelector('[data-modal-mask]');
  const modalSlider = modal.querySelector('[data-modal-slider]');
  const modalBezel = modal.querySelector('[data-modal-bezel]');
  const modalTitle = modal.querySelector('[data-modal-title]');
  const modalCaption = modal.querySelector('[data-modal-caption]');
  const modalCounter = modal.querySelector('[data-modal-counter]');
  const closeBtn = modal.querySelector('[data-modal-close]');
  const prevBtn = modal.querySelector('[data-modal-prev]');
  const nextBtn = modal.querySelector('[data-modal-next]');

  let currentIndex = 0;
  let isAnimating = false;

  // Set up dragging on floating portraits
  const portraits = canvas.querySelectorAll('[data-gallery-item]');
  portraits.forEach((portrait, index) => {
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let hasDragged = false;
    let isDragging = false;

    portrait.addEventListener('pointerdown', (e) => {
      // Only primary mouse button or touch
      if (e.button !== 0) return;
      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;

      const rect = portrait.getBoundingClientRect();
      const parentRect = canvas.getBoundingClientRect();
      initialLeft = rect.left - parentRect.left;
      initialTop = rect.top - parentRect.top;

      portrait.setPointerCapture(e.pointerId);
    });

    portrait.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!hasDragged && Math.hypot(dx, dy) > 6) {
        hasDragged = true;
        portrait.classList.add('is-dragging');
        portrait.style.left = `${initialLeft}px`;
        portrait.style.top = `${initialTop}px`;
      }

      if (hasDragged) {
        const newX = initialLeft + dx;
        const newY = initialTop + dy;
        portrait.style.left = `${newX}px`;
        portrait.style.top = `${newY}px`;
      }
    });

    const finishDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      portrait.classList.remove('is-dragging');
      try {
        if (portrait.hasPointerCapture(e.pointerId)) {
          portrait.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Pointer capture release safeguard
      }

      // If user simply clicked (no significant movement), open lightbox
      if (!hasDragged) {
        openLightbox(index);
      }
    };

    portrait.addEventListener('pointerup', finishDrag);
    portrait.addEventListener('pointercancel', finishDrag);
  });

  function updateModalMeta(idx) {
    const item = GALLERY_ITEMS[idx];
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalCaption) modalCaption.textContent = item.caption;
    if (modalCounter) modalCounter.textContent = `${idx + 1} / ${GALLERY_ITEMS.length}`;
    if (modalBezel) {
      modalBezel.src = '/frames/frame-square.webp';
      modalBezel.alt = `${item.title} Frame`;
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    updateModalMeta(currentIndex);

    // Prepare active slide image
    if (modalSlider) {
      modalSlider.innerHTML = '';
      const slideImg = document.createElement('img');
      slideImg.className = 'gallery-modal__slide';
      slideImg.src = GALLERY_ITEMS[currentIndex].imageSrc;
      slideImg.alt = GALLERY_ITEMS[currentIndex].title;
      modalSlider.appendChild(slideImg);
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);
  }

  function closeLightbox() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.removeEventListener('keydown', handleKeydown);
  }

  function paginate(direction) {
    if (isAnimating || !modalSlider) return;
    isAnimating = true;

    const nextIndex = (currentIndex + direction + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    const currentSlide = modalSlider.querySelector('.gallery-modal__slide');

    // Create incoming slide
    const nextSlide = document.createElement('img');
    nextSlide.className = 'gallery-modal__slide';
    nextSlide.src = GALLERY_ITEMS[nextIndex].imageSrc;
    nextSlide.alt = GALLERY_ITEMS[nextIndex].title;

    // Position incoming slide offscreen based on direction
    const enterOffset = direction > 0 ? 100 : -100;
    const exitOffset = direction > 0 ? -100 : 100;
    nextSlide.style.transform = `translateX(${enterOffset}%) scale(0.92)`;
    nextSlide.style.opacity = '0';
    modalSlider.appendChild(nextSlide);

    // Update metadata right as transition begins
    updateModalMeta(nextIndex);

    // Force reflow
    void nextSlide.offsetWidth;

    // Animate slides
    if (currentSlide) {
      currentSlide.style.transform = `translateX(${exitOffset}%) scale(0.92)`;
      currentSlide.style.opacity = '0';
    }

    nextSlide.style.transform = 'translateX(0) scale(1)';
    nextSlide.style.opacity = '1';

    setTimeout(() => {
      if (currentSlide && currentSlide.parentNode) {
        currentSlide.parentNode.removeChild(currentSlide);
      }
      currentIndex = nextIndex;
      isAnimating = false;
    }, 360);
  }

  function handleKeydown(e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      paginate(1);
    } else if (e.key === 'ArrowLeft') {
      paginate(-1);
    }
  }

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    // If clicking the modal backdrop (not the content dialog)
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Next / Prev button controls
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      paginate(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      paginate(1);
    });
  }

  // Swipe / Drag on Modal Photo Mask
  if (modalMask) {
    let maskStartX = 0;
    let isMaskDragging = false;
    let diffX = 0;

    modalMask.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || isAnimating) return;
      isMaskDragging = true;
      diffX = 0;
      maskStartX = e.clientX;
      modalMask.setPointerCapture(e.pointerId);
    });

    modalMask.addEventListener('pointermove', (e) => {
      if (!isMaskDragging) return;
      diffX = e.clientX - maskStartX;
      const currentSlide = modalSlider?.querySelector('.gallery-modal__slide');
      if (currentSlide) {
        currentSlide.style.transform = `translateX(${diffX * 0.7}px)`;
      }
    });

    const handleMaskPointerEnd = (e) => {
      if (!isMaskDragging) return;
      isMaskDragging = false;
      try {
        if (modalMask.hasPointerCapture(e.pointerId)) {
          modalMask.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Pointer capture safeguard
      }

      if (diffX < -50) {
        paginate(1);
      } else if (diffX > 50) {
        paginate(-1);
      } else {
        // Reset slide transform
        const currentSlide = modalSlider?.querySelector('.gallery-modal__slide');
        if (currentSlide) {
          currentSlide.style.transform = 'translateX(0) scale(1)';
        }
      }
    };

    modalMask.addEventListener('pointerup', handleMaskPointerEnd);
    modalMask.addEventListener('pointercancel', handleMaskPointerEnd);
  }
}
