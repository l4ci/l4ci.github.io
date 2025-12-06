/* ==================== MEETING COST CALCULATOR - MAIN APP ==================== */

/**
 * Main Alpine.js component for the Meeting Cost Calculator
 * Manages state and coordinates between modules
 */
function meetingCalculator() {
  return {
    /* ==================== STATE ==================== */
    
    // Timer State
    elapsedTime: 0,
    isRunning: false,
    startTimestamp: null,
    
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
    shortcutsOpen: false,
    
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
    
    // Managers
    timerManager: null,
    modalManager: null,
    debouncedSave: null,
    debouncedUpdateCost: null,

    /* ==================== COMPUTED PROPERTIES ==================== */
    
    get languageFlag() {
      return LANGUAGE_FLAGS[this.language] || '🌐';
    },

    get currentPeopleCount() {
      return this.segments[this.currentSegmentIndex].numberOfPeople;
    },

    set currentPeopleCount(value) {
      const newValue = clampNumber(value, VALIDATION.MIN_PEOPLE, VALIDATION.MAX_PEOPLE);
      const oldValue = this.segments[this.currentSegmentIndex].numberOfPeople;
      
      if (newValue !== oldValue) {
        const delta = newValue - oldValue;
        this.updatePeopleCount(delta);
      }
    },

    get totalCost() {
      return calculateTotalCost(this.segments, this.elapsedTime, this.costPerPerson);
    },

    get formattedTotalCost() {
      return formatCurrency(this.totalCost, this.currency);
    },

    get formattedElapsedTime() {
      return formatElapsedTimeVerbose(this.elapsedTime, {
        hour: this.t('hour'),
        hours: this.t('hours'),
        minute: this.t('minute'),
        minutes: this.t('minutes'),
        second: this.t('second'),
        seconds: this.t('seconds')
      });
    },

    get isDarkTheme() {
      if (this.theme === 'dark') return true;
      if (this.theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /* ==================== INITIALIZATION ==================== */
    
    init() {
      try {
        // Initialize managers
        this.timerManager = new TimerManager();
        this.modalManager = new ModalManager();
        
        // Check for native share API support
        this.canUseNativeShare = navigator.share !== undefined;

        // Initialize debounced functions
        this.debouncedSave = debounce(() => this.saveState(), DEBOUNCE_DELAYS.SAVE);
        this.debouncedUpdateCost = debounce(() => this.updateCostInternal(), DEBOUNCE_DELAYS.UPDATE_COST);

        // Check URL parameters (highest priority)
        const urlParams = getURLParameters();
        
        if (Object.keys(urlParams).length > 0 && urlParams[URL_PARAMS.LANGUAGE]) {
          this.loadStateFromURL(urlParams);
          this.loadedFromURL = true;
        } else {
          // Load from localStorage or detect from browser
          this.loadStateFromBrowserOrStorage();
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
        this.showNotificationMessage(this.t('errorOccurred'), 'error');
      }
    },

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
      
      // Prevent Space-Scroll
      window.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.key === ' ') && 
            e.target === document.body && 
            !this.modalManager.hasOpenModals()) {
          e.preventDefault();
        }
      });
      
      // Auto-save interval
      setInterval(() => {
        if (this.elapsedTime > 0) {
          this.saveState();
        }
      }, 2000);
      
      // Save on page unload
      window.addEventListener('beforeunload', () => this.saveState());
      
      // Save on visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.saveState();
        } else if (!document.hidden && this.isRunning) {
          this.elapsedTime = updateElapsedTime(this.startTimestamp);
        }
      });
      
      // Save on page hide (mobile browsers)
      window.addEventListener('pagehide', () => this.saveState());
    },

    handleKeyboardShortcuts(e) {
      // Don't trigger if modal is open or user is typing
      if (this.modalManager.hasOpenModals() || 
          ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        return;
      }
      
      // Space: Toggle timer
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        this.toggleTimer();
        return false;
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
      
      // Ctrl+?: Open shortcuts modal
      if ((e.key === '?' || e.key === '/' || e.key === '_') && e.ctrlKey) {
        e.preventDefault();
        this.openShortcutsModal();
      }
      
      // +: Increase participants
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        this.updatePeopleCount(1);
      }
      
      // -: Decrease participants
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        this.updatePeopleCount(-1);
      }
      
      // Escape: Close any open modal
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    },

    /* ==================== STATE MANAGEMENT ==================== */
    
    loadStateFromBrowserOrStorage() {
      try {
        // Detect browser language
        const detectedLanguage = detectBrowserLanguage();
        const savedLanguage = localStorage.getItem('language');
        
        this.language = (savedLanguage && isLanguageSupported(savedLanguage)) 
          ? savedLanguage 
          : detectedLanguage;
        
        // Detect currency
        const detectedCurrency = detectCurrencyFromLanguage();
        const savedCurrency = localStorage.getItem('currency');
        
        this.currency = (savedCurrency && CURRENCY_CONFIG[savedCurrency]) 
          ? savedCurrency 
          : detectedCurrency;
        
        // Load theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && ['auto', 'light', 'dark'].includes(savedTheme)) {
          this.theme = savedTheme;
        }
        
        // Load session from localStorage
        const savedState = loadFromLocalStorage();
        if (savedState) {
          this.applyState(savedState);
          
          if (this.elapsedTime > 0) {
            setTimeout(() => {
              this.showNotificationMessage(this.t('sessionRestored'), 'info');
            }, 500);
          }
        }
      } catch (error) {
        console.error('Error loading from browser/storage:', error);
      }
    },

    loadStateFromURL(params) {
      try {
        const urlState = loadFromURL(params);
        
        if (!urlState) return;
        
        if (urlState.language) {
          this.language = urlState.language;
        }
        
        this.applyState(urlState);
        
        // Auto-start if needed
        if (urlState.autoStart) {
          setTimeout(() => {
            if (!this.isRunning) {
              this.startTimer();
            }
          }, 100);
        }
        
        setTimeout(() => {
          this.showNotificationMessage(this.t('sharedSessionLoaded'), 'info');
        }, 500);
      } catch (error) {
        console.error('Error loading from URL:', error);
        this.showNotificationMessage(this.t('errorInvalidData'), 'error');
      }
    },

    applyState(state) {
      if (state.elapsedTime !== undefined) this.elapsedTime = state.elapsedTime;
      if (state.startTimestamp !== undefined) this.startTimestamp = state.startTimestamp;
      if (state.segments) this.segments = state.segments;
      if (state.currentSegmentIndex !== undefined) this.currentSegmentIndex = state.currentSegmentIndex;
      if (state.costPerPerson !== undefined) this.costPerPerson = state.costPerPerson;
      if (state.currency) this.currency = state.currency;
      if (state.shownTimeNotifications) this.shownTimeNotifications = state.shownTimeNotifications;
      if (state.shownCostNotifications) this.shownCostNotifications = state.shownCostNotifications;
    },

    saveState() {
      saveToLocalStorage({
        elapsedTime: this.elapsedTime,
        isRunning: this.isRunning,
        startTimestamp: this.startTimestamp,
        segments: this.segments,
        currentSegmentIndex: this.currentSegmentIndex,
        costPerPerson: this.costPerPerson,
        currency: this.currency,
        shownTimeNotifications: this.shownTimeNotifications,
        shownCostNotifications: this.shownCostNotifications,
        loadedFromURL: this.loadedFromURL
      });
    },

    /* ==================== TRANSLATION ==================== */
    
    t(key) {
      return getTranslation(key, this.language);
    },

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
      
      const url = new URL(window.location);
      url.searchParams.set(URL_PARAMS.LANGUAGE, lang);
      window.history.replaceState({}, '', url);
    },

    updateHreflangTags() {
      try {
        const baseURL = window.location.origin + window.location.pathname;
        
        document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());
        
        SUPPORTED_LANGUAGES.forEach(lang => {
          const link = document.createElement('link');
          link.rel = 'alternate';
          link.hreflang = lang;
          link.href = `${baseURL}?${URL_PARAMS.LANGUAGE}=${lang}`;
          document.head.appendChild(link);
        });
        
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        defaultLink.href = baseURL;
        document.head.appendChild(defaultLink);
      } catch (error) {
        console.error('Error updating hreflang tags:', error);
      }
    },

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
    
    toggleTheme() {
      const themes = ['auto', 'light', 'dark'];
      const currentIndex = themes.indexOf(this.theme);
      this.theme = themes[(currentIndex + 1) % themes.length];
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
    },

    applyTheme() {
      try {
        const effectiveTheme = this.isDarkTheme ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', effectiveTheme);
      } catch (error) {
        console.error('Error applying theme:', error);
      }
    },

    /* ==================== MODAL MANAGEMENT ==================== */
    
    openInfoModal() {
      this.infoOpen = true;
      this.modalManager.open('info');
    },

    closeInfoModal() {
      this.infoOpen = false;
      this.modalManager.close('info');
    },

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
        this.modalManager.open('share');
      } catch (error) {
        console.error('Error opening share modal:', error);
        this.showNotificationMessage(this.t('errorOccurred'), 'error');
      }
    },

    closeShareModal() {
      this.shareOpen = false;
      this.modalManager.close('share');
    },

    openShortcutsModal() {
      this.shortcutsOpen = true;
      this.modalManager.open('shortcuts');
    },

    closeShortcutsModal() {
      this.shortcutsOpen = false;
      this.modalManager.close('shortcuts');
    },

    closeAllModals() {
      if (this.infoOpen) this.closeInfoModal();
      if (this.shareOpen) this.closeShareModal();
      if (this.shortcutsOpen) this.closeShortcutsModal();
    },

    async copyShareUrl() {
      await copyToClipboard(
        this.shareUrl,
        () => {
          this.copied = true;
          this.showNotificationMessage(this.t('linkCopied'), 'info');
          setTimeout(() => { this.copied = false; }, 2000);
        },
        () => {
          this.showNotificationMessage(this.t('errorOccurred'), 'error');
        }
      );
    },

    shareViaEmail() {
      shareViaEmail(this.shareUrl, {
        shareEmailSubject: this.t('shareEmailSubject'),
        shareEmailBody: this.t('shareEmailBody'),
        elapsedTime: this.t('elapsedTime'),
        totalCostLabel: this.t('totalCostLabel')
      }, this.formattedElapsedTime, this.formattedTotalCost);
    },

    shareViaWhatsApp() {
      shareViaWhatsApp(this.shareUrl, {
        shareWhatsAppText: this.t('shareWhatsAppText')
      }, this.formattedElapsedTime, this.formattedTotalCost);
    },

    shareViaSlack() {
      shareViaSlack(this.shareUrl, {
        shareSlackText: this.t('shareSlackText')
      }, this.formattedElapsedTime, this.formattedTotalCost);
    },

    async shareViaNative() {
      await shareViaNative(this.shareUrl, {
        title: this.t('title'),
        shareWhatsAppText: this.t('shareWhatsAppText')
      }, this.formattedElapsedTime, this.formattedTotalCost);
    },

    /* ==================== TIMER MANAGEMENT ==================== */
    
    toggleTimer() {
      if (this.isRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    },

    startTimer() {
      try {
        this.isRunning = true;
        
        if (!this.startTimestamp) {
          this.startTimestamp = Date.now() - (this.elapsedTime * 1000);
        }
        
        this.elapsedTime = updateElapsedTime(this.startTimestamp);
        
        this.timerManager.start({
          onTick: () => {
            this.elapsedTime = updateElapsedTime(this.startTimestamp);
            this.updateTitle();
            this.checkNotifications();
            if (this.debouncedSave) this.debouncedSave();
          },
          onEmojiTick: () => {
            createFallingEmoji(this.currentPeopleCount);
          }
        });
        
        this.updateTitle();
        this.saveState();
      } catch (error) {
        console.error('Error starting timer:', error);
        this.showNotificationMessage(this.t('errorOccurred'), 'error');
      }
    },

    pauseTimer() {
      try {
        this.isRunning = false;
        this.timerManager.pause();
        clearEmojis();
        this.updateTitle();
        this.saveState();
      } catch (error) {
        console.error('Error pausing timer:', error);
      }
    },

    resetTimer() {
      try {
        if (this.isRunning) {
          this.pauseTimer();
        }
        
        this.timerManager.reset();
        clearEmojis();
        
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTimestamp = null;
        
        this.shownTimeNotifications.clear();
        this.shownCostNotifications.clear();
        
        const currentPeople = this.segments[this.currentSegmentIndex].numberOfPeople;
        this.segments = [{ startTime: 0, numberOfPeople: currentPeople }];
        this.currentSegmentIndex = 0;
        
        this.updateTitle();
        
        if (isLocalStorageAvailable()) {
          localStorage.removeItem(STORAGE_KEY);
        }
        
        const url = new URL(window.location);
        url.search = '';
        window.history.replaceState({}, '', url);
      } catch (error) {
        console.error('Error resetting timer:', error);
        this.showNotificationMessage(this.t('errorOccurred'), 'error');
      }
    },

    updateTitle() {
      try {
        const status = this.isRunning ? '▶️' : '⏸️';
        const time = formatElapsedTime(this.elapsedTime);
        const cost = this.formattedTotalCost;
        const title = this.t('title');
        
        document.title = `${status} ${time} | ${cost} - ${title}`;
      } catch (error) {
        console.error('Error updating title:', error);
      }
    },

    /* ==================== PEOPLE MANAGEMENT ==================== */
    
    updatePeopleCount(delta) {
      try {
        const currentSegment = this.segments[this.currentSegmentIndex];
        const newValue = clampNumber(
          currentSegment.numberOfPeople + delta,
          VALIDATION.MIN_PEOPLE,
          VALIDATION.MAX_PEOPLE
        );
        
        if (newValue === currentSegment.numberOfPeople) return;

        if (this.isRunning) {
          this.segments.push({
            startTime: this.elapsedTime,
            numberOfPeople: newValue
          });
          this.currentSegmentIndex = this.segments.length - 1;
          
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
          
          this.showNotificationMessage(message, type);
        } else {
          currentSegment.numberOfPeople = newValue;
        }
        
        this.saveState();
      } catch (error) {
        console.error('Error updating people count:', error);
        this.showNotificationMessage(this.t('errorOccurred'), 'error');
      }
    },

    onPeopleInputChange() {
      if (this.debouncedSave) {
        this.debouncedSave();
      }
    },

    /* ==================== COST MANAGEMENT ==================== */
    
    updateCost() {
      if (this.debouncedUpdateCost) {
        this.debouncedUpdateCost();
      }
    },

    updateCostInternal() {
      try {
        this.costPerPerson = clampNumber(
          this.costPerPerson,
          VALIDATION.MIN_COST,
          VALIDATION.MAX_COST
        );
        
        this.updateTitle();
        this.saveState();
        localStorage.setItem('currency', this.currency);
      } catch (error) {
        console.error('Error updating cost:', error);
      }
    },

    /* ==================== NOTIFICATIONS ==================== */
    
    showNotificationMessage(message, type = 'info') {
      const notification = showNotification(message, type, (notif) => {
        this.notification = notif;
      });
      
      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
    },

    checkNotifications() {
      checkFunNotifications(
        this.elapsedTime,
        this.totalCost,
        this.shownTimeNotifications,
        this.shownCostNotifications,
        this.language,
        (message, type) => this.showNotificationMessage(message, type)
      );
    },

    /* ==================== FORMATTING ==================== */
    
    formatHistoryEntry(segment, index) {
      return formatHistoryEntry(segment, index, {
        start_history: this.t('start_history'),
        person: this.t('person'),
        persons: this.t('persons'),
        hour: this.t('hour'),
        hours: this.t('hours'),
        minute: this.t('minute'),
        minutes: this.t('minutes'),
        second: this.t('second'),
        seconds: this.t('seconds')
      });
    }
  }
}

/* ==================== INITIALIZATION ==================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Meeting Cost Calculator - DOM ready');
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
