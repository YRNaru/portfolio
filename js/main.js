/* ========================================
   INIT
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  // GSAP fallback check
  if (typeof gsap === 'undefined') {
    document.getElementById('loader')?.remove();
    document.body.classList.remove('is-loading');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Set initial hidden states for GSAP-animated elements
  gsap.set('.hero-title .line-inner', { y: '110%' });
  gsap.set('#heroLabel, #heroBottom, #heroScroll, .hero-line', { autoAlpha: 0, y: 30 });

  initLoader();
  initCursor();
  initScrollProgress();
  initSmoothScroll();
  initFloatingBackToTop();
  initShowcaseSlider();
  initBubbles();
});

/* ========================================
   LOADER
   ======================================== */
function initLoader() {
  const isReturning = sessionStorage.getItem('portfolio-loaded');

  if (isReturning) {
    document.getElementById('loader')?.remove();
    document.body.classList.remove('is-loading');
    playHeroAnimation();
    initScrollAnimations();
    initMobileNav();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      document.getElementById('loader')?.remove();
      document.body.classList.remove('is-loading');
      sessionStorage.setItem('portfolio-loaded', 'true');
      playHeroAnimation();
      initScrollAnimations();
      initMobileNav();
    }
  });

  tl
    .to('.loader-letter', {
      y: '0%',
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08
    })
    .to('#loaderBarFill', {
      width: '100%',
      duration: 1.8,
      ease: 'power1.inOut'
    }, 0.3)
    .to('#loaderCounter', {
      textContent: 100,
      snap: { textContent: 1 },
      duration: 1.8,
      ease: 'power1.inOut'
    }, 0.3)
    .to({}, { duration: 0.3 })
    .to('#loaderInner', {
      autoAlpha: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in'
    })
    .to('#loaderCurtainTop', {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut'
    })
    .to('#loaderCurtainBottom', {
      y: '100%',
      duration: 0.8,
      ease: 'power3.inOut'
    }, '<')
    .from('main, footer', {
      scale: 0.96,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3');
}

/* ========================================
   HERO ANIMATION
   ======================================== */
function playHeroAnimation() {
  const heroTl = gsap.timeline();

  heroTl
    .to('#heroLabel', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
    .to('.hero-title .line-inner', {
      y: '0%',
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.1
    }, 0.2)
    .to('#heroBottom', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.9)
    .to('#heroScroll', { autoAlpha: 1, y: 0, duration: 0.6 }, 1.0)
    .to('.hero-line', { autoAlpha: 1, y: 0, duration: 0.6 }, 0.8);

  // Start typewriter after hero text appears
  setTimeout(initTypewriter, 1200);

  // Start ambient text drift
  initAmbientText();

  // Start mouse parallax
  initMouseParallax();
}

/* ========================================
   TYPEWRITER
   ======================================== */
function initTypewriter() {
  const phrases = [
    'ブランドの本質を、記憶に刻むデザインへ。',
    '余白に意味を。形に意志を。',
    '視覚の力で、物語を紡ぐ。',
  ];

  const textEl = document.getElementById('typewriterText');
  const cursorEl = document.getElementById('typewriterCursor');
  if (!textEl) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let chars = [];

  function typeNextChar() {
    const phrase = phrases[phraseIndex];

    if (!isDeleting && charIndex < phrase.length) {
      // Typing
      const span = document.createElement('span');
      span.className = 'tw-char';
      span.textContent = phrase[charIndex];
      textEl.appendChild(span);
      chars.push(span);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => span.classList.add('is-visible'));
      });

      charIndex++;
      setTimeout(typeNextChar, 40);
    } else if (!isDeleting && charIndex >= phrase.length) {
      // Hold before deleting
      setTimeout(() => {
        isDeleting = true;
        typeNextChar();
      }, 2000);
    } else if (isDeleting && chars.length > 0) {
      // Deleting
      const lastChar = chars.pop();
      lastChar.classList.remove('is-visible');
      lastChar.classList.add('is-leaving');
      setTimeout(() => lastChar.remove(), 200);

      charIndex--;
      setTimeout(typeNextChar, 25);
    } else {
      // Move to next phrase
      isDeleting = false;
      charIndex = 0;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeNextChar, 400);
    }
  }

  typeNextChar();
}

