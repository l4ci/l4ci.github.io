/* ==================== CONFIGURATION ==================== */

/**
 * Currency Configuration
 * Defines formatting rules for different currencies
 */
const CURRENCY_CONFIG = {
  'EUR': { 
    symbol: '€', 
    decimals: 2, 
    position: 'suffix', 
    separator: ',', 
    thousandsSep: '.',
    name: 'Euro'
  },
  'USD': { 
    symbol: '$', 
    decimals: 2, 
    position: 'prefix', 
    separator: '.', 
    thousandsSep: ',',
    name: 'US Dollar'
  },
  'GBP': { 
    symbol: '£', 
    decimals: 2, 
    position: 'prefix', 
    separator: '.', 
    thousandsSep: ',',
    name: 'British Pound'
  },
  'CHF': { 
    symbol: 'CHF', 
    decimals: 2, 
    position: 'suffix', 
    separator: '.', 
    thousandsSep: "'",
    name: 'Swiss Franc'
  },
  'JPY': { 
    symbol: '¥', 
    decimals: 0, 
    position: 'prefix', 
    separator: '', 
    thousandsSep: ',',
    name: 'Japanese Yen'
  },
  'CNY': { 
    symbol: '¥', 
    decimals: 2, 
    position: 'prefix', 
    separator: '.', 
    thousandsSep: ',',
    name: 'Chinese Yuan'
  },
  'INR': { 
    symbol: '₹', 
    decimals: 2, 
    position: 'prefix', 
    separator: '.', 
    thousandsSep: ',',
    name: 'Indian Rupee'
  },
  'AUD': { 
    symbol: 'A$', 
    decimals: 2, 
    position: 'prefix', 
    separator: '.', 
    thousandsSep: ',',
    name: 'Australian Dollar'
  },
  'CAD': { 
    symbol: 'C$', 
    decimals: 2, 
    position: 'prefix', 
    separator: '.', 
    thousandsSep: ',',
    name: 'Canadian Dollar'
  },
  'BRL': { 
    symbol: 'R$', 
    decimals: 2, 
    position: 'prefix', 
    separator: ',', 
    thousandsSep: '.',
    name: 'Brazilian Real'
  }
};

/**
 * Language to Currency Mapping
 * Auto-detect currency based on browser language
 */
const LANGUAGE_CURRENCY_MAP = {
  'de': 'EUR',
  'de-DE': 'EUR',
  'de-AT': 'EUR',
  'de-CH': 'CHF',
  'en': 'USD',
  'en-US': 'USD',
  'en-GB': 'GBP',
  'en-AU': 'AUD',
  'en-CA': 'CAD',
  'en-IN': 'INR',
  'es': 'EUR',
  'es-ES': 'EUR',
  'es-MX': 'USD',
  'es-AR': 'USD',
  'fr': 'EUR',
  'fr-FR': 'EUR',
  'fr-CH': 'CHF',
  'fr-CA': 'CAD',
  'it': 'EUR',
  'it-IT': 'EUR',
  'it-CH': 'CHF',
  'pl': 'EUR',
  'pl-PL': 'EUR',
  'pt': 'EUR',
  'pt-BR': 'BRL',
  'pt-PT': 'EUR',
  'ja': 'JPY',
  'ja-JP': 'JPY',
  'zh': 'CNY',
  'zh-CN': 'CNY',
  'zh-TW': 'CNY'
};

/**
 * Language Flags
 * Emoji flags for language selector
 */
const LANGUAGE_FLAGS = {
  'de': '🇩🇪',
  'en': '🇬🇧',
  'es': '🇪🇸',
  'fr': '🇫🇷',
  'it': '🇮🇹',
  'pl': '🇵🇱'
};

/**
 * Supported Languages
 * List of all available languages
 */
const SUPPORTED_LANGUAGES = ['de', 'en', 'es', 'fr', 'it', 'pl'];

/**
 * Emoji Configuration
 * Emojis used for falling animation
 */
const EMOJIS = ['💵', '💰', '🪙', '💸', '💶', '💷', '💴', '💳', '🤑'];
const MAX_EMOJIS = 50;
const EMOJI_SPAWN_RATE = 1000; // milliseconds

/**
 * LocalStorage Configuration
 */
const STORAGE_KEY = 'meetingCostCalculator';
const STORAGE_VERSION = '1.0';

