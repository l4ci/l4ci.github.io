/**
 * ==================== TIMER MANAGER ====================
 * Timer and cost calculation logic
 * 
 * @file timer.js
 * @version 2.0.0
 */

/**
 * ==================== TIMER MANAGER ====================
 */

/**
 * Timer Manager Class
 */
class TimerManager {
  constructor() {
    this.elapsedTime = 0;
    this.isRunning = false;
    this.intervalId = null;
    this.startTimestamp = null;
    this.pausedTime = 0;
    
    // Event callbacks
    this.callbacks = {
      onTick: null,
      onStart: null,
      onPause: null,
      onReset: null,
      onMilestone: null,
    };
    
    // Milestone tracking
    this.lastTimeMilestone = 0;
    this.lastCostMilestone = 0;
  }
  
  /**
   * Register event callback
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
  }
  
  /**
   * Trigger event callback
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  trigger(event, data = {}) {
    if (this.callbacks[event]) {
      this.callbacks[event](data);
    }
  }
  
  /**
   * Start timer
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTimestamp = Date.now() - (this.pausedTime * 1000);
    
    this.intervalId = setInterval(() => {
      this.tick();
    }, APP_CONFIG.performance.timerUpdateInterval);
    
    this.trigger('onStart', {
      elapsedTime: this.elapsedTime,
    });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Started');
    }
  }
  
  /**
   * Pause timer
   */
  pause() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this.pausedTime = this.elapsedTime;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.trigger('onPause', {
      elapsedTime: this.elapsedTime,
    });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Paused at', this.elapsedTime);
    }
  }
  
  /**
   * Reset timer
   */
  reset() {
    this.pause();
    
    this.elapsedTime = 0;
    this.pausedTime = 0;
    this.startTimestamp = null;
    this.lastTimeMilestone = 0;
    this.lastCostMilestone = 0;
    
    this.trigger('onReset', {
      elapsedTime: 0,
    });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Reset');
    }
  }
  
  /**
   * Toggle timer (start/pause)
   */
  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }
  
  /**
   * Timer tick
   */
  tick() {
    if (!this.isRunning) return;
    
    const now = Date.now();
    this.elapsedTime = Math.floor((now - this.startTimestamp) / 1000);
    
    // Check time milestones
    this.checkTimeMilestone(this.elapsedTime);
    
    // Trigger tick callback
    this.trigger('onTick', {
      elapsedTime: this.elapsedTime,
      isRunning: this.isRunning,
    });
  }
  
  /**
   * Set elapsed time (for loading saved state)
   * @param {number} seconds - Elapsed seconds
   */
  setElapsedTime(seconds) {
    this.elapsedTime = seconds;
    this.pausedTime = seconds;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Elapsed time set to', seconds);
    }
  }
  
  /**
   * Get elapsed time
   * @returns {number} Elapsed seconds
   */
  getElapsedTime() {
    return this.elapsedTime;
  }
  
  /**
   * Check if timer is running
   * @returns {boolean} Is running
   */
  getIsRunning() {
    return this.isRunning;
  }
  
  /**
   * Check time milestone
   * @param {number} seconds - Current elapsed seconds
   */
  checkTimeMilestone(seconds) {
    const milestones = Object.keys(EMOJI_CONFIG.milestones)
      .map(Number)
      .sort((a, b) => a - b);
    
    for (const milestone of milestones) {
      if (seconds >= milestone && this.lastTimeMilestone < milestone) {
        this.lastTimeMilestone = milestone;
        
        this.trigger('onMilestone', {
          type: 'time',
          value: milestone,
          seconds: seconds,
        });
        
        if (DEBUG_CONFIG?.enabled) {
          console.log('[Timer] Time milestone reached:', milestone);
        }
        
        break;
      }
    }
  }
  
  /**
   * Check cost milestone
   * @param {number} cost - Current total cost
   */
  checkCostMilestone(cost) {
    const milestones = Object.keys(EMOJI_CONFIG.costMilestones)
      .map(Number)
      .sort((a, b) => a - b);
    
    for (const milestone of milestones) {
      if (cost >= milestone && this.lastCostMilestone < milestone) {
        this.lastCostMilestone = milestone;
        
        this.trigger('onMilestone', {
          type: 'cost',
          value: milestone,
          cost: cost,
        });
        
        if (DEBUG_CONFIG?.enabled) {
          console.log('[Timer] Cost milestone reached:', milestone);
        }
        
        break;
      }
    }
  }
  
  /**
   * Destroy timer
   */
  destroy() {
    this.pause();
    this.callbacks = {};
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Destroyed');
    }
  }
}

/**
 * ==================== COST CALCULATOR ====================
 */

/**
 * Cost Calculator Class
 */
class CostCalculator {
  constructor() {
    this.costPerPerson = APP_CONFIG.defaults.costPerPerson;
    this.currency = APP_CONFIG.defaults.currency;
    this.peopleCount = APP_CONFIG.defaults.people;
  }
  
  /**
   * Set cost per person
   * @param {number} cost - Cost per person per hour
   */
  setCostPerPerson(cost) {
    if (validateCost(cost)) {
      this.costPerPerson = cost;
    }
  }
  
  /**
   * Set currency
   * @param {string} currency - Currency code
   */
  setCurrency(currency) {
    if (validateCurrency(currency)) {
      this.currency = currency;
    }
  }
  
