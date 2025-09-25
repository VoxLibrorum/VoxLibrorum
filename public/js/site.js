(function () {
  const init = () => {
    const { body, documentElement } = document;
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = reduceMotionQuery.matches;

    documentElement.classList.add('js-ready');
    body.classList.add('js-ready');

    const animatedElements = document.querySelectorAll('[data-animate]');

    if (animatedElements.length > 0) {
      if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        body.classList.add('has-animations');
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

        animatedElements.forEach((element) => {
          observer.observe(element);
        });
      } else {
        animatedElements.forEach((element) => {
          element.classList.add('is-visible');
        });
      }
    }

    const emberField = document.querySelector('#ember-field');
    if (emberField && !prefersReducedMotion) {
      const emberCount = window.innerWidth < 768 ? 35 : 70;
      const emberFragment = document.createDocumentFragment();
      for (let i = 0; i < emberCount; i += 1) {
        const ember = document.createElement('span');
        ember.style.left = `${Math.random() * 100}%`;
        ember.style.animationDelay = `${Math.random() * -24}s`;
        ember.style.animationDuration = `${12 + Math.random() * 14}s`;
        ember.style.opacity = `${0.3 + Math.random() * 0.6}`;
        const scale = 0.4 + Math.random() * 1.3;
        ember.style.transform = `scale(${scale})`;
        emberFragment.appendChild(ember);
      }
      emberField.appendChild(emberFragment);
    }

    const parallaxItems = document.querySelectorAll('[data-parallax]');
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (parallaxItems.length > 0 && !prefersReducedMotion && supportsFinePointer) {
      let pointerX = 0;
      let pointerY = 0;
      let currentX = 0;
      let currentY = 0;
      let frameRequested = false;

      const animateParallax = () => {
        const deltaX = pointerX - currentX;
        const deltaY = pointerY - currentY;

        currentX += deltaX * 0.12;
        currentY += deltaY * 0.12;

        parallaxItems.forEach((item) => {
          const intensity = parseFloat(item.dataset.parallax || '0');
          const translateX = currentX * intensity * -40;
          const translateY = currentY * intensity * -24;
          item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        });

        frameRequested = false;
      };

      window.addEventListener('mousemove', (event) => {
        pointerX = event.clientX / window.innerWidth - 0.5;
        pointerY = event.clientY / window.innerHeight - 0.5;

        if (!frameRequested) {
          frameRequested = true;
          window.requestAnimationFrame(animateParallax);
        }
      });

      window.addEventListener('mouseleave', () => {
        pointerX = 0;
        pointerY = 0;

        if (!frameRequested) {
          frameRequested = true;
          window.requestAnimationFrame(animateParallax);
        }
      });
    } else if (parallaxItems.length > 0) {
      parallaxItems.forEach((item) => {
        item.style.transform = 'translate3d(0, 0, 0)';
      });
    }

    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
        progressBar.style.transform = `scaleX(${progress})`;
      };
      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
