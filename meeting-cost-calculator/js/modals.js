/**
 * ==================== MODAL MANAGER ====================
 * Modal dialogs and overlays management
 * 
 * @file modals.js
 * @version 2.0.0
 */

/**
 * Modal Manager Class
 */
class ModalManager {
  constructor() {
    this.activeModals = [];
    this.focusTrapStack = [];
    this.escapeHandlers = [];
    this.isInitialized = false;
    
    this.init();
  }
  
  /**
   * Initialize modal system
   */
  init() {
    if (this.isInitialized) return;
    
    // Global escape key handler
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.handleEscape();
      }
    });
    
    // Prevent body scroll when modal is open
    this.setupScrollLock();
    
    this.isInitialized = true;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Modals] Modal Manager initialized');
    }
  }
  
  /**
   * Setup scroll lock functionality
   */
  setupScrollLock() {
    this.originalOverflow = '';
    this.originalPaddingRight = '';
  }
  
  /**
   * Open modal
   * @param {string} modalId - Modal element ID or element
   * @param {Object} options - Modal options
   * @returns {boolean} Success
   */
  open(modalId, options = {}) {
    const modal = typeof modalId === 'string' 
      ? document.getElementById(modalId)
      : modalId;
    
    if (!modal) {
      console.warn('[Modals] Modal not found:', modalId);
      return false;
    }
    
    // Check if already open
    if (this.isOpen(modal)) {
      return false;
    }
    
    // Lock body scroll
    this.lockScroll();
    
    // Show modal
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    if (options.autoFocus !== false) {
      this.setupFocusTrap(modal);
    }
    
    // Store active modal
    this.activeModals.push({
      element: modal,
      options: options,
      timestamp: Date.now(),
    });
    
    // Trigger open callback
    if (options.onOpen) {
      options.onOpen(modal);
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Modals] Open:', modalId);
    }
    
    return true;
  }
  
  /**
   * Close modal
   * @param {string|HTMLElement} modalId - Modal element ID or element
   * @param {Object} options - Close options
   * @returns {boolean} Success
   */
  close(modalId, options = {}) {
    const modal = typeof modalId === 'string'
      ? document.getElementById(modalId)
      : modalId;
    
    if (!modal) {
      console.warn('[Modals] Modal not found:', modalId);
      return false;
    }
    
    // Check if open
    if (!this.isOpen(modal)) {
      return false;
    }
    
    // Hide modal
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    
    // Remove from active modals
    this.activeModals = this.activeModals.filter(m => m.element !== modal);
    
    // Unlock scroll if no modals open
    if (this.activeModals.length === 0) {
      this.unlockScroll();
    }
    
    // Remove focus trap
    this.removeFocusTrap(modal);
    
    // Get modal data for callback
    const modalData = this.activeModals.find(m => m.element === modal);
    
    // Trigger close callback
    if (modalData?.options.onClose) {
      modalData.options.onClose(modal);
    }
    
    if (options.onClose) {
      options.onClose(modal);
    }
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Modals] Close:', modalId);
    }
    
    return true;
  }
  
  /**
   * Toggle modal
   * @param {string|HTMLElement} modalId - Modal element ID or element
   * @param {Object} options - Modal options
   * @returns {boolean} New state (true = open)
   */
  toggle(modalId, options = {}) {
    const modal = typeof modalId === 'string'
      ? document.getElementById(modalId)
      : modalId;
    
    if (!modal) return false;
    
    if (this.isOpen(modal)) {
      this.close(modal, options);
      return false;
    } else {
      this.open(modal, options);
      return true;
    }
  }
  
  /**
   * Check if modal is open
   * @param {string|HTMLElement} modalId - Modal element ID or element
   * @returns {boolean} Is open
   */
  isOpen(modalId) {
    const modal = typeof modalId === 'string'
      ? document.getElementById(modalId)
      : modalId;
    
    if (!modal) return false;
    
    return this.activeModals.some(m => m.element === modal);
  }
  
  /**
   * Close all modals
   */
  closeAll() {
    const modals = [...this.activeModals];
    modals.forEach(modalData => {
      this.close(modalData.element);
    });
  }
  
  /**
   * Get active modal count
   * @returns {number} Count
   */
  getCount() {
    return this.activeModals.length;
  }
  
  /**
   * Get topmost modal
   * @returns {HTMLElement|null} Modal element
   */
  getTopModal() {
    if (this.activeModals.length === 0) return null;
    return this.activeModals[this.activeModals.length - 1].element;
  }
  
  /**
   * Handle escape key press
   */
  handleEscape() {
    const topModal = this.getTopModal();
    if (topModal) {
      this.close(topModal);
    }
  }
  
  /**
   * Lock body scroll
   */
  lockScroll() {
    if (this.activeModals.length > 0) return; // Already locked
    
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    this.originalOverflow = document.body.style.overflow;
    this.originalPaddingRight = document.body.style.paddingRight;
    
    document.body.style.overflow = 'hidden';
    
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  
  /**
   * Unlock body scroll
   */
  unlockScroll() {
    document.body.style.overflow = this.originalOverflow;
    document.body.style.paddingRight = this.originalPaddingRight;
  }
  
  /**
   * Setup focus trap for modal
   * @param {HTMLElement} modal - Modal element
   */
  setupFocusTrap(modal) {
    // Get all focusable elements
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    setTimeout(() => {
      firstElement.focus();
    }, 100);
    
    // Trap focus
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    modal.addEventListener('keydown', trapFocus);
    
    // Store for cleanup
    this.focusTrapStack.push({
      modal,
      handler: trapFocus,
    });
  }
  
  /**
   * Remove focus trap
   * @param {HTMLElement} modal - Modal element
   */
  removeFocusTrap(modal) {
    const index = this.focusTrapStack.findIndex(trap => trap.modal === modal);
    
    if (index !== -1) {
      const trap = this.focusTrapStack[index];
      modal.removeEventListener('keydown', trap.handler);
      this.focusTrapStack.splice(index, 1);
    }
  }
  
  /**
   * Destroy modal manager
   */
  destroy() {
    this.closeAll();
    this.unlockScroll();
    this.focusTrapStack = [];
    this.activeModals = [];
    this.isInitialized = false;
    
    if (DEBUG_CONFIG?.enabled) {
      console.log('[Modals] Modal Manager destroyed');
    }
  }
}

