// About Section Enhancement
// Populate and animate the About Me section

function updateAboutSection(profileData) {
  if (!profileData.about) return;

  const about = profileData.about;

  // Update title and description
  const aboutTitle = document.getElementById('about.title');
  const aboutDescription = document.getElementById('about.description');
  
  if (aboutTitle) aboutTitle.textContent = about.title;
  if (aboutDescription) aboutDescription.textContent = about.description;

  // Initialize animations
  initAboutAnimations();
}

// Animate elements on scroll
function initAboutAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe description
  const description = document.querySelector('.about-description');
  if (description) {
    description.style.opacity = '0';
    description.style.transform = 'translateY(20px)';
    description.style.transition = 'all 0.6s ease';
    observer.observe(description);
  }

  // Add fade-in class when visible
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  if (description) {
    fadeInObserver.observe(description);
  }
}

// Smooth scroll to about section
function scrollToAbout() {
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    aboutSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// Progress indicator for timeline reading
function initTimelineProgress() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  window.addEventListener('scroll', () => {
    const timelineRect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
      const progress = Math.min(
        Math.max(
          (windowHeight - timelineRect.top) / (timelineRect.height + windowHeight),
          0
        ),
        1
      );
      
      const timelineLine = timeline.querySelector('::before');
      if (timelineLine) {
        timelineLine.style.transform = `scaleY(${progress})`;
      }
    }
  });
}

// Add copy functionality to timeline items (optional)
function initTimelineCopy() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach(item => {
    item.addEventListener('dblclick', () => {
      const role = item.querySelector('.timeline-role').textContent;
      const company = item.querySelector('.timeline-company').textContent;
      const text = `${role} - ${company}`;
      
      navigator.clipboard.writeText(text).then(() => {
        showNotification(currentLanguage === 'pt' ? 'Copiado!' : 'Copied!');
      });
    });
  });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = `✓ ${message}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(40, 167, 69, 0.95);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Add CSS for notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(notificationStyle);

// Initialize all about enhancements
function initAboutEnhancements() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Initialization code if needed
    });
  }
}

// Run on load
initAboutEnhancements();

// Re-initialize when language changes
window.addEventListener('languageChanged', () => {
  setTimeout(() => {
    initAboutAnimations();
  }, 500);
});

// Export function for use in main.js
if (typeof window !== 'undefined') {
  window.updateAboutSection = updateAboutSection;
}
