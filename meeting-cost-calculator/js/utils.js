/**
 * ==================== UTILITY FUNCTIONS ====================
 * Helper functions used throughout the application
 * 
 * @file utils.js
 * @version 2.0.0
 */

/**
 * ==================== NUMBER UTILITIES ====================
 */

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round number to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
function roundTo(value, decimals = 2) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Check if value is a valid number
 * @param {*} value - Value to check
 * @returns {boolean} Is valid number
 */
function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Parse number safely
 * @param {*} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed number or default
 */
function parseNumber(value, defaultValue = 0) {
  const parsed = Number(value);
  return isValidNumber(parsed) ? parsed : defaultValue;
}

/**
 * Format number with thousand separators
 * @param {number} value - Number to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted number
 */
function formatNumber(value, locale = 'de-DE') {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * ==================== STRING UTILITIES ====================
 */

/**
 * Pad number with leading zeros
 * @param {number} num - Number to pad
 * @param {number} length - Target length
 * @returns {string} Padded string
 */
function padZero(num, length = 2) {
  return String(num).padStart(length, '0');
}

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
function truncate(str, maxLength = 50) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * ==================== URL UTILITIES ====================
 */

/**
 * Get URL parameter
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value
 */
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Set URL parameter without reload
 * @param {string} name - Parameter name
 * @param {string} value - Parameter value
 */
function setUrlParam(name, value) {
  const url = new URL(window.location);
  url.searchParams.set(name, value);
  window.history.replaceState({}, '', url);
}

/**
 * Remove URL parameter without reload
 * @param {string} name - Parameter name
 */
function removeUrlParam(name) {
  const url = new URL(window.location);
  url.searchParams.delete(name);
  window.history.replaceState({}, '', url);
}

/**
 * Get all URL parameters as object
 * @returns {Object} Parameters object
 */
function getAllUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

/**
 * Build URL with parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Parameters object
 * @returns {string} Complete URL
 */
function buildUrl(baseUrl, params = {}) {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

/**
 * ==================== TIME UTILITIES ====================
 */

/**
 * Convert seconds to milliseconds
 * @param {number} seconds - Seconds
 * @returns {number} Milliseconds
 */
function secondsToMs(seconds) {
  return seconds * 1000;
}

/**
 * Convert milliseconds to seconds
 * @param {number} ms - Milliseconds
 * @returns {number} Seconds
 */
function msToSeconds(ms) {
  return Math.floor(ms / 1000);
}

/**
 * Get current timestamp in seconds
 * @returns {number} Current timestamp
 */
function getCurrentTimestamp() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Format duration in seconds to HH:MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted time
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
  }
  return `${minutes}:${padZero(secs)}`;
}

/**
 * Parse duration string (HH:MM:SS or MM:SS) to seconds
 * @param {string} duration - Duration string
 * @returns {number} Seconds
 */
function parseDuration(duration) {
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

/**
 * ==================== DOM UTILITIES ====================
 */

/**
 * Query selector with error handling
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {Element|null} Found element
 */
function qs(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.error(`[Utils] Invalid selector: ${selector}`, error);
    return null;
  }
}

/**
 * Query selector all with error handling
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {NodeList} Found elements
 */
function qsAll(selector, parent = document) {
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.error(`[Utils] Invalid selector: ${selector}`, error);
    return [];
  }
}

/**
 * Add event listener with cleanup
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
function addListener(element, event, handler, options = {}) {
  if (!element || !event || !handler) return () => {};
  
  element.addEventListener(event, handler, options);
  
  return () => {
    element.removeEventListener(event, handler, options);
  };
}

/**
 * ==================== VALIDATION UTILITIES ====================
 */

/**
 * Validate people count
 * @param {number} count - People count
 * @returns {boolean} Is valid
 */
function validatePeopleCount(count) {
  return isValidNumber(count) && 
         count >= APP_CONFIG.limits.minPeople && 
         count <= APP_CONFIG.limits.maxPeople;
}

/**
 * Validate cost value
 * @param {number} cost - Cost value
 * @returns {boolean} Is valid
 */
function validateCost(cost) {
  return isValidNumber(cost) && 
         cost >= APP_CONFIG.limits.minCost && 
         cost <= APP_CONFIG.limits.maxCost;
}

/**
 * Validate currency code
 * @param {string} currency - Currency code
 * @returns {boolean} Is valid
 */
function validateCurrency(currency) {
  return CURRENCY_CONFIG.hasOwnProperty(currency);
}

/**
 * Validate language code
 * @param {string} language - Language code
 * @returns {boolean} Is valid
 */
function validateLanguage(language) {
  return LANGUAGE_CONFIG.hasOwnProperty(language);
}

/**
 * Sanitize people count
 * @param {number} count - People count
 * @returns {number} Sanitized count
 */