/**
 * URL Parameter Names
 * Used for sharing functionality
 */
const URL_PARAMS = {
  LANGUAGE: 'lang',
  START_TIMESTAMP: 'start',
  PEOPLE: 'people',
  COST_PER_PERSON: 'cost',
  CURRENCY: 'currency',
  RUNNING: 'running',
  SEGMENTS: 'segments',
  TIMEZONE: 'tz'
};

/**
 * Fun Notifications Configuration
 * Time-based and cost-based notifications
 */
const FUN_NOTIFICATIONS = {
  time: [
    { 
      seconds: 300, 
      message: { 
        de: '⏰ 5 Minuten! Zeit für eine Entscheidung?', 
        en: '⏰ 5 minutes! Time for a decision?', 
        es: '⏰ ¡5 minutos! ¿Hora de decidir?', 
        fr: '⏰ 5 minutes! Temps de décider?', 
        it: '⏰ 5 minuti! Tempo di decidere?', 
        pl: '⏰ 5 minut! Czas na decyzję?' 
      } 
    },
    { 
      seconds: 900, 
      message: { 
        de: '😅 15 Minuten... Das hätte eine E-Mail sein können!', 
        en: '😅 15 minutes... This could have been an email!', 
        es: '😅 15 minutos... ¡Esto podría haber sido un email!', 
        fr: '😅 15 minutes... Cela aurait pu être un email!', 
        it: '😅 15 minuti... Poteva essere un\'email!', 
        pl: '😅 15 minut... To mogło być emailem!' 
      } 
    },
    { 
      seconds: 1800, 
      message: { 
        de: '🤯 30 Minuten! Habt ihr schon Ergebnisse?', 
        en: '🤯 30 minutes! Any results yet?', 
        es: '🤯 ¡30 minutos! ¿Algún resultado?', 
        fr: '🤯 30 minutes! Des résultats?', 
        it: '🤯 30 minuti! Qualche risultato?', 
        pl: '🤯 30 minut! Jakieś wyniki?' 
      } 
    },
    { 
      seconds: 2700, 
      message: { 
        de: '😴 45 Minuten... Kaffee-Pause nötig?', 
        en: '😴 45 minutes... Coffee break needed?', 
        es: '😴 45 minutos... ¿Pausa para café?', 
        fr: '😴 45 minutes... Pause café nécessaire?', 
        it: '😴 45 minuti... Pausa caffè?', 
        pl: '😴 45 minut... Przerwa na kawę?' 
      } 
    },
    { 
      seconds: 3600, 
      message: { 
        de: '🎉 1 Stunde! Das ist Ausdauer! 💪', 
        en: '🎉 1 hour! That\'s dedication! 💪', 
        es: '🎉 ¡1 hora! ¡Eso es dedicación! 💪', 
        fr: '🎉 1 heure! C\'est de la détermination! 💪', 
        it: '🎉 1 ora! Questa è dedizione! 💪', 
        pl: '🎉 1 godzina! To jest zaangażowanie! 💪' 
      } 
    },
    { 
      seconds: 5400, 
      message: { 
        de: '🚨 90 Minuten! Olympisches Meeting! 🏅', 
        en: '🚨 90 minutes! Olympic meeting! 🏅', 
        es: '🚨 ¡90 minutos! ¡Reunión olímpica! 🏅', 
        fr: '🚨 90 minutes! Réunion olympique! 🏅', 
        it: '🚨 90 minuti! Riunione olimpica! 🏅', 
        pl: '🚨 90 minut! Olimpijskie spotkanie! 🏅' 
      } 
    },
    { 
      seconds: 7200, 
      message: { 
        de: '🎬 2 Stunden! Das ist länger als die meisten Filme! 🍿', 
        en: '🎬 2 hours! Longer than most movies! 🍿', 
        es: '🎬 ¡2 horas! ¡Más largo que la mayoría de películas! 🍿', 
        fr: '🎬 2 heures! Plus long que la plupart des films! 🍿', 
        it: '🎬 2 ore! Più lungo della maggior parte dei film! 🍿', 
        pl: '🎬 2 godziny! Dłużej niż większość filmów! 🍿' 
      } 
    }
  ],
  cost: [
    { 
      amount: 50, 
      message: { 
        de: '💸 50€! Ein schönes Abendessen wäre das gewesen!', 
        en: '💸 $50! That would have been a nice dinner!', 
        es: '💸 ¡50€! ¡Eso habría sido una buena cena!', 
        fr: '💸 50€! Cela aurait été un bon dîner!', 
        it: '💸 50€! Sarebbe stata una bella cena!', 
        pl: '💸 50€! To byłby niezły obiad!' 
      } 
    },
    { 
      amount: 100, 
      message: { 
        de: '🎮 100€! Eine neue Konsole wäre cooler gewesen!', 
        en: '🎮 $100! A new game console would have been cooler!', 
        es: '🎮 ¡100€! ¡Una nueva consola habría sido mejor!', 
        fr: '🎮 100€! Une nouvelle console aurait été plus cool!', 
        it: '🎮 100€! Una nuova console sarebbe stata più figa!', 
        pl: '🎮 100€! Nowa konsola byłaby fajniejsza!' 
      } 
    },
    { 
      amount: 250, 
      message: { 
        de: '✈️ 250€! Fast ein Flug nach Barcelona!', 
        en: '✈️ $250! Almost a flight to Barcelona!', 
        es: '✈️ ¡250€! ¡Casi un vuelo a Barcelona!', 
        fr: '✈️ 250€! Presque un vol pour Barcelone!', 
        it: '✈️ 250€! Quasi un volo per Barcellona!', 
        pl: '✈️ 250€! Prawie lot do Barcelony!' 
      } 
    },
    { 
      amount: 500, 
      message: { 
        de: '🏖️ 500€! Ein Wochenendtrip wäre schöner!', 
        en: '🏖️ $500! A weekend trip would be nicer!', 
        es: '🏖️ ¡500€! ¡Un viaje de fin de semana sería mejor!', 
        fr: '🏖️ 500€! Un weekend serait plus agréable!', 
        it: '🏖️ 500€! Un weekend sarebbe più bello!', 
        pl: '🏖️ 500€! Wypad na weekend byłby fajniejszy!' 
      } 
    },
    { 
      amount: 1000, 
      message: { 
        de: '🤑 1000€! Jetzt wird\'s ernst! Das ist echtes Geld!', 
        en: '🤑 $1000! Now it\'s getting serious! That\'s real money!', 
        es: '🤑 ¡1000€! ¡Ahora se pone serio! ¡Eso es dinero real!', 
        fr: '🤑 1000€! Maintenant ça devient sérieux! C\'est de l\'argent réel!', 
        it: '🤑 1000€! Ora diventa serio! Sono soldi veri!', 
        pl: '🤑 1000€! Teraz robi się poważnie! To prawdziwe pieniądze!' 
      } 
    },
    { 
      amount: 2000, 
      message: { 
        de: '💎 2000€! Ein gebrauchtes Auto! 🚗', 
        en: '💎 $2000! A used car! 🚗', 
        es: '💎 ¡2000€! ¡Un coche usado! 🚗', 
        fr: '💎 2000€! Une voiture d\'occasion! 🚗', 
        it: '💎 2000€! Un\'auto usata! 🚗', 
        pl: '💎 2000€! Używany samochód! 🚗' 
      } 
    },
    { 
      amount: 5000, 
      message: { 
        de: '🏆 5000€! LEGENDÄR! Das Meeting geht in die Geschichte ein! 📚', 
        en: '🏆 $5000! LEGENDARY! This meeting goes down in history! 📚', 
        es: '🏆 ¡5000€! ¡LEGENDARIO! ¡Esta reunión pasa a la historia! 📚', 
        fr: '🏆 5000€! LÉGENDAIRE! Cette réunion entre dans l\'histoire! 📚', 
        it: '🏆 5000€! LEGGENDARIO! Questa riunione entra nella storia! 📚', 
        pl: '🏆 5000€! LEGENDARNIE! To spotkanie przejdzie do historii! 📚' 
      } 
    }
  ]
};

