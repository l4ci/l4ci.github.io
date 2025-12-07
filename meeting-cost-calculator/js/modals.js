/**
 * ==================== MODAL MANAGER ====================
 * Modal dialog management
 * 
 * @file modals.js
 * @version 2.0.0
 */

/**
 * ==================== MODAL MANAGER ====================
 */

/**
 * Modal Manager Class
 */
class ModalManager {
  constructor() {
    this.openModals = [];
    this.init();
  }
  
  /**
   * Initialize modal manager
   */
  init() {
    // Listen for escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeTopModal();
      }
    });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Modals] Modal manager initialized');
    }
  }
  
  /**
   * Open modal
   * @param {string} modalId - Modal identifier
   */
  open(modalId) {
    if (this.openModals.includes(modalId)) {
      return;
    }
    
    this.openModals.push(modalId);
    
    // Prevent body scroll
    if (this.openModals.length === 1) {
      document.body.style.overflow = 'hidden';
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Modals] Opened:', modalId);
    }
  }
  
  /**
   * Close modal
   * @param {string} modalId - Modal identifier
   */
  close(modalId) {
    const index = this.openModals.indexOf(modalId);
    
    if (index === -1) {
      return;
    }
    
    this.openModals.splice(index, 1);
    
    // Restore body scroll if no modals open
    if (this.openModals.length === 0) {
      document.body.style.overflow = '';
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Modals] Closed:', modalId);
    }
  }
  
  /**
   * Close top modal
   */
  closeTopModal() {
    if (this.openModals.length > 0) {
      const topModal = this.openModals[this.openModals.length - 1];
      this.close(topModal);
      return topModal;
    }
    return null;
  }
  
  /**
   * Close all modals
   */
  closeAll() {
    this.openModals = [];
    document.body.style.overflow = '';
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Modals] Closed all modals');
    }
  }
  
  /**
   * Check if modal is open
   * @param {string} modalId - Modal identifier
   * @returns {boolean} Is open
   */
  isOpen(modalId) {
    return this.openModals.includes(modalId);
  }
  
  /**
   * Check if any modal is open
   * @returns {boolean} Any open
   */
  hasOpenModals() {
    return this.openModals.length > 0;
  }
}

/**
 * ==================== SHARE MANAGER ====================
 */

/**
 * Share Manager Class
 */
class ShareManager {
  constructor() {
    this.canUseNativeShare = this.checkNativeShare();
  }
  
  /**
   * Check if native share is available
   * @returns {boolean} Is available
   */
  checkNativeShare() {
    return isSupported('share');
  }
  
  /**
   * Generate share URL
   * @param {Object} data - Share data
   * @returns {string} Share URL
   */
  generateShareUrl(data) {
    const params = {};
    
    if (data.people) {
      params[APP_CONFIG.urlParams.people] = data.people;
    }
    if (data.cost) {
      params[APP_CONFIG.urlParams.cost] = data.cost;
    }
    if (data.currency) {
      params[APP_CONFIG.urlParams.currency] = data.currency;
    }
    if (data.elapsed) {
      params[APP_CONFIG.urlParams.elapsed] = data.elapsed;
    }
    if (data.language) {
      params[APP_CONFIG.urlParams.language] = data.language;
    }
    
    return formatShareUrl(params);
  }
  
  /**
   * Copy share URL to clipboard
   * @param {string} url - URL to copy
   * @returns {Promise<boolean>} Success
   */
  async copyUrl(url) {
    return await copyToClipboard(url);
  }
  
