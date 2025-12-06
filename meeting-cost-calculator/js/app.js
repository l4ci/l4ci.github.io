/* ==================== MEETING COST CALCULATOR ==================== */

/**
 * Main Alpine.js component for the Meeting Cost Calculator
 * Manages state, timer, notifications, and all user interactions
 */
function meetingCalculator() {
  return {
    /* ==================== STATE ==================== */
    
    // Timer State
    elapsedTime: 0,
    isRunning: false,
    startTimestamp: null,
    timer: null,
    emojiInterval: null,
    
    // Segments (track people changes over time)
    segments: [{ startTime: 0, numberOfPeople: 2 }],
    currentSegmentIndex: 0,
    
    // Configuration
    costPerPerson: 65,
    currency: 'EUR',
    language: 'de',
    theme: 'auto',
    
    // UI State
    settingsOpen: false,
    historyOpen: false,
    infoOpen: false,
    shareOpen: false,
    
    // Notification State
    notification: {
      visible: false,
      message: '',
      class: ''
    },
    
    // Share State
    shareUrl: '',
    copied: false,
    canUseNativeShare: false,
    
    // Tracking
    shownTimeNotifications: new Set(),
    shownCostNotifications: new Set(),
    loadedFromURL: false,
    
    // Debounced Functions (will be initialized in init)
    debouncedSave: null,
    debouncedUpdateCost: null,

    /* ==================== COMPUTED PROPERTIES ==================== */
    
    /**
     * Get language flag emoji
     */
    get languageFlag() {
      return LANGUAGE_FLAGS[this.language] || '🌐';
    },

    /**
     * Get current number of people in meeting
     */
    get currentPeopleCount() {
      return this.segments[this.currentSegmentIndex].numberOfPeople;
    },

    /**
     * Set current number of people (with validation)
     */
    set currentPeopleCount(value) {
      const newValue = clampNumber(value, VALIDATION.MIN_PEOPLE, VALIDATION.MAX_PEOPLE);
      const oldValue = this.segments[this.currentSegmentIndex].numberOfPeople;
      
      if (newValue !== oldValue) {
        const delta = newValue - oldValue;
        this.updatePeopleCount(delta);
      }
    },

    /**
     * Calculate total cost based on segments
     */
    get totalCost() {
      let total = 0;
      
      try {
        for (let i = 0; i < this.segments.length; i++) {
          const segment = this.segments[i];
          
          // Validate segment data
          if (!segment || typeof segment.numberOfPeople !== 'number' || typeof segment.startTime !== 'number') {
            console.warn('Invalid segment data:', segment);
            continue;
          }
          
          let duration;
          
          if (i < this.segments.length - 1) {
            // Not the last segment - use next segment's start time
            const nextSegment = this.segments[i + 1];
            duration = nextSegment.startTime - segment.startTime;
          } else {
            // Last segment - use current elapsed time
            duration = this.elapsedTime - segment.startTime;
          }
          
          // Calculate cost for this segment (duration in seconds, convert to hours)
          const segmentCost = (this.costPerPerson * segment.numberOfPeople * duration) / 3600;
          total += segmentCost;
        }
        
        return Math.max(0, total); // Ensure non-negative
      } catch (error) {
        console.error('Error calculating total cost:', error);
        return 0;
      }
    },

    /**
     * Format total cost with currency
     */
    get formattedTotalCost() {
      return this.formatCurrency(this.totalCost, this.currency);
    },

    /**
     * Format elapsed time (verbose)
     */
    get formattedElapsedTime() {
      return this.formatElapsedTimeVerbose(this.elapsedTime);
    },

    /**
     * Check if dark theme is active
     */
    get isDarkTheme() {
      if (this.theme === 'dark') return true;
      if (this.theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /* ==================== INITIALIZATION ==================== */
    
    /**
     * Initialize the application
     */
    init() {
      try {
        // Check for native share API support
        this.canUseNativeShare = navigator.share !== undefined;

        // Initialize debounced functions
        this.debouncedSave = debounce(() => this.saveToLocalStorage(), DEBOUNCE_DELAYS.SAVE);
        this.debouncedUpdateCost = debounce(() => this.updateCostInternal(), DEBOUNCE_DELAYS.UPDATE_COST);

        // Check URL parameters (highest priority)
        const urlParams = getURLParameters();
        
        if (Object.keys(urlParams).length > 0 && urlParams[URL_PARAMS.LANGUAGE]) {
          this.loadFromURL(urlParams);
          this.loadedFromURL = true;
        } else {
          // Load from localStorage or detect from browser
          this.loadFromBrowserOrStorage();
        }
        
        // Apply theme
        this.applyTheme();
        
        // Update SEO elements
        this.updateHreflangTags();
        this.updateOpenGraphURL();
        this.updateTitle();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update HTML lang attribute
        document.documentElement.lang = this.language;
        
        console.log('Meeting Cost Calculator initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
        this.showNotification(this.t('errorOccurred'), 'error');
      }
    },

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
      // Listen for system theme changes
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeMediaQuery.addEventListener('change', () => {
        if (this.theme === 'auto') {
          this.applyTheme();
        }
      });
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
      
      // Auto-save interval
      setInterval(() => {
        if (this.isRunning && this.debouncedSave) {
          this.debouncedSave();
        }
      }, 5000);
      
      // Save on page unload
      window.addEventListener('beforeunload', () => {
        if (this.isRunning || this.elapsedTime > 0) {
          this.saveToLocalStorage();
        }
      });
      
      // Handle visibility change (tab switching)
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.isRunning) {
          // Recalculate elapsed time when tab becomes visible
          this.updateElapsedTime();
        }
      });
    },

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
      // Don't trigger if modal is open or user is typing in input
      if (this.infoOpen || this.shareOpen || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
      }
      
      // Space: Toggle timer
      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleTimer();
      }
      
      // Ctrl+R: Reset timer
      if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        this.resetTimer();
      }
      
      // Ctrl+I: Open info modal
      if (e.key === 'i' && e.ctrlKey) {
        e.preventDefault();
        this.openInfoModal();
      }
      
      // Ctrl+S: Open share modal
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        this.openShareModal();
      }
      
      // Escape: Close any open modal
      if (e.key === 'Escape') {
        if (this.infoOpen) this.closeInfoModal();
        if (this.shareOpen) this.closeShareModal();
      }
    },

    /* ==================== LOADING & SAVING ==================== */
    
    /**
     * Load settings from browser detection or localStorage
     */
    loadFromBrowserOrStorage() {
      try {
        // Detect browser language
        const detectedLanguage = detectBrowserLanguage();
        const savedLanguage = localStorage.getItem('language');
        
        if (savedLanguage && isLanguageSupported(savedLanguage)) {
          this.language = savedLanguage;
        } else {
          this.language = detectedLanguage;
        }
        
        // Detect currency based on language
        const detectedCurrency = detectCurrencyFromLanguage();
        const savedCurrency = localStorage.getItem('currency');
        
        if (savedCurrency && CURRENCY_CONFIG[savedCurrency]) {
          this.currency = savedCurrency;
        } else {
          this.currency = detectedCurrency;
        }
        
        // Load theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && ['auto', 'light', 'dark'].includes(savedTheme)) {
          this.theme = savedTheme;
        }
        
        // Load session from localStorage
        this.loadFromLocalStorage();
      } catch (error) {
        console.error('Error loading from browser/storage:', error);
      }
    },

    /**
     * Load state from URL parameters
     */
    loadFromURL(params) {
      try {
        let sessionDataLoaded = false;
        
        // Language (highest priority)
        if (params[URL_PARAMS.LANGUAGE] && isLanguageSupported(params[URL_PARAMS.LANGUAGE])) {
          this.language = params[URL_PARAMS.LANGUAGE];
        }
        
        // Start timestamp
        if (params[URL_PARAMS.START_TIMESTAMP]) {
          sessionDataLoaded = true;
          
          const sharedStartTimestamp = parseInt(params[URL_PARAMS.START_TIMESTAMP]);
          const sharedTimezoneOffset = parseInt(params[URL_PARAMS.TIMEZONE]) || 0;
          const currentTimezoneOffset = new Date().getTimezoneOffset();
          
          // Validate timestamp
          if (!isValidTimestamp(sharedStartTimestamp)) {
            console.warn('Invalid timestamp in URL');
            return;
          }
          
          // Calculate timezone difference in milliseconds
          const timezoneDiff = (currentTimezoneOffset - sharedTimezoneOffset) * 60 * 1000;
          
          // Correct timestamp with timezone difference
          this.startTimestamp = sharedStartTimestamp + timezoneDiff;
          
          // Calculate current elapsed time
          this.elapsedTime = Math.floor((Date.now() - this.startTimestamp) / 1000);
          
          // Ensure time is not negative
          if (this.elapsedTime < 0) {
            console.warn('Negative elapsed time, resetting');
            this.elapsedTime = 0;
            this.startTimestamp = Date.now();
          }
          
          // Cap at maximum
          if (this.elapsedTime > VALIDATION.MAX_ELAPSED_TIME) {
            console.warn('Elapsed time exceeds maximum, capping');
            this.elapsedTime = VALIDATION.MAX_ELAPSED_TIME;
          }
        }
        
        // Cost per person
        if (params[URL_PARAMS.COST_PER_PERSON]) {
          sessionDataLoaded = true;
          this.costPerPerson = clampNumber(
            parseFloat(params[URL_PARAMS.COST_PER_PERSON]),
            VALIDATION.MIN_COST,
            VALIDATION.MAX_COST
          );
        }
        
        // Currency
        if (params[URL_PARAMS.CURRENCY] && CURRENCY_CONFIG[params[URL_PARAMS.CURRENCY]]) {
          sessionDataLoaded = true;
          this.currency = params[URL_PARAMS.CURRENCY];
        }
        
        // Running status
        if (params[URL_PARAMS.RUNNING]) {
          sessionDataLoaded = true;
          const wasRunning = params[URL_PARAMS.RUNNING] === '1';
          
          if (wasRunning && this.startTimestamp) {
            // Auto-start timer after short delay
            setTimeout(() => {
              if (!this.isRunning) {
                this.startTimer();
              }
            }, 100);
          }
        }
        
        // Segments
        if (params[URL_PARAMS.SEGMENTS]) {
          sessionDataLoaded = true;
          
          try {
            const segmentsData = params[URL_PARAMS.SEGMENTS].split(',');
            this.segments = segmentsData.map(seg => {
              const [startTime, numberOfPeople] = seg.split(':');
              return {
                startTime: clampNumber(parseInt(startTime), 0, VALIDATION.MAX_ELAPSED_TIME),
                numberOfPeople: clampNumber(parseInt(numberOfPeople), VALIDATION.MIN_PEOPLE, VALIDATION.MAX_PEOPLE)
              };
            });
            
            // Validate segments
            if (this.segments.length === 0) {
              this.segments = [{ startTime: 0, numberOfPeople: 2 }];
            }
            
            this.currentSegmentIndex = this.segments.length - 1;
          } catch (e) {
            console.error('Error parsing segments:', e);
            this.segments = [{ startTime: 0, numberOfPeople: 2 }];
            this.currentSegmentIndex = 0;
          }
        } else if (params[URL_PARAMS.PEOPLE]) {
          sessionDataLoaded = true;
          
          // Simple people count
          const people = clampNumber(
            parseInt(params[URL_PARAMS.PEOPLE]),
            VALIDATION.MIN_PEOPLE,
            VALIDATION.MAX_PEOPLE
          );
          this.segments = [{ startTime: 0, numberOfPeople: people }];
          this.currentSegmentIndex = 0;
        }
        
        // Show notification only if session data was loaded
        if (sessionDataLoaded) {
          setTimeout(() => {
            this.showNotification(this.t('sharedSessionLoaded'), 'info');
          }, 500);
        }
      } catch (error) {
        console.error('Error loading from URL:', error);
        this.showNotification(this.t('errorInvalidData'), 'error');
      }
    },

    /**
     * Save current state to localStorage
     */
    saveToLocalStorage() {
      // Don't save if loaded from URL and very little time has passed
      if (this.loadedFromURL && this.elapsedTime < 10) {
        return;
      }
      
      if (!isLocalStorageAvailable()) {
        console.warn('localStorage not available');
        return;
      }
      
      try {
        const data = {
          version: STORAGE_VERSION,
          elapsedTime: this.elapsedTime,
          isRunning: this.isRunning,
          startTimestamp: this.startTimestamp,
          segments: this.segments,
          currentSegmentIndex: this.currentSegmentIndex,
          costPerPerson: this.costPerPerson,
          currency: this.currency,
          shownTimeNotifications: Array.from(this.shownTimeNotifications),
          shownCostNotifications: Array.from(this.shownCostNotifications),
          lastSaveTime: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        
        // Handle quota exceeded error
        if (error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, clearing old data');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    },

    /**
     * Load state from localStorage
     */
    loadFromLocalStorage() {
      if (!isLocalStorageAvailable()) {
        return;
      }
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        const data = JSON.parse(saved);
        
        // Version check (for future migrations)
        if (data.version !== STORAGE_VERSION) {
          console.warn('Storage version mismatch, skipping load');
          return;
        }
        
        // Validate and load data
        this.elapsedTime = clampNumber(data.elapsedTime || 0, 0, VALIDATION.MAX_ELAPSED_TIME);
        
        // Validate segments
        if (Array.isArray(data.segments) && data.segments.length > 0) {
          this.segments = data.segments.map(seg => ({
            startTime: clampNumber(seg.startTime, 0, VALIDATION.MAX_ELAPSED_TIME),
            numberOfPeople: clampNumber(seg.numberOfPeople, VALIDATION.MIN_PEOPLE, VALIDATION.MAX_PEOPLE)
          }));
        } else {
          this.segments = [{ startTime: 0, numberOfPeople: 2 }];
        }
        
        this.currentSegmentIndex = Math.min(
          data.currentSegmentIndex || 0,
          this.segments.length - 1
        );
        
        this.costPerPerson = clampNumber(
          data.costPerPerson || 65,
          VALIDATION.MIN_COST,
          VALIDATION.MAX_COST
        );
        
        if (CURRENCY_CONFIG[data.currency]) {
          this.currency = data.currency;
        }
        
        // Restore notification tracking
        if (Array.isArray(data.shownTimeNotifications)) {
          this.shownTimeNotifications = new Set(data.shownTimeNotifications);
        }
        if (Array.isArray(data.shownCostNotifications)) {
          this.shownCostNotifications = new Set(data.shownCostNotifications);
        }
        
        // Handle running timer
        if (data.isRunning && data.lastSaveTime) {
          const timeSinceLastSave = Math.floor((Date.now() - data.lastSaveTime) / 1000);
          this.elapsedTime += timeSinceLastSave;
          
          // Cap at maximum
          this.elapsedTime = Math.min(this.elapsedTime, VALIDATION.MAX_ELAPSED_TIME);
          
          this.showNotification(this.t('sessionRestored'), 'info');
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        this.showNotification(this.t('errorLoadingSession'), 'error');
      }
    },

        /* ==================== TRANSLATION & LOCALIZATION ==================== */
    
    /**
     * Get translation for a key
     */
    t(key) {
      return getTranslation(key, this.language);
    },

    /**
     * Set language and update UI
     */
    setLanguage(lang) {
      if (!isLanguageSupported(lang)) {
        console.warn(`Language "${lang}" not supported`);
        return;
      }
      
      this.language = lang;
      localStorage.setItem('language', this.language);
      document.documentElement.lang = this.language;
      
      this.updateHreflangTags();
      this.updateTitle();
      
      // Update URL parameter without reload
      const url = new URL(window.location);
      url.searchParams.set(URL_PARAMS.LANGUAGE, lang);
      window.history.replaceState({}, '', url);
    },

    /**
     * Update hreflang tags for SEO
     */
    updateHreflangTags() {
      try {
        const baseURL = window.location.origin + window.location.pathname;
        
        // Remove existing hreflang tags
        document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());
        
        // Add new hreflang tags
        SUPPORTED_LANGUAGES.forEach(lang => {
          const link = document.createElement('link');
          link.rel = 'alternate';
          link.hreflang = lang;
          link.href = `${baseURL}?${URL_PARAMS.LANGUAGE}=${lang}`;
          document.head.appendChild(link);
        });
        
        // Add x-default
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        defaultLink.href = baseURL;
        document.head.appendChild(defaultLink);
      } catch (error) {
        console.error('Error updating hreflang tags:', error);
      }
    },

    /**
     * Update Open Graph URL meta tag
     */
    updateOpenGraphURL() {
      try {
        const ogUrl = document.getElementById('og-url');
        if (ogUrl) {
          ogUrl.content = window.location.href;
        }
      } catch (error) {
        console.error('Error updating OG URL:', error);
      }
    },

    /* ==================== THEME MANAGEMENT ==================== */
    
    /**
     * Toggle between theme modes
     */
    toggleTheme() {
      const themes = ['auto', 'light', 'dark'];
      const currentIndex = themes.indexOf(this.theme);
      this.theme = themes[(currentIndex + 1) % themes.length];
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
    },

    /**
     * Apply current theme to DOM
     */
    applyTheme() {
      try {
        const effectiveTheme = this.isDarkTheme ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', effectiveTheme);
      } catch (error) {
        console.error('Error applying theme:', error);
      }
    },

    /* ==================== MODAL MANAGEMENT ==================== */
    
    /**
     * Open info modal
     */
    openInfoModal() {
      this.infoOpen = true;
      document.body.style.overflow = 'hidden';
    },

    /**
     * Close info modal
     */
    closeInfoModal() {
      this.infoOpen = false;
      document.body.style.overflow = '';
    },

    /**
     * Open share modal
     */
    openShareModal() {
      try {
        this.shareUrl = buildShareURL({
          language: this.language,
          elapsedTime: this.elapsedTime,
          startTimestamp: this.startTimestamp,
          segments: this.segments,
          currentSegmentIndex: this.currentSegmentIndex,
          costPerPerson: this.costPerPerson,
          currency: this.currency,
          isRunning: this.isRunning
        });
        
        this.shareOpen = true;
        this.copied = false;
        document.body.style.overflow = 'hidden';
      } catch (error) {
        console.error('Error opening share modal:', error);
        this.showNotification(this.t('errorOccurred'), 'error');
      }
    },

    /**
     * Close share modal
     */
    closeShareModal() {
      this.shareOpen = false;
      document.body.style.overflow = '';
    },

    /**
     * Copy share URL to clipboard
     */
    async copyShareUrl() {
      try {
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(this.shareUrl);
          this.copied = true;
          this.showNotification(this.t('linkCopied'), 'info');
        } else {
          // Fallback for older browsers
          this.fallbackCopyToClipboard(this.shareUrl);
        }
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
        this.fallbackCopyToClipboard(this.shareUrl);
      }
    },

    /**
     * Fallback method to copy text to clipboard
     */
    fallbackCopyToClipboard(text) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
          this.copied = true;
          this.showNotification(this.t('linkCopied'), 'info');
          
          setTimeout(() => {
            this.copied = false;
          }, 2000);
        } else {
          throw new Error('Copy command failed');
        }
      } catch (error) {
        console.error('Fallback copy failed:', error);
        this.showNotification(this.t('errorOccurred'), 'error');
      }
    },

    /**
     * Share via email
     */
    shareViaEmail() {
      try {
        const subject = encodeURIComponent(this.t('shareEmailSubject'));
        const body = encodeURIComponent(
          `${this.t('shareEmailBody')}\n\n${this.shareUrl}\n\n` +
          `${this.t('elapsedTime')}: ${this.formattedElapsedTime}\n` +
          `${this.t('totalCostLabel')} ${this.formattedTotalCost}`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      } catch (error) {
        console.error('Error sharing via email:', error);
      }
    },

    /**
     * Share via WhatsApp
     */
    shareViaWhatsApp() {
      try {
        const text = encodeURIComponent(
          `${this.t('shareWhatsAppText')}\n${this.shareUrl}\n\n` +
          `⏱️ ${this.formattedElapsedTime}\n💰 ${this.formattedTotalCost}`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
      } catch (error) {
        console.error('Error sharing via WhatsApp:', error);
      }
    },

    /**
     * Share via Slack
     */
    shareViaSlack() {
      try {
        const text = encodeURIComponent(
          `${this.t('shareSlackText')}\n${this.shareUrl}\n\n` +
          `⏱️ ${this.formattedElapsedTime}\n💰 ${this.formattedTotalCost}`
        );
        window.open(`https://slack.com/intl/en-de/help/articles/201330256-Add-links-to-your-messages?text=${text}`, '_blank');
      } catch (error) {
        console.error('Error sharing via Slack:', error);
      }
    },

    /**
     * Share via native share API
     */
    async shareViaNative() {
      if (!navigator.share) {
        console.warn('Native share not supported');
        return;
      }
      
      try {
        await navigator.share({
          title: this.t('title'),
          text: `${this.t('shareWhatsAppText')}\n⏱️ ${this.formattedElapsedTime}\n💰 ${this.formattedTotalCost}`,
          url: this.shareUrl
        });
      } catch (error) {
        // User cancelled share or error occurred
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    },

    /* ==================== TIMER MANAGEMENT ==================== */
    
    /**
     * Toggle timer (start/pause)
     */
    toggleTimer() {
      if (this.isRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    },

    /**
     * Start the timer
     */
    startTimer() {
      try {
        this.isRunning = true;
        
        // Initialize start timestamp if not set
        if (!this.startTimestamp) {
          this.startTimestamp = Date.now() - (this.elapsedTime * 1000);
        }
        
        // Update elapsed time immediately
        this.updateElapsedTime();
        
        // Start timer interval
        this.timer = setInterval(() => {
          this.updateElapsedTime();
          this.updateTitle();
          this.checkFunNotifications();
          
          if (this.debouncedSave) {
            this.debouncedSave();
          }
        }, 1000);
        
        // Start emoji animation
        this.emojiInterval = setInterval(() => this.createFallingEmoji(), EMOJI_SPAWN_RATE);
        
        this.updateTitle();
        this.saveToLocalStorage();
      } catch (error) {
        console.error('Error starting timer:', error);
        this.showNotification(this.t('errorOccurred'), 'error');
      }
    },

    /**
     * Pause the timer
     */
    pauseTimer() {
      try {
        this.isRunning = false;
        
        // Clear intervals
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        
        if (this.emojiInterval) {
          clearInterval(this.emojiInterval);
          this.emojiInterval = null;
        }
        
        this.clearEmojis();
        this.updateTitle();
        this.saveToLocalStorage();
      } catch (error) {
        console.error('Error pausing timer:', error);
      }
    },

    /**
     * Reset the timer
     */
    resetTimer() {
      try {
        // Pause if running
        if (this.isRunning) {
          this.pauseTimer();
        }
        
        // Clear intervals
        if (this.timer) clearInterval(this.timer);
        if (this.emojiInterval) clearInterval(this.emojiInterval);
        this.clearEmojis();
        
        // Reset state
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTimestamp = null;
        
        // Reset notification tracking
        this.shownTimeNotifications.clear();
        this.shownCostNotifications.clear();
        
        // Reset segments (keep current people count)
        const currentPeople = this.segments[this.currentSegmentIndex].numberOfPeople;
        this.segments = [{ startTime: 0, numberOfPeople: currentPeople }];
        this.currentSegmentIndex = 0;
        
        this.updateTitle();
        
        // Clear localStorage
        if (isLocalStorageAvailable()) {
          localStorage.removeItem(STORAGE_KEY);
        }
        
        // Clear URL parameters
        const url = new URL(window.location);
        url.search = '';
        window.history.replaceState({}, '', url);
      } catch (error) {
        console.error('Error resetting timer:', error);
        this.showNotification(this.t('errorOccurred'), 'error');
      }
    },

    /**
     * Update elapsed time based on timestamp
     */
    updateElapsedTime() {
      if (!this.startTimestamp) return;
      
      const now = Date.now();
      this.elapsedTime = Math.floor((now - this.startTimestamp) / 1000);
      
      // Cap at maximum
      if (this.elapsedTime > VALIDATION.MAX_ELAPSED_TIME) {
        this.elapsedTime = VALIDATION.MAX_ELAPSED_TIME;
        this.pauseTimer();
        this.showNotification('⏰ Maximum meeting time reached!', 'info');
      }
    },

    /**
     * Update page title with current stats
     */
    updateTitle() {
      try {
        const status = this.isRunning ? '▶️' : '⏸️';
        const time = this.formatElapsedTime(this.elapsedTime);
        const cost = this.formattedTotalCost;
        const title = this.t('title');
        
        document.title = `${status} ${time} | ${cost} - ${title}`;
      } catch (error) {
        console.error('Error updating title:', error);
      }
    },

    /* ==================== PEOPLE MANAGEMENT ==================== */
    
    /**
     * Update people count (add or remove participants)
     */
    updatePeopleCount(delta) {
      try {
        const currentSegment = this.segments[this.currentSegmentIndex];
        const newValue = clampNumber(
          currentSegment.numberOfPeople + delta,
          VALIDATION.MIN_PEOPLE,
          VALIDATION.MAX_PEOPLE
        );
        
        // No change needed
        if (newValue === currentSegment.numberOfPeople) return;

        if (this.isRunning) {
          // Create new segment when timer is running
          this.segments.push({
            startTime: this.elapsedTime,
            numberOfPeople: newValue
          });
          this.currentSegmentIndex = this.segments.length - 1;
          
          // Show notification
          const absValue = Math.abs(delta);
          let message;
          let type;
          
          if (delta > 0) {
            message = `✅ ${absValue} ${absValue === 1 ? this.t('personJoined') : this.t('personsJoined')}`;
            type = 'join';
          } else {
            message = `👋 ${absValue} ${absValue === 1 ? this.t('personLeft') : this.t('personsLeft')}`;
            type = 'leave';
          }
          
          this.showNotification(message, type);
        } else {
          // Update current segment when timer is paused
          currentSegment.numberOfPeople = newValue;
        }
        
        this.saveToLocalStorage();
      } catch (error) {
        console.error('Error updating people count:', error);
        this.showNotification(this.t('errorOccurred'), 'error');
      }
    },

    /**
     * Handle manual input change for people count
     */
    onPeopleInputChange() {
      if (this.debouncedSave) {
        this.debouncedSave();
      }
    },

    /* ==================== COST MANAGEMENT ==================== */
    
    /**
     * Update cost (debounced)
     */
    updateCost() {
      if (this.debouncedUpdateCost) {
        this.debouncedUpdateCost();
      }
    },

    /**
     * Internal cost update method
     */
    updateCostInternal() {
      try {
        // Validate cost
        this.costPerPerson = clampNumber(
          this.costPerPerson,
          VALIDATION.MIN_COST,
          VALIDATION.MAX_COST
        );
        
        this.updateTitle();
        this.saveToLocalStorage();
        localStorage.setItem('currency', this.currency);
      } catch (error) {
        console.error('Error updating cost:', error);
      }
    },

        /* ==================== NOTIFICATIONS ==================== */
    
    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
      try {
        const bgColors = {
          join: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          leave: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        
        this.notification = {
          visible: true,
          message: message,
          class: bgColors[type] || bgColors.info
        };
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          this.notification.visible = false;
        }, 3000);
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    },

    /**
     * Check and show fun notifications based on time and cost
     */
    checkFunNotifications() {
      try {
        // Check time-based notifications
        FUN_NOTIFICATIONS.time.forEach(notification => {
          if (this.elapsedTime >= notification.seconds && 
              !this.shownTimeNotifications.has(notification.seconds)) {
            this.shownTimeNotifications.add(notification.seconds);
            const message = notification.message[this.language] || notification.message['en'];
            this.showNotification(message, 'info');
          }
        });

        // Check cost-based notifications
        FUN_NOTIFICATIONS.cost.forEach(notification => {
          if (this.totalCost >= notification.amount && 
              !this.shownCostNotifications.has(notification.amount)) {
            this.shownCostNotifications.add(notification.amount);
            const message = notification.message[this.language] || notification.message['en'];
            this.showNotification(message, 'info');
          }
        });
      } catch (error) {
        console.error('Error checking fun notifications:', error);
      }
    },

    /* ==================== FORMATTING ==================== */
    
    /**
     * Format elapsed time (compact format for title)
     */
    formatElapsedTime(seconds) {
      try {
        if (seconds >= 3600) {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const secs = seconds % 60;
          return `${hours}h ${minutes}m ${secs}s`;
        } else if (seconds >= 60) {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
      } catch (error) {
        console.error('Error formatting elapsed time:', error);
        return '0s';
      }
    },

    /**
     * Format elapsed time (verbose format for display)
     */
    formatElapsedTimeVerbose(seconds) {
      try {
        if (seconds >= 3600) {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const hourText = hours === 1 ? this.t('hour') : this.t('hours');
          const minuteText = minutes === 1 ? this.t('minute') : this.t('minutes');
          return `${hours} ${hourText} ${minutes} ${minuteText}`;
        } else if (seconds >= 60) {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          const minuteText = minutes === 1 ? this.t('minute') : this.t('minutes');
          const secondText = remainingSeconds === 1 ? this.t('second') : this.t('seconds');
          return `${minutes} ${minuteText} ${remainingSeconds} ${secondText}`;
        }
        const secondText = seconds === 1 ? this.t('second') : this.t('seconds');
        return `${seconds} ${secondText}`;
      } catch (error) {
        console.error('Error formatting verbose time:', error);
        return '0 ' + this.t('seconds');
      }
    },

    /**
     * Format currency amount
     */
    formatCurrency(amount, currencyCode) {
      try {
        const config = CURRENCY_CONFIG[currencyCode];
        if (!config) {
          console.warn(`Currency config not found for: ${currencyCode}`);
          return `${amount.toFixed(2)} ${currencyCode}`;
        }
        
        // Round to specified decimals
        const rounded = amount.toFixed(config.decimals);
        const [integer, decimal] = rounded.split('.');
        
        // Add thousands separator
        const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSep);
        
        // Build final amount string
        let formattedAmount = formattedInteger;
        if (config.decimals > 0 && decimal) {
          formattedAmount += config.separator + decimal;
        }
        
        // Add currency symbol
        return config.position === 'prefix' 
          ? `${config.symbol} ${formattedAmount}`
          : `${formattedAmount} ${config.symbol}`;
      } catch (error) {
        console.error('Error formatting currency:', error);
        return `${amount.toFixed(2)} ${currencyCode}`;
      }
    },

    /**
     * Format history entry for display
     */
    formatHistoryEntry(segment, index) {
      try {
        const personText = segment.numberOfPeople === 1 ? this.t('person') : this.t('persons');
        
        if (index === 0) {
          return `${this.t('start_history')} ${segment.numberOfPeople} ${personText}`;
        }
        
        const timeFormatted = this.formatElapsedTimeVerbose(segment.startTime);
        return `${timeFormatted}: ${segment.numberOfPeople} ${personText}`;
      } catch (error) {
        console.error('Error formatting history entry:', error);
        return `${segment.numberOfPeople} ${this.t('persons')}`;
      }
    },

    /* ==================== EMOJI ANIMATIONS ==================== */
    
    /**
     * Create falling emoji animation
     */
    createFallingEmoji() {
      try {
        const container = document.getElementById('emojiContainer');
        if (!container) return;
        
        // Limit number of emojis on screen
        if (container.children.length >= MAX_EMOJIS) {
          return;
        }

        const currentSegment = this.segments[this.currentSegmentIndex];
        const count = Math.min(currentSegment.numberOfPeople, 5);
        
        for (let i = 0; i < count; i++) {
          const emoji = document.createElement('div');
          emoji.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
          emoji.className = 'emoji';
          
          // Random horizontal position
          emoji.style.left = `${Math.random() * 100}vw`;
          
          // Random animation duration (3-5 seconds)
          const duration = Math.random() * 2 + 3;
          emoji.style.animationDuration = `${duration}s`;
          
          // Random horizontal sway
          emoji.style.setProperty('--random-x', Math.random() - 0.5);
          
          // Remove emoji after animation ends
          emoji.addEventListener('animationend', () => {
            if (emoji.parentNode) {
              emoji.remove();
            }
          }, { once: true });
          
          container.appendChild(emoji);
        }
      } catch (error) {
        console.error('Error creating falling emoji:', error);
      }
    },

    /**
     * Clear all emojis from screen
     */
    clearEmojis() {
      try {
        const container = document.getElementById('emojiContainer');
        if (container) {
          container.innerHTML = '';
        }
      } catch (error) {
        console.error('Error clearing emojis:', error);
      }
    }
  }
}

/* ==================== INITIALIZATION ==================== */

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Meeting Cost Calculator - DOM ready');
});

/**
 * Log errors to console
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

/**
 * Log unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});