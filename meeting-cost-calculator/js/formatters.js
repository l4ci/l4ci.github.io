/* ==================== FORMATTING FUNCTIONS ==================== */

/**
 * Format elapsed time (compact format for title)
 */
function formatElapsedTime(seconds) {
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
}

/**
 * Format elapsed time (verbose format for display)
 */
function formatElapsedTimeVerbose(seconds, translations) {
  try {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const hourText = hours === 1 ? translations.hour : translations.hours;
      const minuteText = minutes === 1 ? translations.minute : translations.minutes;
      return `${hours} ${hourText} ${minutes} ${minuteText}`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const minuteText = minutes === 1 ? translations.minute : translations.minutes;
      const secondText = remainingSeconds === 1 ? translations.second : translations.seconds;
      return `${minutes} ${minuteText} ${remainingSeconds} ${secondText}`;
    }
    const secondText = seconds === 1 ? translations.second : translations.seconds;
    return `${seconds} ${secondText}`;
  } catch (error) {
    console.error('Error formatting verbose time:', error);
    return '0 ' + translations.seconds;
  }
}

/**
 * Format currency amount
 */
function formatCurrency(amount, currencyCode) {
  try {
    const config = CURRENCY_CONFIG[currencyCode];
    if (!config) {
      console.warn(`Currency config not found for: ${currencyCode}`);
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
    
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
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

/**
 * Format history entry for display
 */
function formatHistoryEntry(segment, index, translations) {
  try {
    const personText = segment.numberOfPeople === 1 ? translations.person : translations.persons;
    
    if (index === 0) {
      return `${translations.start_history} ${segment.numberOfPeople} ${personText}`;
    }
    
    const timeFormatted = formatElapsedTimeVerbose(segment.startTime, translations);
    return `${timeFormatted}: ${segment.numberOfPeople} ${personText}`;
  } catch (error) {
    console.error('Error formatting history entry:', error);
    return `${segment.numberOfPeople} ${translations.persons}`;
  }
}