/* ========================================
   AMBIENT BACKGROUND TEXT
   ======================================== */
function initAmbientText() {
  const ambient = document.getElementById('heroAmbient');
  if (!ambient) return;

  gsap.to(ambient, {
    y: '-8%',
    duration: 30,
    ease: 'none',
    repeat: -1,
    yoyo: true
  });
}

/* ========================================
   MOUSE PARALLAX (Hero)
   ======================================== */
function initMouseParallax() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.innerWidth < 768) return;

  const glow1 = document.getElementById('heroGlow1');
  const glow2 = document.getElementById('heroGlow2');
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 30;
    targetY = (e.clientY / window.innerHeight - 0.5) * 30;
  }, { passive: true });

  function animate() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    if (glow1) glow1.style.transform = `translate(${currentX}px, ${currentY}px)`;
    if (glow2) glow2.style.transform = `translate(${-currentX * 0.6}px, ${-currentY * 0.6}px)`;

    requestAnimationFrame(animate);
  }

  animate();
}

/* ========================================
   CUSTOM CURSOR
   ======================================== */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  const cursorLabel = document.getElementById('cursorLabel');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Event delegation for cursor states
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor]');

    if (target) {
      const type = target.dataset.cursor;
      cursor.classList.remove('is-hover', 'is-view');

      if (type === 'view') {
        cursor.classList.add('is-view');
        cursorLabel.textContent = 'VIEW';
      } else if (type === 'drag') {
        cursor.classList.add('is-view');
        cursorLabel.textContent = 'DRAG';
      } else {
        cursor.classList.add('is-hover');
      }
    } else {
      // Check for generic interactive elements
      const interactive = e.target.closest('a, button');
      if (interactive && !interactive.dataset.cursor) {
        cursor.classList.add('is-hover');
      }
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-cursor], a, button');
    if (target) {
      cursor.classList.remove('is-hover', 'is-view');
    }
  }, { passive: true });
}

/* ========================================
   SCROLL PROGRESS
   ======================================== */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ========================================
   MOBILE FULLSCREEN NAV
   ======================================== */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const overlay = document.getElementById('fnOverlay');
  if (!toggle || !overlay) return;

  let isOpen = false;

  const navTl = gsap.timeline({ paused: true });
  navTl
    .set(overlay, { visibility: 'visible' })
    .to('.fn-panel', {
      x: '0%',
      duration: 0.5,
      ease: 'power3.inOut',
      stagger: 0.06
    })
    .to('.fn-link', {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.06
    }, '-=0.2');

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    toggle.classList.toggle('is-active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    overlay.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      overlay.classList.add('is-open');
      navTl.timeScale(1).play();
    } else {
      navTl.timeScale(1.3).reverse();
      // Remove class after animation completes
      setTimeout(() => {
        if (!isOpen) overlay.classList.remove('is-open');
      }, 600);
    }
  });

  // Close on link click
  overlay.querySelectorAll('.fn-link').forEach((link) => {
    link.addEventListener('click', () => {
      isOpen = false;
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
      navTl.timeScale(1.3).reverse();
      setTimeout(() => overlay.classList.remove('is-open'), 600);
    });
  });
}

/* ========================================
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
   ======================================== */
