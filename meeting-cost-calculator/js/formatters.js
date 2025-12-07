/**
 * ==================== FORMATTERS ====================
 * Formatting functions for display
 * 
 * @file formatters.js
 * @version 2.0.0
 */

/**
 * ==================== TIME FORMATTING ====================
 */

/**
 * Format elapsed time in seconds to readable format
 * @param {number} seconds - Elapsed seconds
 * @returns {string} Formatted time (H:MM:SS or M:SS)
 */
function formatElapsedTime(seconds) {
  if (!isValidNumber(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
  }
  
  return `${minutes}:${padZero(secs)}`;
}

/**
 * Format time for history display
 * @param {number} seconds - Elapsed seconds
 * @returns {string} Formatted time
 */
function formatHistoryTime(seconds) {
  if (!isValidNumber(seconds) || seconds < 0) {
    return '0 Min';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${hours}h`;
  }
  
  return `${minutes} Min`;
}

/**
 * Pad number with leading zero
 * @param {number} num - Number to pad
 * @returns {string} Padded number
 */
function padZero(num) {
  return num.toString().padStart(2, '0');
}

/**
 * ==================== COST FORMATTING ====================
 */

/**
 * Format cost with currency
 * @param {number} cost - Cost value
 * @param {string} currency - Currency code
 * @returns {string} Formatted cost
 */
function formatCost(cost, currency = 'EUR') {
  if (!isValidNumber(cost)) {
    cost = 0;
  }
  
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.EUR;
  const rounded = roundTo(cost, config.decimals);
  
  // Format number with thousand separators
  const parts = rounded.toFixed(config.decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  const formattedNumber = parts.join(',');
  
  // Position symbol
  if (config.position === 'before') {
    return `${config.symbol} ${formattedNumber}`;
  }
  
  return `${formattedNumber} ${config.symbol}`;
}

/**
 * Format cost per hour
 * @param {number} cost - Cost value
 * @param {string} currency - Currency code
 * @returns {string} Formatted cost per hour
 */
function formatCostPerHour(cost, currency = 'EUR') {
  return `${formatCost(cost, currency)}/h`;
}

/**
 * ==================== HISTORY FORMATTING ====================
 */

/**
 * Format history entry
 * @param {Object} segment - History segment
 * @param {number} index - Segment index
 * @param {string} language - Language code
 * @returns {string} Formatted entry
 */
function formatHistoryEntry(segment, index, language = 'de') {
  const time = formatHistoryTime(segment.startTime);
  const people = segment.people;
  
  if (language === 'de') {
    return `${time}: ${people} Teilnehmer`;
  } else if (language === 'en') {
    return `${time}: ${people} participant${people !== 1 ? 's' : ''}`;
  } else if (language === 'es') {
    return `${time}: ${people} participante${people !== 1 ? 's' : ''}`;
  } else if (language === 'fr') {
    return `${time}: ${people} participant${people !== 1 ? 's' : ''}`;
  } else if (language === 'it') {
    return `${time}: ${people} partecipante${people !== 1 ? 'i' : ''}`;
  } else if (language === 'pl') {
    return `${time}: ${people} uczestnik${people !== 1 ? 'ów' : ''}`;
  }
  
  return `${time}: ${people}`;
}

/**
 * ==================== SHARE FORMATTING ====================
 */

/**
 * Format share URL with parameters
 * @param {Object} params - URL parameters
 * @returns {string} Share URL
 */
function formatShareUrl(params = {}) {
  const baseUrl = window.location.origin + window.location.pathname;
  const urlParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      urlParams.set(key, params[key]);
    }
  });
  
  const queryString = urlParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Format share text
 * @param {Object} data - Share data
 * @param {string} platform - Platform (default, whatsapp, slack, email)
 * @returns {string|Object} Formatted text
 */
function formatShareText(data, platform = 'default') {
  const template = SHARE_CONFIG.templates[platform];
  
  if (platform === 'email') {
    return {
      subject: template.subject
        .replace('{cost}', data.cost)
        .replace('{time}', data.time)
        .replace('{people}', data.people),
      body: template.body
        .replace('{cost}', data.cost)
        .replace('{time}', data.time)
        .replace('{people}', data.people)
        .replace('{url}', data.url),
    };
  }
  
  return template
    .replace('{cost}', data.cost)
    .replace('{time}', data.time)
    .replace('{people}', data.people)
    .replace('{url}', data.url);
}

/**
 * ==================== NUMBER FORMATTING ====================
 */

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {string} separator - Thousand separator
 * @returns {string} Formatted number
 */
function formatNumber(num, separator = '.') {
  if (!isValidNumber(num)) {
    return '0';
  }
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * Format percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
function formatPercentage(value, total, decimals = 0) {
  if (!isValidNumber(value) || !isValidNumber(total) || total === 0) {
    return '0%';
  }
  
  const percentage = (value / total) * 100;
  return `${roundTo(percentage, decimals)}%`;
}

/**
 * ==================== DATE FORMATTING ====================
 */

/**
 * Format date to locale string
 * @param {Date|number} date - Date object or timestamp
 * @param {string} language - Language code
 * @returns {string} Formatted date
 */
function formatDate(date, language = 'de') {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return dateObj.toLocaleString(language, options);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|number} date - Date object or timestamp
 * @param {string} language - Language code
 * @returns {string} Relative time
 */
function formatRelativeTime(date, language = 'de') {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return language === 'de' ? 'gerade eben' : 'just now';
  } else if (diffMin < 60) {
    return language === 'de' 
      ? `vor ${diffMin} Minute${diffMin !== 1 ? 'n' : ''}`
      : `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return language === 'de'
      ? `vor ${diffHour} Stunde${diffHour !== 1 ? 'n' : ''}`
      : `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
  } else {
    return language === 'de'
      ? `vor ${diffDay} Tag${diffDay !== 1 ? 'en' : ''}`
      : `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  }
}

/**
 * ==================== INPUT FORMATTING ====================
 */

/**
 * Parse cost input (handles comma and dot)
 * @param {string} input - Input string
 * @returns {number} Parsed number
 */
function parseCostInput(input) {
  if (typeof input === 'number') {
    return input;
  }
  
  // Replace comma with dot for parsing
  const normalized = input.toString().replace(',', '.');
  const parsed = parseFloat(normalized);
  
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format input to cost format
 * @param {string|number} input - Input value
 * @returns {string} Formatted input
 */
function formatCostInput(input) {
  const num = parseCostInput(input);
  return num.toFixed(2).replace('.', ',');
}

/**
 * ==================== EXPORTS ====================
 */

// Log formatters loaded
console.log('[Formatters] Formatting functions loaded');
