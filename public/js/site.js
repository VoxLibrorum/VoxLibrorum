(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (animatedElements.length > 0) {
      if ('IntersectionObserver' in window) {
        document.body.classList.add('js-enabled');
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.25 });

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
    if (emberField) {
      const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      const populateEmbers = () => {
        const emberCount = window.innerWidth < 768 ? 35 : 70;
        const prefersReducedMotion = reduceMotionQuery.matches;

        emberField.innerHTML = '';
        emberField.classList.toggle('is-reduced-motion', prefersReducedMotion);

        for (let i = 0; i < emberCount; i += 1) {
          const ember = document.createElement('span');
          const scale = 0.4 + Math.random() * 1.3;
          const baseOpacity = prefersReducedMotion ? 0.2 : 0.3;

          ember.style.left = `${Math.random() * 100}%`;
          ember.style.transform = `scale(${scale})`;
          ember.style.opacity = `${baseOpacity + Math.random() * 0.5}`;

          if (prefersReducedMotion) {
            ember.style.bottom = 'auto';
            ember.style.top = `${Math.random() * 90}%`;
          } else {
            ember.style.top = '';
            ember.style.bottom = '';
            ember.style.animationDelay = `${Math.random() * -24}s`;
            ember.style.animationDuration = `${12 + Math.random() * 14}s`;
          }

          emberField.appendChild(ember);
        }
      };

      populateEmbers();

      const handleMotionChange = () => {
        populateEmbers();
      };

      if (typeof reduceMotionQuery.addEventListener === 'function') {
        reduceMotionQuery.addEventListener('change', handleMotionChange);
      } else if (typeof reduceMotionQuery.addListener === 'function') {
        reduceMotionQuery.addListener(handleMotionChange);
      }

      let emberResizeFrame = null;
      window.addEventListener('resize', () => {
        if (emberResizeFrame) {
          cancelAnimationFrame(emberResizeFrame);
        }

        emberResizeFrame = window.requestAnimationFrame(() => {
          populateEmbers();
          emberResizeFrame = null;
        });
      });
    }

    const parallaxItems = document.querySelectorAll('[data-parallax]');
    window.addEventListener('mousemove', (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      parallaxItems.forEach((item) => {
        const intensity = parseFloat(item.dataset.parallax || '0');
        const translateX = x * intensity * -40;
        const translateY = y * intensity * -24;
        item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });
    });

    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        progressBar.style.transform = `scaleX(${progress})`;
      };
      updateProgress();
      window.addEventListener('scroll', updateProgress);
      window.addEventListener('resize', updateProgress);
    }
  });
})();