function sanitizePeopleCount(count) {
  const parsed = parseNumber(count, APP_CONFIG.defaults.people);
  return clamp(parsed, APP_CONFIG.limits.minPeople, APP_CONFIG.limits.maxPeople);
}

/**
 * Sanitize cost value
 * @param {number} cost - Cost value
 * @returns {number} Sanitized cost
 */
function sanitizeCost(cost) {
  const parsed = parseNumber(cost, APP_CONFIG.defaults.costPerPerson);
  return clamp(parsed, APP_CONFIG.limits.minCost, APP_CONFIG.limits.maxCost);
}

/**
 * ==================== OBJECT UTILITIES ====================
 */

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('[Utils] Deep clone failed:', error);
    return obj;
  }
}

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} Is empty
 */
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Pick properties from object
 * @param {Object} obj - Source object
 * @param {Array<string>} keys - Keys to pick
 * @returns {Object} New object with picked properties
 */
function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit properties from object
 * @param {Object} obj - Source object
 * @param {Array<string>} keys - Keys to omit
 * @returns {Object} New object without omitted properties
 */
function omit(obj, keys) {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * ==================== ARRAY UTILITIES ====================
 */

/**
 * Get last element of array
 * @param {Array} arr - Array
 * @returns {*} Last element
 */
function last(arr) {
  return arr[arr.length - 1];
}

/**
 * Get first element of array
 * @param {Array} arr - Array
 * @returns {*} First element
 */
function first(arr) {
  return arr[0];
}

/**
 * Remove duplicates from array
 * @param {Array} arr - Array
 * @returns {Array} Array without duplicates
 */
function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Chunk array into smaller arrays
 * @param {Array} arr - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array<Array>} Chunked arrays
 */
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * ==================== DEBOUNCE & THROTTLE ====================
 */

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
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
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * ==================== BROWSER UTILITIES ====================
 */

/**
 * Check if browser supports feature
 * @param {string} feature - Feature name
 * @returns {boolean} Is supported
 */
function isSupported(feature) {
  const features = {
    localStorage: () => {
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    },
    serviceWorker: () => 'serviceWorker' in navigator,
    share: () => navigator.share !== undefined,
    clipboard: () => navigator.clipboard !== undefined,
    notifications: () => 'Notification' in window,
  };
  
  return features[feature] ? features[feature]() : false;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success
 */
async function copyToClipboard(text) {
  try {
    if (isSupported('clipboard')) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (error) {
    console.error('[Utils] Copy to clipboard failed:', error);
    return false;
  }
}

/**
 * Detect if user prefers dark mode
 * @returns {boolean} Prefers dark mode
 */
function prefersDarkMode() {
  return window.matchMedia && 
         window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Detect if user is on mobile device
 * @returns {boolean} Is mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Detect if user is on iOS
 * @returns {boolean} Is iOS
 */
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Get browser name
 * @returns {string} Browser name
 */
function getBrowserName() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

/**
 * ==================== PERFORMANCE UTILITIES ====================
 */

/**
 * Measure function execution time
 * @param {Function} func - Function to measure
 * @param {string} label - Label for logging
 * @returns {*} Function result
 */
function measurePerformance(func, label = 'Function') {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  
  if (DEBUG_CONFIG?.enabled) {
    console.log(`[Performance] ${label} took ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Request animation frame with fallback
 * @param {Function} callback - Callback function
 * @returns {number} Request ID
 */
function raf(callback) {
  return window.requestAnimationFrame(callback) || 
         window.setTimeout(callback, 16);
}

/**
 * Cancel animation frame with fallback
 * @param {number} id - Request ID
 */
function cancelRaf(id) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    window.clearTimeout(id);
  }
}

/**
 * ==================== ERROR HANDLING ====================
 */

/**
 * Safe function execution with error handling
 * @param {Function} func - Function to execute
 * @param {*} fallback - Fallback value on error
 * @param {string} context - Context for logging
 * @returns {*} Function result or fallback
 */
function safeExecute(func, fallback = null, context = 'Function') {
  try {
    return func();
  } catch (error) {
    console.error(`[Utils] ${context} failed:`, error);
    return fallback;
  }
}

/**
 * Log error with context
 * @param {string} context - Error context
 * @param {Error} error - Error object
 * @param {Object} data - Additional data
 */
function logError(context, error, data = {}) {
  console.error(`[Error] ${context}:`, error, data);
  
  // Could send to error tracking service here
  if (DEBUG_CONFIG?.enabled) {
    console.trace();
  }
}

/**
 * ==================== EXPORTS ====================
 */

// Log utilities loaded (only in debug mode)
if (DEBUG_CONFIG?.enabled) {
  console.log('[Utils] Utility functions loaded');
}
