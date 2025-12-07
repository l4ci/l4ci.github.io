/**
 * ==================== EMOJI MANAGER ====================
 * Emoji animations and celebrations
 * 
 * @file emojis.js
 * @version 2.0.0
 */

/**
 * Emoji Manager Class
 */
class EmojiManager {
  constructor() {
    this.container = null;
    this.activeEmojis = [];
    this.maxEmojis = EMOJI_CONFIG.animation.maxOnScreen;
    this.animationDuration = EMOJI_CONFIG.animation.duration;
    this.isEnabled = APP_CONFIG.features.enableEmojis;
    this.isInitialized = false;
    
    this.init();
  }
  
  /**
   * Initialize emoji system
   */
  init() {
    if (this.isInitialized || !this.isEnabled) return;
    
    // Get or create container
    this.container = document.getElementById('emojiContainer');
    
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'emojiContainer';
      this.container.className = 'emoji-container';
      this.container.setAttribute('aria-hidden', 'true');
      
      // Add to DOM when ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(this.container);
        });
      } else {
        document.body.appendChild(this.container);
      }
    }
    
    this.isInitialized = true;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Emoji Manager initialized');
    }
  }
  
  /**
   * Spawn single emoji
   * @param {string} emoji - Emoji character
   * @param {Object} options - Animation options
   * @returns {string} Emoji ID
   */
  spawn(emoji, options = {}) {
    if (!this.isEnabled || !this.isInitialized) return null;
    
    // Limit active emojis
    if (this.activeEmojis.length >= this.maxEmojis) {
      this.removeOldest();
    }
    
    const id = `emoji-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create emoji element
    const emojiElement = this.createEmojiElement(id, emoji, options);
    
    // Add to container
    this.container.appendChild(emojiElement);
    
    // Store reference
    this.activeEmojis.push({
      id,
      element: emojiElement,
      timestamp: Date.now(),
    });
    
    // Trigger animation
    requestAnimationFrame(() => {
      emojiElement.classList.add('emoji-animate');
    });
    
    // Auto-remove after animation
    setTimeout(() => {
      this.remove(id);
    }, this.animationDuration);
    
    if (DEBUG_CONFIG?.enabled && DEBUG_CONFIG.showStateChanges) {
      console.log('[Emojis] Spawn:', emoji, id);
    }
    
    return id;
  }
  
  /**
   * Create emoji element
   * @param {string} id - Emoji ID
   * @param {string} emoji - Emoji character
   * @param {Object} options - Animation options
   * @returns {HTMLElement} Emoji element
   */
  createEmojiElement(id, emoji, options = {}) {
    const element = document.createElement('div');
    element.id = id;
    element.className = 'emoji';
    element.textContent = emoji;
    
    // Random position
    const startX = options.startX || Math.random() * 100;
    const endX = startX + (Math.random() * 40 - 20); // Drift left/right
    const rotation = Math.random() * 720 - 360; // Random rotation
    const scale = options.scale || (0.8 + Math.random() * 0.4); // 0.8 - 1.2
    
    // Set CSS variables for animation
    element.style.setProperty('--start-x', `${startX}%`);
    element.style.setProperty('--end-x', `${endX}%`);
    element.style.setProperty('--rotation', `${rotation}deg`);
    element.style.setProperty('--scale', scale);
    element.style.setProperty('--duration', `${this.animationDuration}ms`);
    
    // Optional custom animation
    if (options.animation) {
      element.style.animation = options.animation;
    }
    
    return element;
  }
  
  /**
   * Remove emoji
   * @param {string} id - Emoji ID
   */
  remove(id) {
    const emojiData = this.activeEmojis.find(e => e.id === id);
    if (!emojiData) return;
    
    const { element } = emojiData;
    
    // Fade out
    element.classList.add('emoji-fade-out');
    
    // Remove after fade
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      
      // Remove from array
      this.activeEmojis = this.activeEmojis.filter(e => e.id !== id);
    }, 300);
  }
  
  /**
   * Remove oldest emoji
   */
  removeOldest() {
    if (this.activeEmojis.length === 0) return;
    
    const oldest = this.activeEmojis.reduce((prev, current) => {
      return prev.timestamp < current.timestamp ? prev : current;
    });
    
    this.remove(oldest.id);
  }
  
  /**
   * Clear all emojis
   */
  clear() {
    const ids = this.activeEmojis.map(e => e.id);
    ids.forEach(id => this.remove(id));
  }
  
  /**
   * Spawn multiple emojis (burst)
   * @param {Array<string>} emojis - Array of emoji characters
   * @param {number} count - Number of emojis to spawn
   * @param {number} interval - Interval between spawns (ms)
   */
  burst(emojis, count = 5, interval = 100) {
    if (!this.isEnabled) return;
    
    let spawned = 0;
    
    const spawnNext = () => {
      if (spawned >= count) return;
      
      const emoji = Array.isArray(emojis) 
        ? emojis[Math.floor(Math.random() * emojis.length)]
        : emojis;
      
      this.spawn(emoji);
      spawned++;
      
      if (spawned < count) {
        setTimeout(spawnNext, interval);
      }
    };
    
    spawnNext();
  }
  
  /**
   * Celebrate with random emojis
   * @param {number} count - Number of emojis
   */
  celebrate(count = 10) {
    this.burst(EMOJI_CONFIG.celebration, count, EMOJI_CONFIG.animation.spawnInterval);
  }
  
  /**
   * Show warning emojis
   * @param {number} count - Number of emojis
   */
  warn(count = 5) {
    this.burst(EMOJI_CONFIG.warning, count, EMOJI_CONFIG.animation.spawnInterval);
  }
  
  /**
   * Show milestone emojis
   * @param {string} type - Milestone type (time, cost)
   * @param {number} value - Milestone value
   */
  milestone(type, value) {
    if (!this.isEnabled) return;
    
    let emojis = [];
    
    if (type === 'time') {
      emojis = EMOJI_CONFIG.milestones[value] || EMOJI_CONFIG.celebration;
    } else if (type === 'cost') {
      emojis = EMOJI_CONFIG.costMilestones[value] || EMOJI_CONFIG.celebration;
    }
    
    if (emojis.length > 0) {
      this.burst(emojis, 8, 150);
      
      // Play sound if available
      if (feedbackManager) {
        feedbackManager.playSound('milestone');
      }
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Milestone:', type, value);
    }
  }
  
  /**
   * Rain effect (continuous spawning)
   * @param {Array<string>} emojis - Array of emoji characters
   * @param {number} duration - Duration in ms
   * @param {number} rate - Spawn rate (emojis per second)
   */
  rain(emojis, duration = 3000, rate = 5) {
    if (!this.isEnabled) return;
    
    const interval = 1000 / rate;
    const endTime = Date.now() + duration;
    
    const spawnNext = () => {
      if (Date.now() >= endTime) return;
      
      const emoji = Array.isArray(emojis)
        ? emojis[Math.floor(Math.random() * emojis.length)]
        : emojis;
      
      this.spawn(emoji);
      
      setTimeout(spawnNext, interval);
    };
    
    spawnNext();
  }
  
  /**
   * Fountain effect (from bottom)
   * @param {string} emoji - Emoji character
   * @param {number} count - Number of emojis
   */
  fountain(emoji, count = 10) {
    if (!this.isEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.spawn(emoji, {
          animation: 'emoji-fountain 2s ease-out forwards',
        });
      }, i * 100);
    }
  }
  
  /**
   * Firework effect (explosion)
   * @param {Array<string>} emojis - Array of emoji characters
   * @param {number} x - X position (%)
   * @param {number} y - Y position (%)
   */
  firework(emojis, x = 50, y = 50) {
    if (!this.isEnabled) return;
    
    const count = 12;
    const angleStep = (Math.PI * 2) / count;
    
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i;
      const emoji = Array.isArray(emojis)
        ? emojis[Math.floor(Math.random() * emojis.length)]
        : emojis;
      
      this.spawn(emoji, {
        startX: x,
        animation: `emoji-firework-${i} 1.5s ease-out forwards`,
      });
    }
  }
  
  /**
   * Get active emoji count
   * @returns {number} Count
   */
  getCount() {
    return this.activeEmojis.length;
  }
  
  /**
   * Enable/disable emoji system
   * @param {boolean} enabled - Enabled state
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    
    if (!enabled) {
      this.clear();
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Enabled:', enabled);
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
    this.activeEmojis = [];
    this.isInitialized = false;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Emojis] Emoji Manager destroyed');
    }
  }
}

/**
 * ==================== HELPER FUNCTIONS ====================
 */

/**
 * Get random emoji from category
 * @param {string} category - Category name (celebration, warning, milestones, costMilestones)
 * @returns {string} Random emoji
 */
function getRandomEmojiFromCategory(category) {
  const emojis = EMOJI_CONFIG[category];
  
  if (!emojis) {
    return '🎉';
  }
  
  if (Array.isArray(emojis)) {
    return emojis[Math.floor(Math.random() * emojis.length)];
  }
  
  // For milestone objects, get random from random milestone
  const keys = Object.keys(emojis);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const emojiArray = emojis[randomKey];
  
  return emojiArray[Math.floor(Math.random() * emojiArray.length)];
}

/**
 * Spawn emoji at specific position
 * @param {string} emoji - Emoji character
 * @param {number} x - X position in pixels
 * @param {number} y - Y position in pixels
 */
function spawnEmojiAtPosition(emoji, x, y) {
  const xPercent = (x / window.innerWidth) * 100;
  const yPercent = (y / window.innerHeight) * 100;
  
  emojiManager.spawn(emoji, {
    startX: xPercent,
    startY: yPercent,
  });
}

/**
 * Spawn emoji on element click
 * @param {HTMLElement} element - Target element
 * @param {string} emoji - Emoji character
 */
function addEmojiOnClick(element, emoji) {
  if (!element) return;
  
  element.addEventListener('click', (event) => {
    spawnEmojiAtPosition(emoji, event.clientX, event.clientY);
  });
}

/**
 * ==================== INITIALIZATION ====================
 */

// Create global instance
const emojiManager = new EmojiManager();

// Add CSS for emojis if not already present
if (!document.getElementById('emoji-styles')) {
  const style = document.createElement('style');
  style.id = 'emoji-styles';
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
      opacity: 0;
      bottom: -50px;
      left: var(--start-x, 50%);
      transform: translateX(-50%) scale(var(--scale, 1));
    }
    
    .emoji-animate {
      animation: emoji-float var(--duration, 3000ms) ease-out forwards;
    }
    
    .emoji-fade-out {
      animation: emoji-fade-out 0.3s ease-out forwards;
    }
    
    @keyframes emoji-float {
      0% {
        bottom: -50px;
        left: var(--start-x, 50%);
        opacity: 0;
        transform: translateX(-50%) scale(var(--scale, 1)) rotate(0deg);
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        bottom: 110%;
        left: var(--end-x, 50%);
        opacity: 0;
        transform: translateX(-50%) scale(var(--scale, 1)) rotate(var(--rotation, 360deg));
      }
    }
    
    @keyframes emoji-fade-out {
      from {
        opacity: 1;
        transform: translateX(-50%) scale(var(--scale, 1));
      }
      to {
        opacity: 0;
        transform: translateX(-50%) scale(0.5);
      }
    }
    
    @keyframes emoji-fountain {
      0% {
        bottom: 0;
        opacity: 0;
        transform: translateX(-50%) translateY(0) scale(1);
      }
      20% {
        opacity: 1;
      }
      50% {
        bottom: 60%;
      }
      80% {
        opacity: 1;
      }
      100% {
        bottom: 0;
        opacity: 0;
        transform: translateX(-50%) translateY(0) scale(0.5);
      }
    }
    
    /* Firework animations (12 directions) */
    ${Array.from({ length: 12 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 12;
      const x = Math.cos(angle) * 200;
      const y = Math.sin(angle) * 200;
      
      return `
        @keyframes emoji-firework-${i} {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translate(${x}px, ${y}px) scale(1);
            opacity: 0;
          }
        }
      `;
    }).join('\n')}
    
    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
      .emoji-animate {
        animation: emoji-fade-out 0.5s ease-out forwards;
      }
      
      @keyframes emoji-float {
        from { opacity: 0; }
        to { opacity: 0; }
      }
    }
    
    /* Mobile optimizations */
    @media (max-width: 640px) {
      .emoji {
        font-size: 1.5rem;
      }
    }
  `;
  document.head.appendChild(style);
}

// Log emojis module loaded (only in debug mode)
if (DEBUG_CONFIG?.enabled) {
  console.log('[Emojis] Emoji module loaded');
}

/**
 * ==================== EXPORTS ====================
 */

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.EmojiManager = EmojiManager;
  window.emojiManager = emojiManager;
  window.getRandomEmojiFromCategory = getRandomEmojiFromCategory;
  window.spawnEmojiAtPosition = spawnEmojiAtPosition;
  window.addEmojiOnClick = addEmojiOnClick;
}
