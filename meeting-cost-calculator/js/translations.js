/* ==================== TRANSLATIONS ==================== */

/**
 * Multi-language translations for the Meeting Cost Calculator
 * Supports: German (de), English (en), Spanish (es), French (fr), Italian (it), Polish (pl)
 */

const TRANSLATIONS = {
  de: {
    // Main UI
    title: '💰 Meeting-Kostenrechner',
    totalCostLabel: 'Gesamtkosten:',
    start: '▶️ Start',
    pause: '⏸️ Pause',
    reset: '🔄 Reset',
    participants: '👥 Teilnehmer:',
    
    // Settings
    settingsShow: '⚙️ Einstellungen anzeigen',
    settingsHide: '⚙️ Einstellungen ausblenden',
    costPerPerson: '💶 Kosten pro Person/h:',
    currency: '🌍 Währung:',
    selectLanguage: 'Sprache auswählen',
    selectCurrency: 'Währung auswählen',
    
    // Time
    elapsedTime: 'Verstrichene Zeit:',
    second: 'Sekunde',
    seconds: 'Sekunden',
    minute: 'Minute',
    minutes: 'Minuten',
    hour: 'Stunde',
    hours: 'Stunden',
    
    // History
    historyShow: '📊 Meeting-Historie anzeigen',
    historyHide: '📊 Meeting-Historie ausblenden',
    historyTitle: 'Personenänderungen:',
    start_history: 'Start:',
    person: 'Person',
    persons: 'Personen',
    personJoined: 'Person ist dem Meeting beigetreten',
    personsJoined: 'Personen sind dem Meeting beigetreten',
    personLeft: 'Person hat das Meeting verlassen',
    personsLeft: 'Personen haben das Meeting verlassen',
    
    // Notifications
    sessionRestored: '⚠️ Session wiederhergestellt - Timer wurde pausiert',
    sharedSessionLoaded: '🔗 Geteilte Session geladen!',
    linkCopied: '✓ Link kopiert!',
    errorOccurred: '❌ Ein Fehler ist aufgetreten',
    
    // Accessibility
    toggleLanguage: 'Sprache wechseln',
    toggleTheme: 'Theme wechseln',
    decreaseParticipants: 'Teilnehmer verringern',
    increaseParticipants: 'Teilnehmer erhöhen',
    numberOfParticipants: 'Anzahl der Teilnehmer',
    showInfo: 'Informationen anzeigen',
    closeDialog: 'Dialog schließen',
    
    // Info Modal
    infoTitle: 'Wozu dieser Rechner?',
    infoText1: 'Meetings sind teuer! Dieser Rechner macht die versteckten Kosten von Besprechungen sichtbar und hilft dabei, bewusster mit der Zeit aller Teilnehmer umzugehen.',
    infoText2: 'Geben Sie die durchschnittlichen Kosten pro Person und Stunde ein (z.B. Stundenlohn + Lohnnebenkosten) und sehen Sie in Echtzeit, wie viel das Meeting kostet.',
    infoExampleTitle: '💡 Beispiel:',
    infoExample: '5 Personen à 65€/h in einem 30-minütigen Meeting = 162,50€ Kosten',
    infoTip: '💡 Tipp: Nutzen Sie die Personenzähler während des Meetings, wenn Teilnehmer hinzukommen oder gehen.',
    infoClose: 'Verstanden',
    
    // Share Modal
    shareLink: 'Link teilen',
    shareTitle: 'Meeting teilen',
    shareDescription: 'Teilen Sie dieses Meeting mit anderen. Der Link enthält alle aktuellen Einstellungen und den Timer-Status.',
    shareUrl: 'Share-Link:',
    copyLink: 'Kopieren',
    shareVia: 'Teilen über:',
    more: 'Mehr',
    or: 'oder',
    close: 'Schließen',
    shareInfoTitle: 'Was wird geteilt?',
    shareInfo1: 'Aktuelle Zeit und Timer-Status',
    shareInfo2: 'Teilnehmeranzahl und Einstellungen',
    shareInfo3: 'Sprache und Währung',
    shareEmailSubject: 'Meeting-Kostenrechner - Aktuelles Meeting',
    shareEmailBody: 'Schau dir die Kosten unseres aktuellen Meetings an:',
    shareWhatsAppText: '💰 Meeting-Kostenrechner - Aktuelle Kosten:',
    shareSlackText: '💰 *Meeting-Kostenrechner*\nAktuelle Meeting-Kosten:',

    // Keyboard Shortcuts
    keyboardShortcuts: 'Tastaturkürzel',
    keyboardShortcutsDescription: 'Nutze diese Tastenkombinationen für schnelleren Zugriff:',
    startPauseTimer: 'Timer starten/pausieren',
    resetTimer: 'Timer zurücksetzen',
    openInfo: 'Informationen öffnen',
    openShare: 'Teilen-Dialog öffnen',
    showShortcuts: 'Tastaturkürzel anzeigen',
    closeModal: 'Dialog schließen',
    adjustParticipants: 'Teilnehmer anpassen',
    proTip: 'Profi-Tipp',
    keyboardShortcutsTip: 'Drücke Ctrl+? jederzeit um diese Übersicht anzuzeigen.',
    
    // Errors
    errorLoadingSession: 'Fehler beim Laden der Session',
    errorSavingSession: 'Fehler beim Speichern der Session',
    errorInvalidData: 'Ungültige Daten',
    errorNetworkIssue: 'Netzwerkproblem'
  },
  
  en: {
    // Main UI
    title: '💰 Meeting Cost Calculator',
    totalCostLabel: 'Total Cost:',
    start: '▶️ Start',
    pause: '⏸️ Pause',
    reset: '🔄 Reset',
    participants: '👥 Participants:',
    
    // Settings
    settingsShow: '⚙️ Show Settings',
    settingsHide: '⚙️ Hide Settings',
    costPerPerson: '💶 Cost per Person/h:',
    currency: '🌍 Currency:',
    selectLanguage: 'Select language',
    selectCurrency: 'Select currency',
    
    // Time
    elapsedTime: 'Elapsed Time:',
    second: 'second',
    seconds: 'seconds',
    minute: 'minute',
    minutes: 'minutes',
    hour: 'hour',
    hours: 'hours',
    
    // History
    historyShow: '📊 Show Meeting History',
    historyHide: '📊 Hide Meeting History',
    historyTitle: 'Participant Changes:',
    start_history: 'Start:',
    person: 'person',
    persons: 'persons',
    personJoined: 'person joined the meeting',
    personsJoined: 'persons joined the meeting',
    personLeft: 'person left the meeting',
    personsLeft: 'persons left the meeting',
    
    // Notifications
    sessionRestored: '⚠️ Session restored - Timer was paused',
    sharedSessionLoaded: '🔗 Shared session loaded!',
    linkCopied: '✓ Link copied!',
    errorOccurred: '❌ An error occurred',
    
    // Accessibility
    toggleLanguage: 'Toggle language',
    toggleTheme: 'Toggle theme',
    decreaseParticipants: 'Decrease participants',
    increaseParticipants: 'Increase participants',
    numberOfParticipants: 'Number of participants',
    showInfo: 'Show information',
    closeDialog: 'Close dialog',
    
    // Info Modal
    infoTitle: 'What is this calculator for?',
    infoText1: 'Meetings are expensive! This calculator makes the hidden costs of meetings visible and helps to be more conscious about everyone\'s time.',
    infoText2: 'Enter the average cost per person per hour (e.g., hourly wage + overhead costs) and see in real-time how much the meeting costs.',
    infoExampleTitle: '💡 Example:',
    infoExample: '5 people at $65/h in a 30-minute meeting = $162.50 cost',
    infoTip: '💡 Tip: Use the participant counter during the meeting when people join or leave.',
    infoClose: 'Got it',
    
    // Share Modal
    shareLink: 'Share link',
    shareTitle: 'Share Meeting',
    shareDescription: 'Share this meeting with others. The link contains all current settings and timer status.',
    shareUrl: 'Share Link:',
    copyLink: 'Copy',
    shareVia: 'Share via:',
    more: 'More',
    close: 'Close',
    or: 'or',
    shareInfoTitle: 'What is shared?',
    shareInfo1: 'Current time and timer status',
    shareInfo2: 'Number of participants and settings',
    shareInfo3: 'Language and currency',
    shareEmailSubject: 'Meeting Cost Calculator - Current Meeting',
    shareEmailBody: 'Check out the costs of our current meeting:',
    shareWhatsAppText: '💰 Meeting Cost Calculator - Current costs:',
    shareSlackText: '💰 *Meeting Cost Calculator*\nCurrent meeting costs:',

    // Keyboard Shortcuts
    keyboardShortcuts: 'Keyboard Shortcuts',
    keyboardShortcutsDescription: 'Use these keyboard shortcuts for faster access:',
    startPauseTimer: 'Start/Pause timer',
    resetTimer: 'Reset timer',
    openInfo: 'Open information',
    openShare: 'Open share dialog',
    showShortcuts: 'Show keyboard shortcuts',
    closeModal: 'Close dialog',
    adjustParticipants: 'Adjust participants',
    proTip: 'Pro Tip',
    keyboardShortcutsTip: 'Press Ctrl+? anytime to show this overview.',
    
    // Errors
    errorLoadingSession: 'Error loading session',
    errorSavingSession: 'Error saving session',
    errorInvalidData: 'Invalid data',
    errorNetworkIssue: 'Network issue'
  },
  
  es: {
    // Main UI
    title: '💰 Calculadora de Costos de Reuniones',
    totalCostLabel: 'Costo Total:',
    start: '▶️ Iniciar',
    pause: '⏸️ Pausar',
    reset: '🔄 Reiniciar',
    participants: '👥 Participantes:',
    
    // Settings
    settingsShow: '⚙️ Mostrar Configuración',
    settingsHide: '⚙️ Ocultar Configuración',
    costPerPerson: '💶 Costo por Persona/h:',
    currency: '🌍 Moneda:',
    selectLanguage: 'Seleccionar idioma',
    selectCurrency: 'Seleccionar moneda',
    
    // Time
    elapsedTime: 'Tiempo Transcurrido:',
    second: 'segundo',
    seconds: 'segundos',
    minute: 'minuto',
    minutes: 'minutos',
    hour: 'hora',
    hours: 'horas',
    
    // History
    historyShow: '📊 Mostrar Historial de Reunión',
    historyHide: '📊 Ocultar Historial de Reunión',
    historyTitle: 'Cambios de Participantes:',
    start_history: 'Inicio:',
    person: 'persona',
    persons: 'personas',
    personJoined: 'persona se unió a la reunión',
    personsJoined: 'personas se unieron a la reunión',
    personLeft: 'persona abandonó la reunión',
    personsLeft: 'personas abandonaron la reunión',
    
    // Notifications
    sessionRestored: '⚠️ Sesión restaurada - El temporizador fue pausado',
    sharedSessionLoaded: '🔗 ¡Sesión compartida cargada!',
    linkCopied: '✓ ¡Enlace copiado!',
    errorOccurred: '❌ Ocurrió un error',
    
    // Accessibility
    toggleLanguage: 'Cambiar idioma',
    toggleTheme: 'Cambiar tema',
    decreaseParticipants: 'Disminuir participantes',
    increaseParticipants: 'Aumentar participantes',
    numberOfParticipants: 'Número de participantes',
    showInfo: 'Mostrar información',
    closeDialog: 'Cerrar diálogo',
    
    // Info Modal
    infoTitle: '¿Para qué sirve esta calculadora?',
    infoText1: '¡Las reuniones son caras! Esta calculadora hace visibles los costos ocultos de las reuniones y ayuda a ser más consciente del tiempo de todos los participantes.',
    infoText2: 'Ingrese el costo promedio por persona por hora (por ejemplo, salario por hora + costos adicionales) y vea en tiempo real cuánto cuesta la reunión.',
    infoExampleTitle: '💡 Ejemplo:',
    infoExample: '5 personas a 65€/h en una reunión de 30 minutos = 162,50€ de costo',
    infoTip: '💡 Consejo: Use el contador de participantes durante la reunión cuando las personas se unan o se vayan.',
    infoClose: 'Entendido',
    
    // Share Modal
    shareLink: 'Compartir enlace',
    shareTitle: 'Compartir Reunión',
    shareDescription: 'Comparte esta reunión con otros. El enlace contiene todas las configuraciones actuales y el estado del temporizador.',
    shareUrl: 'Enlace para compartir:',
    copyLink: 'Copiar',
    shareVia: 'Compartir vía:',
    more: 'Más',
    close: 'Cerrar',
    or: 'o',
    shareInfoTitle: '¿Qué se comparte?',
    shareInfo1: 'Tiempo actual y estado del temporizador',
    shareInfo2: 'Número de participantes y configuraciones',
    shareInfo3: 'Idioma y moneda',
    shareEmailSubject: 'Calculadora de Costos de Reuniones - Reunión Actual',
    shareEmailBody: 'Mira los costos de nuestra reunión actual:',
    shareWhatsAppText: '💰 Calculadora de Costos de Reuniones - Costos actuales:',
    shareSlackText: '💰 *Calculadora de Costos de Reuniones*\nCostos actuales de la reunión:',

    // Keyboard Shortcuts
    keyboardShortcuts: 'Atajos de Teclado',
    keyboardShortcutsDescription: 'Usa estos atajos de teclado para acceso más rápido:',
    startPauseTimer: 'Iniciar/Pausar temporizador',
    resetTimer: 'Reiniciar temporizador',
    openInfo: 'Abrir información',
    openShare: 'Abrir diálogo de compartir',
    showShortcuts: 'Mostrar atajos de teclado',
    closeModal: 'Cerrar diálogo',
    adjustParticipants: 'Ajustar participantes',
    proTip: 'Consejo Pro',
    keyboardShortcutsTip: 'Presiona Ctrl+? en cualquier momento para mostrar esta vista.',
    
    // Errors
    errorLoadingSession: 'Error al cargar la sesión',
    errorSavingSession: 'Error al guardar la sesión',
    errorInvalidData: 'Datos inválidos',
    errorNetworkIssue: 'Problema de red'
  },
  
  fr: {
    // Main UI
    title: '💰 Calculateur de Coûts de Réunion',
    totalCostLabel: 'Coût Total:',
    start: '▶️ Démarrer',
    pause: '⏸️ Pause',
    reset: '🔄 Réinitialiser',
    participants: '👥 Participants:',
    
    // Settings
    settingsShow: '⚙️ Afficher les Paramètres',
    settingsHide: '⚙️ Masquer les Paramètres',
    costPerPerson: '💶 Coût par Personne/h:',
    currency: '🌍 Devise:',
    selectLanguage: 'Sélectionner la langue',
    selectCurrency: 'Sélectionner la devise',
    
    // Time
    elapsedTime: 'Temps Écoulé:',
    second: 'seconde',
    seconds: 'secondes',
    minute: 'minute',
    minutes: 'minutes',
    hour: 'heure',
    hours: 'heures',
    
    // History
    historyShow: '📊 Afficher l\'Historique de la Réunion',
    historyHide: '📊 Masquer l\'Historique de la Réunion',
    historyTitle: 'Changements de Participants:',
    start_history: 'Début:',
    person: 'personne',
    persons: 'personnes',
    personJoined: 'personne a rejoint la réunion',
    personsJoined: 'personnes ont rejoint la réunion',
    personLeft: 'personne a quitté la réunion',
    personsLeft: 'personnes ont quitté la réunion',
    
    // Notifications
    sessionRestored: '⚠️ Session restaurée - Le minuteur a été mis en pause',
    sharedSessionLoaded: '🔗 Session partagée chargée!',
    linkCopied: '✓ Lien copié!',
    errorOccurred: '❌ Une erreur s\'est produite',
    
    // Accessibility
    toggleLanguage: 'Changer de langue',
    toggleTheme: 'Changer de thème',
    decreaseParticipants: 'Diminuer les participants',
    increaseParticipants: 'Augmenter les participants',
    numberOfParticipants: 'Nombre de participants',
    showInfo: 'Afficher les informations',
    closeDialog: 'Fermer le dialogue',
    
    // Info Modal
    infoTitle: 'À quoi sert ce calculateur?',
    infoText1: 'Les réunions coûtent cher! Ce calculateur rend visibles les coûts cachés des réunions et aide à être plus conscient du temps de tous les participants.',
    infoText2: 'Entrez le coût moyen par personne par heure (par exemple, salaire horaire + charges sociales) et voyez en temps réel combien coûte la réunion.',
    infoExampleTitle: '💡 Exemple:',
    infoExample: '5 personnes à 65€/h dans une réunion de 30 minutes = 162,50€ de coût',
    infoTip: '💡 Conseil: Utilisez le compteur de participants pendant la réunion lorsque des personnes arrivent ou partent.',
    infoClose: 'Compris',
    
    // Share Modal
    shareLink: 'Partager le lien',
    shareTitle: 'Partager la Réunion',
    shareDescription: 'Partagez cette réunion avec d\'autres. Le lien contient tous les paramètres actuels et l\'état du minuteur.',
    shareUrl: 'Lien de partage:',
    copyLink: 'Copier',
    shareVia: 'Partager via:',
    more: 'Plus',
    close: 'Fermer',
    or: 'ou',
    shareInfoTitle: 'Qu\'est-ce qui est partagé?',
    shareInfo1: 'Temps actuel et état du minuteur',
    shareInfo2: 'Nombre de participants et paramètres',
    shareInfo3: 'Langue et devise',
    shareEmailSubject: 'Calculateur de Coûts de Réunion - Réunion Actuelle',
    shareEmailBody: 'Découvrez les coûts de notre réunion actuelle:',
    shareWhatsAppText: '💰 Calculateur de Coûts de Réunion - Coûts actuels:',
    shareSlackText: '💰 *Calculateur de Coûts de Réunion*\nCoûts actuels de la réunion:',

    // Keyboard Shortcuts
    keyboardShortcuts: 'Raccourcis Clavier',
    keyboardShortcutsDescription: 'Utilisez ces raccourcis clavier pour un accès plus rapide:',
    startPauseTimer: 'Démarrer/Mettre en pause',
    resetTimer: 'Réinitialiser le minuteur',
    openInfo: 'Ouvrir les informations',
    openShare: 'Ouvrir le dialogue de partage',
    showShortcuts: 'Afficher les raccourcis clavier',
    closeModal: 'Fermer le dialogue',
    adjustParticipants: 'Ajuster les participants',
    proTip: 'Astuce Pro',
    keyboardShortcutsTip: 'Appuyez sur Ctrl+? à tout moment pour afficher cet aperçu.',
    
    // Errors
    errorLoadingSession: 'Erreur lors du chargement de la session',
    errorSavingSession: 'Erreur lors de l\'enregistrement de la session',
    errorInvalidData: 'Données invalides',
    errorNetworkIssue: 'Problème de réseau'
  },
  
  it: {
    // Main UI
    title: '💰 Calcolatore Costi Riunioni',
    totalCostLabel: 'Costo Totale:',
    start: '▶️ Avvia',
    pause: '⏸️ Pausa',
    reset: '🔄 Reimposta',
    participants: '👥 Partecipanti:',
    
    // Settings
    settingsShow: '⚙️ Mostra Impostazioni',
    settingsHide: '⚙️ Nascondi Impostazioni',
    costPerPerson: '💶 Costo per Persona/h:',
    currency: '🌍 Valuta:',
    selectLanguage: 'Seleziona lingua',
    selectCurrency: 'Seleziona valuta',
    
    // Time
    elapsedTime: 'Tempo Trascorso:',
    second: 'secondo',
    seconds: 'secondi',
    minute: 'minuto',
    minutes: 'minuti',
    hour: 'ora',
    hours: 'ore',
    
    // History
    historyShow: '📊 Mostra Cronologia Riunione',
    historyHide: '📊 Nascondi Cronologia Riunione',
    historyTitle: 'Modifiche Partecipanti:',
    start_history: 'Inizio:',
    person: 'persona',
    persons: 'persone',
    personJoined: 'persona si è unita alla riunione',
    personsJoined: 'persone si sono unite alla riunione',
    personLeft: 'persona ha lasciato la riunione',
    personsLeft: 'persone hanno lasciato la riunione',
    
    // Notifications
    sessionRestored: '⚠️ Sessione ripristinata - Il timer è stato messo in pausa',
    sharedSessionLoaded: '🔗 Sessione condivisa caricata!',
    linkCopied: '✓ Link copiato!',
    errorOccurred: '❌ Si è verificato un errore',
    
    // Accessibility
    toggleLanguage: 'Cambia lingua',
    toggleTheme: 'Cambia tema',
    decreaseParticipants: 'Diminuisci partecipanti',
    increaseParticipants: 'Aumenta partecipanti',
    numberOfParticipants: 'Numero di partecipanti',
    showInfo: 'Mostra informazioni',
    closeDialog: 'Chiudi dialogo',
    
    // Info Modal
    infoTitle: 'A cosa serve questo calcolatore?',
    infoText1: 'Le riunioni sono costose! Questo calcolatore rende visibili i costi nascosti delle riunioni e aiuta ad essere più consapevoli del tempo di tutti i partecipanti.',
    infoText2: 'Inserisci il costo medio per persona all\'ora (ad esempio, salario orario + costi accessori) e vedi in tempo reale quanto costa la riunione.',
    infoExampleTitle: '💡 Esempio:',
    infoExample: '5 persone a 65€/h in una riunione di 30 minuti = 162,50€ di costo',
    infoTip: '💡 Suggerimento: Usa il contatore dei partecipanti durante la riunione quando le persone si uniscono o se ne vanno.',
    infoClose: 'Capito',
    
    // Share Modal
    shareLink: 'Condividi link',
    shareTitle: 'Condividi Riunione',
    shareDescription: 'Condividi questa riunione con altri. Il link contiene tutte le impostazioni attuali e lo stato del timer.',
    shareUrl: 'Link di condivisione:',
    copyLink: 'Copia',
    shareVia: 'Condividi tramite:',
    more: 'Altro',
    close: 'Chiudi',
    or: 'o',
    shareInfoTitle: 'Cosa viene condiviso?',
    shareInfo1: 'Tempo attuale e stato del timer',
    shareInfo2: 'Numero di partecipanti e impostazioni',
    shareInfo3: 'Lingua e valuta',
    shareEmailSubject: 'Calcolatore Costi Riunioni - Riunione Attuale',
    shareEmailBody: 'Guarda i costi della nostra riunione attuale:',
    shareWhatsAppText: '💰 Calcolatore Costi Riunioni - Costi attuali:',
    shareSlackText: '💰 *Calcolatore Costi Riunioni*\nCosti attuali della riunione:',

    // Keyboard Shortcuts
    keyboardShortcuts: 'Scorciatoie da Tastiera',
    keyboardShortcutsDescription: 'Usa queste scorciatoie da tastiera per un accesso più veloce:',
    startPauseTimer: 'Avvia/Metti in pausa timer',
    resetTimer: 'Reimposta timer',
    openInfo: 'Apri informazioni',
    openShare: 'Apri dialogo di condivisione',
    showShortcuts: 'Mostra scorciatoie da tastiera',
    closeModal: 'Chiudi dialogo',
    adjustParticipants: 'Regola partecipanti',
    proTip: 'Suggerimento Pro',
    keyboardShortcutsTip: 'Premi Ctrl+? in qualsiasi momento per mostrare questa panoramica.',
    
    // Errors
    errorLoadingSession: 'Errore nel caricamento della sessione',
    errorSavingSession: 'Errore nel salvataggio della sessione',
    errorInvalidData: 'Dati non validi',
    errorNetworkIssue: 'Problema di rete'
  },
  
  pl: {
    // Main UI
    title: '💰 Kalkulator Kosztów Spotkań',
    totalCostLabel: 'Całkowity Koszt:',
    start: '▶️ Start',
    pause: '⏸️ Pauza',
    reset: '🔄 Reset',
    participants: '👥 Uczestnicy:',
    
    // Settings
    settingsShow: '⚙️ Pokaż Ustawienia',
    settingsHide: '⚙️ Ukryj Ustawienia',
    costPerPerson: '💶 Koszt na Osobę/h:',
    currency: '🌍 Waluta:',
    selectLanguage: 'Wybierz język',
    selectCurrency: 'Wybierz walutę',
    
    // Time
    elapsedTime: 'Upłynął Czas:',
    second: 'sekunda',
    seconds: 'sekund',
    minute: 'minuta',
    minutes: 'minut',
    hour: 'godzina',
    hours: 'godzin',
    
    // History
    historyShow: '📊 Pokaż Historię Spotkania',
    historyHide: '📊 Ukryj Historię Spotkania',
    historyTitle: 'Zmiany Uczestników:',
    start_history: 'Start:',
    person: 'osoba',
    persons: 'osoby',
    personJoined: 'osoba dołączyła do spotkania',
    personsJoined: 'osoby dołączyły do spotkania',
    personLeft: 'osoba opuściła spotkanie',
    personsLeft: 'osoby opuściły spotkanie',
    
    // Notifications
    sessionRestored: '⚠️ Sesja przywrócona - Timer został wstrzymany',
    sharedSessionLoaded: '🔗 Załadowano udostępnioną sesję!',
    linkCopied: '✓ Link skopiowany!',
    errorOccurred: '❌ Wystąpił błąd',
    
    // Accessibility
    toggleLanguage: 'Zmień język',
    toggleTheme: 'Zmień motyw',
    decreaseParticipants: 'Zmniejsz uczestników',
    increaseParticipants: 'Zwiększ uczestników',
    numberOfParticipants: 'Liczba uczestników',
    showInfo: 'Pokaż informacje',
    closeDialog: 'Zamknij dialog',
    
    // Info Modal
    infoTitle: 'Do czego służy ten kalkulator?',
    infoText1: 'Spotkania są drogie! Ten kalkulator uwidacznia ukryte koszty spotkań i pomaga być bardziej świadomym czasu wszystkich uczestników.',
    infoText2: 'Wprowadź średni koszt na osobę na godzinę (np. stawka godzinowa + koszty dodatkowe) i zobacz w czasie rzeczywistym, ile kosztuje spotkanie.',
    infoExampleTitle: '💡 Przykład:',
    infoExample: '5 osób po 65€/h w 30-minutowym spotkaniu = 162,50€ kosztu',
    infoTip: '💡 Wskazówka: Użyj licznika uczestników podczas spotkania, gdy osoby dołączają lub wychodzą.',
    infoClose: 'Rozumiem',
    
    // Share Modal
    shareLink: 'Udostępnij link',
    shareTitle: 'Udostępnij Spotkanie',
    shareDescription: 'Udostępnij to spotkanie innym. Link zawiera wszystkie bieżące ustawienia i stan timera.',
    shareUrl: 'Link do udostępnienia:',
    copyLink: 'Kopiuj',
    shareVia: 'Udostępnij przez:',
    more: 'Więcej',
    close: 'Zamknij',
    or: 'lub',
    shareInfoTitle: 'Co jest udostępniane?',
    shareInfo1: 'Aktualny czas i stan timera',
    shareInfo2: 'Liczba uczestników i ustawienia',
    shareInfo3: 'Język i waluta',
    shareEmailSubject: 'Kalkulator Kosztów Spotkań - Bieżące Spotkanie',
    shareEmailBody: 'Zobacz koszty naszego bieżącego spotkania:',
    shareWhatsAppText: '💰 Kalkulator Kosztów Spotkań - Aktualne koszty:',
    shareSlackText: '💰 *Kalkulator Kosztów Spotkań*\nAktualne koszty spotkania:',

    // Keyboard Shortcuts
    keyboardShortcuts: 'Skróty Klawiszowe',
    keyboardShortcutsDescription: 'Użyj tych skrótów klawiszowych dla szybszego dostępu:',
    startPauseTimer: 'Start/Pauza timer',
    resetTimer: 'Resetuj timer',
    openInfo: 'Otwórz informacje',
    openShare: 'Otwórz dialog udostępniania',
    showShortcuts: 'Pokaż skróty klawiszowe',
    closeModal: 'Zamknij dialog',
    adjustParticipants: 'Dostosuj uczestników',
    proTip: 'Wskazówka Pro',
    keyboardShortcutsTip: 'Naciśnij Ctrl+? w dowolnym momencie, aby pokazać ten przegląd.',
    
    // Errors
    errorLoadingSession: 'Błąd ładowania sesji',
    errorSavingSession: 'Błąd zapisywania sesji',
    errorInvalidData: 'Nieprawidłowe dane',
    errorNetworkIssue: 'Problem z siecią'
  }
};

/**
 * Get translation for a key in a specific language
 * @param {string} key - Translation key
 * @param {string} lang - Language code
 * @returns {string} Translated string or key if not found
 */
function getTranslation(key, lang = 'en') {
  try {
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    
    // Fallback to English
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      console.warn(`Translation missing for key "${key}" in language "${lang}", using English fallback`);
      return TRANSLATIONS['en'][key];
    }
    
    // Return key if translation not found
    console.warn(`Translation missing for key "${key}"`);
    return key;
  } catch (error) {
    console.error('Error getting translation:', error);
    return key;
  }
}

/**
 * Check if a language is supported
 * @param {string} lang - Language code
 * @returns {boolean} True if supported
 */
function isLanguageSupported(lang) {
  return TRANSLATIONS.hasOwnProperty(lang);
}

/**
 * Get all available languages
 * @returns {Array<string>} Array of language codes
 */
function getAvailableLanguages() {
  return Object.keys(TRANSLATIONS);
}