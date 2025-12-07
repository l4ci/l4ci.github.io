/**
 * ==================== STORAGE MANAGER ====================
 * LocalStorage management with error handling and validation
 * 
 * @file storage.js
 * @version 2.0.0
 */

/**
 * Storage Manager Class
 */
class StorageManager {
  constructor() {
    this.isAvailable = this.checkAvailability();
    this.prefix = 'meetingCalc_';
    
    if (!this.isAvailable) {
      console.warn('[Storage] LocalStorage is not available. Using in-memory storage.');
      this.memoryStorage = {};
    }
  }
  
  /**
   * Check if localStorage is available
   * @returns {boolean} Is available
   */
  checkAvailability() {
    return isSupported('localStorage');
  }
  
  /**
   * Get prefixed key
   * @param {string} key - Key name
   * @returns {string} Prefixed key
   */
  getKey(key) {
    return `${this.prefix}${key}`;
  }
  
  /**
   * Set item in storage
   * @param {string} key - Key name
   * @param {*} value - Value to store
   * @returns {boolean} Success
   */
  set(key, value) {
    try {
      const prefixedKey = this.getKey(key);
      const serialized = JSON.stringify(value);
      
      if (this.isAvailable) {
        localStorage.setItem(prefixedKey, serialized);
      } else {
        this.memoryStorage[prefixedKey] = serialized;
      }
      
      if (DEBUG_CONFIG?.enabled) {
        console.log(`[Storage] Set: ${key}`, value);
      }
      
      return true;
    } catch (error) {
      logError('Storage.set', error, { key, value });
      return false;
    }
  }
  
  /**
   * Get item from storage
   * @param {string} key - Key name
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    try {
      const prefixedKey = this.getKey(key);
      let serialized;
      
      if (this.isAvailable) {
        serialized = localStorage.getItem(prefixedKey);
      } else {
        serialized = this.memoryStorage[prefixedKey];
      }
      
      if (serialized === null || serialized === undefined) {
        return defaultValue;
      }
      
      const value = JSON.parse(serialized);
      
      if (DEBUG_CONFIG?.enabled) {
        console.log(`[Storage] Get: ${key}`, value);
      }
      
      return value;
    } catch (error) {
      logError('Storage.get', error, { key });
      return defaultValue;
    }
  }
  
  /**
   * Remove item from storage
   * @param {string} key - Key name
   * @returns {boolean} Success
   */
  remove(key) {
    try {
      const prefixedKey = this.getKey(key);
      
      if (this.isAvailable) {
        localStorage.removeItem(prefixedKey);
      } else {
        delete this.memoryStorage[prefixedKey];
      }
      
      if (DEBUG_CONFIG?.enabled) {
        console.log(`[Storage] Remove: ${key}`);
      }
      
      return true;
    } catch (error) {
      logError('Storage.remove', error, { key });
      return false;
    }
  }
  
  /**
   * Check if key exists
   * @param {string} key - Key name
   * @returns {boolean} Exists
   */
  has(key) {
    try {
      const prefixedKey = this.getKey(key);
      
      if (this.isAvailable) {
        return localStorage.getItem(prefixedKey) !== null;
      } else {
        return this.memoryStorage.hasOwnProperty(prefixedKey);
      }
    } catch (error) {
      logError('Storage.has', error, { key });
      return false;
    }
  }
  
  /**
   * Clear all storage items with prefix
   * @returns {boolean} Success
   */
  clear() {
    try {
      if (this.isAvailable) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        this.memoryStorage = {};
      }
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[Storage] Cleared all items');
      }
      
      return true;
    } catch (error) {
      logError('Storage.clear', error);
      return false;
    }
  }
  
  /**
   * Get all keys with prefix
   * @returns {Array<string>} Array of keys (without prefix)
   */
  keys() {
    try {
      const allKeys = this.isAvailable 
        ? Object.keys(localStorage)
        : Object.keys(this.memoryStorage);
      
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      logError('Storage.keys', error);
      return [];
    }
  }
  
  /**
   * Get storage size in bytes
   * @returns {number} Size in bytes
   */
  getSize() {
    try {
      let size = 0;
      
      if (this.isAvailable) {
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
            size += localStorage[key].length + key.length;
          }
        }
      } else {
        for (let key in this.memoryStorage) {
          if (this.memoryStorage.hasOwnProperty(key)) {
            size += this.memoryStorage[key].length + key.length;
          }
        }
      }
      
      return size;
    } catch (error) {
      logError('Storage.getSize', error);
      return 0;
    }
  }
  
  /**
   * Export all data
   * @returns {Object} All stored data
   */
  export() {
    try {
      const data = {};
      const keys = this.keys();
      
      keys.forEach(key => {
        data[key] = this.get(key);
      });
      
      return data;
    } catch (error) {
      logError('Storage.export', error);
      return {};
    }
  }
  
  /**
   * Import data
   * @param {Object} data - Data to import
   * @returns {boolean} Success
   */
  import(data) {
    try {
      for (const [key, value] of Object.entries(data)) {
        this.set(key, value);
      }
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[Storage] Imported data:', data);
      }
      
      return true;
    } catch (error) {
      logError('Storage.import', error, { data });
      return false;
    }
  }
}

