/**
 * ==================== FORMATTERS ====================
 * Formatting functions for display values
 * 
 * @file formatters.js
 * @version 2.0.0
 */

/**
 * ==================== TIME FORMATTERS ====================
 */

/**
 * Format elapsed time in seconds to display format
 * @param {number} seconds - Elapsed time in seconds
 * @param {boolean} showHours - Always show hours
 * @returns {string} Formatted time (HH:MM:SS or MM:SS)
 */
function formatElapsedTime(seconds, showHours = false) {
  if (!isValidNumber(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0 || showHours) {
    return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
  }
  
  return `${minutes}:${padZero(secs)}`;
}

/**
 * Format time for history entries
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time with unit
 */
function formatHistoryTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (minutes < 60) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins > 0) {
    return `${hours}h ${mins}m`;
  }
  
  return `${hours}h`;
}

/**
 * Format time in human-readable format
 * @param {number} seconds - Time in seconds
 * @param {string} language - Language code
 * @returns {string} Human-readable time
 */
function formatHumanTime(seconds, language = 'de') {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours} ${getTranslation('hours', language)}`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes} ${getTranslation('minutes', language)}`);
  }
  
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} ${getTranslation('seconds', language)}`);
  }
  
  return parts.join(', ');
}

/**
 * ==================== CURRENCY FORMATTERS ====================
 */

/**
 * Format cost with currency symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {boolean} showDecimals - Show decimal places
 * @returns {string} Formatted cost
 */
function formatCost(amount, currency = 'EUR', showDecimals = true) {
  if (!isValidNumber(amount)) {
    return formatCostValue(0, currency, showDecimals);
  }
  
  return formatCostValue(amount, currency, showDecimals);
}

/**
 * Internal function to format cost value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {boolean} showDecimals - Show decimal places
 * @returns {string} Formatted cost
 */
function formatCostValue(amount, currency, showDecimals) {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.EUR;
  const decimals = showDecimals ? config.decimals : 0;
  const rounded = roundTo(amount, decimals);
  
  // Format number based on currency
  let formattedNumber;
  if (decimals === 0) {
    formattedNumber = Math.round(rounded).toLocaleString('de-DE');
  } else {
    formattedNumber = rounded.toLocaleString('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  
  // Position symbol
  if (config.position === 'before') {
    return `${config.symbol} ${formattedNumber}`;
  } else {
    return `${formattedNumber} ${config.symbol}`;
  }
}

/**
 * Format cost for sharing (plain text)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Plain text cost
 */
function formatCostPlain(amount, currency = 'EUR') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.EUR;
  const rounded = roundTo(amount, config.decimals);
  
  return `${rounded} ${currency}`;
}

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
function getCurrencySymbol(currency) {
  return CURRENCY_CONFIG[currency]?.symbol || '€';
}

/**
 * ==================== NUMBER FORMATTERS ====================
 */

/**
 * Format number with thousand separators
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
function formatNumberWithSeparators(value, decimals = 0) {
  if (!isValidNumber(value)) return '0';
  
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format percentage
 * @param {number} value - Value (0-1 or 0-100)
 * @param {boolean} isDecimal - Is value in decimal format (0-1)
 * @returns {string} Formatted percentage
 */
function formatPercentage(value, isDecimal = true) {
  if (!isValidNumber(value)) return '0%';
  
  const percentage = isDecimal ? value * 100 : value;
  return `${roundTo(percentage, 1)}%`;
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${roundTo(bytes / Math.pow(k, i), 2)} ${sizes[i]}`;
}

/**
 * ==================== DATE FORMATTERS ====================
 */

/**
 * Format date
 * @param {Date|number} date - Date object or timestamp
 * @param {string} format - Format type (short, long, time)
 * @param {string} locale - Locale code
 * @returns {string} Formatted date
 */
