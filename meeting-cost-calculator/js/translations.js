/**
 * ==================== TRANSLATIONS ====================
 * Multi-language support for the application
 * 
 * @file translations.js
 * @version 2.0.0
 */

/**
 * Translation strings for all supported languages
 */
const TRANSLATIONS = {
  de: {
    // App
    title: '💰 Meeting-Kostenrechner',
    
    // Timer
    elapsedTime: 'Vergangene Zeit',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    
    // Cost
    totalCostLabel: 'Gesamtkosten',
    costPerPerson: 'Kosten pro Person (€/Std)',
    
    // People
    participants: 'Teilnehmer',
    numberOfPeople: 'Anzahl Teilnehmer',
    participantJoined: '👤 Teilnehmer beigetreten',
    participantLeft: '👋 Teilnehmer hat das Meeting verlassen',
    participantsChanged: '👥 Teilnehmerzahl geändert: {count}',
    nowParticipants: 'Jetzt {count} Teilnehmer',
    
    // Settings
    currency: 'Währung',
    language: 'Sprache',
    theme: 'Design',
    
    // History
    historyShow: '📊 Meeting-Historie anzeigen',
    historyHide: '📊 Meeting-Historie ausblenden',
    
    // Modals
    info: 'Info',
    close: 'Schließen',
    
    // Info Modal
    infoText1: 'Dieser Rechner hilft dir, die Kosten deines Meetings in Echtzeit zu visualisieren.',
    infoText2: 'Gib die Anzahl der Teilnehmer und die durchschnittlichen Kosten pro Person und Stunde ein.',
    infoText3: 'Der Timer zeigt dir, wie viel das Meeting bereits gekostet hat.',
    proTip: 'Profi-Tipp:',
    infoTip: 'Nutze Tastaturkürzel für schnellere Bedienung! Drücke Ctrl+? um alle Shortcuts zu sehen.',
    
    // Share
    shareSession: 'Session teilen',
    shareTitle: 'Session teilen',
    shareDescription: 'Teile deine Meeting-Kosten mit anderen:',
    copy: 'Kopieren',
    share: 'Teilen',
    email: 'E-Mail',
    linkCopied: '✅ Link kopiert!',
    sessionShared: '✅ Session geteilt',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Tastaturkürzel',
    keyboardShortcutsDescription: 'Nutze diese Tastenkombinationen für schnellere Bedienung:',
    startPauseTimer: 'Timer starten/pausieren',
    resetTimer: 'Timer zurücksetzen',
    adjustParticipants: 'Teilnehmer anpassen',
    openInfo: 'Info öffnen',
    openShare: 'Teilen-Dialog öffnen',
    showShortcuts: 'Shortcuts anzeigen',
    closeModal: 'Dialog schließen',
    keyboardShortcutsTip: 'Alle Shortcuts funktionieren auch während das Meeting läuft!',
    or: 'oder',
    
    // Notifications
    timerStarted: '▶️ Timer gestartet',
    timerPaused: '⏸️ Timer pausiert',
    timerReset: '🔄 Timer zurückgesetzt',
    errorOccurred: '❌ Ein Fehler ist aufgetreten',
  },
  
  en: {
    // App
    title: '💰 Meeting Cost Calculator',
    
    // Timer
    elapsedTime: 'Elapsed Time',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    
    // Cost
    totalCostLabel: 'Total Cost',
    costPerPerson: 'Cost per Person (€/hr)',
    
    // People
    participants: 'Participants',
    numberOfPeople: 'Number of Participants',
    participantJoined: '👤 Participant joined',
    participantLeft: '👋 Participant left the meeting',
    participantsChanged: '👥 Participant count changed: {count}',
    nowParticipants: 'Now {count} participants',
    
    // Settings
    currency: 'Currency',
    language: 'Language',
    theme: 'Theme',
    
    // History
    historyShow: '📊 Show Meeting History',
    historyHide: '📊 Hide Meeting History',
    
    // Modals
    info: 'Info',
    close: 'Close',
    
    // Info Modal
    infoText1: 'This calculator helps you visualize the cost of your meeting in real-time.',
    infoText2: 'Enter the number of participants and the average cost per person per hour.',
    infoText3: 'The timer shows you how much the meeting has cost so far.',
    proTip: 'Pro Tip:',
    infoTip: 'Use keyboard shortcuts for faster operation! Press Ctrl+? to see all shortcuts.',
    
    // Share
    shareSession: 'Share Session',
    shareTitle: 'Share Session',
    shareDescription: 'Share your meeting costs with others:',
    copy: 'Copy',
    share: 'Share',
    email: 'Email',
    linkCopied: '✅ Link copied!',
    sessionShared: '✅ Session shared',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Keyboard Shortcuts',
    keyboardShortcutsDescription: 'Use these keyboard combinations for faster operation:',
    startPauseTimer: 'Start/pause timer',
    resetTimer: 'Reset timer',
    adjustParticipants: 'Adjust participants',
    openInfo: 'Open info',
    openShare: 'Open share dialog',
    showShortcuts: 'Show shortcuts',
    closeModal: 'Close dialog',
    keyboardShortcutsTip: 'All shortcuts work even while the meeting is running!',
    or: 'or',
    
    // Notifications
    timerStarted: '▶️ Timer started',
    timerPaused: '⏸️ Timer paused',
    timerReset: '🔄 Timer reset',
    errorOccurred: '❌ An error occurred',
  },
  
  es: {
    // App
    title: '💰 Calculadora de Costos de Reunión',
    
    // Timer
    elapsedTime: 'Tiempo Transcurrido',
    start: 'Iniciar',
    pause: 'Pausar',
    reset: 'Reiniciar',
    
    // Cost
    totalCostLabel: 'Costo Total',
    costPerPerson: 'Costo por Persona (€/h)',
    
    // People
    participants: 'Participantes',
    numberOfPeople: 'Número de Participantes',
    participantJoined: '👤 Participante se unió',
    participantLeft: '👋 Participante dejó la reunión',
    participantsChanged: '👥 Número de participantes cambió: {count}',
    nowParticipants: 'Ahora {count} participantes',
    
    // Settings
    currency: 'Moneda',
    language: 'Idioma',
    theme: 'Tema',
    
    // History
    historyShow: '📊 Mostrar Historial',
    historyHide: '📊 Ocultar Historial',
    
    // Modals
    info: 'Info',
    close: 'Cerrar',
    
    // Info Modal
    infoText1: 'Esta calculadora te ayuda a visualizar el costo de tu reunión en tiempo real.',
    infoText2: 'Ingresa el número de participantes y el costo promedio por persona por hora.',
    infoText3: 'El temporizador te muestra cuánto ha costado la reunión hasta ahora.',
    proTip: 'Consejo:',
    infoTip: '¡Usa atajos de teclado para una operación más rápida! Presiona Ctrl+? para ver todos los atajos.',
    
    // Share
    shareSession: 'Compartir Sesión',
    shareTitle: 'Compartir Sesión',
    shareDescription: 'Comparte los costos de tu reunión con otros:',
    copy: 'Copiar',
    share: 'Compartir',
    email: 'Email',
    linkCopied: '✅ ¡Enlace copiado!',
    sessionShared: '✅ Sesión compartida',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Atajos de Teclado',
    keyboardShortcutsDescription: 'Usa estas combinaciones de teclado para una operación más rápida:',
    startPauseTimer: 'Iniciar/pausar temporizador',
    resetTimer: 'Reiniciar temporizador',
    adjustParticipants: 'Ajustar participantes',
    openInfo: 'Abrir info',
    openShare: 'Abrir diálogo de compartir',
    showShortcuts: 'Mostrar atajos',
    closeModal: 'Cerrar diálogo',
    keyboardShortcutsTip: '¡Todos los atajos funcionan incluso mientras la reunión está en curso!',
    or: 'o',
    
    // Notifications
    timerStarted: '▶️ Temporizador iniciado',
    timerPaused: '⏸️ Temporizador pausado',
    timerReset: '🔄 Temporizador reiniciado',
    errorOccurred: '❌ Ocurrió un error',
  },
  
  fr: {
    // App
    title: '💰 Calculateur de Coût de Réunion',
    
    // Timer
    elapsedTime: 'Temps Écoulé',
    start: 'Démarrer',
    pause: 'Pause',
    reset: 'Réinitialiser',
    
    // Cost
    totalCostLabel: 'Coût Total',
    costPerPerson: 'Coût par Personne (€/h)',
    
    // People
    participants: 'Participants',
    numberOfPeople: 'Nombre de Participants',
    participantJoined: '👤 Participant rejoint',
    participantLeft: '👋 Participant a quitté la réunion',
    participantsChanged: '👥 Nombre de participants changé: {count}',
    nowParticipants: 'Maintenant {count} participants',
    
    // Settings
    currency: 'Devise',
    language: 'Langue',
    theme: 'Thème',
    
    // History
    historyShow: '📊 Afficher l\'Historique',
    historyHide: '📊 Masquer l\'Historique',
    
    // Modals
    info: 'Info',
    close: 'Fermer',
    
    // Info Modal
    infoText1: 'Ce calculateur vous aide à visualiser le coût de votre réunion en temps réel.',
    infoText2: 'Entrez le nombre de participants et le coût moyen par personne et par heure.',
    infoText3: 'Le minuteur vous montre combien la réunion a coûté jusqu\'à présent.',
    proTip: 'Conseil Pro:',
    infoTip: 'Utilisez les raccourcis clavier pour une utilisation plus rapide! Appuyez sur Ctrl+? pour voir tous les raccourcis.',
    
    // Share
    shareSession: 'Partager la Session',
    shareTitle: 'Partager la Session',
    shareDescription: 'Partagez les coûts de votre réunion avec d\'autres:',
    copy: 'Copier',
    share: 'Partager',
    email: 'Email',
    linkCopied: '✅ Lien copié!',
    sessionShared: '✅ Session partagée',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Raccourcis Clavier',
    keyboardShortcutsDescription: 'Utilisez ces combinaisons de touches pour une utilisation plus rapide:',
    startPauseTimer: 'Démarrer/mettre en pause le minuteur',
    resetTimer: 'Réinitialiser le minuteur',
    adjustParticipants: 'Ajuster les participants',
    openInfo: 'Ouvrir info',
    openShare: 'Ouvrir dialogue de partage',
    showShortcuts: 'Afficher les raccourcis',
    closeModal: 'Fermer le dialogue',
    keyboardShortcutsTip: 'Tous les raccourcis fonctionnent même pendant que la réunion est en cours!',
    or: 'ou',
    
    // Notifications
    timerStarted: '▶️ Minuteur démarré',
    timerPaused: '⏸️ Minuteur en pause',
    timerReset: '🔄 Minuteur réinitialisé',
    errorOccurred: '❌ Une erreur s\'est produite',
  },
  
  it: {
    // App
    title: '💰 Calcolatore Costi Riunione',
    
    // Timer
    elapsedTime: 'Tempo Trascorso',
    start: 'Avvia',
    pause: 'Pausa',
    reset: 'Reset',
    
    // Cost
    totalCostLabel: 'Costo Totale',
    costPerPerson: 'Costo per Persona (€/h)',
    
    // People
    participants: 'Partecipanti',
    numberOfPeople: 'Numero di Partecipanti',
    participantJoined: '👤 Partecipante entrato',
    participantLeft: '👋 Partecipante ha lasciato la riunione',
    participantsChanged: '👥 Numero di partecipanti cambiato: {count}',
    nowParticipants: 'Ora {count} partecipanti',
    
    // Settings
    currency: 'Valuta',
    language: 'Lingua',
    theme: 'Tema',
    
    // History
    historyShow: '📊 Mostra Cronologia',
    historyHide: '📊 Nascondi Cronologia',
    
    // Modals
    info: 'Info',
    close: 'Chiudi',
    
    // Info Modal
    infoText1: 'Questo calcolatore ti aiuta a visualizzare il costo della tua riunione in tempo reale.',
    infoText2: 'Inserisci il numero di partecipanti e il costo medio per persona all\'ora.',
    infoText3: 'Il timer ti mostra quanto è costata finora la riunione.',
    proTip: 'Suggerimento:',
    infoTip: 'Usa le scorciatoie da tastiera per un\'operazione più veloce! Premi Ctrl+? per vedere tutte le scorciatoie.',
    
    // Share
    shareSession: 'Condividi Sessione',
    shareTitle: 'Condividi Sessione',
    shareDescription: 'Condividi i costi della tua riunione con altri:',
    copy: 'Copia',
    share: 'Condividi',
    email: 'Email',
    linkCopied: '✅ Link copiato!',
    sessionShared: '✅ Sessione condivisa',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Scorciatoie da Tastiera',
    keyboardShortcutsDescription: 'Usa queste combinazioni di tasti per un\'operazione più veloce:',
    startPauseTimer: 'Avvia/metti in pausa il timer',
    resetTimer: 'Resetta il timer',
    adjustParticipants: 'Regola i partecipanti',
    openInfo: 'Apri info',
    openShare: 'Apri dialogo di condivisione',
    showShortcuts: 'Mostra scorciatoie',
    closeModal: 'Chiudi dialogo',
    keyboardShortcutsTip: 'Tutte le scorciatoie funzionano anche mentre la riunione è in corso!',
    or: 'o',
    
    // Notifications
    timerStarted: '▶️ Timer avviato',
    timerPaused: '⏸️ Timer in pausa',
    timerReset: '🔄 Timer resettato',
    errorOccurred: '❌ Si è verificato un errore',
  },
  
  pl: {
    // App
    title: '💰 Kalkulator Kosztów Spotkania',
    
    // Timer
    elapsedTime: 'Upłynął Czas',
    start: 'Start',
    pause: 'Pauza',
    reset: 'Reset',
    
    // Cost
    totalCostLabel: 'Całkowity Koszt',
    costPerPerson: 'Koszt na Osobę (€/h)',
    
    // People
    participants: 'Uczestnicy',
    numberOfPeople: 'Liczba Uczestników',
    participantJoined: '👤 Uczestnik dołączył',
    participantLeft: '👋 Uczestnik opuścił spotkanie',
    participantsChanged: '👥 Liczba uczestników zmieniła się: {count}',
    nowParticipants: 'Teraz {count} uczestników',
    
    // Settings
    currency: 'Waluta',
    language: 'Język',
    theme: 'Motyw',
    
    // History
    historyShow: '📊 Pokaż Historię',
    historyHide: '📊 Ukryj Historię',
    
    // Modals
    info: 'Info',
    close: 'Zamknij',
    
    // Info Modal
    infoText1: 'Ten kalkulator pomaga wizualizować koszt spotkania w czasie rzeczywistym.',
    infoText2: 'Wprowadź liczbę uczestników i średni koszt na osobę na godzinę.',
    infoText3: 'Timer pokazuje, ile kosztowało spotkanie do tej pory.',
    proTip: 'Wskazówka:',
    infoTip: 'Użyj skrótów klawiszowych dla szybszej obsługi! Naciśnij Ctrl+? aby zobaczyć wszystkie skróty.',
    
    // Share
    shareSession: 'Udostępnij Sesję',
    shareTitle: 'Udostępnij Sesję',
    shareDescription: 'Udostępnij koszty spotkania innym:',
    copy: 'Kopiuj',
    share: 'Udostępnij',
    email: 'Email',
    linkCopied: '✅ Link skopiowany!',
    sessionShared: '✅ Sesja udostępniona',
    
    // Keyboard Shortcuts
    keyboardShortcuts: 'Skróty Klawiszowe',
    keyboardShortcutsDescription: 'Użyj tych kombinacji klawiszy dla szybszej obsługi:',
    startPauseTimer: 'Uruchom/wstrzymaj timer',
    resetTimer: 'Zresetuj timer',
    adjustParticipants: 'Dostosuj uczestników',
    openInfo: 'Otwórz info',
    openShare: 'Otwórz okno udostępniania',
    showShortcuts: 'Pokaż skróty',
    closeModal: 'Zamknij okno',
    keyboardShortcutsTip: 'Wszystkie skróty działają nawet podczas trwania spotkania!',
    or: 'lub',
    
    // Notifications
    timerStarted: '▶️ Timer uruchomiony',
    timerPaused: '⏸️ Timer wstrzymany',
    timerReset: '🔄 Timer zresetowany',
    errorOccurred: '❌ Wystąpił błąd',
  },
};

/**
 * Get translation for key
 * @param {string} key - Translation key
 * @param {string} language - Language code
 * @param {Object} replacements - Values to replace in translation
 * @returns {string} Translated text
 */
function getTranslation(key, language = 'de', replacements = {}) {
  const lang = TRANSLATIONS[language] || TRANSLATIONS['de'];
  let text = lang[key] || TRANSLATIONS['de'][key] || key;
  
  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  
  return text;
}

// Log translations loaded
console.log('[Translations] Translations loaded - ' + Object.keys(TRANSLATIONS).length + ' languages');