/**
 * ==================== SESSION STORAGE ====================
 */

/**
 * Save session state
 * @param {Object} state - Session state
 * @returns {boolean} Success
 */
function saveSession(state) {
  try {
    const session = {
      elapsedTime: state.elapsedTime || 0,
      isRunning: state.isRunning || false,
      currentPeopleCount: state.currentPeopleCount || APP_CONFIG.defaults.people,
      segments: state.segments || [],
      lastSaved: Date.now(),
      version: APP_CONFIG.version,
    };
    
    return storage.set(APP_CONFIG.storage.session, session);
  } catch (error) {
    logError('saveSession', error, { state });
    return false;
  }
}

/**
 * Load session state
 * @returns {Object|null} Session state or null
 */
function loadSession() {
  try {
    const session = storage.get(APP_CONFIG.storage.session);
    
    if (!session) {
      return null;
    }
    
    // Validate session data
    if (!session.elapsedTime && session.elapsedTime !== 0) {
      return null;
    }
    
    // Check if session is too old (older than 24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (session.lastSaved && (Date.now() - session.lastSaved > maxAge)) {
      if (DEBUG_CONFIG?.enabled) {
        console.log('[Storage] Session expired, clearing...');
      }
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    logError('loadSession', error);
    return null;
  }
}

/**
 * Clear session state
 * @returns {boolean} Success
 */
function clearSession() {
  return storage.remove(APP_CONFIG.storage.session);
}

/**
 * ==================== SETTINGS STORAGE ====================
 */

/**
 * Save settings
 * @param {Object} settings - Settings object
 * @returns {boolean} Success
 */
function saveSettings(settings) {
  try {
    const settingsData = {
      costPerPerson: settings.costPerPerson || APP_CONFIG.defaults.costPerPerson,
      currency: settings.currency || APP_CONFIG.defaults.currency,
      language: settings.language || APP_CONFIG.defaults.language,
      theme: settings.theme || APP_CONFIG.defaults.theme,
      lastUpdated: Date.now(),
      version: APP_CONFIG.version,
    };
    
    // Validate settings
    if (!validateCost(settingsData.costPerPerson)) {
      settingsData.costPerPerson = APP_CONFIG.defaults.costPerPerson;
    }
    
    if (!validateCurrency(settingsData.currency)) {
      settingsData.currency = APP_CONFIG.defaults.currency;
    }
    
    if (!validateLanguage(settingsData.language)) {
      settingsData.language = APP_CONFIG.defaults.language;
    }
    
    return storage.set(APP_CONFIG.storage.settings, settingsData);
  } catch (error) {
    logError('saveSettings', error, { settings });
    return false;
  }
}

/**
 * Load settings
 * @returns {Object} Settings object with defaults
 */
function loadSettings() {
  try {
    const settings = storage.get(APP_CONFIG.storage.settings);
    
    if (!settings) {
      return getDefaultSettings();
    }
    
    // Merge with defaults to ensure all properties exist
    return {
      costPerPerson: settings.costPerPerson || APP_CONFIG.defaults.costPerPerson,
      currency: settings.currency || APP_CONFIG.defaults.currency,
      language: settings.language || APP_CONFIG.defaults.language,
      theme: settings.theme || APP_CONFIG.defaults.theme,
    };
  } catch (error) {
    logError('loadSettings', error);
    return getDefaultSettings();
  }
}

/**
 * Get default settings
 * @returns {Object} Default settings
 */
function getDefaultSettings() {
  return {
    costPerPerson: APP_CONFIG.defaults.costPerPerson,
    currency: APP_CONFIG.defaults.currency,
    language: APP_CONFIG.defaults.language,
    theme: APP_CONFIG.defaults.theme,
  };
}

/**
 * ==================== HISTORY STORAGE ====================
 */

/**
 * Save meeting history
 * @param {Array} history - History array
 * @returns {boolean} Success
 */
function saveHistory(history) {
  try {
    // Limit history size
    const limitedHistory = history.slice(-APP_CONFIG.limits.maxHistoryEntries);
    
    const historyData = {
      entries: limitedHistory,
      lastUpdated: Date.now(),
      version: APP_CONFIG.version,
    };
    
    return storage.set(APP_CONFIG.storage.history, historyData);
  } catch (error) {
    logError('saveHistory', error, { history });
    return false;
  }
}

/**
 * Load meeting history
 * @returns {Array} History array
 */
function loadHistory() {
  try {
    const historyData = storage.get(APP_CONFIG.storage.history);
    
    if (!historyData || !historyData.entries) {
      return [];
    }
    
    return historyData.entries;
  } catch (error) {
    logError('loadHistory', error);
    return [];
  }
}

/**
 * Clear meeting history
 * @returns {boolean} Success
 */
