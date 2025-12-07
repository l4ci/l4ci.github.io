/**
 * ==================== UTILITY FUNCTIONS ====================
 * Helper functions and utilities
 * 
 * @file utils.js
 * @version 2.0.0
 */

/**
 * ==================== VALIDATION ====================
 */

/**
 * Validate people count
 * @param {number} count - People count
 * @returns {boolean} Is valid
 */
function validatePeopleCount(count) {
  return (
    typeof count === 'number' &&
    !isNaN(count) &&
    count >= APP_CONFIG.limits.minPeople &&
    count <= APP_CONFIG.limits.maxPeople
  );
}

/**
 * Validate cost
 * @param {number} cost - Cost value
 * @returns {boolean} Is valid
 */
function validateCost(cost) {
  return (
    typeof cost === 'number' &&
    !isNaN(cost) &&
    cost >= APP_CONFIG.limits.minCost &&
    cost <= APP_CONFIG.limits.maxCost
  );
}

/**
 * Validate currency
 * @param {string} currency - Currency code
 * @returns {boolean} Is valid
 */
function validateCurrency(currency) {
  return SUPPORTED_CURRENCIES.includes(currency);
}

/**
 * Validate language
 * @param {string} language - Language code
 * @returns {boolean} Is valid
 */
function validateLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language);
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
 * ==================== SANITIZATION ====================
 */

/**
 * Sanitize people count
 * @param {number} count - People count
 * @returns {number} Sanitized count
 */
function sanitizePeopleCount(count) {
  const num = parseInt(count);
  if (isNaN(num)) return APP_CONFIG.defaults.people;
  return Math.max(
    APP_CONFIG.limits.minPeople,
    Math.min(APP_CONFIG.limits.maxPeople, num)
  );
}

/**
 * Sanitize cost
 * @param {number} cost - Cost value
 * @returns {number} Sanitized cost
 */
function sanitizeCost(cost) {
  const num = parseFloat(cost);
  if (isNaN(num)) return APP_CONFIG.defaults.costPerPerson;
  return Math.max(
    APP_CONFIG.limits.minCost,
    Math.min(APP_CONFIG.limits.maxCost, num)
  );
}

/**
 * ==================== MATH ====================
 */

/**
 * Round number to decimals
 * @param {number} num - Number to round
 * @param {number} decimals - Number of decimals
 * @returns {number} Rounded number
 */
function roundTo(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Clamp number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * ==================== URL PARAMETERS ====================
 */

/**
 * Get URL parameter
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Get all URL parameters
 * @returns {Object} All parameters
 */
function getAllUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Set URL parameter without reload
 * @param {string} param - Parameter name
 * @param {string} value - Parameter value
 */
function setUrlParam(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.replaceState({}, '', url);
}

/**
 * ==================== BROWSER DETECTION ====================
 */

/**
 * Check if feature is supported
 * @param {string} feature - Feature name
 * @returns {boolean} Is supported
 */
function isSupported(feature) {
  switch (feature) {
    case 'localStorage':
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    
    case 'notifications':
      return 'Notification' in window;
    
    case 'share':
      return 'share' in navigator;
    
    case 'clipboard':
      return 'clipboard' in navigator;
    
    case 'serviceWorker':
      return 'serviceWorker' in navigator;
    
    default:
      return false;
  }
}

/**
 * Check if mobile device
 * @returns {boolean} Is mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
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
 * Check if dark mode is preferred
 * @returns {boolean} Prefers dark mode
 */
function prefersDarkMode() {
  return window.matchMedia && 
         window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * ==================== CLIPBOARD ====================
 */

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success
 */
async function copyToClipboard(text) {
  if (!text) return false;
  
  try {
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
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
  } catch (error) {
    console.error('[Utils] Copy to clipboard failed:', error);
    return false;
  }
}

/**
 * ==================== ERROR HANDLING ====================
 */

/**
 * Log error
 * @param {string} context - Error context
 * @param {Error} error - Error object
 * @param {Object} data - Additional data
 */
function logError(context, error, data = {}) {
  if (!DEBUG_CONFIG.logErrors) return;
  
  console.error(`[Error] ${context}:`, error);
  
  if (Object.keys(data).length > 0) {
    console.error('[Error] Additional data:', data);
  }
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
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * ==================== STORAGE INFO ====================
 */

/**
 * Get storage information
 * @returns {Object} Storage info
 */
function getStorageInfo() {
  if (!isSupported('localStorage')) {
    return { available: false };
  }
  
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    
    // Calculate used space (approximate)
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    
    return {
      available: true,
      used: totalSize,
      usedKB: (totalSize / 1024).toFixed(2),
    };
  } catch (e) {
    return { available: false, error: e.message };
  }
}

/**
 * ==================== ARRAY HELPERS ====================
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
 * ==================== DOM HELPERS ====================
 */

/**
 * Wait for DOM to be ready
 * @returns {Promise<void>}
 */
function domReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

/**
 * ==================== EXPORTS ====================
 */

// Log utils loaded
console.log('[Utils] Utility functions loaded');
