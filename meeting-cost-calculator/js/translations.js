/**
 * ==================== TRANSLATIONS ====================
 * Multi-language support for the Meeting Cost Calculator
 * 
 * @file translations.js
 * @version 2.0.0
 */

/**
 * Translation strings for all supported languages
 */
const TRANSLATIONS = {
  de: {
    // App Title
    title: '💰 Meeting-Kostenrechner',
    
    // Actions
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    close: 'Schließen',
    copy: 'Kopieren',
    share: 'Teilen',
    
    // Labels
    participants: 'Teilnehmer',
    numberOfPeople: 'Anzahl der Teilnehmer',
    costPerPerson: 'Kosten pro Person (€/Std)',
    currency: 'Währung',
    totalCostLabel: 'Gesamtkosten:',
    settings: 'Einstellungen',
    language: 'Sprache',
    theme: 'Design',
    info: 'Info',
    
    // Actions with context
    addPerson: 'Person hinzufügen',
    removePerson: 'Person entfernen',
    selectLanguage: 'Sprache auswählen',
    selectCurrency: 'Währung auswählen',
    
    // History
    historyShow: '📊 Meeting-Historie anzeigen',
    historyHide: '📊 Meeting-Historie ausblenden',
    historyTitle: 'Teilnehmer-Änderungen:',
    historyEntry: '{people} Personen ab {time}',
    
    // Share
    shareSession: 'Session teilen',
    shareTitle: 'Session teilen',
    shareDescription: 'Teile deine Meeting-Kosten mit anderen:',
    shareUrl: 'Share-URL',
    copyLink: 'Link kopieren',
    linkCopied: 'Link in Zwischenablage kopiert!',
    email: 'E-Mail',
    
    // Info Modal
    infoText1: 'Dieser Rechner hilft dir, die Kosten deines Meetings in Echtzeit zu visualisieren.',
    infoText2: 'Gib die Anzahl der Teilnehmer und die durchschnittlichen Kosten pro Person und Stunde ein.',
    infoText3: 'Der Timer zeigt dir, wie viel das Meeting bereits gekostet hat.',
    proTip: 'Profi-Tipp',
    infoTip: 'Nutze Tastaturkürzel für schnellere Bedienung! Drücke Ctrl+? um alle Shortcuts zu sehen.',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Tastaturkürzel',
    keyboardShortcutsDescription: 'Nutze diese Tastenkombinationen für schnellere Bedienung:',
    keyboardShortcutsTip: 'Alle Shortcuts funktionieren auch während das Meeting läuft!',
    startPauseTimer: 'Timer starten/pausieren',
    resetTimer: 'Timer zurücksetzen',
    openInfo: 'Info öffnen',
    openShare: 'Teilen-Dialog öffnen',
    showShortcuts: 'Shortcuts anzeigen',
    closeModal: 'Dialog schließen',
    adjustParticipants: 'Teilnehmer anpassen',
    or: 'oder',
    
    // Notifications
    timerStarted: 'Timer gestartet!',
    timerPaused: 'Timer pausiert',
    timerReset: 'Timer zurückgesetzt',
    sessionShared: 'Session-Link kopiert!',
    errorOccurred: 'Ein Fehler ist aufgetreten',
    
    // Time formatting
    seconds: 'Sekunden',
    minutes: 'Minuten',
    hours: 'Stunden',
    
    // Validation
    invalidPeopleCount: 'Ungültige Teilnehmerzahl',
    invalidCost: 'Ungültiger Kostenwert',
    
    // PWA
    installApp: 'App installieren',
    offlineMode: 'Offline-Modus aktiv',
  },
  
  en: {
    // App Title
    title: '💰 Meeting Cost Calculator',
    
    // Actions
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    close: 'Close',
    copy: 'Copy',
    share: 'Share',
    
    // Labels
    participants: 'Participants',
    numberOfPeople: 'Number of participants',
    costPerPerson: 'Cost per person (€/hr)',
    currency: 'Currency',
    totalCostLabel: 'Total cost:',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    info: 'Info',
    
    // Actions with context
    addPerson: 'Add person',
    removePerson: 'Remove person',
    selectLanguage: 'Select language',
    selectCurrency: 'Select currency',
    
    // History
    historyShow: '📊 Show meeting history',
    historyHide: '📊 Hide meeting history',
    historyTitle: 'Participant changes:',
    historyEntry: '{people} people from {time}',
    
    // Share
    shareSession: 'Share session',
    shareTitle: 'Share session',
    shareDescription: 'Share your meeting costs with others:',
    shareUrl: 'Share URL',
    copyLink: 'Copy link',
    linkCopied: 'Link copied to clipboard!',
    email: 'Email',
    
    // Info Modal
    infoText1: 'This calculator helps you visualize the cost of your meeting in real-time.',
    infoText2: 'Enter the number of participants and the average cost per person per hour.',
    infoText3: 'The timer shows you how much the meeting has already cost.',
    proTip: 'Pro Tip',
    infoTip: 'Use keyboard shortcuts for faster operation! Press Ctrl+? to see all shortcuts.',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Keyboard shortcuts',
    keyboardShortcutsDescription: 'Use these key combinations for faster operation:',
    keyboardShortcutsTip: 'All shortcuts work even while the meeting is running!',
    startPauseTimer: 'Start/pause timer',
    resetTimer: 'Reset timer',
    openInfo: 'Open info',
    openShare: 'Open share dialog',
    showShortcuts: 'Show shortcuts',
    closeModal: 'Close dialog',
    adjustParticipants: 'Adjust participants',
    or: 'or',
    
    // Notifications
    timerStarted: 'Timer started!',
    timerPaused: 'Timer paused',
    timerReset: 'Timer reset',
    sessionShared: 'Session link copied!',
    errorOccurred: 'An error occurred',
    
    // Time formatting
    seconds: 'seconds',
    minutes: 'minutes',
    hours: 'hours',
    
    // Validation
    invalidPeopleCount: 'Invalid number of people',
    invalidCost: 'Invalid cost value',
    
    // PWA
    installApp: 'Install app',
    offlineMode: 'Offline mode active',
  },
  
  es: {
    // App Title
    title: '💰 Calculadora de Costos de Reunión',
    
    // Actions
    start: 'Iniciar',
    pause: 'Pausar',
    reset: 'Reiniciar',
    close: 'Cerrar',
    copy: 'Copiar',
    share: 'Compartir',
    
    // Labels
    participants: 'Participantes',
    numberOfPeople: 'Número de participantes',
    costPerPerson: 'Costo por persona (€/h)',
    currency: 'Moneda',
    totalCostLabel: 'Costo total:',
    settings: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    info: 'Info',
    
    // Actions with context
    addPerson: 'Añadir persona',
    removePerson: 'Eliminar persona',
    selectLanguage: 'Seleccionar idioma',
    selectCurrency: 'Seleccionar moneda',
    
    // History
    historyShow: '📊 Mostrar historial de reunión',
    historyHide: '📊 Ocultar historial de reunión',
    historyTitle: 'Cambios de participantes:',
    historyEntry: '{people} personas desde {time}',
    
    // Share
    shareSession: 'Compartir sesión',
    shareTitle: 'Compartir sesión',
    shareDescription: 'Comparte los costos de tu reunión con otros:',
    shareUrl: 'URL para compartir',
    copyLink: 'Copiar enlace',
    linkCopied: '¡Enlace copiado al portapapeles!',
    email: 'Correo',
    
    // Info Modal
    infoText1: 'Esta calculadora te ayuda a visualizar el costo de tu reunión en tiempo real.',
    infoText2: 'Ingresa el número de participantes y el costo promedio por persona por hora.',
    infoText3: 'El temporizador te muestra cuánto ha costado ya la reunión.',
    proTip: 'Consejo profesional',
    infoTip: '¡Usa atajos de teclado para una operación más rápida! Presiona Ctrl+? para ver todos los atajos.',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Atajos de teclado',
    keyboardShortcutsDescription: 'Usa estas combinaciones de teclas para una operación más rápida:',
    keyboardShortcutsTip: '¡Todos los atajos funcionan incluso mientras la reunión está en curso!',
    startPauseTimer: 'Iniciar/pausar temporizador',
    resetTimer: 'Reiniciar temporizador',
    openInfo: 'Abrir información',
    openShare: 'Abrir diálogo de compartir',
    showShortcuts: 'Mostrar atajos',
    closeModal: 'Cerrar diálogo',
    adjustParticipants: 'Ajustar participantes',
    or: 'o',
    
    // Notifications
    timerStarted: '¡Temporizador iniciado!',
    timerPaused: 'Temporizador pausado',
    timerReset: 'Temporizador reiniciado',
    sessionShared: '¡Enlace de sesión copiado!',
    errorOccurred: 'Ocurrió un error',
    
    // Time formatting
    seconds: 'segundos',
    minutes: 'minutos',
    hours: 'horas',
    
    // Validation
    invalidPeopleCount: 'Número de personas inválido',
    invalidCost: 'Valor de costo inválido',
    
    // PWA
    installApp: 'Instalar aplicación',
    offlineMode: 'Modo sin conexión activo',
  },
  
  fr: {
    // App Title
    title: '💰 Calculateur de Coût de Réunion',
    
    // Actions
    start: 'Démarrer',
    pause: 'Pause',
    reset: 'Réinitialiser',
    close: 'Fermer',
    copy: 'Copier',
    share: 'Partager',
    
    // Labels
    participants: 'Participants',
    numberOfPeople: 'Nombre de participants',
    costPerPerson: 'Coût par personne (€/h)',
    currency: 'Devise',
    totalCostLabel: 'Coût total:',
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    info: 'Info',
    
    // Actions with context
    addPerson: 'Ajouter une personne',
    removePerson: 'Retirer une personne',
    selectLanguage: 'Sélectionner la langue',
    selectCurrency: 'Sélectionner la devise',
    
    // History
    historyShow: '📊 Afficher l\'historique de la réunion',
    historyHide: '📊 Masquer l\'historique de la réunion',
    historyTitle: 'Changements de participants:',
    historyEntry: '{people} personnes depuis {time}',
    
    // Share
    shareSession: 'Partager la session',
    shareTitle: 'Partager la session',
    shareDescription: 'Partagez les coûts de votre réunion avec d\'autres:',
    shareUrl: 'URL de partage',
    copyLink: 'Copier le lien',
    linkCopied: 'Lien copié dans le presse-papiers!',
    email: 'E-mail',
    
    // Info Modal
    infoText1: 'Ce calculateur vous aide à visualiser le coût de votre réunion en temps réel.',
    infoText2: 'Entrez le nombre de participants et le coût moyen par personne par heure.',
    infoText3: 'Le minuteur vous montre combien la réunion a déjà coûté.',
    proTip: 'Astuce pro',
    infoTip: 'Utilisez les raccourcis clavier pour une utilisation plus rapide! Appuyez sur Ctrl+? pour voir tous les raccourcis.',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Raccourcis clavier',
    keyboardShortcutsDescription: 'Utilisez ces combinaisons de touches pour une utilisation plus rapide:',
    keyboardShortcutsTip: 'Tous les raccourcis fonctionnent même pendant que la réunion est en cours!',
    startPauseTimer: 'Démarrer/mettre en pause le minuteur',
    resetTimer: 'Réinitialiser le minuteur',
    openInfo: 'Ouvrir les informations',
    openShare: 'Ouvrir le dialogue de partage',
    showShortcuts: 'Afficher les raccourcis',
    closeModal: 'Fermer le dialogue',
    adjustParticipants: 'Ajuster les participants',
    or: 'ou',
    
    // Notifications
    timerStarted: 'Minuteur démarré!',
    timerPaused: 'Minuteur en pause',
    timerReset: 'Minuteur réinitialisé',
    sessionShared: 'Lien de session copié!',
    errorOccurred: 'Une erreur s\'est produite',
    
    // Time formatting
    seconds: 'secondes',
    minutes: 'minutes',
    hours: 'heures',
    
    // Validation
    invalidPeopleCount: 'Nombre de personnes invalide',
    invalidCost: 'Valeur de coût invalide',
    
    // PWA
    installApp: 'Installer l\'application',
    offlineMode: 'Mode hors ligne actif',
  },
  
  it: {
    // App Title
    title: '💰 Calcolatore Costi Riunione',
    
    // Actions
    start: 'Avvia',
    pause: 'Pausa',
    reset: 'Ripristina',
    close: 'Chiudi',
    copy: 'Copia',
    share: 'Condividi',
    
    // Labels
    participants: 'Partecipanti',
    numberOfPeople: 'Numero di partecipanti',
    costPerPerson: 'Costo per persona (€/h)',
    currency: 'Valuta',
    totalCostLabel: 'Costo totale:',
    settings: 'Impostazioni',
    language: 'Lingua',
    theme: 'Tema',
    info: 'Info',
    
    // Actions with context
    addPerson: 'Aggiungi persona',
    removePerson: 'Rimuovi persona',
    selectLanguage: 'Seleziona lingua',
    selectCurrency: 'Seleziona valuta',
    
    // History
    historyShow: '📊 Mostra cronologia riunione',
    historyHide: '📊 Nascondi cronologia riunione',
    historyTitle: 'Modifiche partecipanti:',
    historyEntry: '{people} persone da {time}',
    
    // Share
    shareSession: 'Condividi sessione',
    shareTitle: 'Condividi sessione',
    shareDescription: 'Condividi i costi della tua riunione con altri:',
    shareUrl: 'URL di condivisione',
    copyLink: 'Copia link',
    linkCopied: 'Link copiato negli appunti!',
    email: 'Email',
    
    // Info Modal
    infoText1: 'Questo calcolatore ti aiuta a visualizzare il costo della tua riunione in tempo reale.',
    infoText2: 'Inserisci il numero di partecipanti e il costo medio per persona all\'ora.',
    infoText3: 'Il timer ti mostra quanto è già costata la riunione.',
    proTip: 'Suggerimento professionale',
    infoTip: 'Usa le scorciatoie da tastiera per un\'operazione più veloce! Premi Ctrl+? per vedere tutte le scorciatoie.',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Scorciatoie da tastiera',
    keyboardShortcutsDescription: 'Usa queste combinazioni di tasti per un\'operazione più veloce:',
    keyboardShortcutsTip: 'Tutte le scorciatoie funzionano anche mentre la riunione è in corso!',
    startPauseTimer: 'Avvia/metti in pausa il timer',
    resetTimer: 'Ripristina timer',
    openInfo: 'Apri informazioni',
    openShare: 'Apri dialogo di condivisione',
    showShortcuts: 'Mostra scorciatoie',
    closeModal: 'Chiudi dialogo',
    adjustParticipants: 'Regola partecipanti',
    or: 'o',
    
    // Notifications
    timerStarted: 'Timer avviato!',
    timerPaused: 'Timer in pausa',
    timerReset: 'Timer ripristinato',
    sessionShared: 'Link di sessione copiato!',
    errorOccurred: 'Si è verificato un errore',
    
    // Time formatting
    seconds: 'secondi',
    minutes: 'minuti',
    hours: 'ore',
    
    // Validation
    invalidPeopleCount: 'Numero di persone non valido',
    invalidCost: 'Valore di costo non valido',
    
    // PWA
    installApp: 'Installa app',
    offlineMode: 'Modalità offline attiva',
  },
  
  pl: {
    // App Title
    title: '💰 Kalkulator Kosztów Spotkania',
    
    // Actions
    start: 'Start',
    pause: 'Pauza',
    reset: 'Reset',
    close: 'Zamknij',
    copy: 'Kopiuj',
    share: 'Udostępnij',
    
    // Labels
    participants: 'Uczestnicy',
    numberOfPeople: 'Liczba uczestników',
    costPerPerson: 'Koszt na osobę (€/godz)',
    currency: 'Waluta',
    totalCostLabel: 'Całkowity koszt:',
    settings: 'Ustawienia',
    language: 'Język',
    theme: 'Motyw',
    info: 'Info',
    
    // Actions with context
    addPerson: 'Dodaj osobę',
    removePerson: 'Usuń osobę',
    selectLanguage: 'Wybierz język',
    selectCurrency: 'Wybierz walutę',
    
    // History
    historyShow: '📊 Pokaż historię spotkania',
    historyHide: '📊 Ukryj historię spotkania',
    historyTitle: 'Zmiany uczestników:',
    historyEntry: '{people} osób od {time}',
    
    // Share
    shareSession: 'Udostępnij sesję',
    shareTitle: 'Udostępnij sesję',
    shareDescription: 'Udostępnij koszty swojego spotkania innym:',
    shareUrl: 'URL do udostępnienia',
    copyLink: 'Kopiuj link',
    linkCopied: 'Link skopiowany do schowka!',
    email: 'E-mail',
    
    // Info Modal
    infoText1: 'Ten kalkulator pomaga wizualizować koszt spotkania w czasie rzeczywistym.',
    infoText2: 'Wprowadź liczbę uczestników i średni koszt na osobę na godzinę.',
    infoText3: 'Timer pokazuje, ile spotkanie już kosztowało.',
    proTip: 'Profesjonalna wskazówka',
    infoTip: 'Użyj skrótów klawiszowych dla szybszej obsługi! Naciśnij Ctrl+?, aby zobaczyć wszystkie skróty.',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Skróty klawiszowe',
    keyboardShortcutsDescription: 'Użyj tych kombinacji klawiszy dla szybszej obsługi:',
    keyboardShortcutsTip: 'Wszystkie skróty działają nawet podczas trwania spotkania!',
    startPauseTimer: 'Uruchom/wstrzymaj timer',
    resetTimer: 'Zresetuj timer',
    openInfo: 'Otwórz informacje',
    openShare: 'Otwórz okno udostępniania',
    showShortcuts: 'Pokaż skróty',
    closeModal: 'Zamknij okno',
    adjustParticipants: 'Dostosuj uczestników',
    or: 'lub',
    
    // Notifications
    timerStarted: 'Timer uruchomiony!',
    timerPaused: 'Timer wstrzymany',
    timerReset: 'Timer zresetowany',
    sessionShared: 'Link sesji skopiowany!',
    errorOccurred: 'Wystąpił błąd',
    
    // Time formatting
    seconds: 'sekund',
    minutes: 'minut',
    hours: 'godzin',
    
    // Validation
    invalidPeopleCount: 'Nieprawidłowa liczba osób',
    invalidCost: 'Nieprawidłowa wartość kosztu',
    
    // PWA
    installApp: 'Zainstaluj aplikację',
    offlineMode: 'Tryb offline aktywny',
  },
};

/**
 * Get translation for current language
 * @param {string} key - Translation key
 * @param {string} lang - Language code (optional, uses current language if not provided)
 * @param {Object} replacements - Key-value pairs for string replacement
 * @returns {string} Translated string
 */
function getTranslation(key, lang = null, replacements = {}) {
  const currentLang = lang || APP_CONFIG.defaults.language;
  const translation = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;
  
  // Replace placeholders
  let result = translation;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`{${placeholder}}`, 'g'), value);
  }
  
  return result;
}

/**
 * Check if translation exists
 * @param {string} key - Translation key
 * @param {string} lang - Language code
 * @returns {boolean} Translation exists
 */
function hasTranslation(key, lang) {
  return TRANSLATIONS[lang]?.[key] !== undefined;
}

/**
 * Get all translations for a language
 * @param {string} lang - Language code
 * @returns {Object} All translations
 */
function getAllTranslations(lang) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

// Freeze translations to prevent modifications
Object.freeze(TRANSLATIONS);

// Log available languages (only in debug mode)
if (DEBUG_CONFIG?.enabled) {
  console.log('[Translations] Available languages:', Object.keys(TRANSLATIONS));
}
