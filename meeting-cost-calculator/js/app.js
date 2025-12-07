/**
 * ==================== MAIN APPLICATION ====================
 * Vue.js application instance and logic
 * 
 * @file app.js
 * @version 2.0.0
 */

/**
 * ==================== VUE APP ====================
 */

const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      // Timer state
      elapsedTime: 0,
      isRunning: false,
      
      // Cost settings
      costPerPerson: APP_CONFIG.defaults.costPerPerson,
      currency: APP_CONFIG.defaults.currency,
      
      // People
      currentPeopleCount: APP_CONFIG.defaults.people,
      
      // Segments (people count changes over time)
      segments: [],
      
      // Calculated values
      totalCost: 0,
      formattedElapsedTime: '0:00',
      formattedTotalCost: '0,00 €',
      
      // UI state
      language: APP_CONFIG.defaults.language,
      theme: APP_CONFIG.defaults.theme,
      
      // Modals
      showInfoModal: false,
      showShareModal: false,
      showHistoryModal: false,
      showKeyboardModal: false,
      
      // History
      meetingHistory: [],
      
      // Share
      shareUrl: '',
      
      // Managers
      timerManager: null,
      costCalculator: null,
      segmentManager: null,
    };
  },
  
  computed: {
    /**
     * Get translation
     */
    t() {
      return (key, replacements = {}) => {
        return getTranslation(key, this.language, replacements);
      };
    },
    
    /**
     * Get supported currencies
     */
    currencies() {
      return SUPPORTED_CURRENCIES;
    },
    
    /**
     * Get supported languages
     */
    languages() {
      return SUPPORTED_LANGUAGES;
    },
    
    /**
     * Get timer button text
     */
    timerButtonText() {
      return this.isRunning ? this.t('pause') : this.t('start');
    },
    
    /**
     * Get timer button icon
     */
    timerButtonIcon() {
      return this.isRunning ? '⏸️' : '▶️';
    },
    
    /**
     * Get history button text
     */
    historyButtonText() {
      return this.showHistoryModal ? this.t('historyHide') : this.t('historyShow');
    },
    
    /**
     * Check if can decrease people
     */
    canDecreasePeople() {
      return this.currentPeopleCount > APP_CONFIG.limits.minPeople;
    },
    
    /**
     * Check if can increase people
     */
    canIncreasePeople() {
      return this.currentPeopleCount < APP_CONFIG.limits.maxPeople;
    },
  },
  
  methods: {
    /**
     * Initialize application
     */
    init() {
      // Create managers
      this.timerManager = new TimerManager();
      this.costCalculator = new CostCalculator();
      this.segmentManager = new SegmentManager();
      
      // Setup timer callbacks
      this.setupTimerCallbacks();
      
      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Load saved data
      this.loadSavedData();
      
      // Load URL parameters
      this.loadUrlParams();
      
      // Apply theme
      this.applyTheme();
      
      // Initial update
      this.updateDisplay();
      
      // Setup auto-save
      if (APP_CONFIG.features.enableAutoSave) {
        this.setupAutoSave();
      }
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Application initialized');
      }
    },
    
    /**
     * Setup timer callbacks
     */
    setupTimerCallbacks() {
      this.timerManager.on('onTick', (data) => {
        this.elapsedTime = data.elapsedTime;
        this.updateDisplay();
      });
      
      this.timerManager.on('onStart', () => {
        this.isRunning = true;
        showTimerNotification('started', this.language);
        
        if (feedbackManager) {
          feedbackManager.haptic('medium');
        }
      });
      
      this.timerManager.on('onPause', () => {
        this.isRunning = false;
        showTimerNotification('paused', this.language);
        
        if (feedbackManager) {
          feedbackManager.haptic('light');
        }
        
        this.saveSession();
      });
      
      this.timerManager.on('onReset', () => {
        this.isRunning = false;
        this.elapsedTime = 0;
        
        // Save to history before reset
        if (this.totalCost > 0) {
          this.saveMeetingToHistory();
        }
        
        // Reset segments
        this.segmentManager.clear();
        this.segmentManager.addSegment(this.currentPeopleCount, 0);
        this.segments = this.segmentManager.getSegments();
        
        showTimerNotification('reset', this.language);
        
        if (feedbackManager) {
          feedbackManager.haptic('heavy');
        }
        
        this.updateDisplay();
        this.clearSession();
      });
      
      this.timerManager.on('onMilestone', (data) => {
        if (data.type === 'time') {
          handleTimeMilestone(data.value);
        } else if (data.type === 'cost') {
          handleCostMilestone(data.value);
        }
      });
    },
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
      // Space: Start/Pause
      keyboardManager.register('space', () => {
        this.toggleTimer();
      }, this.t('startPauseTimer'));
      
      // R: Reset
      keyboardManager.register('r', () => {
        this.resetTimer();
      }, this.t('resetTimer'));
      
      // Plus: Increase people
      keyboardManager.register('plus', () => {
        this.updatePeopleCount(1);
      }, this.t('adjustParticipants'));
      
      keyboardManager.register('shift+plus', () => {
        this.updatePeopleCount(1);
      }, this.t('adjustParticipants'));
      
      // Minus: Decrease people
      keyboardManager.register('minus', () => {
        this.updatePeopleCount(-1);
      }, this.t('adjustParticipants'));
      
      // I: Info
      keyboardManager.register('i', () => {
        this.toggleInfoModal();
      }, this.t('openInfo'));
      
      // S: Share
      keyboardManager.register('ctrl+s', () => {
        this.toggleShareModal();
      }, this.t('openShare'));
      
      // ?: Keyboard shortcuts
      keyboardManager.register('ctrl+question', () => {
        this.toggleKeyboardModal();
      }, this.t('showShortcuts'));
      
      keyboardManager.register('shift+question', () => {
        this.toggleKeyboardModal();
      }, this.t('showShortcuts'));
      
      // ESC: Close modals
      keyboardManager.register('esc', () => {
        this.closeAllModals();
      }, this.t('closeModal'));
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
        
        // Timer wiederherstellen wenn er lief
        if (session.isRunning && session.lastTimestamp) {
          // Berechne vergangene Zeit seit letztem Save
          const timeSinceLastSave = Math.floor((Date.now() - session.lastTimestamp) / 1000);
          this.elapsedTime += timeSinceLastSave;
          
          // Timer automatisch starten
          this.$nextTick(() => {
            this.timerManager.setElapsedTime(this.elapsedTime);
            this.timerManager.start();
            this.isRunning = true;
            
            if (DEBUG_CONFIG?.enabled) {
              console.log('[App] Timer restored and started');
            }
          });
        } else {
          // Load into managers
          this.timerManager.setElapsedTime(this.elapsedTime);
        }
        
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
      
      // Load history
      this.meetingHistory = loadMeetingHistory();
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Data loaded from storage');
      }
    },
    
    /**
     * Load URL parameters
     */
    loadUrlParams() {
      const params = getAllUrlParams();
      
      if (params[APP_CONFIG.urlParams.people]) {
        const people = parseInt(params[APP_CONFIG.urlParams.people]);
        if (validatePeopleCount(people)) {
          this.currentPeopleCount = people;
          this.costCalculator.setPeopleCount(people);
        }
      }
      
      if (params[APP_CONFIG.urlParams.cost]) {
        const cost = parseFloat(params[APP_CONFIG.urlParams.cost]);
        if (validateCost(cost)) {
          this.costPerPerson = cost;
          this.costCalculator.setCostPerPerson(cost);
        }
      }
      
      if (params[APP_CONFIG.urlParams.currency]) {
        const currency = params[APP_CONFIG.urlParams.currency].toUpperCase();
        if (validateCurrency(currency)) {
          this.currency = currency;
          this.costCalculator.setCurrency(currency);
        }
      }
      
      if (params[APP_CONFIG.urlParams.language]) {
        const language = params[APP_CONFIG.urlParams.language].toLowerCase();
        if (validateLanguage(language)) {
          this.language = language;
        }
      }
      
      if (params[APP_CONFIG.urlParams.elapsed]) {
        const elapsed = parseInt(params[APP_CONFIG.urlParams.elapsed]);
        if (elapsed > 0) {
          this.elapsedTime = elapsed;
          this.timerManager.setElapsedTime(elapsed);
        }
      }
      
      if (DEBUG_CONFIG?.enabled && Object.keys(params).length > 0) {
        console.log('[App] Loaded URL parameters:', params);
      }
    },
    
    /**
     * Setup auto-save
     */
    setupAutoSave() {
      setInterval(() => {
        if (this.isRunning) {
          this.saveSession();
        }
      }, APP_CONFIG.performance.autoSaveInterval);
    },
    
    /**
     * Update all display values
     */
    updateDisplay() {
      // Update time display
      this.formattedElapsedTime = formatElapsedTime(this.elapsedTime);
      
      // Store old cost for animation
      const oldCost = this.totalCost;
      
      // Update cost display mit Segmenten
      this.totalCost = this.costCalculator.calculateTotalCostWithSegments(
        this.elapsedTime,
        this.segments
      );
      this.formattedTotalCost = formatCost(this.totalCost, this.currency);
      
      // Trigger animation wenn Kosten sich ändern
      if (oldCost !== this.totalCost && this.isRunning) {
        this.$nextTick(() => {
          const costElement = document.querySelector('.cost-value');
          if (costElement) {
            costElement.classList.remove('cost-changed');
            void costElement.offsetWidth; // Force reflow
            costElement.classList.add('cost-changed');
            
            setTimeout(() => {
              costElement.classList.remove('cost-changed');
            }, 600);
          }
        });
      }
      
      // Check cost milestones
      if (this.timerManager) {
        this.timerManager.checkCostMilestone(this.totalCost);
      }
    },
    
    /**
     * Toggle timer (start/pause)
     */
    toggleTimer() {
      this.timerManager.toggle();
    },
    
    /**
     * Reset timer
     */
    resetTimer() {
      if (this.elapsedTime === 0) return;
      
      this.timerManager.reset();
    },
    
    /**
     * Update people count
     * @param {number} delta - Change amount (+1 or -1)
     */
    updatePeopleCount(delta) {
      const oldCount = this.currentPeopleCount;
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
      
      // Notification anzeigen
      if (delta > 0) {
        // Teilnehmer beigetreten
        notificationManager.success(
          this.t('participantJoined') + ' - ' +
          this.t('nowParticipants', { count: newCount }),
          3000
        );
        
        // Emoji spawnen
        if (emojiManager && APP_CONFIG.features.enableEmojis) {
          emojiManager.spawn('👤');
        }
      } else {
        // Teilnehmer verlassen
        notificationManager.info(
          this.t('participantLeft') + ' - ' +
          this.t('nowParticipants', { count: newCount }),
          3000
        );
        
        // Emoji spawnen
        if (emojiManager && APP_CONFIG.features.enableEmojis) {
          emojiManager.spawn('👋');
        }
      }
      
      // Update display
      this.updateDisplay();
      
      // Feedback
      if (feedbackManager) {
        feedbackManager.haptic('light');
      }
      
      // Save
      this.saveSession();
      
      if (DEBUG_CONFIG?.enabled) {
        console.log(`[App] People count changed: ${oldCount} → ${newCount}`);
      }
    },
    
    /**
     * Handle people input change
     */
    onPeopleInputChange() {
      const oldCount = this.currentPeopleCount;
      const count = sanitizePeopleCount(this.currentPeopleCount);
      
      if (count !== this.currentPeopleCount) {
        this.currentPeopleCount = count;
      }
      
      this.costCalculator.setPeopleCount(count);
      
      // Add segment
      this.segmentManager.addSegment(count, this.elapsedTime);
      this.segments = this.segmentManager.getSegments();
      
      // Notification bei manueller Änderung
      if (count !== oldCount) {
        const delta = count - oldCount;
        
        if (delta > 0) {
          notificationManager.success(
            this.t('participantsChanged', { count: count }),
            3000
          );
          
          if (emojiManager && APP_CONFIG.features.enableEmojis) {
            emojiManager.burst(['👤', '👥'], Math.abs(delta), 100);
          }
        } else if (delta < 0) {
          notificationManager.info(
            this.t('participantsChanged', { count: count }),
            3000
          );
          
          if (emojiManager && APP_CONFIG.features.enableEmojis) {
            emojiManager.burst(['👋'], Math.abs(delta), 100);
          }
        }
      }
      
      this.updateDisplay();
      this.saveSession();
      
      if (DEBUG_CONFIG?.enabled) {
        console.log(`[App] People input changed: ${oldCount} → ${count}`);
      }
    },
    
    /**
     * Handle cost input change
     */
    onCostInputChange() {
      const cost = sanitizeCost(this.costPerPerson);
      
      if (cost !== this.costPerPerson) {
        this.costPerPerson = cost;
      }
      
      this.costCalculator.setCostPerPerson(cost);
      this.updateDisplay();
      this.saveSettings();
    },
    
    /**
     * Handle currency change
     */
    onCurrencyChange() {
      this.costCalculator.setCurrency(this.currency);
      this.updateDisplay();
      this.saveSettings();
    },
    
    /**
     * Handle language change
     */
    onLanguageChange() {
      this.saveSettings();
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Language changed to:', this.language);
      }
    },
    
    /**
     * Handle theme change
     */
    onThemeChange() {
      this.applyTheme();
      this.saveSettings();
    },
    
    /**
     * Apply theme
     */
    applyTheme() {
      const root = document.documentElement;
      
      if (this.theme === 'auto') {
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
    
    /**
     * Toggle info modal
     */
    toggleInfoModal() {
      this.showInfoModal = !this.showInfoModal;
      
      if (this.showInfoModal) {
        modalManager.open('info');
      } else {
        modalManager.close('info');
      }
    },
    
    /**
     * Toggle share modal
     */
    toggleShareModal() {
      this.showShareModal = !this.showShareModal;
      
      if (this.showShareModal) {
        this.generateShareUrl();
        modalManager.open('share');
      } else {
        modalManager.close('share');
      }
    },
    
    /**
     * Toggle history modal
     */
    toggleHistoryModal() {
      this.showHistoryModal = !this.showHistoryModal;
      
      if (this.showHistoryModal) {
        this.meetingHistory = loadMeetingHistory();
        modalManager.open('history');
      } else {
        modalManager.close('history');
      }
    },
    
    /**
     * Toggle keyboard shortcuts modal
     */
    toggleKeyboardModal() {
      this.showKeyboardModal = !this.showKeyboardModal;
      
      if (this.showKeyboardModal) {
        modalManager.open('keyboard');
      } else {
        modalManager.close('keyboard');
      }
    },
    
    /**
     * Close all modals
     */
    closeAllModals() {
      this.showInfoModal = false;
      this.showShareModal = false;
      this.showHistoryModal = false;
      this.showKeyboardModal = false;
      modalManager.closeAll();
    },
    
    /**
     * Generate share URL
     */
    generateShareUrl() {
      this.shareUrl = shareManager.generateShareUrl({
        people: this.currentPeopleCount,
        cost: this.costPerPerson,
        currency: this.currency,
        elapsed: this.elapsedTime,
        language: this.language,
      });
    },
    
    /**
     * Copy share URL
     */
    async copyShareUrl() {
      const success = await shareManager.copyUrl(this.shareUrl);
      
      if (success) {
        notificationManager.success(this.t('linkCopied'), 2000);
        
        if (feedbackManager) {
          feedbackManager.haptic('success');
        }
      } else {
        notificationManager.error(this.t('errorOccurred'), 3000);
      }
    },
    
    /**
     * Share via native share
     */
    async shareNative() {
      const shareData = {
        cost: this.formattedTotalCost,
        time: this.formattedElapsedTime,
        people: this.currentPeopleCount,
        url: this.shareUrl,
      };
      
      const text = formatShareText(shareData, 'default');
      
      const success = await shareManager.shareNative({
        title: '💰 Meeting-Kostenrechner',
        text: text,
        url: this.shareUrl,
      });
      
      if (success) {
        notificationManager.success(this.t('sessionShared'), 2000);
      }
    },
    
    /**
     * Share via email
     */
    shareEmail() {
      const shareData = {
        cost: this.formattedTotalCost,
        time: this.formattedElapsedTime,
        people: this.currentPeopleCount,
        url: this.shareUrl,
      };
      
      shareManager.shareEmail(shareData);
    },
    
    /**
     * Save meeting to history
     */
    saveMeetingToHistory() {
      const meeting = {
        elapsedTime: this.elapsedTime,
        totalCost: this.totalCost,
        peopleCount: this.currentPeopleCount,
        costPerPerson: this.costPerPerson,
        currency: this.currency,
        segments: this.segments,
      };
      
      saveMeetingToHistory(meeting);
      this.meetingHistory = loadMeetingHistory();
      
      if (DEBUG_CONFIG?.enabled) {
        console.log('[App] Meeting saved to history');
      }
    },
    
    /**
     * Delete history entry
     */
    deleteHistoryEntry(id) {
      deleteHistoryEntry(id);
      this.meetingHistory = loadMeetingHistory();
    },
    
    /**
     * Clear history
     */
    clearHistory() {
      clearMeetingHistory();
      this.meetingHistory = [];
      notificationManager.success('Historie gelöscht', 2000);
    },
    
    /**
     * Save session
     */
    saveSession() {
      saveSession({
        elapsedTime: this.elapsedTime,
        isRunning: this.isRunning,
        currentPeopleCount: this.currentPeopleCount,
        segments: this.segments,
      });
    },
    
    /**
     * Clear session
     */
    clearSession() {
      clearSession();
    },
    
    /**
     * Save settings
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
     * Format history entry
     */
    formatHistoryEntry(segment, index) {
      return formatHistoryEntry(segment, index, this.language);
    },
    
    /**
     * Format date
     */
    formatDate(date) {
      return formatDate(date, this.language);
    },
  },
  
  mounted() {
    this.init();
    
    // Add timer-running class to body
    this.$watch('isRunning', (newVal) => {
      if (newVal) {
        document.body.classList.add('timer-running');
      } else {
        document.body.classList.remove('timer-running');
      }
    });
    
    // Listen for theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.theme === 'auto') {
          this.applyTheme();
        }
      });
    }
  },
  
  beforeUnmount() {
    // Cleanup
    if (this.timerManager) {
      this.timerManager.destroy();
    }
  },
});

/**
 * ==================== MOUNT APP ====================
 */

// Wait for DOM to be ready
domReady().then(() => {
  app.mount('#app');
  console.log('[App] Vue app mounted');
});