/**
 * Validation Constants
 */
const VALIDATION = {
  MIN_PEOPLE: 1,
  MAX_PEOPLE: 999,
  MIN_COST: 0,
  MAX_COST: 9999,
  MAX_ELAPSED_TIME: 86400, // 24 hours in seconds
  MIN_TIMESTAMP: 946684800000, // 2000-01-01
  MAX_TIMESTAMP: 4102444800000 // 2100-01-01
};

/**
 * Debounce Delays (milliseconds)
 */
const DEBOUNCE_DELAYS = {
  SAVE: 500,
  UPDATE_COST: 300,
  RESIZE: 250
};

/* ==================== HELPER FUNCTIONS ==================== */

/**
 * Detect currency from browser language
 * @returns {string} Currency code (e.g., 'EUR', 'USD')
 */
function detectCurrencyFromLanguage() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    
    // Try exact match first
    if (LANGUAGE_CURRENCY_MAP[browserLang]) {
      return LANGUAGE_CURRENCY_MAP[browserLang];
    }
    
    // Try language code without region
    const langCode = browserLang.split('-')[0];
    if (LANGUAGE_CURRENCY_MAP[langCode]) {
      return LANGUAGE_CURRENCY_MAP[langCode];
    }
    
    // Default to EUR
    return 'EUR';
  } catch (error) {
    console.error('Error detecting currency:', error);
    return 'EUR';
  }
}