function initScrollAnimations() {
  // --- Reveal from bottom ---
  document.querySelectorAll('.gsap-reveal').forEach((el) => {
    gsap.from(el, {
      y: 60,
      autoAlpha: 0,
      duration: 1,
      delay: parseFloat(el.dataset.delay || 0),
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  // --- Reveal from left ---
  document.querySelectorAll('.gsap-reveal-left').forEach((el) => {
    gsap.from(el, {
      x: -80,
      autoAlpha: 0,
      duration: 1,
      delay: parseFloat(el.dataset.delay || 0),
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  // --- Reveal from right ---
  document.querySelectorAll('.gsap-reveal-right').forEach((el) => {
    gsap.from(el, {
      x: 80,
      autoAlpha: 0,
      duration: 1,
      delay: parseFloat(el.dataset.delay || 0),
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  // --- Section divider lines ---
  document.querySelectorAll('.section-divider-line').forEach((line) => {
    gsap.to(line, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: line,
        start: 'top 90%',
        once: true
      }
    });
  });

  // --- Number counters ---
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.nextElementSibling;

    gsap.to(el, {
      textContent: target,
      snap: { textContent: 1 },
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (suffix && suffix.classList.contains('stat-suffix') && suffix.textContent) {
            gsap.to(suffix, { opacity: 1, duration: 0.3, delay: 1.5 });
          }
        }
      }
    });
  });

  // --- Clip-path image reveals ---
  document.querySelectorAll('.work-image-wrapper').forEach((wrapper) => {
    gsap.to(wrapper, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 80%',
        once: true
      },
      onComplete: () => wrapper.classList.add('is-revealed')
    });
  });

  // --- Parallax shapes ---
  if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.parallax-shape').forEach((shape) => {
      const speed = parseFloat(shape.dataset.speed || 0.2);

      gsap.to(shape, {
        y: () => window.innerHeight * speed * -0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: shape.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    // About deco parallax
    const deco = document.querySelector('.about-deco');
    if (deco) {
      gsap.to(deco, {
        y: -80,
        rotation: 45,
        ease: 'none',
        scrollTrigger: {
          trigger: deco.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  }

  // --- Magnetic card tilt ---
  initMagneticTilt();
}

/* ========================================
   MAGNETIC CARD TILT
   ======================================== */
function initMagneticTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(card, {
        rotateX: -y * 5,
        rotateY: x * 5,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  });
}

/* ========================================
   FLOATING BACK TO TOP
   ======================================== */
function initFloatingBackToTop() {
  const floatingBtn = document.getElementById('floatingBackTop');
  if (!floatingBtn) return;

  // Utilize GSAP ScrollTrigger if available, else fallback to vanilla scroll listener
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: document.body,
      start: '80% bottom',
      onEnter: () => floatingBtn.classList.add('is-visible'),
      onLeaveBack: () => floatingBtn.classList.remove('is-visible')
    });
  } else {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0 && (scrollTop / scrollHeight) >= 0.8) {
        floatingBtn.classList.add('is-visible');
      } else {
        floatingBtn.classList.remove('is-visible');
      }
    }, { passive: true });
  }
}

/* ========================================
   SHOWCASE AUTO SLIDER
   ======================================== */
function initShowcaseSlider() {
  const showcase = document.querySelector('.showcase-horizontal');
  if (!showcase) return;

  const originalCards = Array.from(showcase.querySelectorAll('.showcase-card'));
  
  // 1. Append Clones (for infinite scrolling right)
  originalCards.forEach(card => {
    showcase.appendChild(card.cloneNode(true));
  });

  // 2. Prepend Clones (for infinite scrolling left & centering the first item without a gap)
  originalCards.slice().reverse().forEach(card => {
    showcase.insertBefore(card.cloneNode(true), showcase.firstChild);
  });

  // Need to wait slightly for layout to compute widths
  requestAnimationFrame(() => {
    const firstCard = showcase.querySelector('.showcase-card');
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gapStr = window.getComputedStyle(showcase).gap || '0';
    const gap = parseInt(gapStr, 10);
    const scrollStep = cardWidth + (isNaN(gap) ? 0 : gap);
    const originalTotalWidth = scrollStep * originalCards.length;

    // Immediately snap to the original first card (now in the middle section)
    showcase.scrollTo({ left: originalTotalWidth, behavior: 'auto' });

    let slideInterval;
    const slideDelay = 3000;

    const startSlider = () => {
      slideInterval = setInterval(() => {
        // Infinite Loop Bounds Check before taking a step
        if (showcase.scrollLeft >= originalTotalWidth * 1.5) {
          showcase.scrollTo({ left: showcase.scrollLeft - originalTotalWidth, behavior: 'auto' });
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              showcase.scrollBy({ left: scrollStep, behavior: 'smooth' });
            });
          });
          return;
        } 
        
        if (showcase.scrollLeft < originalTotalWidth * 0.5) {
          showcase.scrollTo({ left: showcase.scrollLeft + originalTotalWidth, behavior: 'auto' });
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              showcase.scrollBy({ left: scrollStep, behavior: 'smooth' });
            });
          });
          return;
        }

        // Standard smooth step if within safe bounds
        showcase.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }, slideDelay);
    };

    const stopSlider = () => {
      clearInterval(slideInterval);
    };

    startSlider();

    showcase.addEventListener('mouseenter', stopSlider);
    showcase.addEventListener('mouseleave', startSlider);
    showcase.addEventListener('touchstart', stopSlider, { passive: true });
    showcase.addEventListener('touchend', startSlider);

    const resetSlider = () => {
      stopSlider();
      startSlider();
    };

    const nextBtn = document.querySelector('.showcase-nav-btn.next');
    const prevBtn = document.querySelector('.showcase-nav-btn.prev');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        resetSlider();
        if (showcase.scrollLeft >= originalTotalWidth * 1.5) {
          showcase.scrollTo({ left: showcase.scrollLeft - originalTotalWidth, behavior: 'auto' });
          requestAnimationFrame(() => requestAnimationFrame(() => {
            showcase.scrollBy({ left: scrollStep, behavior: 'smooth' });
          }));
        } else {
          showcase.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        resetSlider();
        if (showcase.scrollLeft <= originalTotalWidth * 0.5) {
          showcase.scrollTo({ left: showcase.scrollLeft + originalTotalWidth, behavior: 'auto' });
          requestAnimationFrame(() => requestAnimationFrame(() => {
            showcase.scrollBy({ left: -scrollStep, behavior: 'smooth' });
          }));
        } else {
          showcase.scrollBy({ left: -scrollStep, behavior: 'smooth' });
        }
      });
    }

  });
}