function formatDate(date, format = 'short', locale = 'de-DE') {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const formats = {
    short: { dateStyle: 'short' },
    long: { dateStyle: 'long' },
    time: { timeStyle: 'short' },
    full: { dateStyle: 'long', timeStyle: 'short' },
  };
  
  const options = formats[format] || formats.short;
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 minutes ago")
 * @param {Date|number} date - Date object or timestamp
 * @param {string} locale - Locale code
 * @returns {string} Relative time
 */
function formatRelativeTime(date, locale = 'de-DE') {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSecs = Math.floor(diffMs / 1000);
  
  if (diffSecs < 60) return 'gerade eben';
  if (diffSecs < 3600) return `vor ${Math.floor(diffSecs / 60)} Minuten`;
  if (diffSecs < 86400) return `vor ${Math.floor(diffSecs / 3600)} Stunden`;
  if (diffSecs < 604800) return `vor ${Math.floor(diffSecs / 86400)} Tagen`;
  
  return formatDate(dateObj, 'short', locale);
}

/**
 * ==================== HISTORY FORMATTERS ====================
 */

/**
 * Format history entry for display
 * @param {Object} segment - History segment
 * @param {number} index - Segment index
 * @param {string} language - Language code
 * @returns {string} Formatted history entry
 */
function formatHistoryEntry(segment, index, language = 'de') {
  const time = formatHistoryTime(segment.startTime);
  const people = segment.people;
  
  return getTranslation('historyEntry', language, {
    people: people,
    time: time,
  });
}

/**
 * Format history for export
 * @param {Array} segments - History segments
 * @param {string} language - Language code
 * @returns {string} Formatted history text
 */
function formatHistoryForExport(segments, language = 'de') {
  if (!segments || segments.length === 0) {
    return 'No history available';
  }
  
  const lines = segments.map((segment, index) => {
    return `${index + 1}. ${formatHistoryEntry(segment, index, language)}`;
  });
  
  return lines.join('\n');
}

/**
 * ==================== SHARE TEXT FORMATTERS ====================
 */

/**
 * Format share text for different platforms
 * @param {Object} data - Share data
 * @param {string} platform - Platform name (whatsapp, email, slack, default)
 * @returns {string} Formatted share text
 */
function formatShareText(data, platform = 'default') {
  const { cost, time, people, url } = data;
  const template = SHARE_CONFIG.templates[platform] || SHARE_CONFIG.templates.default;
  
  if (typeof template === 'string') {
    return template
      .replace('{cost}', cost)
      .replace('{time}', time)
      .replace('{people}', people)
      .replace('{url}', url);
  }
  
  // For email (object with subject and body)
  if (platform === 'email') {
    return {
      subject: template.subject,
      body: template.body
        .replace('{cost}', cost)
        .replace('{time}', time)
        .replace('{people}', people)
        .replace('{url}', url),
    };
  }
  
  return '';
}

/**
 * Format URL for sharing
 * @param {Object} params - URL parameters
 * @returns {string} Share URL
 */
function formatShareUrl(params) {
  const baseUrl = window.location.origin + window.location.pathname;
  return buildUrl(baseUrl, params);
}

/**
 * ==================== INPUT FORMATTERS ====================
 */

/**
 * Format input value (remove invalid characters)
 * @param {string} value - Input value
 * @param {string} type - Input type (number, currency, text)
 * @returns {string} Formatted value
 */
function formatInputValue(value, type = 'text') {
  if (type === 'number') {
    return value.replace(/[^0-9]/g, '');
  }
  
  if (type === 'currency') {
    return value.replace(/[^0-9.,]/g, '');
  }
  
  return value;
}

/**
 * Parse input value to number
 * @param {string} value - Input value
 * @returns {number} Parsed number
 */
function parseInputNumber(value) {
  // Replace comma with dot for decimal separator
  const normalized = String(value).replace(',', '.');
  const parsed = parseFloat(normalized);
  
  return isValidNumber(parsed) ? parsed : 0;
}

/**
 * ==================== VALIDATION FORMATTERS ====================
 */

/**
 * Format validation error message
 * @param {string} field - Field name
 * @param {string} error - Error type
 * @param {Object} context - Additional context
 * @returns {string} Error message
 */
function formatValidationError(field, error, context = {}) {
  const messages = {
    required: `${field} is required`,
    min: `${field} must be at least ${context.min}`,
    max: `${field} must be at most ${context.max}`,
    invalid: `${field} is invalid`,
  };
  
  return messages[error] || `${field} validation failed`;
}

/**
 * ==================== DISPLAY FORMATTERS ====================
 */

/**
 * Format people count for display
 * @param {number} count - People count
 * @param {string} language - Language code
 * @returns {string} Formatted count
 */
function formatPeopleCount(count, language = 'de') {
  if (count === 1) {
    return `1 ${getTranslation('participant', language)}`;
  }
  return `${count} ${getTranslation('participants', language)}`;
}

/**
 * Format cost per person for display
 * @param {number} cost - Cost value
 * @param {string} currency - Currency code
 * @returns {string} Formatted cost per person
 */
function formatCostPerPerson(cost, currency = 'EUR') {
  return `${formatCost(cost, currency)} / h`;
}

/**
 * Format meeting summary
 * @param {Object} data - Meeting data
 * @param {string} language - Language code
 * @returns {string} Summary text
 */
function formatMeetingSummary(data, language = 'de') {
  const { elapsedTime, totalCost, people, currency } = data;
  
  const time = formatHumanTime(elapsedTime, language);
  const cost = formatCost(totalCost, currency);
  const participants = formatPeopleCount(people, language);
  
  return `${time} • ${cost} • ${participants}`;
}

/**
 * ==================== EMOJI FORMATTERS ====================
 */

/**
 * Get random emoji from array
 * @param {Array<string>} emojis - Array of emojis
 * @returns {string} Random emoji
 */
function getRandomEmoji(emojis) {
  if (!emojis || emojis.length === 0) return '🎉';
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Get milestone emoji based on time
 * @param {number} seconds - Elapsed time in seconds
 * @returns {string|null} Milestone emoji or null
 */
function getMilestoneEmoji(seconds) {
  const milestones = Object.keys(EMOJI_CONFIG.milestones)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const milestone of milestones) {
    if (seconds >= milestone) {
      return getRandomEmoji(EMOJI_CONFIG.milestones[milestone]);
    }
  }
  
  return null;
}

/**
 * Get cost milestone emoji
 * @param {number} cost - Total cost
 * @returns {string|null} Milestone emoji or null
 */
function getCostMilestoneEmoji(cost) {
  const milestones = Object.keys(EMOJI_CONFIG.costMilestones)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const milestone of milestones) {
    if (cost >= milestone) {
      return getRandomEmoji(EMOJI_CONFIG.costMilestones[milestone]);
    }
  }
  
  return null;
}

