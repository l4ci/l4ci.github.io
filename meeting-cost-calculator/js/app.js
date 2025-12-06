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
    shareOpen: false,
    
    notification: {
      visible: false,
      message: '',
      class: ''
    },

    // Share state
    shareUrl: '',
    copied: false,
    canUseNativeShare: false,

    // Track which notifications have been shown
    shownTimeNotifications: new Set(),
    shownCostNotifications: new Set(),

    // Flag to check if loaded from URL
    loadedFromURL: false,

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
      // Check for native share API
      this.canUseNativeShare = navigator.share !== undefined;

      // First, check URL parameters (highest priority)
      const urlParams = getURLParameters();
      
      if (Object.keys(urlParams).length > 0 && urlParams[URL_PARAMS.LANGUAGE]) {
        this.loadFromURL(urlParams);
        this.loadedFromURL = true;
      } else {
        // Load from localStorage or detect from browser
        this.loadFromBrowserOrStorage();
      }
      
      this.applyTheme();
      
      // Update hreflang tags dynamically
      this.updateHreflangTags();
      
      // Update Open Graph URL
      this.updateOpenGraphURL();
      
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
        if (this.infoOpen || this.shareOpen) {
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
        if (e.key === 's' && e.ctrlKey) {
          e.preventDefault();
          this.openShareModal();
        }
      });
      
      // Auto-save
      setInterval(() => {
        if (this.isRunning) {
          this.saveToLocalStorage();
        }
      }, 5000);
      
      // Save on page unload
      window.addEventListener('beforeunload', () => {
        if (this.isRunning || this.elapsedTime > 0) {
          this.saveToLocalStorage();
        }
      });
      
      // Update HTML lang
      document.documentElement.lang = this.language;
    },

    loadFromBrowserOrStorage() {
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
      
      // Load session from localStorage
      this.loadFromLocalStorage();
    },

    loadFromURL(params) {
      // Language (highest priority)
      if (params[URL_PARAMS.LANGUAGE] && TRANSLATIONS[params[URL_PARAMS.LANGUAGE]]) {
        this.language = params[URL_PARAMS.LANGUAGE];
      }
      
      // Elapsed time
      if (params[URL_PARAMS.ELAPSED_TIME]) {
        this.elapsedTime = parseInt(params[URL_PARAMS.ELAPSED_TIME]) || 0;
      }
      
      // Cost per person
      if (params[URL_PARAMS.COST_PER_PERSON]) {
        this.costPerPerson = parseFloat(params[URL_PARAMS.COST_PER_PERSON]) || 65;
      }
      
      // Currency
      if (params[URL_PARAMS.CURRENCY]) {
        this.currency = params[URL_PARAMS.CURRENCY];
      }
      
      // Running status
      if (params[URL_PARAMS.RUNNING]) {
        const wasRunning = params[URL_PARAMS.RUNNING] === '1';
        // Don't auto-start, just set the timestamp
        if (wasRunning) {
          this.startTimestamp = Date.now() - (this.elapsedTime * 1000);
        }
      }
      
      // Segments
      if (params[URL_PARAMS.SEGMENTS]) {
        try {
          const segmentsData = params[URL_PARAMS.SEGMENTS].split(',');
          this.segments = segmentsData.map(seg => {
            const [startTime, numberOfPeople] = seg.split(':');
            return {
              startTime: parseInt(startTime) || 0,
              numberOfPeople: parseInt(numberOfPeople) || 2
            };
          });
          this.currentSegmentIndex = this.segments.length - 1;
        } catch (e) {
          console.error('Error parsing segments:', e);
        }
      } else if (params[URL_PARAMS.PEOPLE]) {
        // Simple people count
        const people = parseInt(params[URL_PARAMS.PEOPLE]) || 2;
        this.segments = [{ startTime: 0, numberOfPeople: people }];
        this.currentSegmentIndex = 0;
      }
      
      // Show notification that shared session was loaded
      setTimeout(() => {
        this.showNotification(this.t('sharedSessionLoaded'), 'info');
      }, 500);
    },

    updateHreflangTags() {
      const baseURL = window.location.origin + window.location.pathname;
      const supportedLanguages = ['de', 'en', 'es', 'fr', 'it', 'pl'];
      
      // Remove existing hreflang tags
      document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());
      
      // Add new hreflang tags
      supportedLanguages.forEach(lang => {
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
    },

    updateOpenGraphURL() {
      const ogUrl = document.getElementById('og-url');
      if (ogUrl) {
        ogUrl.content = window.location.href;
      }
    },

    t(key) {
      return TRANSLATIONS[this.language][key] || key;
    },

    setLanguage(lang) {
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

    toggleTheme() {
      const themes = ['auto', 'light', 'dark'];
      const currentIndex = themes.indexOf(this.theme);
      this.theme = themes[(currentIndex + 1) % themes.length];
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
    },

    applyTheme() {
      const effectiveTheme = this.isDarkTheme ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', effectiveTheme);
    },

    openInfoModal() {
      this.infoOpen = true;
      document.body.style.overflow = 'hidden';
    },

    closeInfoModal() {
      this.infoOpen = false;
      document.body.style.overflow = '';
    },

    openShareModal() {
      this.shareUrl = buildShareURL({
        language: this.language,
        elapsedTime: this.elapsedTime,
        segments: this.segments,
        currentSegmentIndex: this.currentSegmentIndex,
        costPerPerson: this.costPerPerson,
        currency: this.currency,
        isRunning: this.isRunning
      });
      this.shareOpen = true;
      this.copied = false;
      document.body.style.overflow = 'hidden';
    },

    closeShareModal() {
      this.shareOpen = false;
      document.body.style.overflow = '';
    },

    async copyShareUrl() {
      try {
        await navigator.clipboard.writeText(this.shareUrl);
        this.copied = true;
        this.showNotification(this.t('linkCopied'), 'info');
        
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = this.shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        this.copied = true;
        this.showNotification(this.t('linkCopied'), 'info');
        
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      }
    },

    shareViaEmail() {
      const subject = encodeURIComponent(this.t('shareEmailSubject'));
      const body = encodeURIComponent(`${this.t('shareEmailBody')}\n\n${this.shareUrl}\n\n${this.t('elapsedTime')}: ${this.formattedElapsedTime}\n${this.t('totalCostLabel')} ${this.formattedTotalCost}`);
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    },

    shareViaWhatsApp() {
      const text = encodeURIComponent(`${this.t('shareWhatsAppText')}\n${this.shareUrl}\n\n⏱️ ${this.formattedElapsedTime}\n💰 ${this.formattedTotalCost}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    },

    shareViaSlack() {
      const text = encodeURIComponent(`${this.t('shareSlackText')}\n${this.shareUrl}\n\n⏱️ ${this.formattedElapsedTime}\n💰 ${this.formattedTotalCost}`);
      window.open(`https://slack.com/intl/en-de/help/articles/201330256-Add-links-to-your-messages?text=${text}`, '_blank');
    },

    async shareViaNative() {
      if (navigator.share) {
        try {
          await navigator.share({
            title: this.t('title'),
            text: `${this.t('shareWhatsAppText')}\n⏱️ ${this.formattedElapsedTime}\n💰 ${this.formattedTotalCost}`,
            url: this.shareUrl
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Error sharing:', err);
          }
        }
      }
    },

    toggleTimer() {
      if (this.isRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    },

    startTimer() {
      this.isRunning = true;
      
      if (!this.startTimestamp) {
        this.startTimestamp = Date.now() - (this.elapsedTime * 1000);
      }
      
      this.timer = setInterval(() => {
        const now = Date.now();
        this.elapsedTime = Math.floor((now - this.startTimestamp) / 1000);
        this.updateTitle();
        this.checkFunNotifications();
        this.saveToLocalStorage();
      }, 1000);
      
      this.emojiInterval = setInterval(() => this.createFallingEmoji(), 1000);
      
      this.updateTitle();
      this.saveToLocalStorage();
    },

    pauseTimer() {
      this.isRunning = false;
      
      clearInterval(this.timer);
      clearInterval(this.emojiInterval);
      this.clearEmojis();
      
      this.updateTitle();
      this.saveToLocalStorage();
    },

    resetTimer() {
      if (this.isRunning) {
        this.pauseTimer();
      }
      
      clearInterval(this.timer);
      clearInterval(this.emojiInterval);
      this.clearEmojis();
      
      this.isRunning = false;
      this.elapsedTime = 0;
      this.startTimestamp = null;
      
      // Reset notification tracking
      this.shownTimeNotifications.clear();
      this.shownCostNotifications.clear();
      
      const initialPeople = this.segments[this.currentSegmentIndex].numberOfPeople;
      this.segments = [{ startTime: 0, numberOfPeople: initialPeople }];
      this.currentSegmentIndex = 0;
      
      this.updateTitle();
      localStorage.removeItem(STORAGE_KEY);
      
      // Clear URL parameters
      const url = new URL(window.location);
      url.search = '';
      window.history.replaceState({}, '', url);
    },

    updatePeopleCount(delta) {
      const currentSegment = this.segments[this.currentSegmentIndex];
      const newValue = Math.max(1, currentSegment.numberOfPeople + delta);
      
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
        
        this.showNotification(message, type);
      } else {
        currentSegment.numberOfPeople = newValue;
      }
      
      this.saveToLocalStorage();
    },

    onPeopleInputChange() {
      this.saveToLocalStorage();
    },

    updateCost() {
      this.updateTitle();
      this.saveToLocalStorage();
      localStorage.setItem('currency', this.currency);
    },

    updateTitle() {
      const status = this.isRunning ? '▶️' : '⏸️';
      const time = this.formatElapsedTime(this.elapsedTime);
      const cost = this.formattedTotalCost;
      const title = this.t('title');
      
      document.title = `${status} ${time} | ${cost} - ${title}`;
    },

    // Check for fun notifications based on time and cost
    checkFunNotifications() {
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
    },

    formatElapsedTime(seconds) {
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
    },

    formatElapsedTimeVerbose(seconds) {
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
    },

    formatCurrency(amount, currencyCode) {
      const config = CURRENCY_CONFIG[currencyCode];
      if (!config) return `${amount.toFixed(2)} ${currencyCode}`;
      
      const rounded = amount.toFixed(config.decimals);
      const [integer, decimal] = rounded.split('.');
      const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSep);
      
      let formattedAmount = formattedInteger;
      if (config.decimals > 0 && decimal) {
        formattedAmount += config.separator + decimal;
      }
      
      return config.position === 'prefix' 
        ? `${config.symbol} ${formattedAmount}`
        : `${formattedAmount} ${config.symbol}`;
    },

    formatHistoryEntry(segment, index) {
      const personText = segment.numberOfPeople === 1 ? this.t('person') : this.t('persons');
      
      if (index === 0) {
        return `${this.t('start_history')} ${segment.numberOfPeople} ${personText}`;
      }
      
      const timeFormatted = this.formatElapsedTimeVerbose(segment.startTime);
      return `${timeFormatted}: ${segment.numberOfPeople} ${personText}`;
    },

    showNotification(message, type = 'info') {
      const bgColors = {
        join: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        leave: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      };
      
      this.notification = {
        visible: true,
        message: message,
        class: bgColors[type] || bgColors.info
      };
      
      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
    },

    createFallingEmoji() {
      const container = document.getElementById('emojiContainer');
      if (!container || container.children.length >= MAX_EMOJIS) return;

      const currentSegment = this.segments[this.currentSegmentIndex];
      const count = Math.min(currentSegment.numberOfPeople, 5);
      
      for (let i = 0; i < count; i++) {
        const emoji = document.createElement('div');
        emoji.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        emoji.className = 'emoji';
        emoji.style.left = `${Math.random() * 100}vw`;
        emoji.style.animationDuration = `${Math.random() * 2 + 3}s`;
        
        emoji.addEventListener('animationend', () => emoji.remove(), { once: true });
        container.appendChild(emoji);
      }
    },

    clearEmojis() {
      const container = document.getElementById('emojiContainer');
      if (container) {
        container.innerHTML = '';
      }
    },

    saveToLocalStorage() {
      // Don't save if loaded from URL (to avoid overwriting shared sessions)
      if (this.loadedFromURL && this.elapsedTime < 10) {
        return;
      }
      
      const data = {
        elapsedTime: this.elapsedTime,
        isRunning: this.isRunning,
        segments: this.segments,
        currentSegmentIndex: this.currentSegmentIndex,
        costPerPerson: this.costPerPerson,
        currency: this.currency,
        shownTimeNotifications: Array.from(this.shownTimeNotifications),
        shownCostNotifications: Array.from(this.shownCostNotifications),
        lastSaveTime: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        const data = JSON.parse(saved);
        
        this.elapsedTime = data.elapsedTime || 0;
        this.segments = data.segments || [{ startTime: 0, numberOfPeople: 2 }];
        this.currentSegmentIndex = data.currentSegmentIndex || 0;
        this.costPerPerson = data.costPerPerson || 65;
        this.currency = data.currency || 'EUR';
        
        // Restore notification tracking
        if (data.shownTimeNotifications) {
          this.shownTimeNotifications = new Set(data.shownTimeNotifications);
        }
        if (data.shownCostNotifications) {
          this.shownCostNotifications = new Set(data.shownCostNotifications);
        }
        
        if (data.isRunning) {
          const timeSinceLastSave = Math.floor((Date.now() - data.lastSaveTime) / 1000);
          this.elapsedTime += timeSinceLastSave;
          
          this.showNotification(this.t('sessionRestored'), 'info');
        }
      } catch (e) {
        console.error('Error loading session:', e);
      }
    }
  }
}
