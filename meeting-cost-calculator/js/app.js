function meetingCalculator() {
  return {
    // ==================== STATE ====================
    elapsedTime: 0,
    isRunning: false,
    startTimestamp: null,
    timer: null,
    emojiInterval: null,
    
    segments: [{ startTime: 0, numberOfPeople: 2 }],
    currentSegmentIndex: 0,
    
    costPerPerson: 65,
    currency: 'EUR',
    
    language: 'de',
    theme: 'auto',
    
    settingsOpen: false,
    historyOpen: false,
    infoOpen: false,
    
    notification: {
      visible: false,
      message: '',
      class: ''
    },

    // Track which notifications have been shown
    shownTimeNotifications: new Set(),
    shownCostNotifications: new Set(),

    // ==================== COMPUTED PROPERTIES ====================
    get languageFlag() {
      return LANGUAGE_FLAGS[this.language] || '🌐';
    },

    get currentPeopleCount() {
      return this.segments[this.currentSegmentIndex].numberOfPeople;
    },

    set currentPeopleCount(value) {
      const newValue = Math.max(1, parseInt(value) || 1);
      const oldValue = this.segments[this.currentSegmentIndex].numberOfPeople;
      
      if (newValue !== oldValue) {
        const delta = newValue - oldValue;
        this.updatePeopleCount(delta);
      }
    },

    get totalCost() {
      let total = 0;
      
      for (let i = 0; i < this.segments.length; i++) {
        const segment = this.segments[i];
        
        if (i < this.segments.length - 1) {
          const nextSegment = this.segments[i + 1];
          const duration = nextSegment.startTime - segment.startTime;
          total += (this.costPerPerson * segment.numberOfPeople * duration) / 3600;
        } else {
          const duration = this.elapsedTime - segment.startTime;
          total += (this.costPerPerson * segment.numberOfPeople * duration) / 3600;
        }
      }
      
      return total;
    },

    get formattedTotalCost() {
      return this.formatCurrency(this.totalCost, this.currency);
    },

    get formattedElapsedTime() {
      return this.formatElapsedTimeVerbose(this.elapsedTime);
    },

    get isDarkTheme() {
      if (this.theme === 'dark') return true;
      if (this.theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    // ==================== METHODS ====================
    init() {
      // Detect browser language
      const detectedLanguage = detectBrowserLanguage();
      const savedLanguage = localStorage.getItem('language');
      
      if (savedLanguage && TRANSLATIONS[savedLanguage]) {
        this.language = savedLanguage;
      } else {
        this.language = detectedLanguage;
      }
      
      // Detect currency based on language
      const detectedCurrency = detectCurrencyFromLanguage();
      const savedCurrency = localStorage.getItem('currency');
      
      if (!savedCurrency) {
        this.currency = detectedCurrency;
      }
      
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) this.theme = savedTheme;
      
      this.applyTheme();
      
      // Load session
      this.loadFromLocalStorage();
      
      // Update title
      this.updateTitle();
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.theme === 'auto') {
          this.applyTheme();
        }
      });
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Don't trigger if modal is open
        if (this.infoOpen) {
          return;
        }
        
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
          e.preventDefault();
          this.toggleTimer();
        }
        if (e.key === 'r' && e.ctrlKey) {
          e.preventDefault();
          this.resetTimer();
        }
        if (e.key === 'i' && e.ctrlKey) {
          e.preventDefault();
          this.openInfoModal();
        }
      });
      
      // Auto-save
      setInterval(() => {
        if (this.isRunning) {
          this.saveToLocalStorage();
        }
      }, 5000);
