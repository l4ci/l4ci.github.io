/**
 * ==================== NOTIFICATION MANAGER ====================
 * Toast notifications and user feedback
 * 
 * @file notifications.js
 * @version 2.0.0
 */

/**
 * Notification Manager Class
 */
class NotificationManager {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.maxNotifications = 3;
    this.defaultDuration = NOTIFICATION_CONFIG.duration;
    this.isInitialized = false;
    
    this.init();
  }
  
  /**
   * Initialize notification system
   */
  init() {
    if (this.isInitialized) return;
    
    // Create container
    this.container = document.createElement('div');
    this.container.id = 'notificationContainer';
    this.container.className = 'notification-container';
    this.container.setAttribute('aria-live', 'polite');
    this.container.setAttribute('aria-atomic', 'true');
    
    // Add to DOM when ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(this.container);
      });
    } else {
      document.body.appendChild(this.container);
    }
    
    this.isInitialized = true;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Notifications] Notification Manager initialized');
    }
  }
  
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {number} duration - Duration in ms (0 = permanent)
   * @returns {string} Notification ID
   */
  show(message, type = 'info', duration = null) {
    if (!message) return null;
    
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notificationDuration = duration !== null ? duration : this.defaultDuration;
    
    // Create notification element
    const notification = this.createNotification(id, message, type);
    
    // Add to container
    this.container.appendChild(notification);
    
    // Store reference
    this.notifications.push({
      id,
      element: notification,
      type,
      timestamp: Date.now(),
    });
    
    // Limit notifications
    this.limitNotifications();
    
    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('notification-show');
    });
    
    // Auto-hide
    if (notificationDuration > 0) {
      setTimeout(() => {
        this.hide(id);
      }, notificationDuration);
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Notifications] Show:', { id, message, type, duration: notificationDuration });
    }
    
    return id;
  }
  
  /**
   * Create notification element
   * @param {string} id - Notification ID
   * @param {string} message - Message text
   * @param {string} type - Notification type
   * @returns {HTMLElement} Notification element
   */
  createNotification(id, message, type) {
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    
    const config = NOTIFICATION_CONFIG.types[type] || NOTIFICATION_CONFIG.types.info;
    
    notification.innerHTML = `
      <div class="notification-icon">${config.icon}</div>
      <div class="notification-message">${this.escapeHtml(message)}</div>
      <button class="notification-close" aria-label="Close notification" type="button">×</button>
    `;
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.hide(id);
    });
    
    return notification;
  }
  
  /**
   * Hide notification
   * @param {string} id - Notification ID
   */
  hide(id) {
    const notificationData = this.notifications.find(n => n.id === id);
    if (!notificationData) return;
    
    const { element } = notificationData;
    
    // Trigger hide animation
    element.classList.remove('notification-show');
    element.classList.add('notification-hide');
    
    // Remove after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      
      // Remove from array
      this.notifications = this.notifications.filter(n => n.id !== id);
    }, 300);
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Notifications] Hide:', id);
    }
  }
  
  /**
   * Hide all notifications
   */
  hideAll() {
    const ids = this.notifications.map(n => n.id);
    ids.forEach(id => this.hide(id));
  }
  
  /**
   * Limit number of visible notifications
   */
  limitNotifications() {
    if (this.notifications.length > this.maxNotifications) {
      const toRemove = this.notifications.length - this.maxNotifications;
      for (let i = 0; i < toRemove; i++) {
        this.hide(this.notifications[0].id);
      }
    }
  }
  
  /**
   * Show success notification
   * @param {string} message - Message text
   * @param {number} duration - Duration in ms
   * @returns {string} Notification ID
   */
  success(message, duration = null) {
    return this.show(message, 'success', duration);
  }
  
  /**
   * Show error notification
   * @param {string} message - Message text
   * @param {number} duration - Duration in ms
   * @returns {string} Notification ID
   */
  error(message, duration = null) {
    return this.show(message, 'error', duration || 5000);
  }
  
  /**
   * Show warning notification
   * @param {string} message - Message text
   * @param {number} duration - Duration in ms
   * @returns {string} Notification ID
   */
  warning(message, duration = null) {
    return this.show(message, 'warning', duration);
  }
  
  /**
   * Show info notification
   * @param {string} message - Message text
   * @param {number} duration - Duration in ms
   * @returns {string} Notification ID
   */
  info(message, duration = null) {
    return this.show(message, 'info', duration);
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Get active notifications count
   * @returns {number} Count
   */
  getCount() {
    return this.notifications.length;
  }
  
  /**
   * Check if notification exists
   * @param {string} id - Notification ID
   * @returns {boolean} Exists
   */
  has(id) {
    return this.notifications.some(n => n.id === id);
  }
  
  /**
   * Destroy notification manager
   */
  destroy() {
    this.hideAll();
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    this.container = null;
    this.notifications = [];
    this.isInitialized = false;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Notifications] Notification Manager destroyed');
    }
  }
}