/**
 * ==================== MODAL HELPERS ====================
 */

/**
 * Create modal programmatically
 * @param {Object} config - Modal configuration
 * @returns {HTMLElement} Modal element
 */
function createModal(config = {}) {
  const {
    id = `modal-${Date.now()}`,
    title = 'Modal',
    content = '',
    buttons = [],
    closeButton = true,
    backdrop = true,
    className = '',
  } = config;
  
  // Create modal structure
  const modal = document.createElement('div');
  modal.id = id;
  modal.className = `modal-backdrop ${className}`;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', `${id}-title`);
  modal.style.display = 'none';
  
  // Close on backdrop click
  if (backdrop) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modalManager.close(modal);
      }
    });
  }
  
  // Modal content container
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Header
  const header = document.createElement('div');
  header.className = 'modal-header';
  
  const titleElement = document.createElement('h2');
  titleElement.id = `${id}-title`;
  titleElement.className = 'modal-title';
  titleElement.textContent = title;
  header.appendChild(titleElement);
  
  if (closeButton) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.setAttribute('aria-label', 'Close dialog');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
      modalManager.close(modal);
    });
    header.appendChild(closeBtn);
  }
  
  modalContent.appendChild(header);
  
  // Body
  const body = document.createElement('div');
  body.className = 'modal-body';
  
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  
  modalContent.appendChild(body);
  
  // Footer with buttons
  if (buttons.length > 0) {
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    buttons.forEach(buttonConfig => {
      const button = document.createElement('button');
      button.className = buttonConfig.className || 'modal-button';
      button.textContent = buttonConfig.text || 'Button';
      
      if (buttonConfig.onClick) {
        button.addEventListener('click', () => {
          buttonConfig.onClick(modal);
        });
      }
      
      footer.appendChild(button);
    });
    
    modalContent.appendChild(footer);
  }
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  return modal;
}

/**
 * Show confirmation dialog
 * @param {Object} config - Confirmation config
 * @returns {Promise<boolean>} User choice
 */
function showConfirmDialog(config = {}) {
  const {
    title = 'Confirm',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmClass = 'btn-primary',
    cancelClass = 'btn-secondary',
  } = config;
  
  return new Promise((resolve) => {
    const modal = createModal({
      title,
      content: `<p>${message}</p>`,
      buttons: [
        {
          text: cancelText,
          className: `modal-button ${cancelClass}`,
          onClick: (modal) => {
            modalManager.close(modal);
            resolve(false);
          },
        },
        {
          text: confirmText,
          className: `modal-button ${confirmClass}`,
          onClick: (modal) => {
            modalManager.close(modal);
            resolve(true);
          },
        },
      ],
    });
    
    modalManager.open(modal, {
      onClose: () => {
        // Clean up modal element
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 300);
      },
    });
  });
}

