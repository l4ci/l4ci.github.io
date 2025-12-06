/* ==================== MODAL MANAGEMENT ==================== */

/**
 * Modal Manager Class
 */
class ModalManager {
  constructor() {
    this.openModals = new Set();
  }

  open(modalName) {
    this.openModals.add(modalName);
    document.body.style.overflow = 'hidden';
  }

  close(modalName) {
    this.openModals.delete(modalName);
    if (this.openModals.size === 0) {
      document.body.style.overflow = '';
    }
  }

  closeAll() {
    this.openModals.clear();
    document.body.style.overflow = '';
  }

  isOpen(modalName) {
    return this.openModals.has(modalName);
  }

  hasOpenModals() {
    return this.openModals.size > 0;
  }
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text, onSuccess, onError) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      if (onSuccess) onSuccess();
    } else {
      fallbackCopyToClipboard(text, onSuccess, onError);
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    fallbackCopyToClipboard(text, onSuccess, onError);
  }
}

/**
 * Fallback method to copy text to clipboard
 */
function fallbackCopyToClipboard(text, onSuccess, onError) {
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
    
    if (successful && onSuccess) {
      onSuccess();
    } else if (!successful && onError) {
      onError();
    }
  } catch (error) {
    console.error('Fallback copy failed:', error);
    if (onError) onError();
  }
}

/**
 * Share via email
 */
function shareViaEmail(shareUrl, translations, elapsedTime, totalCost) {
  try {
    const subject = encodeURIComponent(translations.shareEmailSubject);
    const body = encodeURIComponent(
      `${translations.shareEmailBody}\n\n${shareUrl}\n\n` +
      `${translations.elapsedTime}: ${elapsedTime}\n` +
      `${translations.totalCostLabel} ${totalCost}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  } catch (error) {
    console.error('Error sharing via email:', error);
  }
}

/**
 * Share via WhatsApp
 */
function shareViaWhatsApp(shareUrl, translations, elapsedTime, totalCost) {
  try {
    const text = encodeURIComponent(
      `${translations.shareWhatsAppText}\n${shareUrl}\n\n` +
      `⏱️ ${elapsedTime}\n💰 ${totalCost}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  } catch (error) {
    console.error('Error sharing via WhatsApp:', error);
  }
}

/**
 * Share via Slack
 */
function shareViaSlack(shareUrl, translations, elapsedTime, totalCost) {
  try {
    const text = encodeURIComponent(
      `${translations.shareSlackText}\n${shareUrl}\n\n` +
      `⏱️ ${elapsedTime}\n💰 ${totalCost}`
    );
    window.open(`https://slack.com/intl/en-de/help/articles/201330256-Add-links-to-your-messages?text=${text}`, '_blank');
  } catch (error) {
    console.error('Error sharing via Slack:', error);
  }
}

/**
 * Share via native share API
 */
async function shareViaNative(shareUrl, translations, elapsedTime, totalCost) {
  if (!navigator.share) {
    console.warn('Native share not supported');
    return;
  }
  
  try {
    await navigator.share({
      title: translations.title,
      text: `${translations.shareWhatsAppText}\n⏱️ ${elapsedTime}\n💰 ${totalCost}`,
      url: shareUrl
    });
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
  }
}