/**
 * ==================== KEYBOARD SHORTCUT FORMATTERS ====================
 */

/**
 * Format keyboard shortcut for display
 * @param {string} shortcut - Shortcut string (e.g., "Ctrl+S")
 * @returns {string} Formatted shortcut
 */
function formatKeyboardShortcut(shortcut) {
  return shortcut
    .replace('Ctrl', isMobile() ? 'Cmd' : 'Ctrl')
    .replace('+', ' + ');
}

/**
 * Get keyboard shortcut display name
 * @param {string} key - Key name
 * @returns {string} Display name
 */
function getKeyDisplayName(key) {
  const names = {
    Enter: '↵',
    Space: '␣',
    Escape: 'Esc',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
  };
  
  return names[key] || key;
}

/**
 * ==================== HELPER FUNCTIONS ====================
 */

/**
 * Safely format value with fallback
 * @param {Function} formatter - Formatter function
 * @param {*} value - Value to format
 * @param {*} fallback - Fallback value
 * @returns {*} Formatted value or fallback
 */
function safeFormat(formatter, value, fallback = '') {
  try {
    return formatter(value);
  } catch (error) {
    console.error('[Formatters] Format error:', error);
    return fallback;
  }
}

/**
 * ==================== EXPORTS ====================
 */

// Log formatters loaded (only in debug mode)
if (DEBUG_CONFIG?.enabled) {
  console.log('[Formatters] Formatting functions loaded');
}
