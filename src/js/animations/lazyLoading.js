/**
 * Lazy Loading de Imagens - Gabriel Bolonhez Portfolio
 * Carrega imagens apenas quando ficam visíveis na viewport
 * Melhora significativamente o tempo de carregamento inicial
 */

// Configuração do Intersection Observer
const imageObserverConfig = {
  root: null,
  rootMargin: '50px', // Começa a carregar 50px antes da imagem entrar na viewport
  threshold: 0.01
};

// Callback quando a imagem entra na viewport
function handleImageIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      
      // Carregar a imagem
      loadImage(img);
      
      // Parar de observar esta imagem
      observer.unobserve(img);
    }
  });
}

// Função para carregar a imagem
function loadImage(img) {
  // Verifica se há data-src
  const src = img.dataset.src;
  if (!src) return;
  
  // Cria uma nova imagem para pré-carregar
  const tempImage = new Image();
  
  tempImage.onload = () => {
    // Quando carregada, substitui o src e adiciona classe loaded
    img.src = src;
    img.classList.add('loaded');
    img.classList.remove('lazy');
    
    // Remove o data-src
    delete img.dataset.src;
    
    // Se tiver srcset, também carrega
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      delete img.dataset.srcset;
    }
  };
  
  tempImage.onerror = () => {
    console.error(`Erro ao carregar imagem: ${src}`);
    img.classList.add('error');
  };
  
  // Inicia o carregamento
  tempImage.src = src;
  if (img.dataset.srcset) {
    tempImage.srcset = img.dataset.srcset;
  }
}

// Inicializa o lazy loading
function initLazyLoading() {
  // Seleciona todas as imagens com classe 'lazy'
  const lazyImages = document.querySelectorAll('img.lazy');
  
  // Verifica se o navegador suporta Intersection Observer
  if ('IntersectionObserver' in window) {
    // Cria o observer
    const imageObserver = new IntersectionObserver(
      handleImageIntersection,
      imageObserverConfig
    );
    
    // Observa cada imagem lazy
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
    
    console.log(`🖼️ Lazy loading inicializado para ${lazyImages.length} imagens`);
  } else {
    // Fallback: carrega todas as imagens imediatamente
    console.warn('⚠️ Intersection Observer não suportado. Carregando todas as imagens.');
    lazyImages.forEach(img => loadImage(img));
  }
}

// Lazy loading para background images
function initLazyBackgrounds() {
  const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
  
  if ('IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const bgUrl = element.dataset.bg;
          
          if (bgUrl) {
            element.style.backgroundImage = `url(${bgUrl})`;
            element.classList.add('loaded');
            element.classList.remove('lazy-bg');
            delete element.dataset.bg;
          }
          
          observer.unobserve(element);
        }
      });
    }, imageObserverConfig);
    
    lazyBackgrounds.forEach(bg => bgObserver.observe(bg));
    console.log(`🎨 Lazy loading inicializado para ${lazyBackgrounds.length} backgrounds`);
  } else {
    // Fallback
    lazyBackgrounds.forEach(element => {
      const bgUrl = element.dataset.bg;
      if (bgUrl) {
        element.style.backgroundImage = `url(${bgUrl})`;
        element.classList.add('loaded');
      }
    });
  }
}

// CSS de transição para imagens carregadas
function addLazyLoadingStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Placeholder para imagens lazy */
    img.lazy {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
      );
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    img.lazy.loaded {
      opacity: 1;
      background: none;
      animation: none;
    }
    
    img.lazy.error {
      opacity: 0.5;
      background: #ffebee;
    }
    
    /* Animação de loading */
    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    
    /* Lazy backgrounds */
    .lazy-bg {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: opacity 0.3s ease-in-out;
    }
    
    .lazy-bg:not(.loaded) {
      background-color: #f0f0f0;
    }
  `;
  document.head.appendChild(style);
}

// Inicializa tudo quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addLazyLoadingStyles();
    initLazyLoading();
    initLazyBackgrounds();
  });
} else {
  addLazyLoadingStyles();
  initLazyLoading();
  initLazyBackgrounds();
}

// Exporta para uso externo se necessário
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initLazyLoading,
    initLazyBackgrounds,
    loadImage
  };
}
