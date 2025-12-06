/* ==================== TIMER MANAGEMENT ==================== */

class TimerManager {
  constructor() {
    this.timer = null;
    this.emojiInterval = null;
  }

  start(callbacks) {
    if (this.timer) return;
    
    this.timer = setInterval(() => {
      if (callbacks.onTick) callbacks.onTick();
    }, 1000);
    
    if (callbacks.onEmojiTick) {
      this.emojiInterval = setInterval(() => {
        callbacks.onEmojiTick();
      }, EMOJI_SPAWN_RATE);
    }
  }

  pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    if (this.emojiInterval) {
      clearInterval(this.emojiInterval);
      this.emojiInterval = null;
    }
  }

  reset() {
    this.pause();
  }

  isRunning() {
    return this.timer !== null;
  }
}

/**
 * Calculate total cost based on segments
 */
function calculateTotalCost(segments, elapsedTime, costPerPerson) {
  let total = 0;
  
  try {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      if (!segment || typeof segment.numberOfPeople !== 'number' || typeof segment.startTime !== 'number') {
        console.warn('Invalid segment data:', segment);
        continue;
      }
      
      let duration;
      
      if (i < segments.length - 1) {
        const nextSegment = segments[i + 1];
        duration = nextSegment.startTime - segment.startTime;
      } else {
        duration = elapsedTime - segment.startTime;
      }
      
      const segmentCost = (costPerPerson * segment.numberOfPeople * duration) / 3600;
      total += segmentCost;
    }
    
    return Math.max(0, total);
  } catch (error) {
    console.error('Error calculating total cost:', error);
    return 0;
  }
}

/**
 * Update elapsed time based on timestamp
 */
function updateElapsedTime(startTimestamp) {
  if (!startTimestamp) return 0;
  
  const now = Date.now();
  let elapsedTime = Math.floor((now - startTimestamp) / 1000);
  
  if (elapsedTime > VALIDATION.MAX_ELAPSED_TIME) {
    elapsedTime = VALIDATION.MAX_ELAPSED_TIME;
  }
  
  return elapsedTime;
}
