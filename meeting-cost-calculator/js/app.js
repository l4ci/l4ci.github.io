/**
 * ==================== MEETING COST CALCULATOR ====================
 * Main application logic using Alpine.js
 * 
 * @file app.js
 * @version 2.0.0
 */

/**
 * Main Alpine.js Component
 */
function meetingCalculator() {
  return {
    // ==================== STATE ====================
    
    // Timer state
    elapsedTime: 0,
    isRunning: false,
    formattedElapsedTime: '0:00',
    
    // Cost state
    totalCost: 0,
    formattedTotalCost: '0,00 €',
    costPerPerson: APP_CONFIG.defaults.costPerPerson,
    currency: APP_CONFIG.defaults.currency,
    
    // People state
    currentPeopleCount: APP_CONFIG.defaults.people,
    segments: [],
    
    // UI state
    settingsOpen: false,
    historyOpen: false,
    infoOpen: false,
    shareOpen: false,
    shortcutsOpen: false,
    
    // Settings
    language: APP_CONFIG.defaults.language,
    theme: APP_CONFIG.defaults.theme,
    
    // Share state
    shareUrl: '',
    copied: false,
    canUseNativeShare: false,
    
    // Managers
    timerManager: null,
    costCalculator: null,
    segmentManager: null,
    
    // Auto-save
    autoSaveInterval: null,
    
    // ==================== INITIALIZATION ====================
    
    /**
     * Initialize application
     */
    init() {
      console.log('[App] Initializing Meeting Cost Calculator v' + APP_CONFIG.version);
      
      // Initialize managers
      this.initializeManagers();
      
      // Load saved data
      this.loadSavedData();
      
      // Check URL parameters
      this.checkUrlParams();
      
      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Setup auto-save
      this.setupAutoSave();
      
      // Check native share support
      this.canUseNativeShare = isSupported('share');
      
      // Setup timer callbacks
      this.setupTimerCallbacks();
      
      // Apply theme
      this.applyTheme();
      
      // Initial update
      this.updateDisplay();
      
      console.log('[App] Initialization complete');
    },
    
    /**
     * Initialize manager instances
     */
    initializeManagers() {
      this.timerManager = new TimerManager();
      this.costCalculator = new CostCalculator();
      this.segmentManager = new SegmentManager();
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Managers initialized');
      }
    },
    
    /**
     * Setup timer callbacks
     */
    setupTimerCallbacks() {
      // On tick - update display
      this.timerManager.on('onTick', (data) => {
        this.elapsedTime = data.elapsedTime;
        this.updateDisplay();
      });
      
      // On start
      this.timerManager.on('onStart', () => {
        this.isRunning = true;
        showTimerNotification('started', this.language);
        if (feedbackManager) {
          feedbackManager.haptic('light');
        }
      });
      
      // On pause
      this.timerManager.on('onPause', () => {
        this.isRunning = false;
        showTimerNotification('paused', this.language);
        if (feedbackManager) {
          feedbackManager.haptic('light');
        }
      });
      
      // On reset
      this.timerManager.on('onReset', () => {
        this.elapsedTime = 0;
        this.segments = [];
        this.segmentManager.clear();
        this.updateDisplay();
        showTimerNotification('reset', this.language);
        if (feedbackManager) {
          feedbackManager.haptic('medium');
        }
        if (emojiManager) {
          emojiManager.clear();
        }
      });
      
      // On milestone
      this.timerManager.on('onMilestone', (data) => {
        this.handleMilestone(data);
      });
    },
    
    /**
     * Handle milestone events
     */
    handleMilestone(data) {
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Milestone:', data);
      }
      
      // Show emojis
      if (emojiManager && APP_CONFIG.features.enableEmojis) {
        emojiManager.milestone(data.type, data.value);
      }
      
      // Play sound
      if (feedbackManager) {
        feedbackManager.playSound('milestone');
        feedbackManager.vibrate([100, 50, 100]);
      }
    },
    
    /**
     * Load saved data from storage
     */
    loadSavedData() {
      // Load settings
      const settings = loadSettings();
      this.costPerPerson = settings.costPerPerson;
      this.currency = settings.currency;
      this.language = settings.language;
      this.theme = settings.theme;
      
      // Load session
      const session = loadSession();
      if (session) {
        this.elapsedTime = session.elapsedTime || 0;
        this.currentPeopleCount = session.currentPeopleCount || APP_CONFIG.defaults.people;
        this.segments = session.segments || [];
        
        // Load into managers
        this.timerManager.setElapsedTime(this.elapsedTime);
        this.segmentManager.loadSegments(this.segments);
      }
      
      // Update calculators
      this.costCalculator.setCostPerPerson(this.costPerPerson);
      this.costCalculator.setCurrency(this.currency);
      this.costCalculator.setPeopleCount(this.currentPeopleCount);
      
      // Add initial segment if none exists
      if (this.segments.length === 0) {
        this.segmentManager.addSegment(this.currentPeopleCount, 0);
        this.segments = this.segmentManager.getSegments();
      }
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Data loaded from storage');
      }
    },
    
    /**
     * Check and apply URL parameters
     */
    checkUrlParams() {
      const params = getAllUrlParams();
      const urlConfig = APP_CONFIG.urlParams;
      
      // People count
      if (params[urlConfig.people]) {
        const people = parseInt(params[urlConfig.people]);
        if (validatePeopleCount(people)) {
          this.currentPeopleCount = people;
          this.costCalculator.setPeopleCount(people);
        }
      }
      
      // Cost per person
      if (params[urlConfig.cost]) {
        const cost = parseFloat(params[urlConfig.cost]);
        if (validateCost(cost)) {
          this.costPerPerson = cost;
          this.costCalculator.setCostPerPerson(cost);
        }
      }
      
      // Currency
      if (params[urlConfig.currency]) {
        const currency = params[urlConfig.currency].toUpperCase();
        if (validateCurrency(currency)) {
          this.currency = currency;
          this.costCalculator.setCurrency(currency);
        }
      }
      
      // Language
      if (params[urlConfig.language]) {
        const lang = params[urlConfig.language].toLowerCase();
        if (validateLanguage(lang)) {
          this.language = lang;
        }
      }
      
      // Elapsed time
      if (params[urlConfig.elapsed]) {
        const elapsed = parseInt(params[urlConfig.elapsed]);
        if (elapsed > 0) {
          this.elapsedTime = elapsed;
          this.timerManager.setElapsedTime(elapsed);
        }
      }
      
      if (DEBUG_CONFIG?.enabled && Object.keys(params).length > 0) {
        console.log('[App] URL parameters applied:', params);
      }
    },
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
      if (!APP_CONFIG.features.enableKeyboardShortcuts) return;
      
      document.addEventListener('keydown', (event) => {
        // Ignore if typing in input
        if (event.target.matches('input, textarea, select')) {
          return;
        }
        
        // Ctrl/Cmd + Space or Enter - Toggle timer
        if ((event.key === 'Enter' || event.key === ' ') || 
            (event.ctrlKey && event.key === ' ')) {
          event.preventDefault();
          this.toggleTimer();
        }
        
        // Ctrl/Cmd + R - Reset
        if (event.ctrlKey && event.key === 'r') {
          event.preventDefault();
          this.resetTimer();
        }
        
        // Ctrl/Cmd + I - Info
        if (event.ctrlKey && event.key === 'i') {
          event.preventDefault();
          this.openInfoModal();
        }
        
        // Ctrl/Cmd + S - Share
        if (event.ctrlKey && event.key === 's') {
          event.preventDefault();
          this.openShareModal();
        }
        
        // Ctrl/Cmd + ? - Shortcuts
        if (event.ctrlKey && (event.key === '?' || event.key === '/')) {
          event.preventDefault();
          this.openShortcutsModal();
        }
        
        // + - Increase people
        if (event.key === '+' || event.key === '=') {
          event.preventDefault();
          this.updatePeopleCount(1);
        }
        
        // - - Decrease people
        if (event.key === '-' || event.key === '_') {
          event.preventDefault();
          this.updatePeopleCount(-1);
        }
      });
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Keyboard shortcuts enabled');
      }
    },
    
    /**
     * Setup auto-save
     */
    setupAutoSave() {
      if (!APP_CONFIG.features.enableAutoSave) return;
      
      this.autoSaveInterval = setInterval(() => {
        this.saveSession();
      }, APP_CONFIG.performance.autoSaveInterval);
      
      // Save on page unload
      window.addEventListener('beforeunload', () => {
        this.saveSession();
      });
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Auto-save enabled');
      }
    },
    
    // ==================== TIMER CONTROLS ====================
    
    /**
     * Start timer
     */
    startTimer() {
      this.timerManager.start();
    },
    
    /**
     * Pause timer
     */
    pauseTimer() {
      this.timerManager.pause();
    },
    
    /**
     * Reset timer
     */
    resetTimer() {
      this.timerManager.reset();
      clearSession();
    },
    
    /**
     * Toggle timer (start/pause)
     */
    toggleTimer() {
      this.timerManager.toggle();
    },
    
    // ==================== PEOPLE MANAGEMENT ====================
    
    /**
     * Update people count
     * @param {number} delta - Change amount (+1 or -1)
     */
    updatePeopleCount(delta) {
      const newCount = this.currentPeopleCount + delta;
      
      if (!validatePeopleCount(newCount)) {
        if (feedbackManager) {
          feedbackManager.haptic('error');
        }
        return;
      }
      
      this.currentPeopleCount = newCount;
      this.costCalculator.setPeopleCount(newCount);
      
      // Add segment
      this.segmentManager.addSegment(newCount, this.elapsedTime);
      this.segments = this.segmentManager.getSegments();
      
      // Update display
      this.updateDisplay();
      
      // Feedback
      if (feedbackManager) {
        feedbackManager.haptic('light');
      }
      
      // Save
      this.saveSession();
    },
    
    /**
     * Handle people input change
     */
    onPeopleInputChange() {
      const count = sanitizePeopleCount(this.currentPeopleCount);
      
      if (count !== this.currentPeopleCount) {
        this.currentPeopleCount = count;
      }
      
      this.costCalculator.setPeopleCount(count);
      
      // Add segment
      this.segmentManager.addSegment(count, this.elapsedTime);
      this.segments = this.segmentManager.getSegments();
      
      this.updateDisplay();
      this.saveSession();
    },
    
    // ==================== COST MANAGEMENT ====================
    
    /**
     * Update cost calculation
     */
    updateCost() {
      this.costCalculator.setCostPerPerson(this.costPerPerson);
      this.costCalculator.setCurrency(this.currency);
      this.updateDisplay();
      this.saveSettings();
    },
    
    // ==================== DISPLAY UPDATE ====================
    
    /**
     * Update all display values
     */
    updateDisplay() {
      // Update time display
      this.formattedElapsedTime = formatElapsedTime(this.elapsedTime);
      
      // Update cost display
      this.totalCost = this.costCalculator.calculateTotalCost(this.elapsedTime);
      this.formattedTotalCost = formatCost(this.totalCost, this.currency);
      
      // Check cost milestones
      if (this.timerManager) {
        this.timerManager.checkCostMilestone(this.totalCost);
      }
    },
    
    // ==================== SETTINGS ====================
    
    /**
     * Save settings to storage
     */
    saveSettings() {
      saveSettings({
        costPerPerson: this.costPerPerson,
        currency: this.currency,
        language: this.language,
        theme: this.theme,
      });
    },
    
    /**
     * Save session to storage
     */
    saveSession() {
      saveSession({
        elapsedTime: this.elapsedTime,
        isRunning: this.isRunning,
        currentPeopleCount: this.currentPeopleCount,
        segments: this.segments,
      });
    },
    
    // ==================== LANGUAGE ====================
    
    /**
     * Get translation
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    t(key) {
      return getTranslation(key, this.language);
    },
    
    /**
     * Set language
     * @param {string} lang - Language code
     */
    setLanguage(lang) {
      if (!validateLanguage(lang)) return;
      
      this.language = lang;
      saveLanguage(lang);
      
      // Update document language
      document.documentElement.lang = lang;
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Language changed to:', lang);
      }
    },
    
    // ==================== THEME ====================
    
    /**
     * Toggle theme
     */
    toggleTheme() {
      const themes = ['auto', 'light', 'dark'];
      const currentIndex = themes.indexOf(this.theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      
      this.theme = themes[nextIndex];
      this.applyTheme();
      saveTheme(this.theme);
      
      if (feedbackManager) {
        feedbackManager.haptic('light');
      }
    },
    
    /**
     * Apply theme to document
     */
    applyTheme() {
      const root = document.documentElement;
      
      if (this.theme === 'auto') {
        // Use system preference
        if (prefersDarkMode()) {
          root.setAttribute('data-theme', 'dark');
        } else {
          root.setAttribute('data-theme', 'light');
        }
      } else {
        root.setAttribute('data-theme', this.theme);
      }
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Theme applied:', this.theme);
      }
    },
    
    // ==================== HISTORY ====================
    
    /**
     * Format history entry
     * @param {Object} segment - History segment
     * @param {number} index - Segment index
     * @returns {string} Formatted entry
     */
    formatHistoryEntry(segment, index) {
      return formatHistoryEntry(segment, index, this.language);
    },
    
    // ==================== MODALS ====================
    
    /**
     * Open info modal
     */
    openInfoModal() {
      this.infoOpen = true;
    },
    
    /**
     * Close info modal
     */
    closeInfoModal() {
      this.infoOpen = false;
    },
    
    /**
     * Open share modal
     */
    openShareModal() {
      this.shareOpen = true;
      this.generateShareUrl();
    },
    
    /**
     * Close share modal
     */
    closeShareModal() {
      this.shareOpen = false;
      this.copied = false;
    },
    
    /**
     * Open shortcuts modal
     */
    openShortcutsModal() {
      this.shortcutsOpen = true;
    },
    
    /**
     * Close shortcuts modal
     */
    closeShortcutsModal() {
      this.shortcutsOpen = false;
    },
    
    // ==================== SHARING ====================
    
    /**
     * Generate share URL
     */
    generateShareUrl() {
      const params = {
        [APP_CONFIG.urlParams.people]: this.currentPeopleCount,
        [APP_CONFIG.urlParams.cost]: this.costPerPerson,
        [APP_CONFIG.urlParams.currency]: this.currency,
        [APP_CONFIG.urlParams.language]: this.language,
        [APP_CONFIG.urlParams.elapsed]: this.elapsedTime,
      };
      
      this.shareUrl = formatShareUrl(params);
    },
    
    /**
     * Copy share URL to clipboard
     */
    async copyShareUrl() {
      const success = await copyToClipboard(this.shareUrl);
      
      if (success) {
        this.copied = true;
        notificationManager.success(this.t('linkCopied'));
        
        if (feedbackManager) {
          feedbackManager.haptic('success');
        }
        
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } else {
        notificationManager.error(this.t('errorOccurred'));
      }
    },
    
    /**
     * Share via email
     */
    shareViaEmail() {
      const data = {
        cost: this.formattedTotalCost,
        time: formatElapsedTime(this.elapsedTime),
        people: this.currentPeopleCount,
        url: this.shareUrl,
      };
      
      const emailData = formatShareText(data, 'email');
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
      
      window.location.href = mailtoUrl;
    },
    
    /**
     * Share via WhatsApp
     */
    shareViaWhatsApp() {
      const data = {
        cost: this.formattedTotalCost,
        time: formatElapsedTime(this.elapsedTime),
        people: this.currentPeopleCount,
        url: this.shareUrl,
      };
      
      const text = formatShareText(data, 'whatsapp');
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      
      window.open(whatsappUrl, '_blank');
    },
    
    /**
     * Share via Slack
     */
    shareViaSlack() {
      const data = {
        cost: this.formattedTotalCost,
        time: formatElapsedTime(this.elapsedTime),
        people: this.currentPeopleCount,
        url: this.shareUrl,
      };
      
      const text = formatShareText(data, 'slack');
      
      // Copy to clipboard for Slack
      copyToClipboard(text).then(success => {
        if (success) {
          notificationManager.info('Text copied! Paste it in Slack.');
        }
      });
    },
    
    /**
     * Share via native share API
     */
    async shareViaNative() {
      if (!this.canUseNativeShare) return;
      
      const data = {
        cost: this.formattedTotalCost,
        time: formatElapsedTime(this.elapsedTime),
        people: this.currentPeopleCount,
        url: this.shareUrl,
      };
      
      try {
        await navigator.share({
          title: this.t('title'),
          text: formatShareText(data, 'default'),
          url: this.shareUrl,
        });
        
        notificationManager.success(this.t('sessionShared'));
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('[App] Share failed:', error);
        }
      }
    },
    
    // ==================== CLEANUP ====================
    
    /**
     * Destroy application
     */
    destroy() {
      // Clear auto-save
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
      }
      
      // Save final state
      this.saveSession();
      
      // Destroy managers
      if (this.timerManager) {
        this.timerManager.destroy();
      }
      
      console.log('[App] Application destroyed');
    },
  };
}

/**
 * ==================== INITIALIZATION ====================
 */

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

/**
 * Initialize application
 */
function initializeApp() {
  console.log('[App] DOM ready, starting application...');
  
  // Check if Alpine.js is loaded
  if (typeof Alpine === 'undefined') {
    console.error('[App] Alpine.js not loaded!');
    return;
  }
  
  // Log application info
  if (DEBUG_CONFIG?.enabled) {
    console.group('[App] Application Info');
    console.log('Version:', APP_CONFIG.version);
    console.log('Features:', APP_CONFIG.features);
    console.log('Browser:', getBrowserName());
    console.log('Mobile:', isMobile());
    console.log('Storage:', getStorageInfo());
    console.groupEnd();
  }
}

/**
 * ==================== SERVICE WORKER ====================
 */

// Register service worker for PWA
if ('serviceWorker' in navigator && APP_CONFIG.features.enablePWA) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        if (DEBUG_CONFIG?.enabled) {
          console.log('[PWA] Service Worker registered:', registration);
        }
      })
      .catch(error => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}

/**
 * ==================== EXPORTS ====================
 */

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.meetingCalculator = meetingCalculator;
}

// Log app module loaded
console.log('[App] Application module loaded');
