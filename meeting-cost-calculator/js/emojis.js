/* ==================== EMOJI ANIMATIONS ==================== */

/**
 * Create falling emoji animation
 */
function createFallingEmoji(numberOfPeople) {
  try {
    const container = document.getElementById('emojiContainer');
    if (!container) return;
    
    if (container.children.length >= MAX_EMOJIS) {
      return;
    }

    const count = Math.min(numberOfPeople, 5);
    
    for (let i = 0; i < count; i++) {
      const emoji = document.createElement('div');
      emoji.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      emoji.className = 'emoji';
      
      emoji.style.left = `${Math.random() * 100}vw`;
      
      const duration = Math.random() * 2 + 3;
      emoji.style.animationDuration = `${duration}s`;
      
      emoji.style.setProperty('--random-x', Math.random() - 0.5);
      
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
}

/**
 * Clear all emojis from screen
 */
function clearEmojis() {
  try {
    const container = document.getElementById('emojiContainer');
    if (container) {
      container.innerHTML = '';
    }
  } catch (error) {
    console.error('Error clearing emojis:', error);
  }
}
