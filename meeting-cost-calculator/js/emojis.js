/**
 * ==================== EMOJI MANAGER ====================
 * Emoji animations and celebrations
 * 
 * @file emojis.js
 * @version 2.0.0
 */

/**
 * ==================== EMOJI MANAGER ====================
 */

/**
 * Emoji Manager Class
 */
class EmojiManager {
  constructor() {
    this.container = null;
    this.emojis = [];
    this.maxEmojis = EMOJI_CONFIG.animation.maxOnScreen;
    this.init();
  }
  
  /**
   * Initialize emoji container
   */
  init() {
    // Create container if it doesn't exist
    this.container = document.getElementById('emojiContainer');
    
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'emojiContainer';
      this.container.className = 'emoji-container';
      this.container.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.container);
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Emoji manager initialized');
    }
  }
  
  /**
   * Spawn single emoji
   * @param {string} emoji - Emoji character
   * @param {Object} options - Spawn options
   */
  spawn(emoji, options = {}) {
    // Check if at max
    if (this.emojis.length >= this.maxEmojis) {
      this.removeOldest();
    }
    
    const defaults = {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight,
      duration: EMOJI_CONFIG.animation.duration,
      size: 2 + Math.random() * 2, // 2-4rem
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 100, // -50 to 50px
    };
    
    const config = { ...defaults, ...options };
    
    const element = this.createEmoji(emoji, config);
    this.emojis.push({ element, emoji, config });
    
    // Remove after animation
    setTimeout(() => {
      this.remove(element);
    }, config.duration);
  }
  
  /**
   * Create emoji element
   * @param {string} emoji - Emoji character
   * @param {Object} config - Configuration
   * @returns {HTMLElement} Emoji element
   */
  createEmoji(emoji, config) {
    const element = document.createElement('div');
    element.className = 'emoji';
    element.textContent = emoji;
    
    // Set initial position
    element.style.left = `${config.x}px`;
    element.style.bottom = '0';
    element.style.fontSize = `${config.size}rem`;
    element.style.transform = `rotate(${config.rotation}deg)`;
    
    // Set animation
    element.style.animation = `
      emojiFloat ${config.duration}ms ease-out forwards,
      emojiRotate ${config.duration}ms linear forwards
    `;
    
    // Set custom properties for animation
    element.style.setProperty('--drift', `${config.drift}px`);
    
    this.container.appendChild(element);
    
    return element;
  }
  
  /**
   * Remove emoji element
   * @param {HTMLElement} element - Emoji element
   */
  remove(element) {
    const index = this.emojis.findIndex(e => e.element === element);
    
    if (index !== -1) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.emojis.splice(index, 1);
    }
  }
  
  /**
   * Remove oldest emoji
   */
  removeOldest() {
    if (this.emojis.length > 0) {
      const oldest = this.emojis[0];
      this.remove(oldest.element);
    }
  }
  
  /**
   * Spawn multiple emojis (burst)
   * @param {Array|string} emojis - Emoji(s) to spawn
   * @param {number} count - Number of emojis
   * @param {number} interval - Interval between spawns in ms
   */
  burst(emojis, count = 5, interval = EMOJI_CONFIG.animation.spawnInterval) {
    const emojiArray = Array.isArray(emojis) ? emojis : [emojis];
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const emoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
        this.spawn(emoji);
      }, i * interval);
    }
  }
  
  /**
   * Celebration animation
   * @param {string} type - Celebration type
   */
  celebrate(type = 'default') {
    const emojis = EMOJI_CONFIG.celebration;
    this.burst(emojis, 10, 100);
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Celebration:', type);
    }
  }
  
  /**
   * Warning animation
   */
  warn() {
    const emojis = EMOJI_CONFIG.warning;
    this.burst(emojis, 5, 150);
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Warning');
    }
  }
  
  /**
   * Time milestone animation
   * @param {number} seconds - Milestone seconds
   */
  timeMilestone(seconds) {
    const emojis = EMOJI_CONFIG.milestones[seconds] || ['⏰'];
    this.burst(emojis, 8, 120);
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Time milestone:', seconds);
    }
  }
  
  /**
   * Cost milestone animation
   * @param {number} cost - Milestone cost
   */
  costMilestone(cost) {
    const emojis = EMOJI_CONFIG.costMilestones[cost] || ['💰'];
    this.burst(emojis, 10, 100);
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Cost milestone:', cost);
    }
  }
  
  /**
   * Clear all emojis
   */
  clear() {
    this.emojis.forEach(emoji => {
      if (emoji.element.parentNode) {
        emoji.element.parentNode.removeChild(emoji.element);
      }
    });
    this.emojis = [];
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Cleared all emojis');
    }
  }
  
  /**
   * Destroy emoji manager
   */
  destroy() {
    this.clear();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }
}

/**
 * ==================== CSS ANIMATIONS ====================
 * Inject CSS animations if not already present
 */
function injectEmojiStyles() {
  const styleId = 'emoji-animations';
  
  // Check if already injected
  if (document.getElementById(styleId)) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .emoji-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    
    .emoji {
      position: absolute;
      font-size: 2rem;
      user-select: none;
      pointer-events: none;
      will-change: transform, opacity;
    }
    
    @keyframes emojiFloat {
      0% {
        transform: translateY(0) translateX(0) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
        transform: translateY(-10vh) translateX(0) scale(1);
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(var(--drift, 0)) scale(0.5);
        opacity: 0;
      }
    }
    
    @keyframes emojiRotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * ==================== MILESTONE HANDLERS ====================
 */

/**
 * Handle time milestone
 * @param {number} seconds - Milestone seconds
 */
function handleTimeMilestone(seconds) {
  if (!APP_CONFIG.features.enableEmojis) return;
  
  emojiManager.timeMilestone(seconds);
  
  // Optional: Play sound
  if (feedbackManager) {
    feedbackManager.playSound('milestone');
    feedbackManager.haptic('medium');
  }
}

/**
 * Handle cost milestone
 * @param {number} cost - Milestone cost
 */
function handleCostMilestone(cost) {
  if (!APP_CONFIG.features.enableEmojis) return;
  
  emojiManager.costMilestone(cost);
  
  // Optional: Play sound
  if (feedbackManager) {
    feedbackManager.playSound('milestone');
    feedbackManager.haptic('heavy');
  }
}

/**
 * ==================== INITIALIZATION ====================
 */

// Inject styles on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectEmojiStyles);
} else {
  injectEmojiStyles();
}

/**
 * ==================== GLOBAL INSTANCE ====================
 */

const emojiManager = new EmojiManager();

/**
 * ==================== EXPORTS ====================
 */

// Log emojis loaded
console.log('[Emojis] Emoji manager loaded');

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.EmojiManager = EmojiManager;
  window.emojiManager = emojiManager;
  window.handleTimeMilestone = handleTimeMilestone;
  window.handleCostMilestone = handleCostMilestone;
}
