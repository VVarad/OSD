/**
 * Anti-Gravity Floating Photo Wall & Lightbox Slider
 * Arranged in a salon-wall composition inspired by the grand portrait gallery
 */

export const GALLERY_ITEMS = [
  // Top Row (Sirius, Umbridge/McGonagall, Bellatrix)
  {
    id: 'mem-1',
    imageSrc: '/gallery/event-1.jpg',
    title: 'The Gathering',
    caption: 'Attendees kicking off the day at WCE Sangli.',
    frameSrc: '/frames/frame-square.png',
    width: 230,
    height: 290,
    top: '3%',
    left: '7%',
    floatDuration: 6.2,
    rotationDrift: 1.8,
  },
  {
    id: 'mem-2',
    imageSrc: '/gallery/event-2.jpg',
    title: 'Microservices Workshop',
    caption: 'Hands-on microservice architectures, containers, and deployments.',
    frameSrc: '/frames/frame-oval.png',
    width: 240,
    height: 290,
    top: '2%',
    left: '40%',
    floatDuration: 7.8,
    rotationDrift: -1.5,
  },
  {
    id: 'mem-3',
    imageSrc: '/gallery/event-3.jpg',
    title: 'Git & GitHub Labs',
    caption: 'Demystifying commits, branching, pull requests, and interactive rebasing.',
    frameSrc: '/frames/frame-gothic.png',
    width: 230,
    height: 290,
    top: '4%',
    left: '73%',
    floatDuration: 6.8,
    rotationDrift: 2.0,
  },

  // Middle Tier (Lucius, Grand Centerpiece Dumbledore, Snape)
  {
    id: 'mem-4',
    imageSrc: '/gallery/event-4.jpg',
    title: 'Terminal Sorcery',
    caption: 'Late afternoon command-line mastery and debugging puzzles.',
    frameSrc: '/frames/frame-square.png',
    width: 240,
    height: 300,
    top: '34%',
    left: '13%',
    floatDuration: 5.9,
    rotationDrift: -1.9,
  },
  {
    id: 'mem-5',
    imageSrc: '/gallery/event-5.jpg',
    title: 'The Grand Assembly',
    caption: 'The keynote hall alive with open source passion and energy.',
    frameSrc: '/frames/frame-gothic.png',
    width: 295,
    height: 380,
    top: '26%',
    left: '38%',
    floatDuration: 8.4,
    rotationDrift: 1.2,
    isCenterpiece: true,
  },
  {
    id: 'mem-6',
    imageSrc: '/gallery/event-6.jpg',
    title: 'Code & Collaboration',
    caption: 'Peer programming, architecture debates, and lightning hacks.',
    frameSrc: '/frames/frame-square.png',
    width: 240,
    height: 300,
    top: '33%',
    left: '69%',
    floatDuration: 6.6,
    rotationDrift: 1.7,
  },

  // Bottom Row (Hagrid, Hedwig/Rita, Lockhart)
  {
    id: 'mem-7',
    imageSrc: '/gallery/event-7.jpg',
    title: 'The Mentorship Circle',
    caption: 'Senior engineers guiding newcomers through their first contributions.',
    frameSrc: '/frames/frame-square.png',
    width: 250,
    height: 310,
    top: '66%',
    left: '9%',
    floatDuration: 6.4,
    rotationDrift: 2.1,
  },
  {
    id: 'mem-8',
    imageSrc: '/gallery/event-8.jpg',
    title: 'Open Source Odyssey',
    caption: 'Exploring distributed systems and real-world Linux tools.',
    frameSrc: '/frames/frame-oval.png',
    width: 235,
    height: 290,
    top: '68%',
    left: '40.5%',
    floatDuration: 7.4,
    rotationDrift: -1.6,
  },
  {
    id: 'mem-9',
    imageSrc: '/gallery/event-9.jpg',
    title: 'The Finale',
    caption: 'Certificates, swags, and closing open source celebrations.',
    frameSrc: '/frames/frame-gothic.png',
    width: 240,
    height: 300,
    top: '65%',
    left: '72%',
    floatDuration: 6.9,
    rotationDrift: -1.8,
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
      modalBezel.src = item.frameSrc;
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
