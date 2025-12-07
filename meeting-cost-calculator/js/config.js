/**
 * ==================== APPLICATION CONFIG ====================
 * Central configuration for the Meeting Cost Calculator
 * 
 * @file config.js
 * @version 2.0.0
 */

/**
 * Main Application Configuration
 */
const APP_CONFIG = {
  version: '2.0.0',
  
  // Default values
  defaults: {
    people: 5,
    costPerPerson: 50,
    currency: 'EUR',
    language: 'de',
    theme: 'auto',
  },
  
  // Validation limits
  limits: {
    minPeople: 1,
    maxPeople: 100,
    minCost: 0,
    maxCost: 10000,
    maxHistoryEntries: 50,
  },
  
  // Feature flags
  features: {
    enableEmojis: true,
    enableAutoSave: true,
    enableKeyboardShortcuts: true,
    enablePWA: true,
  },
  
  // Performance settings
  performance: {
    timerUpdateInterval: 1000,
    autoSaveInterval: 2000,
  },
  
  // Storage keys
  storage: {
    session: 'session',
    settings: 'settings',
    history: 'history',
    theme: 'theme',
    language: 'language',
  },
  
  // URL parameters for sharing
  urlParams: {
    people: 'p',
    cost: 'c',
    currency: 'cur',
    language: 'lang',
    elapsed: 't',
  },
};

/**
 * Currency Configuration
 */
const CURRENCY_CONFIG = {
  EUR: { symbol: '€', decimals: 2, position: 'after' },
  USD: { symbol: '$', decimals: 2, position: 'before' },
  GBP: { symbol: '£', decimals: 2, position: 'before' },
  CHF: { symbol: 'CHF', decimals: 2, position: 'after' },
  JPY: { symbol: '¥', decimals: 0, position: 'before' },
  CNY: { symbol: '¥', decimals: 2, position: 'before' },
};

/**
 * Emoji Configuration
 */
const EMOJI_CONFIG = {
  celebration: ['🎉', '🎊', '✨', '🎈', '🥳'],
  warning: ['⚠️', '⏰', '💸', '🔥'],
  
  // Time milestones (in seconds)
  milestones: {
    300: ['⏰', '⏱️'],      // 5 minutes
    600: ['🕐', '⌚'],      // 10 minutes
    900: ['⏰', '🕒'],      // 15 minutes
    1800: ['⏰', '🕕'],     // 30 minutes
    3600: ['⏰', '🕐'],     // 1 hour
    7200: ['⏰', '🕑'],     // 2 hours
  },
  
  // Cost milestones
  costMilestones: {
    100: ['💰', '💵'],
    500: ['💰', '💸'],
    1000: ['💰', '💸', '🤑'],
    5000: ['💸', '🤑', '💎'],
  },
  
  // Animation settings
  animation: {
    duration: 3000,
    maxOnScreen: 10,
    spawnInterval: 150,
  },
};

/**
 * Notification Configuration
 */
const NOTIFICATION_CONFIG = {
  duration: 3000,
  
  types: {
    success: { icon: '✅', color: '#10b981' },
    error: { icon: '❌', color: '#ef4444' },
    warning: { icon: '⚠️', color: '#f59e0b' },
    info: { icon: 'ℹ️', color: '#3b82f6' },
  },
};

/**
 * Share Configuration
 */
const SHARE_CONFIG = {
  templates: {
    default: '💰 Meeting-Kosten: {cost} | ⏱️ Zeit: {time} | 👥 Teilnehmer: {people}\n\n🔗 {url}',
    whatsapp: '💰 *Meeting-Kosten*\n\nKosten: {cost}\nZeit: {time}\nTeilnehmer: {people}\n\n🔗 {url}',
    slack: '💰 *Meeting-Kosten*\n• Kosten: {cost}\n• Zeit: {time}\n• Teilnehmer: {people}\n\n🔗 {url}',
    email: {
      subject: '💰 Meeting-Kosten: {cost}',
      body: 'Hallo,\n\nhier sind die Kosten unseres Meetings:\n\n💰 Gesamtkosten: {cost}\n⏱️ Dauer: {time}\n👥 Teilnehmer: {people}\n\nDetails: {url}\n\nViele Grüße'
    },
  },
};

/**
 * Debug Configuration
 */
const DEBUG_CONFIG = {
  enabled: false,
  showStateChanges: false,
  logErrors: true,
};

/**
 * Supported Languages
 */
const SUPPORTED_LANGUAGES = ['de', 'en', 'es', 'fr', 'it', 'pl'];

/**
 * Supported Currencies
 */
const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'JPY', 'CNY'];

// Log config loaded
console.log('[Config] Configuration loaded - v' + APP_CONFIG.version);
