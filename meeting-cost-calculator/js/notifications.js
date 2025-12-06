/* ==================== NOTIFICATION SYSTEM ==================== */

/**
 * Show notification to user
 */
function showNotification(message, type, callback) {
  try {
    const bgColors = {
      join: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      leave: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    const notification = {
      visible: true,
      message: message,
      class: bgColors[type] || bgColors.info
    };
    
    if (callback) callback(notification);
    
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
}

/**
 * Check and show fun notifications based on time and cost
 */
function checkFunNotifications(elapsedTime, totalCost, shownTimeNotifications, shownCostNotifications, language, callback) {
  try {
    FUN_NOTIFICATIONS.time.forEach(notification => {
      if (elapsedTime >= notification.seconds && 
          !shownTimeNotifications.has(notification.seconds)) {
        shownTimeNotifications.add(notification.seconds);
        const message = notification.message[language] || notification.message['en'];
        if (callback) callback(message, 'info');
      }
    });

    FUN_NOTIFICATIONS.cost.forEach(notification => {
      if (totalCost >= notification.amount && 
          !shownCostNotifications.has(notification.amount)) {
        shownCostNotifications.add(notification.amount);
        const message = notification.message[language] || notification.message['en'];
        if (callback) callback(message, 'info');
      }
    });
  } catch (error) {
    console.error('Error checking fun notifications:', error);
  }
}
