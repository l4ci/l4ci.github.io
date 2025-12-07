/**
 * ==================== TIMER MANAGER ====================
 * Timer logic and state management
 * 
 * @file timer.js
 * @version 2.0.0
 */

/**
 * Timer Manager Class
 */
class TimerManager {
  constructor() {
    this.elapsedTime = 0;
    this.isRunning = false;
    this.startTime = null;
    this.intervalId = null;
    this.updateInterval = APP_CONFIG.performance.timerUpdateInterval;
    this.lastMilestone = 0;
    this.lastCostMilestone = 0;
    this.callbacks = {
      onTick: null,
      onStart: null,
      onPause: null,
      onReset: null,
      onMilestone: null,
    };
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Timer Manager initialized');
    }
  }
  
  /**
   * Register callback functions
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
  }
  
  /**
   * Trigger callback
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  trigger(event, data = null) {
    if (this.callbacks[event] && typeof this.callbacks[event] === 'function') {
      try {
        this.callbacks[event](data);
      } catch (error) {
        logError(`Timer.trigger.${event}`, error, { data });
      }
    }
  }
  
  /**
   * Start the timer
   * @returns {boolean} Success
   */
  start() {
    if (this.isRunning) {
      if (DEBUG_CONFIG?.enabled) {
        console.warn('[Timer] Timer is already running');
      }
      return false;
    }
    
    this.isRunning = true;
    this.startTime = Date.now() - (this.elapsedTime * 1000);
    
    this.intervalId = setInterval(() => {
      this.tick();
    }, this.updateInterval);
    
    this.trigger('onStart', { elapsedTime: this.elapsedTime });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Started at', this.elapsedTime, 'seconds');
    }
    
    return true;
  }
  
  /**
   * Pause the timer
   * @returns {boolean} Success
   */
  pause() {
    if (!this.isRunning) {
      if (DEBUG_CONFIG?.enabled) {
        console.warn('[Timer] Timer is not running');
      }
      return false;
    }
    
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.trigger('onPause', { elapsedTime: this.elapsedTime });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Paused at', this.elapsedTime, 'seconds');
    }
    
    return true;
  }
  
  /**
   * Reset the timer
   * @returns {boolean} Success
   */
  reset() {
    const wasRunning = this.isRunning;
    
    if (this.isRunning) {
      this.pause();
    }
    
    this.elapsedTime = 0;
    this.startTime = null;
    this.lastMilestone = 0;
    this.lastCostMilestone = 0;
    
    this.trigger('onReset', { wasRunning });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Reset');
    }
    
    return true;
  }
  
  /**
   * Toggle timer (start/pause)
   * @returns {boolean} New running state
   */
  toggle() {
    if (this.isRunning) {
      this.pause();
      return false;
    } else {
      this.start();
      return true;
    }
  }
  
  /**
   * Timer tick (called every interval)
   */
  tick() {
    if (!this.isRunning) return;
    
    const now = Date.now();
    this.elapsedTime = Math.floor((now - this.startTime) / 1000);
    
    // Trigger tick callback
    this.trigger('onTick', {
      elapsedTime: this.elapsedTime,
      isRunning: this.isRunning,
    });
    
    // Check for milestones
    this.checkMilestones();
  }
  
  /**
   * Check and trigger milestone events
   */
  checkMilestones() {
    // Time milestones
    const timeMilestones = Object.keys(EMOJI_CONFIG.milestones)
      .map(Number)
      .sort((a, b) => a - b);
    
    for (const milestone of timeMilestones) {
      if (this.elapsedTime >= milestone && this.lastMilestone < milestone) {
        this.lastMilestone = milestone;
        this.trigger('onMilestone', {
          type: 'time',
          value: milestone,
          elapsedTime: this.elapsedTime,
        });
        
        if (DEBUG_CONFIG?.enabled) {
          console.log('[Timer] Time milestone reached:', milestone, 'seconds');
        }
      }
    }
  }
  
  /**
   * Check cost milestone (called externally)
   * @param {number} cost - Current cost
   */
  checkCostMilestone(cost) {
    const costMilestones = Object.keys(EMOJI_CONFIG.costMilestones)
      .map(Number)
      .sort((a, b) => a - b);
    
    for (const milestone of costMilestones) {
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
      }
    }
  }
  
  /**
   * Set elapsed time (for loading saved sessions)
   * @param {number} seconds - Elapsed time in seconds
   */
  setElapsedTime(seconds) {
    if (!isValidNumber(seconds) || seconds < 0) {
      console.warn('[Timer] Invalid elapsed time:', seconds);
      return;
    }
    
    this.elapsedTime = Math.floor(seconds);
    
    if (this.isRunning) {
      this.startTime = Date.now() - (this.elapsedTime * 1000);
    }
    
    // Update milestone trackers
    this.updateMilestoneTrackers();
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Elapsed time set to', this.elapsedTime, 'seconds');
    }
  }
  
  /**
   * Update milestone trackers based on current time
   */
  updateMilestoneTrackers() {
    const timeMilestones = Object.keys(EMOJI_CONFIG.milestones)
      .map(Number)
      .sort((a, b) => b - a);
    
    for (const milestone of timeMilestones) {
      if (this.elapsedTime >= milestone) {
        this.lastMilestone = milestone;
        break;
      }
    }
  }
  
  /**
   * Get current state
   * @returns {Object} Timer state
   */
  getState() {
    return {
      elapsedTime: this.elapsedTime,
      isRunning: this.isRunning,
      startTime: this.startTime,
      lastMilestone: this.lastMilestone,
      lastCostMilestone: this.lastCostMilestone,
    };
  }
  
  /**
   * Load state (for restoring sessions)
   * @param {Object} state - Timer state
   */
  loadState(state) {
    if (!state) return;
    
    this.elapsedTime = state.elapsedTime || 0;
    this.lastMilestone = state.lastMilestone || 0;
    this.lastCostMilestone = state.lastCostMilestone || 0;
    
    // Don't restore running state - always start paused
    this.isRunning = false;
    this.startTime = null;
    
    this.updateMilestoneTrackers();
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] State loaded:', this.getState());
    }
  }
  
  /**
   * Get formatted elapsed time
   * @param {boolean} showHours - Always show hours
   * @returns {string} Formatted time
   */
  getFormattedTime(showHours = false) {
    return formatElapsedTime(this.elapsedTime, showHours);
  }
  
  /**
   * Get elapsed time in different units
   * @returns {Object} Time in different units
   */
  getTimeUnits() {
    const hours = Math.floor(this.elapsedTime / 3600);
    const minutes = Math.floor((this.elapsedTime % 3600) / 60);
    const seconds = this.elapsedTime % 60;
    
    return {
      hours,
      minutes,
      seconds,
      totalMinutes: Math.floor(this.elapsedTime / 60),
      totalSeconds: this.elapsedTime,
    };
  }
  
  /**
   * Destroy timer (cleanup)
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isRunning = false;
    this.callbacks = {};
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Timer] Timer destroyed');
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
    this.peopleCount = APP_CONFIG.defaults.people;
    this.currency = APP_CONFIG.defaults.currency;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[CostCalculator] Cost Calculator initialized');
    }
  }
  
  /**
   * Set cost per person
   * @param {number} cost - Cost per person per hour
   */
  setCostPerPerson(cost) {
    if (!validateCost(cost)) {
      console.warn('[CostCalculator] Invalid cost:', cost);
      return;
    }
    
    this.costPerPerson = cost;
  }
  
  /**
   * Set people count
   * @param {number} count - Number of people
   */
  setPeopleCount(count) {
    if (!validatePeopleCount(count)) {
      console.warn('[CostCalculator] Invalid people count:', count);
      return;
    }
    
    this.peopleCount = count;
  }
  
  /**
   * Set currency
   * @param {string} currency - Currency code
   */
  setCurrency(currency) {
    if (!validateCurrency(currency)) {
      console.warn('[CostCalculator] Invalid currency:', currency);
      return;
    }
    
    this.currency = currency;
  }
  
  /**
   * Calculate total cost for elapsed time
   * @param {number} elapsedSeconds - Elapsed time in seconds
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
   * Calculate cost per second
   * @returns {number} Cost per second
   */
  getCostPerSecond() {
    return (this.costPerPerson * this.peopleCount) / 3600;
  }
  
  /**
   * Calculate cost per minute
   * @returns {number} Cost per minute
   */
  getCostPerMinute() {
    return (this.costPerPerson * this.peopleCount) / 60;
  }
  
  /**
   * Calculate cost per hour
   * @returns {number} Cost per hour
   */
  getCostPerHour() {
    return this.costPerPerson * this.peopleCount;
  }
  
  /**
   * Get formatted total cost
   * @param {number} elapsedSeconds - Elapsed time in seconds
   * @returns {string} Formatted cost
   */
  getFormattedCost(elapsedSeconds) {
    const totalCost = this.calculateTotalCost(elapsedSeconds);
    return formatCost(totalCost, this.currency);
  }
  
  /**
   * Get cost breakdown
   * @param {number} elapsedSeconds - Elapsed time in seconds
   * @returns {Object} Cost breakdown
   */
  getCostBreakdown(elapsedSeconds) {
    const totalCost = this.calculateTotalCost(elapsedSeconds);
    const costPerPerson = totalCost / this.peopleCount;
    
    return {
      total: totalCost,
      perPerson: roundTo(costPerPerson, 2),
      perSecond: roundTo(this.getCostPerSecond(), 4),
      perMinute: roundTo(this.getCostPerMinute(), 2),
      perHour: roundTo(this.getCostPerHour(), 2),
      currency: this.currency,
      people: this.peopleCount,
    };
  }
  
  /**
   * Get current state
   * @returns {Object} Calculator state
   */
  getState() {
    return {
      costPerPerson: this.costPerPerson,
      peopleCount: this.peopleCount,
      currency: this.currency,
    };
  }
  
  /**
   * Load state
   * @param {Object} state - Calculator state
   */
  loadState(state) {
    if (!state) return;
    
    if (state.costPerPerson !== undefined) {
      this.setCostPerPerson(state.costPerPerson);
    }
    
    if (state.peopleCount !== undefined) {
      this.setPeopleCount(state.peopleCount);
    }
    
    if (state.currency !== undefined) {
      this.setCurrency(state.currency);
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[CostCalculator] State loaded:', this.getState());
    }
  }
}

