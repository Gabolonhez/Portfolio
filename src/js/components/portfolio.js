// Portfolio Section Enhancements
// Animation and interaction improvements for project cards

// Animate cards on scroll
function initPortfolioAnimations() {
  const portfolioCards = document.querySelectorAll('.portfolio li');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        // Stagger animation
        setTimeout(() => {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 50);
          
          entry.target.dataset.animated = 'true';
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });

  portfolioCards.forEach(card => {
    observer.observe(card);
  });
}

// Add parallax effect to project thumbnails
function initProjectParallax() {
  const projectCards = document.querySelectorAll('.portfolio li');
  
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      const thumbnail = card.querySelector('.project-thumbnail');
      if (thumbnail) {
        thumbnail.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const thumbnail = card.querySelector('.project-thumbnail');
      if (thumbnail) {
        thumbnail.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      }
    });
  });
}

// Enhanced hover effect with ripple
function initProjectRipple() {
  const projectLinks = document.querySelectorAll('.project-link');
  
  projectLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      // Add ripple styles if not already in CSS
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple-effect 0.6s ease-out';
      ripple.style.pointerEvents = 'none';
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Filter projects by technology
function initProjectFilter() {
  // Get all unique technologies
  const allTechs = new Set();
  document.querySelectorAll('.tech-tag').forEach(tag => {
    allTechs.add(tag.textContent.trim());
  });

  // Create filter UI (optional - can be added later)
  // This is a placeholder for future enhancement
  console.log('Available technologies:', Array.from(allTechs));
}

// Lazy load project images
function initLazyLoadImages() {
  const images = document.querySelectorAll('.project-thumbnail img');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    // If image has data-src attribute, observe it
    if (img.dataset.src) {
      imageObserver.observe(img);
    }
  });
}

// Add copy project link functionality
function initCopyLink() {
  const projectCards = document.querySelectorAll('.portfolio li');
  
  projectCards.forEach(card => {
    // Add double-click to copy link (optional feature)
    card.addEventListener('dblclick', () => {
      const demoLink = card.querySelector('.project-link.demo');
      if (demoLink) {
        const url = demoLink.href;
        navigator.clipboard.writeText(url).then(() => {
          showCopyNotification(card);
        });
      }
    });
  });
}

function showCopyNotification(element) {
  const notification = document.createElement('div');
  notification.textContent = currentLanguage === 'pt' ? '✓ Link copiado!' : '✓ Link copied!';
  notification.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(40, 167, 69, 0.95);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 1000;
    animation: fadeInOut 2s ease;
  `;
  
  element.style.position = 'relative';
  element.appendChild(notification);
  
  setTimeout(() => notification.remove(), 2000);
}

// Add CSS animation for ripple
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-effect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    10%, 90% { opacity: 1; }
  }
`;
document.head.appendChild(style);

// Initialize all portfolio enhancements
function initPortfolioEnhancements() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        initPortfolioAnimations();
        initProjectParallax();
        initProjectRipple();
        initLazyLoadImages();
        // initCopyLink(); // Optional - uncomment if you want this feature
      }, 100);
    });
  } else {
    setTimeout(() => {
      initPortfolioAnimations();
      initProjectParallax();
      initProjectRipple();
      initLazyLoadImages();
      // initCopyLink();
    }, 100);
  }
}

// Run on load
initPortfolioEnhancements();

// Re-initialize when language changes or content updates
window.addEventListener('languageChanged', () => {
  setTimeout(() => {
    initPortfolioAnimations();
    initProjectParallax();
    initProjectRipple();
  }, 500);
});

// Re-initialize when portfolio data is loaded
const portfolioElement = document.getElementById('profile.portfolio');
if (portfolioElement) {
  const observer = new MutationObserver(() => {
    initPortfolioEnhancements();
  });
  
  observer.observe(portfolioElement, { 
    childList: true, 
    subtree: true 
  });
}