/**
 * ==================== BROWSER NOTIFICATIONS ====================
 */

/**
 * Browser Notification Manager (for native notifications)
 */
class BrowserNotificationManager {
  constructor() {
    this.isSupported = this.checkSupport();
    this.permission = this.isSupported ? Notification.permission : 'denied';
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[BrowserNotifications] Support:', this.isSupported, 'Permission:', this.permission);
    }
  }
  
  /**
   * Check if browser notifications are supported
   * @returns {boolean} Is supported
   */
  checkSupport() {
    return isSupported('notifications');
  }
  
  /**
   * Request notification permission
   * @returns {Promise<string>} Permission status
   */
  async requestPermission() {
    if (!this.isSupported) {
      return 'denied';
    }
    
    try {
      this.permission = await Notification.requestPermission();
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[BrowserNotifications] Permission:', this.permission);
      }
      
      return this.permission;
    } catch (error) {
      logError('BrowserNotificationManager.requestPermission', error);
      return 'denied';
    }
  }
  
  /**
   * Show browser notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @returns {Notification|null} Notification instance
   */
  show(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      return null;
    }
    
    try {
      const notification = new Notification(title, {
        icon: './icon-192.png',
        badge: './icon-192.png',
        ...options,
      });
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[BrowserNotifications] Show:', title);
      }
      
      return notification;
    } catch (error) {
      logError('BrowserNotificationManager.show', error, { title, options });
      return null;
    }
  }
  
  /**
   * Show milestone notification
   * @param {string} type - Milestone type (time, cost)
   * @param {number} value - Milestone value
   * @param {string} language - Language code
   */
  showMilestone(type, value, language = 'de') {
    if (type === 'time') {
      const time = formatHistoryTime(value);
      this.show(
        getTranslation('timerStarted', language),
        {
          body: `Meeting has been running for ${time}`,
          tag: 'milestone-time',
        }
      );
    } else if (type === 'cost') {
      this.show(
        getTranslation('timerStarted', language),
        {
          body: `Meeting cost has reached ${value}`,
          tag: 'milestone-cost',
        }
      );
    }
  }
}

/**
 * ==================== FEEDBACK MANAGER ====================
 */

/**
 * User Feedback Manager (visual and audio feedback)
 */
class FeedbackManager {
  constructor() {
    this.audioContext = null;
    this.soundEnabled = true;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Feedback] Feedback Manager initialized');
    }
  }
  
  /**
   * Play sound feedback
   * @param {string} type - Sound type (success, error, click)
   */
  playSound(type = 'click') {
    if (!this.soundEnabled) return;
    
    try {
      // Create audio context if needed
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Sound parameters based on type
      const sounds = {
        success: { frequency: 800, duration: 100 },
        error: { frequency: 200, duration: 200 },
        click: { frequency: 400, duration: 50 },
        milestone: { frequency: 1000, duration: 150 },
      };
      
      const sound = sounds[type] || sounds.click;
      
      oscillator.frequency.value = sound.frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + sound.duration / 1000);
    } catch (error) {
      // Silently fail - audio is not critical
      if (DEBUG_CONFIG?.enabled) {
        console.warn('[Feedback] Sound playback failed:', error);
      }
    }
  }
  
  /**
   * Vibrate device (mobile)
   * @param {number|Array} pattern - Vibration pattern
   */
  vibrate(pattern = 50) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        if (DEBUG_CONFIG?.enabled) {
          console.warn('[Feedback] Vibration failed:', error);
        }
      }
    }
  }
  
  /**
   * Flash screen (visual feedback)
   * @param {string} color - Flash color
   */
  flash(color = 'rgba(255, 255, 255, 0.3)') {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${color};
      pointer-events: none;
      z-index: 9999;
      animation: flash 0.3s ease-out;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 300);
  }
  
  /**
   * Provide haptic feedback (combined)
   * @param {string} type - Feedback type
   */
  haptic(type = 'light') {
    const patterns = {
      light: 10,
      medium: 50,
      heavy: 100,
      success: [50, 50, 50],
      error: [100, 50, 100],
    };
    
    this.vibrate(patterns[type] || patterns.light);
    
    if (type === 'success' || type === 'error') {
      this.playSound(type);
    }
  }
  
  /**
   * Enable/disable sound
   * @param {boolean} enabled - Sound enabled
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }
  
  /**
   * Destroy feedback manager
   */
  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Feedback] Feedback Manager destroyed');
    }
  }
}

