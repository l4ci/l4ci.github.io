/**
 * ==================== NOTIFICATION MANAGER ====================
 * Toast notifications and feedback
 * 
 * @file notifications.js
 * @version 2.0.0
 */

/**
 * ==================== NOTIFICATION MANAGER ====================
 */

/**
 * Notification Manager Class
 */
class NotificationManager {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.maxNotifications = 3;
    this.init();
  }
  
  /**
   * Initialize notification container
   */
  init() {
    // Create container if it doesn't exist
    this.container = document.getElementById('notificationContainer');
    
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notificationContainer';
      this.container.className = 'notification-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.container);
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Notifications] Notification manager initialized');
    }
  }
  
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {number} duration - Duration in ms
   * @returns {Object} Notification object
   */
  show(message, type = 'info', duration = NOTIFICATION_CONFIG.duration) {
    // Remove oldest if at max
    if (this.notifications.length >= this.maxNotifications) {
      const oldest = this.notifications[0];
      this.remove(oldest.id);
    }
    
    const notification = this.create(message, type, duration);
    this.notifications.push(notification);
    
    return notification;
  }
  
  /**
   * Create notification element
   * @param {string} message - Notification message
   * @param {string} type - Notification type
   * @param {number} duration - Duration in ms
   * @returns {Object} Notification object
   */
  create(message, type, duration) {
    const id = Date.now() + Math.random();
    const config = NOTIFICATION_CONFIG.types[type] || NOTIFICATION_CONFIG.types.info;
    
    // Create notification element
    const element = document.createElement('div');
    element.className = `notification notification-${type}`;
    element.setAttribute('role', 'alert');
    element.dataset.id = id;
    
    // Create icon
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = config.icon;
    
    // Create message
    const messageEl = document.createElement('span');
    messageEl.className = 'notification-message';
    messageEl.textContent = message;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.onclick = () => this.remove(id);
    
    // Append elements
    element.appendChild(icon);
    element.appendChild(messageEl);
    element.appendChild(closeBtn);
    
    // Add to container
    this.container.appendChild(element);
    
    // Trigger animation
    setTimeout(() => {
      element.classList.add('notification-show');
    }, 10);
    
    // Auto remove
    const timeoutId = setTimeout(() => {
      this.remove(id);
    }, duration);
    
    const notification = {
      id,
      element,
      type,
      message,
      timeoutId,
    };
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Notifications] Created:', type, message);
    }
    
    return notification;
  }
  
  /**
   * Remove notification
   * @param {number} id - Notification ID
   */
  remove(id) {
    const index = this.notifications.findIndex(n => n.id === id);
    
    if (index === -1) return;
    
    const notification = this.notifications[index];
    
    // Clear timeout
    if (notification.timeoutId) {
      clearTimeout(notification.timeoutId);
    }
    
    // Fade out animation
    notification.element.classList.remove('notification-show');
    notification.element.classList.add('notification-hide');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (notification.element.parentNode) {
        notification.element.parentNode.removeChild(notification.element);
      }
    }, 300);
    
    // Remove from array
    this.notifications.splice(index, 1);
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Notifications] Removed:', id);
    }
  }
  
  /**
   * Remove all notifications
   */
  clear() {
    this.notifications.forEach(notification => {
      this.remove(notification.id);
    });
  }
  
  /**
   * Show success notification
   * @param {string} message - Message
   * @param {number} duration - Duration in ms
   */
  success(message, duration) {
    return this.show(message, 'success', duration);
  }
  
  /**
   * Show error notification
   * @param {string} message - Message
   * @param {number} duration - Duration in ms
   */
  error(message, duration) {
    return this.show(message, 'error', duration);
  }
  
  /**
   * Show warning notification
   * @param {string} message - Message
   * @param {number} duration - Duration in ms
   */
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }
  
  /**
   * Show info notification
   * @param {string} message - Message
   * @param {number} duration - Duration in ms
   */
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

/**
 * ==================== FEEDBACK MANAGER ====================
 */

/**
 * Feedback Manager Class
 * Handles haptic feedback, sounds, and vibrations
 */
class FeedbackManager {
  constructor() {
    this.soundEnabled = true;
    this.hapticEnabled = true;
    this.sounds = {};
  }
  
  /**
   * Play haptic feedback
   * @param {string} type - Feedback type (light, medium, heavy, success, error)
   */
  haptic(type = 'light') {
    if (!this.hapticEnabled) return;
    
    // Vibration API
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        error: [20, 100, 20],
      };
      
      const pattern = patterns[type] || patterns.light;
      navigator.vibrate(pattern);
    }
  }
  
  /**
   * Vibrate with custom pattern
   * @param {number|Array} pattern - Vibration pattern
   */
  vibrate(pattern) {
    if (!this.hapticEnabled) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
  
  /**
   * Play sound
   * @param {string} soundName - Sound name
   */
  playSound(soundName) {
    if (!this.soundEnabled) return;
    
    // Simple beep using Web Audio API
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different frequencies for different sounds
        const frequencies = {
          click: 800,
          success: 1000,
          error: 400,
          milestone: 1200,
        };
        
        oscillator.frequency.value = frequencies[soundName] || 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        if (DEBUG_CONFIG?.enabled) {
          console.warn('[Feedback] Sound playback failed:', error);
        }
      }
    }
  }
  
  /**
   * Enable/disable sound
   * @param {boolean} enabled - Enable sound
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }
  
  /**
   * Enable/disable haptic feedback
   * @param {boolean} enabled - Enable haptic
   */
  setHapticEnabled(enabled) {
    this.hapticEnabled = enabled;
  }
}

/**
 * ==================== TIMER NOTIFICATIONS ====================
 */

/**
 * Show timer notification
 * @param {string} action - Action (started, paused, reset)
 * @param {string} language - Language code
 */
function showTimerNotification(action, language = 'de') {
  const messages = {
    started: getTranslation('timerStarted', language),
    paused: getTranslation('timerPaused', language),
    reset: getTranslation('timerReset', language),
  };
  
  const message = messages[action];
  
  if (message) {
    if (action === 'started') {
      notificationManager.success(message, 2000);
    } else if (action === 'paused') {
      notificationManager.info(message, 2000);
    } else if (action === 'reset') {
      notificationManager.warning(message, 2000);
    }
  }
}

/**
 * ==================== GLOBAL INSTANCES ====================
 */

const notificationManager = new NotificationManager();
const feedbackManager = new FeedbackManager();

/**
 * ==================== EXPORTS ====================
 */

// Log notifications loaded
console.log('[Notifications] Notification manager loaded');

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.NotificationManager = NotificationManager;
  window.FeedbackManager = FeedbackManager;
  window.notificationManager = notificationManager;
  window.feedbackManager = feedbackManager;
  window.showTimerNotification = showTimerNotification;
}