/**
 * ==================== SEGMENT MANAGER ====================
 */

/**
 * Segment Manager Class (for tracking people count changes)
 */
class SegmentManager {
  constructor() {
    this.segments = [];
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[SegmentManager] Segment Manager initialized');
    }
  }
  
  /**
   * Add a new segment
   * @param {number} people - Number of people
   * @param {number} startTime - Start time in seconds
   */
  addSegment(people, startTime) {
    if (!validatePeopleCount(people)) {
      console.warn('[SegmentManager] Invalid people count:', people);
      return;
    }
    
    if (!isValidNumber(startTime) || startTime < 0) {
      console.warn('[SegmentManager] Invalid start time:', startTime);
      return;
    }
    
    this.segments.push({
      people: people,
      startTime: startTime,
      timestamp: Date.now(),
    });
    
    // Limit segments
    if (this.segments.length > APP_CONFIG.limits.maxHistoryEntries) {
      this.segments.shift();
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[SegmentManager] Segment added:', { people, startTime });
    }
  }
  
  /**
   * Get all segments
   * @returns {Array} Segments array
   */
  getSegments() {
    return [...this.segments];
  }
  
  /**
   * Get current segment
   * @returns {Object|null} Current segment
   */
  getCurrentSegment() {
    return this.segments.length > 0 ? last(this.segments) : null;
  }
  
  /**
   * Clear all segments
   */
  clear() {
    this.segments = [];
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[SegmentManager] Segments cleared');
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
   * Get formatted segments for display
   * @param {string} language - Language code
   * @returns {Array<string>} Formatted segments
   */
  getFormattedSegments(language = 'de') {
    return this.segments.map((segment, index) => {
      return formatHistoryEntry(segment, index, language);
    });
  }
  
  /**
   * Load segments
   * @param {Array} segments - Segments array
   */
  loadSegments(segments) {
    if (!Array.isArray(segments)) {
      console.warn('[SegmentManager] Invalid segments:', segments);
      return;
    }
    
    this.segments = segments.filter(segment => {
      return segment.people !== undefined && 
             segment.startTime !== undefined &&
             validatePeopleCount(segment.people);
    });
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[SegmentManager] Segments loaded:', this.segments.length);
    }
  }
  
  /**
   * Export segments
   * @returns {Array} Segments array
   */
  export() {
    return this.getSegments();
  }
}

/**
 * ==================== INITIALIZATION ====================
 */

// Log timer module loaded (only in debug mode)
if (DEBUG_CONFIG?.enabled) {
  console.log('[Timer] Timer module loaded');
}

/**
 * ==================== EXPORTS ====================
 */

// Export classes for use in other modules
if (typeof window !== 'undefined') {
  window.TimerManager = TimerManager;
  window.CostCalculator = CostCalculator;
  window.SegmentManager = SegmentManager;
}