/**
 * ==================== HELPER FUNCTIONS ====================
 */

/**
 * Show notification with translation
 * @param {string} key - Translation key
 * @param {string} type - Notification type
 * @param {string} language - Language code
 * @param {Object} replacements - Translation replacements
 */
function showTranslatedNotification(key, type = 'info', language = 'de', replacements = {}) {
  const message = getTranslation(key, language, replacements);
  notificationManager.show(message, type);
}

/**
 * Show timer notification
 * @param {string} action - Action (started, paused, reset)
 * @param {string} language - Language code
 */
function showTimerNotification(action, language = 'de') {
  const keys = {
    started: 'timerStarted',
    paused: 'timerPaused',
    reset: 'timerReset',
  };
  
  const key = keys[action];
  if (!key) return;
  
  const types = {
    started: 'success',
    paused: 'warning',
    reset: 'info',
  };
  
  showTranslatedNotification(key, types[action], language);
}

/**
 * Show error notification with translation
 * @param {string} key - Translation key
 * @param {string} language - Language code
 */
function showErrorNotification(key, language = 'de') {
  showTranslatedNotification(key, 'error', language);
}

/**
 * ==================== INITIALIZATION ====================
 */

// Create global instances
const notificationManager = new NotificationManager();
const browserNotificationManager = new BrowserNotificationManager();
const feedbackManager = new FeedbackManager();

// Add CSS for notifications if not already present
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    }
    
    .notification {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease-out;
    }
    
    .notification-show {
      opacity: 1;
      transform: translateX(0);
    }
    
    .notification-hide {
      opacity: 0;
      transform: translateX(100%);
    }
    
    .notification-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    
    .notification-message {
      flex: 1;
      font-size: 0.875rem;
      line-height: 1.4;
      color: #374151;
    }
    
    .notification-close {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: #9ca3af;
      cursor: pointer;
      font-size: 1.5rem;
      line-height: 1;
      transition: color 0.2s;
    }
    
    .notification-close:hover {
      color: #4b5563;
    }
    
    .notification-success {
      border-left: 4px solid #10b981;
    }
    
    .notification-error {
      border-left: 4px solid #ef4444;
    }
    
    .notification-warning {
      border-left: 4px solid #f59e0b;
    }
    
    .notification-info {
      border-left: 4px solid #3b82f6;
    }
    
    [data-theme="dark"] .notification {
      background: #1f2937;
    }
    
    [data-theme="dark"] .notification-message {
      color: #e5e7eb;
    }
    
    [data-theme="dark"] .notification-close {
      color: #6b7280;
    }
    
    [data-theme="dark"] .notification-close:hover {
      color: #9ca3af;
    }
    
    @keyframes flash {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    @media (max-width: 640px) {
      .notification-container {
        left: 1rem;
        right: 1rem;
      }
      
      .notification {
        min-width: auto;
        max-width: none;
      }
    }
  `;
  document.head.appendChild(style);
}

// Log notifications module loaded (only in debug mode)
if (DEBUG_CONFIG?.enabled) {
  console.log('[Notifications] Notification module loaded');
}

/**
 * ==================== EXPORTS ====================
 */

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.NotificationManager = NotificationManager;
  window.BrowserNotificationManager = BrowserNotificationManager;
  window.FeedbackManager = FeedbackManager;
  window.notificationManager = notificationManager;
  window.browserNotificationManager = browserNotificationManager;
  window.feedbackManager = feedbackManager;
}
