/**
 * ==================== CONFIGURATION ====================
 * Global configuration constants for the Meeting Cost Calculator
 * 
 * @file config.js
 * @version 2.0.0
 */

/**
 * Application Configuration
 */
const APP_CONFIG = {
  // App Information
  name: 'Meeting Cost Calculator',
  version: '2.0.0',
  author: 'Meeting Cost Calculator Team',
  
  // Feature Flags
  features: {
    enableEmojis: true,
    enableNotifications: true,
    enablePWA: true,
    enableSharing: true,
    enableKeyboardShortcuts: true,
    enableHistory: true,
    enableAutoSave: true,
    enableDarkMode: true,
  },
  
  // Performance Settings
  performance: {
    autoSaveInterval: 2000, // ms
    timerUpdateInterval: 100, // ms
    emojiAnimationDuration: 3000, // ms
    notificationDuration: 3000, // ms
    debounceDelay: 300, // ms
  },
  
  // Limits & Constraints
  limits: {
    minPeople: 1,
    maxPeople: 1000,
    minCost: 0,
    maxCost: 10000,
    maxHistoryEntries: 100,
    maxEmojisOnScreen: 20,
  },
  
  // Default Values
  defaults: {
    people: 2,
    costPerPerson: 50,
    currency: 'EUR',
    language: 'de',
    theme: 'auto',
  },
  
  // Storage Keys
  storage: {
    session: 'meetingCalculatorSession',
    settings: 'meetingCalculatorSettings',
    history: 'meetingCalculatorHistory',
    theme: 'meetingCalculatorTheme',
    language: 'meetingCalculatorLanguage',
  },
  
  // URL Parameters
  urlParams: {
    people: 'p',
    cost: 'c',
    currency: 'cur',
    language: 'lang',
    elapsed: 'e',
  },
};

/**
 * Currency Configuration
 */
