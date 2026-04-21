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
    .to('#heroBottom', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.9)
    .to('#heroScroll', { autoAlpha: 1, y: 0, duration: 0.6 }, 1.0)
    .to('.hero-line', { autoAlpha: 1, y: 0, duration: 0.6 }, 0.8);

  // Start hero title animation
  startHeroAnimation('Design Without Limits');

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

  const hero = document.getElementById('hero');
  const glow1 = document.getElementById('heroGlow1');
  const glow2 = document.getElementById('heroGlow2');
  if (!hero) return;

  let isVisible = true;

  // Only animate when hero is visible
  const observer = new IntersectionObserver(
    ([entry]) => { isVisible = entry.isIntersecting; },
    { threshold: 0 }
  );
  observer.observe(hero);

  // Use GSAP quickTo for batched, GPU-efficient transform updates
  const g1x = glow1 ? gsap.quickTo(glow1, 'x', { duration: 0.6, ease: 'power2.out' }) : null;
  const g1y = glow1 ? gsap.quickTo(glow1, 'y', { duration: 0.6, ease: 'power2.out' }) : null;
  const g2x = glow2 ? gsap.quickTo(glow2, 'x', { duration: 0.8, ease: 'power2.out' }) : null;
  const g2y = glow2 ? gsap.quickTo(glow2, 'y', { duration: 0.8, ease: 'power2.out' }) : null;

  document.addEventListener('mousemove', (e) => {
    if (!isVisible) return;
    const mx = (e.clientX / window.innerWidth - 0.5) * 30;
    const my = (e.clientY / window.innerHeight - 0.5) * 30;

    if (g1x) g1x(mx);
    if (g1y) g1y(my);
    if (g2x) g2x(-mx * 0.6);
    if (g2y) g2y(-my * 0.6);
  }, { passive: true });
}

/* ========================================
   CUSTOM CURSOR
   ======================================== */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  const cursorLabel = document.getElementById('cursorLabel');
  if (!cursor || !cursorDot) return;

  // Initialize GSAP centering to avoid CSS transform overriding issues
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });

  // Use GSAP quickTo for highly efficient, GPU-accelerated transform updates.
  // This prevents continuous Layout thrashing (Reflows) caused by top/left assignment.
  const cursorX = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3.out" });
  const cursorY = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3.out" });

  const dotX = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3.out" });
  const dotY = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3.out" });

  document.addEventListener('mousemove', (e) => {
    cursorX(e.clientX);
    cursorY(e.clientY);
    dotX(e.clientX);
    dotY(e.clientY);
  }, { passive: true });

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
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const isNav = anchor.closest('.nav-links, .fn-content, .footer-nav');

      // ハンバーガーメニューが出ているスマホサイズ(768px以下)では幕を出さない
      if (isNav && window.innerWidth > 768) {
        doNavTransition(target, () => {
          if (window.closeMobileNavInstantly) {
            window.closeMobileNavInstantly();
          }
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // モバイルナビゲーションのリンクだった場合はスムーズに閉じる
        if (anchor.closest('.fn-content') && window.closeMobileNavGracefully) {
          window.closeMobileNavGracefully();
        }
      }
    });
  });
}

