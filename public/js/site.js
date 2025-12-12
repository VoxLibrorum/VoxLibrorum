(function () {
  'use strict';

  /**
   * Configuration constants – tweak here for design changes.
   */
  const CONFIG = {
    MOBILE_BREAKPOINT: 768,
    EMBER_COUNT_MOBILE: 35,
    EMBER_COUNT_DESKTOP: 70,
    PARALLAX_INTENSITY_FACTOR_X: -40,
    PARALLAX_INTENSITY_FACTOR_Y: -24,
    PROGRESS_BAR_SELECTOR: '.scroll-progress-bar',
    ANIMATE_SELECTOR: '[data-animate]',
    EMBER_FIELD_SELECTOR: '#ember-field',
    PARALLAX_SELECTOR: '[data-parallax]',
    OBSERVER_THRESHOLD: 0.25,
  };

  /** Utility selectors */
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  /** Initialise IntersectionObserver based reveal animations. */
  function initRevealAnimations() {
    const animatedElements = $$(CONFIG.ANIMATE_SELECTOR);
    if (!animatedElements.length) return;

    if ('IntersectionObserver' in window) {
      document.body.classList.add('js-enabled');
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: CONFIG.OBSERVER_THRESHOLD });

      animatedElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback – instantly reveal all elements.
      animatedElements.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /** Ember field – creates floating ember particles. */
  function initEmbers() {
    const emberField = $(CONFIG.EMBER_FIELD_SELECTOR);
    if (!emberField) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const createEmber = (prefersReducedMotion) => {
      const ember = document.createElement('span');
      const scale = 0.4 + Math.random() * 1.3;
      const baseOpacity = prefersReducedMotion ? 0.2 : 0.3;

      ember.style.left = `${Math.random() * 100}%`;
      // We use CSS variables so the keyframe animation can use them
      ember.style.setProperty('--measure-scale', scale);
      ember.style.setProperty('--measure-drift', `${(Math.random() - 0.5) * 40}vw`);

      ember.style.opacity = `${baseOpacity + Math.random() * 0.5}`;

      if (prefersReducedMotion) {
        ember.style.bottom = 'auto';
        ember.style.top = `${Math.random() * 90}%`;
        ember.style.animationDelay = '';
        ember.style.animationDuration = '';
        ember.style.transform = `scale(${scale})`; // Static for reduced motion
      } else {
        ember.style.top = '';
        ember.style.bottom = '';
        ember.style.animationDelay = `${Math.random() * -24}s`;
        ember.style.animationDuration = `${12 + Math.random() * 14}s`;
      }
      return ember;
    };

    const populateEmbers = () => {
      const emberCount = window.innerWidth < CONFIG.MOBILE_BREAKPOINT ? CONFIG.EMBER_COUNT_MOBILE : CONFIG.EMBER_COUNT_DESKTOP;
      const prefersReducedMotion = reduceMotionQuery.matches;

      emberField.innerHTML = '';
      emberField.classList.toggle('is-reduced-motion', prefersReducedMotion);

      for (let i = 0; i < emberCount; i++) {
        emberField.appendChild(createEmber(prefersReducedMotion));
      }
    };

    // Initial population.
    populateEmbers();

    // React to motion‑preference changes.
    const handleMotionChange = () => populateEmbers();
    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleMotionChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleMotionChange);
    }

    // Re‑populate on resize – debounced with requestAnimationFrame.
    let resizeRaf = null;
    window.addEventListener('resize', () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        populateEmbers();
        resizeRaf = null;
      });
    });
  }

  /** Parallax effect – mousemove listener throttled via requestAnimationFrame. */
  function initParallax() {
    const items = $$(CONFIG.PARALLAX_SELECTOR);
    if (!items.length) return;

    let rafId = null;
    const onMouseMove = (event) => {
      if (rafId) return; // already scheduled
      rafId = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        items.forEach((item) => {
          const intensity = parseFloat(item.dataset.parallax || '0');
          const translateX = x * intensity * CONFIG.PARALLAX_INTENSITY_FACTOR_X;
          const translateY = y * intensity * CONFIG.PARALLAX_INTENSITY_FACTOR_Y;
          item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        });
        rafId = null;
      });
    };
    window.addEventListener('mousemove', onMouseMove);
  }

  /** Scroll progress bar – updates on scroll and resize. */
  function initScrollProgress() {
    const progressBar = $(CONFIG.PROGRESS_BAR_SELECTOR);
    if (!progressBar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    };

    update();
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
  }

  /** Main entry – wrapped in try/catch for graceful failure. */
  function init() {
    try {
      initRevealAnimations();
      initEmbers();
      initParallax();
      initScrollProgress();
    } catch (e) {
      console.error('site.js initialization error:', e);
    }
  }

  /**
   * Text Decoding Effect suitable for a "Ghost Town" / "Terminal" aesthetic.
   * animatedText(element, finalString, speed)
   */
  function decodeText(element, finalString, duration = 1000) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const length = finalString.length;
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      let output = "";
      const revealIndex = Math.floor(progress * length);

      for (let i = 0; i < length; i++) {
        if (i < revealIndex) {
          output += finalString[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.innerText = output;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.innerText = finalString; // Ensure final state
      }
    };

    requestAnimationFrame(animate);
  }

  // Expose utilities globally safely
  window.VOX_UTILS = {
    decodeText
  };

  // Run after DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
