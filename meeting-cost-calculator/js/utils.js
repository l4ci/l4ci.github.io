/* ==================== UTILITY FUNCTIONS ==================== */

/**
 * Clamp number between min and max
 */
function clampNumber(value, min, max) {
  const num = parseFloat(value);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

/**
 * Sanitize string to prevent XSS
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Validate timestamp
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
 * Parse and sanitize URL parameters
 */
function getURLParameters() {
  try {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = sanitizeString(value);
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing URL parameters:', error);
    return {};
  }
}

/**
 * Build share URL with current state
 */
function buildShareURL(state) {
  try {
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    
    if (state.language && SUPPORTED_LANGUAGES.includes(state.language)) {
      params.set(URL_PARAMS.LANGUAGE, state.language);
    }
    
    if (state.startTimestamp && isValidTimestamp(state.startTimestamp)) {
      params.set(URL_PARAMS.START_TIMESTAMP, state.startTimestamp);
    } else if (state.elapsedTime > 0) {
      const calculatedTimestamp = Date.now() - (state.elapsedTime * 1000);
      if (isValidTimestamp(calculatedTimestamp)) {
        params.set(URL_PARAMS.START_TIMESTAMP, calculatedTimestamp);
      }
    }
    
    const timezoneOffset = new Date().getTimezoneOffset();
    params.set(URL_PARAMS.TIMEZONE, timezoneOffset);
    
    const people = clampNumber(
      state.segments[state.currentSegmentIndex].numberOfPeople,
      VALIDATION.MIN_PEOPLE,
      VALIDATION.MAX_PEOPLE
    );
    params.set(URL_PARAMS.PEOPLE, people);
    
    const cost = clampNumber(state.costPerPerson, VALIDATION.MIN_COST, VALIDATION.MAX_COST);
    params.set(URL_PARAMS.COST_PER_PERSON, cost);
    
    if (CURRENCY_CONFIG[state.currency]) {
      params.set(URL_PARAMS.CURRENCY, state.currency);
    }
    
    params.set(URL_PARAMS.RUNNING, state.isRunning ? '1' : '0');
    
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

/**
 * Detect currency from browser language
 */
function detectCurrencyFromLanguage() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    
    if (LANGUAGE_CURRENCY_MAP[browserLang]) {
      return LANGUAGE_CURRENCY_MAP[browserLang];
    }
    
    const langCode = browserLang.split('-')[0];
    if (LANGUAGE_CURRENCY_MAP[langCode]) {
      return LANGUAGE_CURRENCY_MAP[langCode];
    }
    
    return 'EUR';
  } catch (error) {
    console.error('Error detecting currency:', error);
    return 'EUR';
  }
}

/**
 * Detect language from browser
 */
function detectBrowserLanguage() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      return langCode;
    }
    
    return 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en';
  }
}
