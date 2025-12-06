// Currency Configuration
const CURRENCY_CONFIG = {
  'EUR': { symbol: '€', decimals: 2, position: 'suffix', separator: ',', thousandsSep: '.' },
  'USD': { symbol: '$', decimals: 2, position: 'prefix', separator: '.', thousandsSep: ',' },
  'GBP': { symbol: '£', decimals: 2, position: 'prefix', separator: '.', thousandsSep: ',' },
  'CHF': { symbol: 'CHF', decimals: 2, position: 'suffix', separator: '.', thousandsSep: "'" },
  'JPY': { symbol: '¥', decimals: 0, position: 'prefix', separator: '', thousandsSep: ',' },
  'CNY': { symbol: '¥', decimals: 2, position: 'prefix', separator: '.', thousandsSep: ',' },
  'INR': { symbol: '₹', decimals: 2, position: 'prefix', separator: '.', thousandsSep: ',' },
  'AUD': { symbol: 'A$', decimals: 2, position: 'prefix', separator: '.', thousandsSep: ',' },
  'CAD': { symbol: 'C$', decimals: 2, position: 'prefix', separator: '.', thousandsSep: ',' },
  'BRL': { symbol: 'R$', decimals: 2, position: 'prefix', separator: ',', thousandsSep: '.' }
};

// Language to Currency Mapping
const LANGUAGE_CURRENCY_MAP = {
  'de': 'EUR',
  'de-DE': 'EUR',
  'de-AT': 'EUR',
  'de-CH': 'CHF',
  'en': 'USD',
  'en-US': 'USD',
  'en-GB': 'GBP',
  'en-AU': 'AUD',
  'en-CA': 'CAD',
  'en-IN': 'INR',
  'es': 'EUR',
  'es-ES': 'EUR',
  'es-MX': 'USD',
  'fr': 'EUR',
  'fr-FR': 'EUR',
  'fr-CH': 'CHF',
  'fr-CA': 'CAD',
  'it': 'EUR',
  'it-IT': 'EUR',
  'it-CH': 'CHF',
  'pl': 'EUR',
  'pl-PL': 'EUR',
  'pt': 'EUR',
  'pt-BR': 'BRL',
  'ja': 'JPY',
  'ja-JP': 'JPY',
  'zh': 'CNY',
  'zh-CN': 'CNY'
};

// Language Flags
const LANGUAGE_FLAGS = {
  'de': '🇩🇪',
  'en': '🇬🇧',
  'es': '🇪🇸',
  'fr': '🇫🇷',
  'it': '🇮🇹',
  'pl': '🇵🇱'
};

// Emoji Configuration
const EMOJIS = ['💵', '💰', '🪙', '💸', '💶', '💷', '💴'];
const MAX_EMOJIS = 50;
const STORAGE_KEY = 'meetingCostCalculator';