let isNavTransitioning = false;
function doNavTransition(targetElement, onCoverCallback) {
  if (isNavTransitioning) return;

  const curtain = document.getElementById('transitionCurtain');
  if (!curtain) {
    if (onCoverCallback) onCoverCallback();
    targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    return;
  }

  isNavTransitioning = true;
  curtain.classList.add('is-active');

  const tl = gsap.timeline({
    onComplete: () => {
      isNavTransitioning = false;
      curtain.classList.remove('is-active');
    }
  });

  tl.to(curtain, {
    y: '0%',
    duration: 0.7,
    ease: 'power3.inOut',
    onComplete: () => {
      if (onCoverCallback) onCoverCallback();
      targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  })
    .to(curtain, {
      y: '-100%',
      duration: 0.7,
      ease: 'power3.inOut',
      delay: 0.5
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

  // Create a function to instantly reset mobile nav (called under the curtain)
  window.closeMobileNavInstantly = () => {
    if (!isOpen) return;
    isOpen = false;
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    navTl.progress(0).pause();
    overlay.classList.remove('is-open');
  };

  // Create a function to gracefully close mobile nav (used on mobile without curtain)
  window.closeMobileNavGracefully = () => {
    if (!isOpen) return;
    isOpen = false;
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    navTl.timeScale(1.3).reverse();
    setTimeout(() => overlay.classList.remove('is-open'), 600);
  };
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

/* ========================================
   HERO TITLE ANIMATION
   ======================================== */
const HERO_CONFIG = {
  entryDuration: 750,   // ms: 1文字の入場アニメーション時間
  entryStagger: 75,    // ms: 文字ごとの入場ディレイ
  holdDuration: 1600,  // ms: 中央で止まっている時間
  exitDuration: 480,   // ms: 1文字の退場アニメーション時間
  exitStagger: 45,    // ms: 文字ごとの退場ディレイ
  loopPause: 700,   // ms: ループ前の休憩時間
  entryEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  exitEasing: 'cubic-bezier(0.7, 0, 0.84, 0)',
};

let allHeroChars = [];
let heroLoopTimer = null;
let isHeroRunning = false;

function buildHeroChars(text) {
  const titleEl = document.getElementById('heroTitle');
  if (!titleEl) return;
  titleEl.innerHTML = '';
  allHeroChars = [];

  const words = text.trim().split(' ');
  words.forEach((word, wi) => {
    if (wi > 0) {
      const sp = document.createElement('span');
      sp.style.cssText = 'display:inline-block;width:0.28em;';
      titleEl.appendChild(sp);
    }
    const group = document.createElement('span');
    group.className = 'word-group';
    const isReverse = (wi === 1); // Apply to 'Without'

    const charArray = [...word];
    const wordLen = charArray.length;
    const charStaggerBase = allHeroChars.length;

    charArray.forEach((letter, li) => {
      const span = document.createElement('span');
      span.className = 'char';
      if (isReverse) span.classList.add('is-reverse');
      span.textContent = letter;

      // "Without" (isReverse) は頭の文字から、それ以外は最後の文字から
      const staggerIndex = charStaggerBase + (isReverse ? li : (wordLen - 1 - li));
      span.dataset.stagger = staggerIndex;

      group.appendChild(span);
      allHeroChars.push(span);
    });
    titleEl.appendChild(group);
  });
}

function resetHeroChars() {
  allHeroChars.forEach(c => {
    c.style.animation = 'none';
    c.style.opacity = '0';
  });
}

function runHeroCycle() {
  if (!isHeroRunning) return;
  resetHeroChars();

  allHeroChars.forEach((c) => {
    const staggerIndex = parseInt(c.dataset.stagger, 10);
    setTimeout(() => {
      if (!isHeroRunning) return;
      const animName = c.classList.contains('is-reverse') ? 'charEnterReverse' : 'charEnter';
      c.style.animation = `${animName} ${HERO_CONFIG.entryDuration}ms ${HERO_CONFIG.entryEasing} forwards`;
    }, staggerIndex * HERO_CONFIG.entryStagger);
  });

  const entryEnd = (allHeroChars.length - 1) * HERO_CONFIG.entryStagger + HERO_CONFIG.entryDuration;
  const holdStart = entryEnd;
  const exitStart = holdStart + HERO_CONFIG.holdDuration;

  allHeroChars.forEach((c) => {
    const staggerIndex = parseInt(c.dataset.stagger, 10);
    setTimeout(() => {
      if (!isHeroRunning) return;
      const animName = c.classList.contains('is-reverse') ? 'charExitReverse' : 'charExit';
      c.style.animation = `${animName} ${HERO_CONFIG.exitDuration}ms ${HERO_CONFIG.exitEasing} forwards`;
    }, exitStart + staggerIndex * HERO_CONFIG.exitStagger);
  });

  const cycleEnd = exitStart + (allHeroChars.length - 1) * HERO_CONFIG.exitStagger + HERO_CONFIG.exitDuration + HERO_CONFIG.loopPause;
  heroLoopTimer = setTimeout(runHeroCycle, cycleEnd);
}

function startHeroAnimation(text) {
  clearTimeout(heroLoopTimer);
  isHeroRunning = true;
  buildHeroChars(text);
  runHeroCycle();
}

