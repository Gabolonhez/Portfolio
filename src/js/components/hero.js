// Hero Section Enhancements
// Animation for counting numbers in stats

function animateCounter(element, target, duration = 2000) {
  const targetNum = parseInt(target.replace(/\D/g, ''));
  const hasPlus = target.includes('+');
  const start = 0;
  const increment = targetNum / (duration / 16); // 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= targetNum) {
      element.textContent = hasPlus ? `${targetNum}+` : targetNum;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Animate stats when they come into view
function initStatsAnimation() {
  const stats = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const targetValue = entry.target.textContent;
        entry.target.textContent = '0';
        animateCounter(entry.target, targetValue);
        entry.target.dataset.animated = 'true';
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

// Smooth scroll for hero CTAs
function initSmoothScroll() {
  const ctaButtons = document.querySelectorAll('.hero-ctas a[href^="#"]');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const href = button.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Add parallax effect to hero background
function initParallaxEffect() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    if (scrolled < window.innerHeight) {
      header.style.transform = `translateY(${rate}px)`;
      header.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
  });
}

// Typing effect for tagline (alternative to CSS animation)
function typingEffect(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  element.classList.remove('typing');
  
  function typeChar() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, speed);
    }
  }
  
  typeChar();
}

// Tech pills hover effect with ripple
function initTechPillsEffect() {
  const pills = document.querySelectorAll('.tech-pill');
  
  pills.forEach(pill => {
    pill.addEventListener('mouseenter', function(e) {
      this.style.transform = 'translateY(-4px) scale(1.05)';
    });
    
    pill.addEventListener('mouseleave', function(e) {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Stagger animation for hero elements
function initStaggerAnimation() {
  const elements = [
    '.header .photo',
    '.header .title',
    '.header .tagline',
    '.hero-stats',
    '.tech-stack',
    '.hero-ctas',
    '.information'
  ];

  elements.forEach((selector, index) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 150);
    }
  });
}

// Initialize all hero enhancements
function initHeroEnhancements() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        initStatsAnimation();
        initSmoothScroll();
        initTechPillsEffect();
        initStaggerAnimation();
        
        // Uncomment for parallax (can affect performance on some devices)
        // initParallaxEffect();
      }, 100);
    });
  } else {
    setTimeout(() => {
      initStatsAnimation();
      initSmoothScroll();
      initTechPillsEffect();
      initStaggerAnimation();
    }, 100);
  }
}

// Run on load
initHeroEnhancements();

// Re-initialize on language change
window.addEventListener('languageChanged', () => {
  setTimeout(() => {
    initStatsAnimation();
  }, 500);
});