/* ========================================
   AMBIENT BUBBLES
   ======================================== */
function initBubbles() {
  const container = document.getElementById('bubblesContainer');
  if (!container) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bubbleColors = [
    'rgba(205, 255, 80, 0.45)',   // Lime accent
    'rgba(120, 200, 255, 0.40)',  // Cyan
    'rgba(200, 130, 255, 0.40)',  // Purple
    'rgba(255, 180, 100, 0.35)',  // Warm orange
    'rgba(100, 255, 200, 0.40)',  // Mint
  ];

  const createBubble = () => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = Math.random() * 180 + 80; // 80px ~ 260px
    const left = Math.random() * 100;       // 0% ~ 100%
    const duration = Math.random() * 12 + 10; // 10s ~ 22s (slightly faster)
    const drift = (Math.random() - 0.5) * 150; // wider sway
    const opacity = Math.random() * 0.2 + 0.3; // 0.3 ~ 0.5
    const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];

    bubble.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      --bubble-drift: ${drift}px;
      --bubble-opacity: ${opacity};
      background: radial-gradient(circle at 30% 30%, ${color}, transparent 60%);
      border-color: ${color.replace(/[\d.]+\)$/, '0.25)')};
    `;

    container.appendChild(bubble);

    // Self-remove after animation completes
    setTimeout(() => bubble.remove(), duration * 1000);
  };

  // Initial batch of bubbles (staggered)
  for (let i = 0; i < 8; i++) {
    setTimeout(createBubble, i * 600);
  }

  // Continuously spawn new bubbles
  setInterval(createBubble, 2000);
}
