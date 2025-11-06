/**
 * Configuration Constants - Gabriel Bolonhez Portfolio
 * Centralized configuration following DRY principles
 * @author Gabriel Bolonhez
 */

// ========================================
// API & DATA
// ========================================
export const API = {
  DATA_PATH: './src/data/',
  PROFILE_PT: './src/data/profilePT.json',
  PROFILE_EN: './src/data/profileEN.json',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000
};

// ========================================
// LANGUAGE
// ========================================
export const LANGUAGE = {
  DEFAULT: 'pt',
  SUPPORTED: ['pt', 'en'],
  STORAGE_KEY: 'preferredLanguage'
};

// ========================================
// THEME
// ========================================
export const THEME = {
  DARK: 'dark-mode',
  LIGHT: 'light-mode',
  STORAGE_KEY: 'theme',
  DEFAULT: 'dark-mode'
};

// ========================================
// ANIMATION & UI
// ========================================
export const ANIMATION = {
  COUNTER_DURATION: 2000,
  SCROLL_THRESHOLD: 0.1,
  SCROLL_ROOT_MARGIN: '0px 0px -50px 0px',
  CARD_STAGGER_DELAY: 100,
  LAZY_LOAD_MARGIN: '50px',
  LAZY_LOAD_THRESHOLD: 0.01
};

// ========================================
// LOADING STATES
// ========================================
export const LOADING = {
  TEXT: {
    pt: 'Carregando...',
    en: 'Loading...'
  },
  ERROR: {
    pt: 'Erro ao carregar dados',
    en: 'Error loading data'
  }
};

// ========================================
// SELECTORS (commonly used DOM selectors)
// ========================================
export const SELECTORS = {
  THEME_TOGGLE: '#theme-toggle',
  BTN_PT: '#btnPT',
  BTN_EN: '#btnEN',
  ACORDEON_TRIGGER: '.acordeon .trigger',
  HERO_STATS: '.stat-number',
  PORTFOLIO_CARDS: '.portfolio li'
};

// ========================================
// HELPERS
// ========================================

/**
 * Get profile data URL based on language
 * @param {string} language - 'pt' or 'en'
 * @returns {string} URL to profile JSON
 */
export function getProfileURL(language) {
  return language === 'pt' ? API.PROFILE_PT : API.PROFILE_EN;
}

/**
 * Get loading text based on language
 * @param {string} language - 'pt' or 'en'
 * @returns {string} Loading text
 */
export function getLoadingText(language) {
  return LOADING.TEXT[language] || LOADING.TEXT[LANGUAGE.DEFAULT];
}

/**
 * Get error text based on language
 * @param {string} language - 'pt' or 'en'
 * @returns {string} Error text
 */
export function getErrorText(language) {
  return LOADING.ERROR[language] || LOADING.ERROR[LANGUAGE.DEFAULT];
}

/**
 * Check if language is supported
 * @param {string} language - Language code to check
 * @returns {boolean} True if supported
 */
export function isLanguageSupported(language) {
  return LANGUAGE.SUPPORTED.includes(language);
}