  /**
   * Share via native share API
   * @param {Object} data - Share data
   * @returns {Promise<boolean>} Success
   */
  async shareNative(data) {
    if (!this.canUseNativeShare) {
      return false;
    }
    
    try {
      await navigator.share({
        title: data.title || '💰 Meeting-Kostenrechner',
        text: data.text || '',
        url: data.url || '',
      });
      
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        logError('shareNative', error, { data });
      }
      return false;
    }
  }
  
  /**
   * Share via email
   * @param {Object} data - Share data
   */
  shareEmail(data) {
    const emailData = formatShareText(data, 'email');
    const subject = encodeURIComponent(emailData.subject);
    const body = encodeURIComponent(emailData.body);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
  
  /**
   * Share via WhatsApp
   * @param {Object} data - Share data
   */
  shareWhatsApp(data) {
    const text = formatShareText(data, 'whatsapp');
    const encoded = encodeURIComponent(text);
    
    if (isMobile()) {
      window.location.href = `whatsapp://send?text=${encoded}`;
    } else {
      window.open(`https://web.whatsapp.com/send?text=${encoded}`, '_blank');
    }
  }
  
  /**
   * Share via Slack
   * @param {Object} data - Share data
   */
  shareSlack(data) {
    const text = formatShareText(data, 'slack');
    const encoded = encodeURIComponent(text);
    
    window.open(
      `https://slack.com/intl/de-de/help/articles/201330256#share-a-link`,
      '_blank'
    );
    
    // Copy to clipboard as fallback
    copyToClipboard(text);
  }
  
  /**
   * Share via Twitter
   * @param {Object} data - Share data
   */
  shareTwitter(data) {
    const text = formatShareText(data, 'default');
    const encoded = encodeURIComponent(text);
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encoded}`,
      '_blank',
      'width=550,height=420'
    );
  }
  
  /**
   * Share via LinkedIn
   * @param {Object} data - Share data
   */
  shareLinkedIn(data) {
    const url = encodeURIComponent(data.url);
    
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'width=550,height=420'
    );
  }
}

/**
 * ==================== KEYBOARD SHORTCUTS ====================
 */

/**
 * Keyboard Shortcut Manager
 */
class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = APP_CONFIG.features.enableKeyboardShortcuts;
    this.init();
  }
  
  /**
   * Initialize keyboard shortcuts
   */
  init() {
    if (!this.enabled) return;
    
    document.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Keyboard] Keyboard shortcuts initialized');
    }
  }
  
  /**
   * Register shortcut
   * @param {string} key - Key combination (e.g., 'ctrl+s')
   * @param {Function} callback - Callback function
   * @param {string} description - Description
   */
  register(key, callback, description = '') {
    this.shortcuts.set(key.toLowerCase(), {
      callback,
      description,
    });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Keyboard] Registered shortcut:', key);
    }
  }
  
  /**
   * Unregister shortcut
   * @param {string} key - Key combination
   */
  unregister(key) {
    this.shortcuts.delete(key.toLowerCase());
  }
  
  /**
   * Handle keydown event
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeydown(e) {
    // Don't handle if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    const key = this.getKeyString(e);
    const shortcut = this.shortcuts.get(key);
    
    if (shortcut) {
      e.preventDefault();
      shortcut.callback(e);
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[Keyboard] Triggered shortcut:', key);
      }
    }
  }
  
  /**
   * Get key string from event
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {string} Key string
   */
  getKeyString(e) {
    const parts = [];
    
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    
    const key = e.key.toLowerCase();
    
    // Special keys
    if (key === ' ') {
      parts.push('space');
    } else if (key === 'escape') {
      parts.push('esc');
    } else if (key === 'enter') {
      parts.push('enter');
    } else if (key === '+') {
      parts.push('plus');
    } else if (key === '-') {
      parts.push('minus');
    } else if (key === '?') {
      parts.push('question');
    } else {
      parts.push(key);
    }
    
    return parts.join('+');
  }
  
  /**
   * Get all shortcuts
   * @returns {Map} All shortcuts
   */
  getAll() {
    return this.shortcuts;
  }
  
  /**
   * Enable shortcuts
   */
  enable() {
    this.enabled = true;
  }
  
  /**
   * Disable shortcuts
   */
  disable() {
    this.enabled = false;
  }
}

/**
 * ==================== GLOBAL INSTANCES ====================
 */

const modalManager = new ModalManager();
const shareManager = new ShareManager();
const keyboardManager = new KeyboardShortcutManager();

/**
 * ==================== EXPORTS ====================
 */

// Log modals loaded
console.log('[Modals] Modal manager loaded');

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ModalManager = ModalManager;
  window.ShareManager = ShareManager;
  window.KeyboardShortcutManager = KeyboardShortcutManager;
  window.modalManager = modalManager;
  window.shareManager = shareManager;
  window.keyboardManager = keyboardManager;
}