  /**
   * Set people count
   * @param {number} count - Number of people
   */
  setPeopleCount(count) {
    if (validatePeopleCount(count)) {
      this.peopleCount = count;
    }
  }
  
  /**
   * Calculate total cost (simple - without segments)
   * @param {number} elapsedSeconds - Total elapsed time
   * @returns {number} Total cost
   */
  calculateTotalCost(elapsedSeconds) {
    if (!isValidNumber(elapsedSeconds) || elapsedSeconds < 0) {
      return 0;
    }
    
    const hours = elapsedSeconds / 3600;
    const totalCost = this.costPerPerson * this.peopleCount * hours;
    
    return roundTo(totalCost, 2);
  }
  
  /**
   * Calculate total cost with segments
   * @param {number} elapsedSeconds - Total elapsed time
   * @param {Array} segments - People count segments
   * @returns {number} Total cost
   */
  calculateTotalCostWithSegments(elapsedSeconds, segments) {
    if (!segments || segments.length === 0) {
      return this.calculateTotalCost(elapsedSeconds);
    }
    
    let totalCost = 0;
    
    // Calculate cost for each segment
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const nextSegment = segments[i + 1];
      
      // Calculate segment duration
      const segmentStart = segment.startTime;
      const segmentEnd = nextSegment ? nextSegment.startTime : elapsedSeconds;
      const segmentDuration = segmentEnd - segmentStart;
      
      if (segmentDuration > 0) {
        // Calculate cost for this segment
        const hours = segmentDuration / 3600;
        const segmentCost = this.costPerPerson * segment.people * hours;
        totalCost += segmentCost;
        
        if (DEBUG_CONFIG?.enabled && DEBUG_CONFIG.showStateChanges) {
          console.log(
            `[CostCalculator] Segment ${i}: ${segment.people} people, ` +
            `${segmentDuration}s = ${segmentCost.toFixed(2)}`
          );
        }
      }
    }
    
    return roundTo(totalCost, 2);
  }
  
  /**
   * Calculate cost per minute
   * @returns {number} Cost per minute
   */
  getCostPerMinute() {
    return roundTo((this.costPerPerson * this.peopleCount) / 60, 4);
  }
  
  /**
   * Calculate cost per second
   * @returns {number} Cost per second
   */
  getCostPerSecond() {
    return roundTo((this.costPerPerson * this.peopleCount) / 3600, 6);
  }
  
  /**
   * Get current settings
   * @returns {Object} Current settings
   */
  getSettings() {
    return {
      costPerPerson: this.costPerPerson,
      currency: this.currency,
      peopleCount: this.peopleCount,
    };
  }
}

/**
 * ==================== SEGMENT MANAGER ====================
 */

/**
 * Segment Manager Class
 * Manages people count changes over time
 */
class SegmentManager {
  constructor() {
    this.segments = [];
  }
  
  /**
   * Add new segment
   * @param {number} peopleCount - Number of people
   * @param {number} startTime - Start time in seconds
   */
  addSegment(peopleCount, startTime) {
    // Don't add if same as last segment
    const lastSegment = this.getLastSegment();
    if (lastSegment && lastSegment.people === peopleCount) {
      return;
    }
    
    this.segments.push({
      people: peopleCount,
      startTime: startTime,
      timestamp: Date.now(),
    });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[SegmentManager] Added segment:', {
        people: peopleCount,
        startTime: startTime,
      });
    }
  }
  
  /**
   * Get all segments
   * @returns {Array} All segments
   */
  getSegments() {
    return this.segments;
  }
  
  /**
   * Get last segment
   * @returns {Object|null} Last segment
   */
  getLastSegment() {
    return this.segments.length > 0 
      ? this.segments[this.segments.length - 1]
      : null;
  }
  
  /**
   * Clear all segments
   */
  clear() {
    this.segments = [];
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[SegmentManager] Cleared all segments');
    }
  }
  
  /**
   * Load segments from saved data
   * @param {Array} segments - Segments array
   */
  loadSegments(segments) {
    if (Array.isArray(segments)) {
      this.segments = segments;
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[SegmentManager] Loaded segments:', segments.length);
      }
    }
  }
  
  /**
   * Get segment count
   * @returns {number} Number of segments
   */
  getCount() {
    return this.segments.length;
  }
  
  /**
   * Get segment at index
   * @param {number} index - Segment index
   * @returns {Object|null} Segment
   */
  getSegment(index) {
    return this.segments[index] || null;
  }
  
  /**
   * Remove segment at index
   * @param {number} index - Segment index
   * @returns {boolean} Success
   */
  removeSegment(index) {
    if (index >= 0 && index < this.segments.length) {
      this.segments.splice(index, 1);
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[SegmentManager] Removed segment at index:', index);
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Get total duration for people count
   * @param {number} peopleCount - Number of people
   * @param {number} totalTime - Total elapsed time
   * @returns {number} Total duration in seconds
   */
  getDurationForPeopleCount(peopleCount, totalTime) {
    let duration = 0;
    
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      
      if (segment.people === peopleCount) {
        const nextSegment = this.segments[i + 1];
        const segmentEnd = nextSegment ? nextSegment.startTime : totalTime;
        duration += segmentEnd - segment.startTime;
      }
    }
    
    return duration;
  }
}

/**
 * ==================== EXPORTS ====================
 */

// Log timer module loaded
console.log('[Timer] Timer module loaded');

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.TimerManager = TimerManager;
  window.CostCalculator = CostCalculator;
  window.SegmentManager = SegmentManager;
}