function clearHistory() {
  return storage.remove(APP_CONFIG.storage.history);
}

/**
 * ==================== THEME STORAGE ====================
 */

/**
 * Save theme preference
 * @param {string} theme - Theme name (auto, light, dark)
 * @returns {boolean} Success
 */
function saveTheme(theme) {
  try {
    if (!['auto', 'light', 'dark'].includes(theme)) {
      theme = APP_CONFIG.defaults.theme;
    }
    
    return storage.set(APP_CONFIG.storage.theme, theme);
  } catch (error) {
    logError('saveTheme', error, { theme });
    return false;
  }
}

/**
 * Load theme preference
 * @returns {string} Theme name
 */
function loadTheme() {
  try {
    const theme = storage.get(APP_CONFIG.storage.theme);
    
    if (!theme || !['auto', 'light', 'dark'].includes(theme)) {
      return APP_CONFIG.defaults.theme;
    }
    
    return theme;
  } catch (error) {
    logError('loadTheme', error);
    return APP_CONFIG.defaults.theme;
  }
}

/**
 * ==================== LANGUAGE STORAGE ====================
 */

/**
 * Save language preference
 * @param {string} language - Language code
 * @returns {boolean} Success
 */
function saveLanguage(language) {
  try {
    if (!validateLanguage(language)) {
      language = APP_CONFIG.defaults.language;
    }
    
    return storage.set(APP_CONFIG.storage.language, language);
  } catch (error) {
    logError('saveLanguage', error, { language });
    return false;
  }
}

/**
 * Load language preference
 * @returns {string} Language code
 */
function loadLanguage() {
  try {
    const language = storage.get(APP_CONFIG.storage.language);
    
    if (!language || !validateLanguage(language)) {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (validateLanguage(browserLang)) {
        return browserLang;
      }
      return APP_CONFIG.defaults.language;
    }
    
    return language;
  } catch (error) {
    logError('loadLanguage', error);
    return APP_CONFIG.defaults.language;
  }
}

/**
 * ==================== MIGRATION ====================
 */

/**
 * Migrate old storage format to new format
 * @returns {boolean} Success
 */
function migrateStorage() {
  try {
    // Check if migration is needed
    const oldSession = localStorage.getItem('meetingCalculatorSession');
    
    if (oldSession) {
      if (DEBUG_CONFIG?.enabled) {
        console.log('[Storage] Migrating old storage format...');
      }
      
      const oldData = JSON.parse(oldSession);
      
      // Migrate to new format
      saveSession({
        elapsedTime: oldData.elapsedTime || 0,
        isRunning: false,
        currentPeopleCount: oldData.currentPeopleCount || APP_CONFIG.defaults.people,
        segments: oldData.segments || [],
      });
      
      // Remove old key
      localStorage.removeItem('meetingCalculatorSession');
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[Storage] Migration completed');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    logError('migrateStorage', error);
    return false;
  }
}

/**
 * ==================== UTILITIES ====================
 */

/**
 * Get storage info
 * @returns {Object} Storage information
 */
function getStorageInfo() {
  return {
    available: storage.isAvailable,
    size: storage.getSize(),
    sizeFormatted: formatFileSize(storage.getSize()),
    keys: storage.keys(),
    keyCount: storage.keys().length,
  };
}

/**
 * Clear all app data
 * @returns {boolean} Success
 */
function clearAllData() {
  try {
    clearSession();
    clearHistory();
    storage.clear();
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Storage] All data cleared');
    }
    
    return true;
  } catch (error) {
    logError('clearAllData', error);
    return false;
  }
}

/**
 * Export all app data
 * @returns {Object} All app data
 */
function exportAllData() {
  try {
    return {
      session: loadSession(),
      settings: loadSettings(),
      history: loadHistory(),
      theme: loadTheme(),
      language: loadLanguage(),
      exportDate: new Date().toISOString(),
      version: APP_CONFIG.version,
    };
  } catch (error) {
    logError('exportAllData', error);
    return null;
  }
}

/**
 * Import all app data
 * @param {Object} data - Data to import
 * @returns {boolean} Success
 */
function importAllData(data) {
  try {
    if (data.session) saveSession(data.session);
    if (data.settings) saveSettings(data.settings);
    if (data.history) saveHistory(data.history);
    if (data.theme) saveTheme(data.theme);
    if (data.language) saveLanguage(data.language);
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Storage] Data imported successfully');
    }
    
    return true;
  } catch (error) {
    logError('importAllData', error, { data });
    return false;
  }
}

/**
 * ==================== INITIALIZATION ====================
 */

// Create global storage instance
const storage = new StorageManager();

// Run migration on load
if (storage.isAvailable) {
  migrateStorage();
}

// Log storage info (only in debug mode)
if (DEBUG_CONFIG?.enabled) {
  console.log('[Storage] Storage Manager initialized');
  console.log('[Storage] Info:', getStorageInfo());
}

/**
 * ==================== EXPORTS ====================
 */

// Export storage instance and functions for use in other modules
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
  window.storage = storage;
}
