/**
 * ==================== STORAGE MANAGER ====================
 * LocalStorage management with error handling
 * 
 * @file storage.js
 * @version 2.0.0
 */

/**
 * Storage Manager Class
 */
class StorageManager {
  constructor(prefix = 'meetingCalc_') {
    this.prefix = prefix;
    this.isAvailable = this.checkAvailability();
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
    return this.prefix + key;
  }
  
  /**
   * Get item from storage
   * @param {string} key - Key name
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }
    
    try {
      const item = localStorage.getItem(this.getKey(key));
      
      if (item === null) {
        return defaultValue;
      }
      
      return JSON.parse(item);
    } catch (error) {
      logError('StorageManager.get', error, { key });
      return defaultValue;
    }
  }
  
  /**
   * Set item in storage
   * @param {string} key - Key name
   * @param {*} value - Value to store
   * @returns {boolean} Success
   */
  set(key, value) {
    if (!this.isAvailable) {
      return false;
    }
    
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      logError('StorageManager.set', error, { key, value });
      return false;
    }
  }
  
  /**
   * Remove item from storage
   * @param {string} key - Key name
   * @returns {boolean} Success
   */
  remove(key) {
    if (!this.isAvailable) {
      return false;
    }
    
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      logError('StorageManager.remove', error, { key });
      return false;
    }
  }
  
  /**
   * Clear all storage with prefix
   * @returns {boolean} Success
   */
  clear() {
    if (!this.isAvailable) {
      return false;
    }
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      logError('StorageManager.clear', error);
      return false;
    }
  }
  
  /**
   * Check if key exists
   * @param {string} key - Key name
   * @returns {boolean} Exists
   */
  has(key) {
    if (!this.isAvailable) {
      return false;
    }
    
    return localStorage.getItem(this.getKey(key)) !== null;
  }
  
  /**
   * Get all keys with prefix
   * @returns {Array<string>} All keys
   */
  keys() {
    if (!this.isAvailable) {
      return [];
    }
    
    try {
      const allKeys = Object.keys(localStorage);
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      logError('StorageManager.keys', error);
      return [];
    }
  }
}

/**
 * ==================== GLOBAL STORAGE INSTANCE ====================
 */

const storage = new StorageManager('meetingCalc_');

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
      lastTimestamp: state.isRunning ? Date.now() : null,
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
 * @returns {Object|null} Session state
 */
function loadSession() {
  try {
    const session = storage.get(APP_CONFIG.storage.session);
    
    if (!session) {
      return null;
    }
    
    // Validate session
    if (session.version !== APP_CONFIG.version) {
      console.warn('[Storage] Session version mismatch, clearing session');
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
    
    return storage.set(APP_CONFIG.storage.settings, settingsData);
  } catch (error) {
    logError('saveSettings', error, { settings });
    return false;
  }
}

/**
 * Load settings
 * @returns {Object} Settings object
 */
function loadSettings() {
  try {
    const settings = storage.get(APP_CONFIG.storage.settings);
    
    if (!settings) {
      return {
        costPerPerson: APP_CONFIG.defaults.costPerPerson,
        currency: APP_CONFIG.defaults.currency,
        language: APP_CONFIG.defaults.language,
        theme: APP_CONFIG.defaults.theme,
      };
    }
    
    // Merge with defaults to ensure all keys exist
    return {
      costPerPerson: settings.costPerPerson || APP_CONFIG.defaults.costPerPerson,
      currency: settings.currency || APP_CONFIG.defaults.currency,
      language: settings.language || APP_CONFIG.defaults.language,
      theme: settings.theme || APP_CONFIG.defaults.theme,
    };
  } catch (error) {
    logError('loadSettings', error);
    return {
      costPerPerson: APP_CONFIG.defaults.costPerPerson,
      currency: APP_CONFIG.defaults.currency,
      language: APP_CONFIG.defaults.language,
      theme: APP_CONFIG.defaults.theme,
    };
  }
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
  return storage.set(APP_CONFIG.storage.theme, theme);
}

/**
 * Load theme preference
 * @returns {string} Theme name
 */
function loadTheme() {
  return storage.get(APP_CONFIG.storage.theme, APP_CONFIG.defaults.theme);
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
  return storage.set(APP_CONFIG.storage.language, language);
}

/**
 * Load language preference
 * @returns {string} Language code
 */
function loadLanguage() {
  return storage.get(APP_CONFIG.storage.language, APP_CONFIG.defaults.language);
}

/**
 * ==================== HISTORY STORAGE ====================
 */

/**
 * Save meeting to history
 * @param {Object} meeting - Meeting data
 * @returns {boolean} Success
 */
function saveMeetingToHistory(meeting) {
  try {
    const history = storage.get(APP_CONFIG.storage.history, []);
    
    const historyEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      elapsedTime: meeting.elapsedTime,
      totalCost: meeting.totalCost,
      peopleCount: meeting.peopleCount,
      costPerPerson: meeting.costPerPerson,
      currency: meeting.currency,
      segments: meeting.segments || [],
    };
    
    // Add to beginning of array
    history.unshift(historyEntry);
    
    // Limit history size
    if (history.length > APP_CONFIG.limits.maxHistoryEntries) {
      history.splice(APP_CONFIG.limits.maxHistoryEntries);
    }
    
    return storage.set(APP_CONFIG.storage.history, history);
  } catch (error) {
    logError('saveMeetingToHistory', error, { meeting });
    return false;
  }
}

/**
 * Load meeting history
 * @returns {Array} History entries
 */
function loadMeetingHistory() {
  return storage.get(APP_CONFIG.storage.history, []);
}

/**
 * Clear meeting history
 * @returns {boolean} Success
 */
function clearMeetingHistory() {
  return storage.remove(APP_CONFIG.storage.history);
}

/**
 * Delete history entry
 * @param {number} id - Entry ID
 * @returns {boolean} Success
 */
function deleteHistoryEntry(id) {
  try {
    const history = storage.get(APP_CONFIG.storage.history, []);
    const filtered = history.filter(entry => entry.id !== id);
    return storage.set(APP_CONFIG.storage.history, filtered);
  } catch (error) {
    logError('deleteHistoryEntry', error, { id });
    return false;
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
    const oldSession = localStorage.getItem('meeting_session');
    
    if (!oldSession) {
      return true; // Nothing to migrate
    }
    
    // Parse old session
    const oldData = JSON.parse(oldSession);
    
    // Convert to new format
    saveSession({
      elapsedTime: oldData.time || 0,
      isRunning: false,
      currentPeopleCount: oldData.people || APP_CONFIG.defaults.people,
      segments: [],
    });
    
    saveSettings({
      costPerPerson: oldData.cost || APP_CONFIG.defaults.costPerPerson,
      currency: oldData.currency || APP_CONFIG.defaults.currency,
      language: APP_CONFIG.defaults.language,
      theme: APP_CONFIG.defaults.theme,
    });
    
    // Remove old key
    localStorage.removeItem('meeting_session');
    
    console.log('[Storage] Migration completed');
    return true;
  } catch (error) {
    logError('migrateStorage', error);
    return false;
  }
}

/**
 * ==================== INITIALIZATION ====================
 */

// Run migration on load
if (storage.isAvailable) {
  migrateStorage();
}

// Log storage loaded
console.log('[Storage] Storage manager loaded');

/**
 * ==================== EXPORTS ====================
 */

if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
  window.storage = storage;
}