// Fun Notifications Configuration
const FUN_NOTIFICATIONS = {
  time: [
    { seconds: 300, message: { de: '⏰ 5 Minuten! Zeit für eine Entscheidung?', en: '⏰ 5 minutes! Time for a decision?', es: '⏰ ¡5 minutos! ¿Hora de decidir?', fr: '⏰ 5 minutes! Temps de décider?', it: '⏰ 5 minuti! Tempo di decidere?', pl: '⏰ 5 minut! Czas na decyzję?' } },
    { seconds: 900, message: { de: '😅 15 Minuten... Das hätte eine E-Mail sein können!', en: '😅 15 minutes... This could have been an email!', es: '😅 15 minutos... ¡Esto podría haber sido un email!', fr: '😅 15 minutes... Cela aurait pu être un email!', it: '😅 15 minuti... Poteva essere un\'email!', pl: '😅 15 minut... To mogło być emailem!' } },
    { seconds: 1800, message: { de: '🤯 30 Minuten! Habt ihr schon Ergebnisse?', en: '🤯 30 minutes! Any results yet?', es: '🤯 ¡30 minutos! ¿Algún resultado?', fr: '🤯 30 minutes! Des résultats?', it: '🤯 30 minuti! Qualche risultato?', pl: '🤯 30 minut! Jakieś wyniki?' } },
    { seconds: 2700, message: { de: '😴 45 Minuten... Kaffee-Pause nötig?', en: '😴 45 minutes... Coffee break needed?', es: '😴 45 minutos... ¿Pausa para café?', fr: '😴 45 minutes... Pause café nécessaire?', it: '😴 45 minuti... Pausa caffè?', pl: '😴 45 minut... Przerwa na kawę?' } },
    { seconds: 3600, message: { de: '🎉 1 Stunde! Das ist Ausdauer! 💪', en: '🎉 1 hour! That\'s dedication! 💪', es: '🎉 ¡1 hora! ¡Eso es dedicación! 💪', fr: '🎉 1 heure! C\'est de la détermination! 💪', it: '🎉 1 ora! Questa è dedizione! 💪', pl: '🎉 1 godzina! To jest zaangażowanie! 💪' } },
    { seconds: 5400, message: { de: '🚨 90 Minuten! Olympisches Meeting! 🏅', en: '🚨 90 minutes! Olympic meeting! 🏅', es: '🚨 ¡90 minutos! ¡Reunión olímpica! 🏅', fr: '🚨 90 minutes! Réunion olympique! 🏅', it: '🚨 90 minuti! Riunione olimpica! 🏅', pl: '🚨 90 minut! Olimpijskie spotkanie! 🏅' } },
    { seconds: 7200, message: { de: '🎬 2 Stunden! Das ist länger als die meisten Filme! 🍿', en: '🎬 2 hours! Longer than most movies! 🍿', es: '🎬 ¡2 horas! ¡Más largo que la mayoría de películas! 🍿', fr: '🎬 2 heures! Plus long que la plupart des films! 🍿', it: '🎬 2 ore! Più lungo della maggior parte dei film! 🍿', pl: '🎬 2 godziny! Dłużej niż większość filmów! 🍿' } }
  ],
  cost: [
    { amount: 50, message: { de: '💸 50€! Ein schönes Abendessen wäre das gewesen!', en: '💸 $50! That would have been a nice dinner!', es: '💸 ¡50€! ¡Eso habría sido una buena cena!', fr: '💸 50€! Cela aurait été un bon dîner!', it: '💸 50€! Sarebbe stata una bella cena!', pl: '💸 50€! To byłby niezły obiad!' } },
    { amount: 100, message: { de: '🎮 100€! Eine neue Konsole wäre cooler gewesen!', en: '🎮 $100! A new game console would have been cooler!', es: '🎮 ¡100€! ¡Una nueva consola habría sido mejor!', fr: '🎮 100€! Une nouvelle console aurait été plus cool!', it: '🎮 100€! Una nuova console sarebbe stata più figa!', pl: '🎮 100€! Nowa konsola byłaby fajniejsza!' } },
    { amount: 250, message: { de: '✈️ 250€! Fast ein Flug nach Barcelona!', en: '✈️ $250! Almost a flight to Barcelona!', es: '✈️ ¡250€! ¡Casi un vuelo a Barcelona!', fr: '✈️ 250€! Presque un vol pour Barcelone!', it: '✈️ 250€! Quasi un volo per Barcellona!', pl: '✈️ 250€! Prawie lot do Barcelony!' } },
    { amount: 500, message: { de: '🏖️ 500€! Ein Wochenendtrip wäre schöner!', en: '🏖️ $500! A weekend trip would be nicer!', es: '🏖️ ¡500€! ¡Un viaje de fin de semana sería mejor!', fr: '🏖️ 500€! Un weekend serait plus agréable!', it: '🏖️ 500€! Un weekend sarebbe più bello!', pl: '🏖️ 500€! Wypad na weekend byłby fajniejszy!' } },
    { amount: 1000, message: { de: '🤑 1000€! Jetzt wird\'s ernst! Das ist echtes Geld!', en: '🤑 $1000! Now it\'s getting serious! That\'s real money!', es: '🤑 ¡1000€! ¡Ahora se pone serio! ¡Eso es dinero real!', fr: '🤑 1000€! Maintenant ça devient sérieux! C\'est de l\'argent réel!', it: '🤑 1000€! Ora diventa serio! Sono soldi veri!', pl: '🤑 1000€! Teraz robi się poważnie! To prawdziwe pieniądze!' } },
    { amount: 2000, message: { de: '💎 2000€! Ein gebrauchtes Auto! 🚗', en: '💎 $2000! A used car! 🚗', es: '💎 ¡2000€! ¡Un coche usado! 🚗', fr: '💎 2000€! Une voiture d\'occasion! 🚗', it: '💎 2000€! Un\'auto usata! 🚗', pl: '💎 2000€! Używany samochód! 🚗' } },
    { amount: 5000, message: { de: '🏆 5000€! LEGENDÄR! Das Meeting geht in die Geschichte ein! 📚', en: '🏆 $5000! LEGENDARY! This meeting goes down in history! 📚', es: '🏆 ¡5000€! ¡LEGENDARIO! ¡Esta reunión pasa a la historia! 📚', fr: '🏆 5000€! LÉGENDAIRE! Cette réunion entre dans l\'histoire! 📚', it: '🏆 5000€! LEGGENDARIO! Questa riunione entra nella storia! 📚', pl: '🏆 5000€! LEGENDARNIE! To spotkanie przejdzie do historii! 📚' } }
  ]
};

// Helper function to detect currency from browser language
function detectCurrencyFromLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  
  // Try exact match first
  if (LANGUAGE_CURRENCY_MAP[browserLang]) {
    return LANGUAGE_CURRENCY_MAP[browserLang];
  }
  
  // Try language code without region
  const langCode = browserLang.split('-')[0];
  if (LANGUAGE_CURRENCY_MAP[langCode]) {
    return LANGUAGE_CURRENCY_MAP[langCode];
  }
  
  // Default to EUR
  return 'EUR';
}

// Helper function to detect language from browser
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0];
  
  // Check if we support this language
  const supportedLanguages = ['de', 'en', 'es', 'fr', 'it', 'pl'];
  if (supportedLanguages.includes(langCode)) {
    return langCode;
  }
  
  // Default to English
  return 'en';
}