/**
 * Show alert dialog
 * @param {Object} config - Alert config
 * @returns {Promise<void>}
 */
function showAlertDialog(config = {}) {
  const {
    title = 'Alert',
    message = '',
    buttonText = 'OK',
    buttonClass = 'btn-primary',
  } = config;
  
  return new Promise((resolve) => {
    const modal = createModal({
      title,
      content: `<p>${message}</p>`,
      buttons: [
        {
          text: buttonText,
          className: `modal-button ${buttonClass}`,
          onClick: (modal) => {
            modalManager.close(modal);
            resolve();
          },
        },
      ],
    });
    
    modalManager.open(modal, {
      onClose: () => {
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 300);
      },
    });
  });
}

/**
 * Show prompt dialog
 * @param {Object} config - Prompt config
 * @returns {Promise<string|null>} User input or null
 */
function showPromptDialog(config = {}) {
  const {
    title = 'Input',
    message = '',
    defaultValue = '',
    placeholder = '',
    confirmText = 'OK',
    cancelText = 'Cancel',
  } = config;
  
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-input';
    input.value = defaultValue;
    input.placeholder = placeholder;
    
    const content = document.createElement('div');
    if (message) {
      const p = document.createElement('p');
      p.textContent = message;
      content.appendChild(p);
    }
    content.appendChild(input);
    
    const modal = createModal({
      title,
      content,
      buttons: [
        {
          text: cancelText,
          className: 'modal-button btn-secondary',
          onClick: (modal) => {
            modalManager.close(modal);
            resolve(null);
          },
        },
        {
          text: confirmText,
          className: 'modal-button btn-primary',
          onClick: (modal) => {
            modalManager.close(modal);
            resolve(input.value);
          },
        },
      ],
    });
    
    modalManager.open(modal, {
      onOpen: () => {
        setTimeout(() => input.focus(), 100);
      },
      onClose: () => {
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 300);
      },
    });
    
    // Submit on Enter
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        modalManager.close(modal);
        resolve(input.value);
      }
    });
  });
}

/**
 * ==================== LOADING MODAL ====================
 */

/**
 * Show loading modal
 * @param {string} message - Loading message
 * @returns {string} Modal ID
 */
function showLoadingModal(message = 'Loading...') {
  const content = `
    <div style="text-align: center; padding: 2rem;">
      <div class="loading-spinner"></div>
      <p style="margin-top: 1rem;">${message}</p>
    </div>
  `;
  
  const modal = createModal({
    id: 'loading-modal',
    title: '',
    content,
    closeButton: false,
    backdrop: false,
  });
  
  modalManager.open(modal, { autoFocus: false });
  
  return modal.id;
}

/**
 * Hide loading modal
 */
function hideLoadingModal() {
  modalManager.close('loading-modal');
  
  setTimeout(() => {
    const modal = document.getElementById('loading-modal');
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }, 300);
}

/**
 * ==================== INITIALIZATION ====================
 */

// Create global instance
const modalManager = new ModalManager();

// Add loading spinner styles if not present
if (!document.getElementById('loading-spinner-styles')) {
  const style = document.createElement('style');
  style.id = 'loading-spinner-styles';
  style.textContent = `
    .loading-spinner {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: var(--primary-color, #667eea);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    [data-theme="dark"] .loading-spinner {
      border-color: rgba(255, 255, 255, 0.1);
      border-left-color: var(--primary-color, #667eea);
    }
  `;
  document.head.appendChild(style);
}

// Log modals module loaded (only in debug mode)
if (DEBUG_CONFIG?.enabled) {
  console.log('[Modals] Modal module loaded');
}

/**
 * ==================== EXPORTS ====================
 */

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ModalManager = ModalManager;
  window.modalManager = modalManager;
  window.createModal = createModal;
  window.showConfirmDialog = showConfirmDialog;
  window.showAlertDialog = showAlertDialog;
  window.showPromptDialog = showPromptDialog;
  window.showLoadingModal = showLoadingModal;
  window.hideLoadingModal = hideLoadingModal;
}
