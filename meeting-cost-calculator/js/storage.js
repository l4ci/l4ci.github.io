/* ==================== STORAGE MANAGEMENT ==================== */

/**
 * Save state to localStorage
 */
function saveToLocalStorage(state) {
  if (state.loadedFromURL && state.elapsedTime < 10) {
    return;
  }
  
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available');
    return;
  }
  
  try {
    const data = {
      version: STORAGE_VERSION,
      elapsedTime: state.elapsedTime,
      isRunning: state.isRunning,
      startTimestamp: state.startTimestamp,
      segments: state.segments,
      currentSegmentIndex: state.currentSegmentIndex,
      costPerPerson: state.costPerPerson,
      currency: state.currency,
      shownTimeNotifications: Array.from(state.shownTimeNotifications),
      shownCostNotifications: Array.from(state.shownCostNotifications),
      lastSaveTime: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('[Storage] Session saved:', {
      elapsedTime: state.elapsedTime,
      isRunning: state.isRunning,
      people: state.segments[state.currentSegmentIndex].numberOfPeople
    });
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old data');
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

/**
 * Load state from localStorage
 */
function loadFromLocalStorage() {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    const data = JSON.parse(saved);
    
    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, skipping load');
      return null;
    }
    
    const state = {
      elapsedTime: clampNumber(data.elapsedTime || 0, 0, VALIDATION.MAX_ELAPSED_TIME),
      segments: [],
      currentSegmentIndex: 0,
      costPerPerson: clampNumber(data.costPerPerson || 65, VALIDATION.MIN_COST, VALIDATION.MAX_COST),
      currency: CURRENCY_CONFIG[data.currency] ? data.currency : 'EUR',
      shownTimeNotifications: new Set(data.shownTimeNotifications || []),
      shownCostNotifications: new Set(data.shownCostNotifications || []),
      startTimestamp: null,
      isRunning: false
    };
    
    if (Array.isArray(data.segments) && data.segments.length > 0) {
      state.segments = data.segments.map(seg => ({
        startTime: clampNumber(seg.startTime, 0, VALIDATION.MAX_ELAPSED_TIME),
        numberOfPeople: clampNumber(seg.numberOfPeople, VALIDATION.MIN_PEOPLE, VALIDATION.MAX_PEOPLE)
      }));
    } else {
      state.segments = [{ startTime: 0, numberOfPeople: 2 }];
    }
    
    state.currentSegmentIndex = Math.min(
      data.currentSegmentIndex || 0,
      state.segments.length - 1
    );
    
    if (data.isRunning && data.lastSaveTime && data.startTimestamp) {
      const timeSinceLastSave = Math.floor((Date.now() - data.lastSaveTime) / 1000);
      state.elapsedTime = data.elapsedTime + timeSinceLastSave;
      state.elapsedTime = Math.min(state.elapsedTime, VALIDATION.MAX_ELAPSED_TIME);
      state.startTimestamp = Date.now() - (state.elapsedTime * 1000);
      state.isRunning = false;
    } else if (data.startTimestamp) {
      state.startTimestamp = data.startTimestamp;
    }
    
    return state;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Load state from URL parameters
 */
function loadFromURL(params) {
  try {
    const state = {
      language: null,
      elapsedTime: 0,
      startTimestamp: null,
      segments: [{ startTime: 0, numberOfPeople: 2 }],
      currentSegmentIndex: 0,
      costPerPerson: 65,
      currency: 'EUR',
      isRunning: false,
      autoStart: false
    };
    
    let sessionDataLoaded = false;
    
    if (params[URL_PARAMS.LANGUAGE] && isLanguageSupported(params[URL_PARAMS.LANGUAGE])) {
      state.language = params[URL_PARAMS.LANGUAGE];
    }
    
    if (params[URL_PARAMS.START_TIMESTAMP]) {
      sessionDataLoaded = true;
      
      const sharedStartTimestamp = parseInt(params[URL_PARAMS.START_TIMESTAMP]);
      const sharedTimezoneOffset = parseInt(params[URL_PARAMS.TIMEZONE]) || 0;
      const currentTimezoneOffset = new Date().getTimezoneOffset();
      
      if (!isValidTimestamp(sharedStartTimestamp)) {
        console.warn('Invalid timestamp in URL');
        return null;
      }
      
      const timezoneDiff = (currentTimezoneOffset - sharedTimezoneOffset) * 60 * 1000;
      state.startTimestamp = sharedStartTimestamp + timezoneDiff;
      state.elapsedTime = Math.floor((Date.now() - state.startTimestamp) / 1000);
      
      if (state.elapsedTime < 0) {
        console.warn('Negative elapsed time, resetting');
        state.elapsedTime = 0;
        state.startTimestamp = Date.now();
      }
      
      if (state.elapsedTime > VALIDATION.MAX_ELAPSED_TIME) {
        console.warn('Elapsed time exceeds maximum, capping');
        state.elapsedTime = VALIDATION.MAX_ELAPSED_TIME;
      }
    }
    
    if (params[URL_PARAMS.COST_PER_PERSON]) {
      sessionDataLoaded = true;
      state.costPerPerson = clampNumber(
        parseFloat(params[URL_PARAMS.COST_PER_PERSON]),
        VALIDATION.MIN_COST,
        VALIDATION.MAX_COST
      );
    }
    
    if (params[URL_PARAMS.CURRENCY] && CURRENCY_CONFIG[params[URL_PARAMS.CURRENCY]]) {
      sessionDataLoaded = true;
      state.currency = params[URL_PARAMS.CURRENCY];
    }
    
    if (params[URL_PARAMS.RUNNING]) {
      sessionDataLoaded = true;
      state.autoStart = params[URL_PARAMS.RUNNING] === '1' && state.startTimestamp;
    }
    
    if (params[URL_PARAMS.SEGMENTS]) {
      sessionDataLoaded = true;
      
      try {
        const segmentsData = params[URL_PARAMS.SEGMENTS].split(',');
        state.segments = segmentsData.map(seg => {
          const [startTime, numberOfPeople] = seg.split(':');
          return {
            startTime: clampNumber(parseInt(startTime), 0, VALIDATION.MAX_ELAPSED_TIME),
            numberOfPeople: clampNumber(parseInt(numberOfPeople), VALIDATION.MIN_PEOPLE, VALIDATION.MAX_PEOPLE)
          };
        });
        
        if (state.segments.length === 0) {
          state.segments = [{ startTime: 0, numberOfPeople: 2 }];
        }
        
        state.currentSegmentIndex = state.segments.length - 1;
      } catch (e) {
        console.error('Error parsing segments:', e);
        state.segments = [{ startTime: 0, numberOfPeople: 2 }];
        state.currentSegmentIndex = 0;
      }
    } else if (params[URL_PARAMS.PEOPLE]) {
      sessionDataLoaded = true;
      
      const people = clampNumber(
        parseInt(params[URL_PARAMS.PEOPLE]),
        VALIDATION.MIN_PEOPLE,
        VALIDATION.MAX_PEOPLE
      );
      state.segments = [{ startTime: 0, numberOfPeople: people }];
      state.currentSegmentIndex = 0;
    }
    
    return sessionDataLoaded ? state : null;
  } catch (error) {
    console.error('Error loading from URL:', error);
    return null;
  }
}
