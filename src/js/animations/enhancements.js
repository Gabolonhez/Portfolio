// Scroll animations and intersection observer
class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");

              // Special handling for skill progress bars
              if (entry.target.classList.contains("acordeon")) {
                const progressBars = entry.target.querySelectorAll(
                  ".skill-progress-bar"
                );
                setTimeout(() => {
                  progressBars.forEach((bar) => {
                    const level = bar.dataset.level;
                    if (level) {
                      bar.style.width = level + "%";
                    }
                  });
                }, 300);
              }

              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      // Observe all accordions
      document.querySelectorAll(".acordeon").forEach((section) => {
        section.classList.add("animate-on-scroll");
        this.observer.observe(section);
      });
    }
  }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Back to top button
function createBackToTopButton() {
  const backToTop = document.createElement("button");
  backToTop.innerHTML = "↑";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Voltar ao topo");
  backToTop.style.display = "none";

  document.body.appendChild(backToTop);

  // Show/hide based on scroll
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  });

  // Smooth scroll to top
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Performance monitoring
class PerformanceTracker {
  constructor() {
    this.metrics = {};
    this.startTime = performance.now();
  }

  mark(name) {
    this.metrics[name] = performance.now() - this.startTime;
    console.log(`⚡ ${name}: ${this.metrics[name].toFixed(2)}ms`);
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

// Enhanced loading with performance tracking
const perfTracker = new PerformanceTracker();

// Initialize all enhancements when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  perfTracker.mark("DOM_Ready");

  // Initialize scroll animations
  new ScrollAnimations();
  perfTracker.mark("Scroll_Animations_Init");

  // Initialize smooth scroll
  initSmoothScroll();
  perfTracker.mark("Smooth_Scroll_Init");

  // Create back to top button
  createBackToTopButton();
  perfTracker.mark("Back_To_Top_Init");

  // Add loading performance info
  window.addEventListener("load", () => {
    perfTracker.mark("Page_Fully_Loaded");
    console.log("📊 Performance Metrics:", perfTracker.getMetrics());
  });
});

// Lazy loading for images
function initLazyLoading() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Enhanced theme toggle with system preference
function enhancedThemeToggle() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Set initial theme
  if (!savedTheme) {
    const initialTheme = systemPrefersDark ? "dark" : "light";
    localStorage.setItem("theme", initialTheme);
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme-manual")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
      }
    });
}

// Keyboard navigation improvements
function enhanceKeyboardNavigation() {
  let focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  document.addEventListener("keydown", (e) => {
    // Enhanced ESC key handling
    if (e.key === "Escape") {
      // Close any open accordions or modals
      document.querySelectorAll(".acordeon.open").forEach((accordion) => {
        accordion.classList.remove("open");
      });
    }

    // Skip to main content with Alt+S
    if (e.altKey && e.key === "s") {
      e.preventDefault();
      document.getElementById("main-content")?.focus();
    }

    // Toggle theme with Alt+T
    if (e.altKey && e.key === "t") {
      e.preventDefault();
      document.getElementById("theme-toggle")?.click();
    }
  });
}

// Initialize all enhancements
document.addEventListener("DOMContentLoaded", () => {
  enhancedThemeToggle();
  enhanceKeyboardNavigation();

  // Add keyboard shortcuts info to console
  console.log(`
🔐 Keyboard Shortcuts:
- Alt + S: Skip to main content
- Alt + T: Toggle theme
- ESC: Close accordions
- Tab: Navigate through elements
    `);
});

export { ScrollAnimations, PerformanceTracker };