/**
 * Detect language from browser
 * @returns {string} Language code (e.g., 'de', 'en')
 */
function detectBrowserLanguage() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Check if we support this language
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      return langCode;
    }
    
    // Default to English
    return 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en';
  }
}

/**
 * Parse and sanitize URL parameters
 * @returns {Object} Sanitized URL parameters
 */
function getURLParameters() {
  try {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      // Sanitize parameter values to prevent XSS
      result[key] = sanitizeString(value);
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing URL parameters:', error);
    return {};
  }
}

/**
 * Sanitize string to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validate timestamp
 * @param {number} timestamp - Timestamp to validate
 * @returns {boolean} True if valid
 */
function isValidTimestamp(timestamp) {
  return (
    typeof timestamp === 'number' &&
    !isNaN(timestamp) &&
    timestamp >= VALIDATION.MIN_TIMESTAMP &&
    timestamp <= VALIDATION.MAX_TIMESTAMP
  );
}

/**
 * Validate number within range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clampNumber(value, min, max) {
  const num = parseFloat(value);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

/**
 * Build share URL with current state
 * @param {Object} state - Current application state
 * @returns {string} Share URL
 */
function buildShareURL(state) {
  try {
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    
    // Add language
    if (state.language && SUPPORTED_LANGUAGES.includes(state.language)) {
      params.set(URL_PARAMS.LANGUAGE, state.language);
    }
    
    // Add start timestamp instead of elapsed time
    if (state.startTimestamp && isValidTimestamp(state.startTimestamp)) {
      params.set(URL_PARAMS.START_TIMESTAMP, state.startTimestamp);
    } else if (state.elapsedTime > 0) {
      // If no startTimestamp but we have elapsed time, calculate it
      const calculatedTimestamp = Date.now() - (state.elapsedTime * 1000);
      if (isValidTimestamp(calculatedTimestamp)) {
        params.set(URL_PARAMS.START_TIMESTAMP, calculatedTimestamp);
      }
    }
    
    // Add timezone offset
    const timezoneOffset = new Date().getTimezoneOffset();
    params.set(URL_PARAMS.TIMEZONE, timezoneOffset);
    
    // Add current people count
    const people = clampNumber(
      state.segments[state.currentSegmentIndex].numberOfPeople,
      VALIDATION.MIN_PEOPLE,
      VALIDATION.MAX_PEOPLE
    );
    params.set(URL_PARAMS.PEOPLE, people);
    
    // Add cost per person
    const cost = clampNumber(state.costPerPerson, VALIDATION.MIN_COST, VALIDATION.MAX_COST);
    params.set(URL_PARAMS.COST_PER_PERSON, cost);
    
    // Add currency
    if (CURRENCY_CONFIG[state.currency]) {
      params.set(URL_PARAMS.CURRENCY, state.currency);
    }
    
    // Add running status
    params.set(URL_PARAMS.RUNNING, state.isRunning ? '1' : '0');
    
    // Add segments (compressed) - Relative timestamps
    if (state.segments && state.segments.length > 1) {
      const segmentsData = state.segments
        .map(s => `${s.startTime}:${s.numberOfPeople}`)
        .join(',');
      params.set(URL_PARAMS.SEGMENTS, segmentsData);
    }
    
    return `${baseURL}?${params.toString()}`;
  } catch (error) {
    console.error('Error building share URL:', error);
    return window.location.href;
  }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if available
 */
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}