const CURRENCY_CONFIG = {
  EUR: { symbol: '€', name: 'Euro', decimals: 2, position: 'after' },
  USD: { symbol: '$', name: 'US Dollar', decimals: 2, position: 'before' },
  GBP: { symbol: '£', name: 'British Pound', decimals: 2, position: 'before' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', decimals: 2, position: 'after' },
  JPY: { symbol: '¥', name: 'Japanese Yen', decimals: 0, position: 'before' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', decimals: 2, position: 'before' },
  INR: { symbol: '₹', name: 'Indian Rupee', decimals: 2, position: 'before' },
  AUD: { symbol: '$', name: 'Australian Dollar', decimals: 2, position: 'before' },
  CAD: { symbol: '$', name: 'Canadian Dollar', decimals: 2, position: 'before' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', decimals: 2, position: 'before' },
};

/**
 * Language Configuration
 */
const LANGUAGE_CONFIG = {
  de: { name: 'Deutsch', flag: '🇩🇪', rtl: false },
  en: { name: 'English', flag: '🇬🇧', rtl: false },
  es: { name: 'Español', flag: '🇪🇸', rtl: false },
  fr: { name: 'Français', flag: '🇫🇷', rtl: false },
  it: { name: 'Italiano', flag: '🇮🇹', rtl: false },
  pl: { name: 'Polski', flag: '🇵🇱', rtl: false },
};

/**
 * Theme Configuration
 */
const THEME_CONFIG = {
  auto: { name: 'Auto', icon: '🌓' },
  light: { name: 'Light', icon: '☀️' },
  dark: { name: 'Dark', icon: '🌙' },
};

/**
 * Emoji Configuration for Celebrations
 */
const EMOJI_CONFIG = {
  // Milestone Emojis (time-based)
  milestones: {
    60: ['⏰', '⏱️', '🕐'],           // 1 minute
    300: ['🎯', '⭐', '✨'],          // 5 minutes
    600: ['🎉', '🎊', '🥳'],         // 10 minutes
    1800: ['😱', '💸', '💰'],        // 30 minutes
    3600: ['🔥', '💥', '⚠️'],        // 1 hour
  },
  
  // Cost Milestone Emojis
  costMilestones: {
    100: ['💵', '💶', '💷'],
    500: ['💰', '🤑', '💸'],
    1000: ['🏦', '💎', '👑'],
  },
  
  // Random celebration emojis
  celebration: ['🎉', '🎊', '✨', '⭐', '🌟', '💫', '🎈', '🎆', '🎇'],
  
  // Warning emojis for long meetings
  warning: ['⚠️', '🚨', '⏰', '😰', '😱', '💀'],
  
  // Animation settings
  animation: {
    duration: 3000, // ms
    maxOnScreen: 20,
    spawnInterval: 200, // ms between spawns
  },
};

/**
 * Keyboard Shortcuts Configuration
 */
const KEYBOARD_CONFIG = {
  shortcuts: {
    toggleTimer: ['Enter', 'Space', 'Ctrl+Space'],
    reset: ['Ctrl+R'],
    openInfo: ['Ctrl+I'],
    openShare: ['Ctrl+S'],
    openShortcuts: ['Ctrl+?', 'Ctrl+/'],
    closeModal: ['Escape'],
    increasePeople: ['+', '='],
    decreasePeople: ['-', '_'],
  },
  
  // Debounce settings
  debounce: 300, // ms
  
  // Prevent default for these keys
  preventDefaults: ['Space', 'Enter'],
};

/**
 * Notification Configuration
 */
const NOTIFICATION_CONFIG = {
  duration: 3000, // ms
  position: 'top-right',
  types: {
    success: { icon: '✅', color: 'green' },
    error: { icon: '❌', color: 'red' },
    warning: { icon: '⚠️', color: 'orange' },
    info: { icon: 'ℹ️', color: 'blue' },
  },
};

/**
 * Validation Rules
 */
const VALIDATION_RULES = {
  people: {
    min: APP_CONFIG.limits.minPeople,
    max: APP_CONFIG.limits.maxPeople,
    default: APP_CONFIG.defaults.people,
    errorMessage: 'Number of people must be between {min} and {max}',
  },
  
  cost: {
    min: APP_CONFIG.limits.minCost,
    max: APP_CONFIG.limits.maxCost,
    default: APP_CONFIG.defaults.costPerPerson,
    errorMessage: 'Cost must be between {min} and {max}',
  },
  
  currency: {
    allowed: Object.keys(CURRENCY_CONFIG),
    default: APP_CONFIG.defaults.currency,
    errorMessage: 'Invalid currency code',
  },
  
  language: {
    allowed: Object.keys(LANGUAGE_CONFIG),
    default: APP_CONFIG.defaults.language,
    errorMessage: 'Invalid language code',
  },
};

/**
 * Share Configuration
 */
const SHARE_CONFIG = {
  // Share text templates
  templates: {
    default: 'Check out this meeting cost: {cost} for {time} with {people} people',
    whatsapp: '💰 Meeting Cost: {cost}\n⏱️ Duration: {time}\n👥 People: {people}\n\nCalculate yours: {url}',
    email: {
      subject: 'Meeting Cost Calculator Results',
      body: 'Our meeting cost {cost} with {people} participants over {time}.\n\nTry it yourself: {url}',
    },
    slack: '💰 *Meeting Cost Calculator*\n\n*Cost:* {cost}\n*Duration:* {time}\n*Participants:* {people}\n\n<{url}|Calculate your meeting cost>',
  },
  
  // Share platforms
  platforms: {
    whatsapp: 'https://wa.me/?text=',
    slack: 'https://slack.com/intl/en-de/',
    email: 'mailto:?subject=',
  },
};

/**
 * Analytics Configuration (for future use)
 */
const ANALYTICS_CONFIG = {
  enabled: false,
  trackEvents: {
    timerStart: true,
    timerPause: true,
    timerReset: true,
    share: true,
    themeChange: true,
    languageChange: true,
  },
};

/**
 * Debug Configuration
 */
const DEBUG_CONFIG = {
  enabled: false, // Set to true for development
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  showPerformance: false,
  showStateChanges: false,
};

/**
 * Helper function to get configuration value
 * @param {string} path - Dot notation path (e.g., 'APP_CONFIG.defaults.people')
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} Configuration value
 */
function getConfig(path, defaultValue = null) {
  try {
    const keys = path.split('.');
    let value = window;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return defaultValue;
    }
    
    return value;
  } catch (error) {
    console.warn(`[Config] Could not get config for path: ${path}`, error);
    return defaultValue;
  }
}

/**
 * Helper function to validate value against rules
 * @param {string} type - Validation type (people, cost, currency, language)
 * @param {*} value - Value to validate
 * @returns {boolean} Is valid
 */
function validateConfig(type, value) {
  const rules = VALIDATION_RULES[type];
  if (!rules) return true;
  
  if (rules.min !== undefined && value < rules.min) return false;
  if (rules.max !== undefined && value > rules.max) return false;
  if (rules.allowed && !rules.allowed.includes(value)) return false;
  
  return true;
}

/**
 * Helper function to get default value
 * @param {string} type - Config type
 * @returns {*} Default value
 */
function getDefaultConfig(type) {
  return VALIDATION_RULES[type]?.default || APP_CONFIG.defaults[type] || null;
}

/**
 * Log configuration on load (only in debug mode)
 */
if (DEBUG_CONFIG.enabled) {
  console.group('[Config] Application Configuration Loaded');
  console.log('Version:', APP_CONFIG.version);
  console.log('Features:', APP_CONFIG.features);
  console.log('Defaults:', APP_CONFIG.defaults);
  console.log('Debug Mode:', DEBUG_CONFIG.enabled);
  console.groupEnd();
}

// Freeze configurations to prevent modifications
Object.freeze(APP_CONFIG);
Object.freeze(CURRENCY_CONFIG);
Object.freeze(LANGUAGE_CONFIG);
Object.freeze(THEME_CONFIG);
Object.freeze(EMOJI_CONFIG);
Object.freeze(KEYBOARD_CONFIG);
Object.freeze(NOTIFICATION_CONFIG);
Object.freeze(VALIDATION_RULES);
Object.freeze(SHARE_CONFIG);
Object.freeze(ANALYTICS_CONFIG);
Object.freeze(DEBUG_CONFIG);
