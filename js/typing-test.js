// ===== TEST DE DACTYLOGRAPHIE =====

// Liste de mots français courants pour le test
const frenchWords = [
    'le', 'de', 'et', 'à', 'un', 'il', 'être', 'en', 'avoir', 'que', 'pour',
    'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'plus',
    'par', 'grand', 'mais', 'homme', 'vie', 'temps', 'jour', 'eau', 'monde', 'main',
    'premier', 'vous', 'lui', 'nous', 'comme', 'savoir', 'pouvoir', 'autre', 'année',
    'venir', 'deux', 'même', 'prendre', 'état', 'partie', 'entre', 'contre', 'place',
    'sans', 'faire', 'aller', 'enfant', 'ville', 'métier', 'terre', 'point', 'depuis',
    'semaine', 'ciel', 'route', 'fin', 'raison', 'trouver', 'tête', 'donner', 'fait',
    'groupe', 'vers', 'chose', 'femme', 'créer', 'ouvrir', 'public', 'aussi', 'celui',
    'moment', 'dire', 'rendre', 'elle', 'bien', 'où', 'jusque', 'forme', 'regarder',
    'école', 'maison', 'petit', 'encore', 'laisser', 'mot', 'rester', 'partir', 'père',
    'tenir', 'mois', 'passer', 'vouloir', 'parler', 'jeu', 'tant', 'mener', 'ordre',
    'loi', 'ligne', 'tard', 'force', 'beau', 'soir', 'population', 'retour', 'enfin',
    'travail', 'commune', 'prix', 'livre', 'certain', 'commerce', 'question', 'politique',
    'devant', 'mer', 'car', 'sentir', 'porte', 'pays', 'votre', 'yeux', 'entendre',
    'heure', 'amour', 'oui', 'jeune', 'mon', 'reprendre', 'puis', 'demander', 'trois',
    'noir', 'lequel', 'bon', 'sous', 'quelque', 'moins', 'notre', 'sembler', 'gens',
    'moi', 'croire', 'rien', 'falloir', 'regard', 'ainsi', 'nom', 'âme', 'quatre',
    'vingt', 'mettre', 'chercher', 'non', 'voix', 'sortir', 'côté', 'aimer', 'coeur',
    'voir', 'donner', 'bras', 'blanc', 'long', 'seul', 'rêve', 'rouge', 'vert',
    'noir', 'jaune', 'bleu', 'gris', 'rose', 'boire', 'manger', 'dormir', 'courir'
];
// Variables globales pour le test de dactylographie
let typingWords = [];
let currentWordIndex = 0;
let typingStartTime = 0;
let typingEndTime = 0;
let typingTimer = null;
let typingDuration = 60; // secondes
let typingTimeLeft = 60;
let typingStats = {
    correctWords: 0,
    incorrectWords: 0,
    totalCharacters: 0,
    incorrectCharacters: 0
};
let typingHistory = [];
let typingTestActive = false;

// ===== FONCTIONS PRINCIPALES =====
function startTypingTest() {
    showSection('typing-test');
    initTypingTest();
}

function initTypingTest() {
    const gameArea = document.getElementById('typing-game-area');
    
    gameArea.innerHTML = `
        <div class="typing-game">
            <div class="typing-setup">
                <div class="typing-controls">
                    <div class="control-group">
                        <label>Durée</label>
                        <select id="typing-duration" onchange="setTypingDuration(this.value)">
                            <option value="30">30 secondes</option>
                            <option value="60" selected>60 secondes</option>
                            <option value="120">2 minutes</option>
                            <option value="300">5 minutes</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="startTypingRound()" id="start-typing-btn">
                    Commencer le test
                </button>
                <button class="btn btn-secondary" onclick="showTypingHistory()" style="margin-left: 10px;">
                    Voir l'historique
                </button>
            </div>
            
            <div class="typing-instructions">
                ⌨️ Tapez les mots affichés en bleu. Appuyez sur <strong>Espace</strong> pour valider chaque mot. 
                Le test commencera dès que vous taperez le premier caractère !
            </div>
            
            <div class="typing-status">
                <div class="typing-stat">
                    <div class="typing-stat-value" id="typing-time">60</div>
                    <div class="typing-stat-label">Temps</div>
                </div>
                <div class="typing-stat">
                    <div class="typing-stat-value" id="typing-wpm">0</div>
                    <div class="typing-stat-label">WPM</div>
                </div>
                <div class="typing-stat">
                    <div class="typing-stat-value" id="typing-accuracy">100%</div>
                    <div class="typing-stat-label">Précision</div>
                </div>
                <div class="typing-stat">
                    <div class="typing-stat-value" id="typing-words-count">0</div>
                    <div class="typing-stat-label">Mots</div>
                </div>
            </div>
            
            <div class="typing-words-container">
                <div class="typing-words" id="typing-words">
                    Cliquez sur "Commencer le test" pour générer les mots
                </div>
            </div>
            
            <div class="typing-input-container">
                <input 
                    type="text" 
                    class="typing-input" 
                    id="typing-input" 
                    placeholder="Commencez à taper ici..."
                    disabled
                />
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" id="typing-progress"></div>
            </div>
        </div>
    `;
    
    resetTypingStats();
    startTypingRound()

}

// ===== CONFIGURATION ET GÉNÉRATION =====
function setTypingDuration(duration) {
    typingDuration = parseInt(duration);
    typingTimeLeft = typingDuration;
    document.getElementById('typing-time').textContent = typingDuration;
}

function generateTypingWords() {
    let wordPool = [...frenchWords];
    
    // Générer 200 mots aléatoirement
    typingWords = [];
    for (let i = 0; i < 200; i++) {
        const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        typingWords.push(randomWord);
    }
    
    displayTypingWords();
}

function displayTypingWords() {
    const wordsContainer = document.getElementById('typing-words');
    wordsContainer.innerHTML = '';
    
    typingWords.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.classList.add(index === 0 ? 'current' : 'pending');
        wordSpan.textContent = word;
        wordSpan.id = `word-${index}`;
        wordsContainer.appendChild(wordSpan);
    });
}

// ===== LOGIQUE DU JEU =====
function startTypingRound() {
    generateTypingWords();
    
    const input = document.getElementById('typing-input');
    const startBtn = document.getElementById('start-typing-btn');
    
    // Activer l'input et le focus
    input.disabled = false;
    input.focus();
    input.value = '';
    
    // Masquer le bouton de démarrage
    startBtn.style.display = 'none';
    
    // Reset
    currentWordIndex = 0;
    resetTypingStats();
    typingTestActive = true;
    
    // Event listener pour l'input
    input.addEventListener('input', handleTypingInput);
    input.addEventListener('keydown', handleTypingKeydown);
    
    // Le timer commencera au premier caractère tapé
    document.getElementById('typing-time').textContent = typingDuration;
}

function handleTypingInput(event) {
    if (!typingTestActive) return;
    
    // Démarrer le timer au premier caractère
    if (!typingStartTime) {
        startTypingTimer();
    }
    
    const input = event.target;
    const currentWord = typingWords[currentWordIndex];
    const typedText = input.value.trim();
    
    // Vérifier si le mot est correct en temps réel
    if (currentWord.startsWith(typedText)) {
        input.classList.remove('error');
    } else {
        input.classList.add('error');
    }
    
    updateTypingStats();
}

function handleTypingKeydown(event) {
    if (!typingTestActive) return;
    
    if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        submitCurrentWord();
    }
}

function submitCurrentWord() {
    const input = document.getElementById('typing-input');
    const typedWord = input.value.trim();
    const currentWord = typingWords[currentWordIndex];
    
    if (typedWord === '') return;
    
    // Marquer le mot comme correct ou incorrect
    const wordElement = document.getElementById(`word-${currentWordIndex}`);
    
    if (typedWord === currentWord) {
        wordElement.classList.remove('current');
        wordElement.classList.add('correct');
        typingStats.correctWords++;
    } else {
        wordElement.classList.remove('current');
        wordElement.classList.add('incorrect');
        typingStats.incorrectWords++;
    }
    
    // Compter les caractères
    typingStats.totalCharacters += currentWord.length + 1; // +1 pour l'espace
    if (typedWord !== currentWord) {
        typingStats.incorrectCharacters += Math.abs(currentWord.length - typedWord.length) + 1;
    }
    
    // Passer au mot suivant
    currentWordIndex++;
    
    if (currentWordIndex < typingWords.length) {
        const nextWordElement = document.getElementById(`word-${currentWordIndex}`);
        nextWordElement.classList.remove('pending');
        nextWordElement.classList.add('current');
        
        // Scroll automatique si nécessaire
        nextWordElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Vider l'input
    input.value = '';
    input.classList.remove('error');
    
    updateTypingStats();
    
    // Arrêter si on a fini tous les mots
    if (currentWordIndex >= typingWords.length) {
        endTypingTest();
    }
}

// ===== TIMER ET STATISTIQUES =====
function startTypingTimer() {
    typingStartTime = Date.now();
    typingTimeLeft = typingDuration;
    
    typingTimer = setInterval(() => {
        typingTimeLeft--;
        document.getElementById('typing-time').textContent = typingTimeLeft;
        
        // Mettre à jour la barre de progression
        const progress = ((typingDuration - typingTimeLeft) / typingDuration) * 100;
        document.getElementById('typing-progress').style.width = progress + '%';
        
        if (typingTimeLeft <= 0) {
            endTypingTest();
        }
    }, 1000);
}

function updateTypingStats() {
    if (!typingStartTime) return;
    
    const timeElapsed = (Date.now() - typingStartTime) / 1000 / 60; // en minutes
    const totalWords = typingStats.correctWords + typingStats.incorrectWords;
    
    // Calculer WPM (Words Per Minute)
    const wpm = timeElapsed > 0 ? Math.round(typingStats.correctWords / timeElapsed) : 0;
    
    // Calculer la précision
    const accuracy = typingStats.totalCharacters > 0 ? 
        Math.round(((typingStats.totalCharacters - typingStats.incorrectCharacters) / typingStats.totalCharacters) * 100) : 100;
    
    // Mettre à jour l'affichage
    document.getElementById('typing-wpm').textContent = wpm;
    document.getElementById('typing-accuracy').textContent = accuracy + '%';
    document.getElementById('typing-words-count').textContent = totalWords;
}

// ===== FIN DU TEST ET RÉSULTATS =====
function endTypingTest() {
    clearInterval(typingTimer);
    typingTestActive = false;
    typingEndTime = Date.now();
    
    const input = document.getElementById('typing-input');
    input.disabled = true;
    
    // Calculer les statistiques finales
    const timeElapsed = (typingEndTime - typingStartTime) / 1000 / 60; // en minutes
    const totalWords = typingStats.correctWords + typingStats.incorrectWords;
    const wpm = Math.round(typingStats.correctWords / timeElapsed);
    const rawWpm = Math.round(totalWords / timeElapsed);
    const accuracy = typingStats.totalCharacters > 0 ? 
        Math.round(((typingStats.totalCharacters - typingStats.incorrectCharacters) / typingStats.totalCharacters) * 100) : 100;
    
    // Sauvegarder dans l'historique
    typingHistory.push({
        wpm: wpm,
        rawWpm: rawWpm,
        accuracy: accuracy,
        correctWords: typingStats.correctWords,
        incorrectWords: typingStats.incorrectWords,
        duration: typingDuration,
        date: new Date().toLocaleString()
    });
    
    // Afficher les résultats
    displayTypingResults(wpm, rawWpm, accuracy, totalWords);
}

function displayTypingResults(wpm, rawWpm, accuracy, totalWords) {
    const gameArea = document.getElementById('typing-game-area');
    
    const performanceRating = getTypingRating(wpm);
    
    gameArea.innerHTML = `
        <div class="typing-results">
            <h3>🎯 Résultats du Test</h3>
            
            <div class="results-grid">
                <div class="result-card">
                    <div class="result-value">${wpm}</div>
                    <div class="result-label">WPM</div>
                    <div class="result-description">Mots par minute</div>
                </div>
                
                <div class="result-card">
                    <div class="result-value">${accuracy}%</div>
                    <div class="result-label">Précision</div>
                    <div class="result-description">Caractères corrects</div>
                </div>
                
                <div class="result-card">
                    <div class="result-value">${totalWords}</div>
                    <div class="result-label">Mots tapés</div>
                    <div class="result-description">${typingStats.correctWords} corrects, ${typingStats.incorrectWords} erreurs</div>
                </div>
                
                <div class="result-card">
                    <div class="result-value">${rawWpm}</div>
                    <div class="result-label">WPM Brut</div>
                    <div class="result-description">Tous les mots</div>
                </div>
            </div>
            
            <div style="background: var(--psych-ivory); padding: 20px; border-radius: 15px; margin-bottom: 30px;">
                <h4 style="color: var(--psych-sage); margin-bottom: 10px;">📊 Évaluation</h4>
                <p style="font-size: 1.1em; margin: 0; color: var(--text-dark);">${performanceRating}</p>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="initTypingTest()">
                    Recommencer
                </button>
                <button class="btn btn-secondary" onclick="showTypingHistory()">
                    Voir l'historique
                </button>
            </div>
        </div>
    `;
}

// ===== ÉVALUATION ET UTILITAIRES =====
function getTypingRating(wpm) {
    if (wpm >= 80) return '🚀 Exceptionnellement rapide ! C\'est ta 12e Redbull de la journée ?!';
    if (wpm >= 60) return '⚡ Très rapide ! Excellente vitesse de frappe !';
    if (wpm >= 40) return '👍 Bonne vitesse ! Au-dessus de la moyenne !';
    if (wpm >= 25) return '👌 Vitesse correcte, tu peux faire mieux!';
    if (wpm >= 15) return '🏃 Vitesse de moldu.';
    return '🐢 Début de l\'apprentissage. Prends ton temps et ressaye !';
}

function resetTypingStats() {
    typingStats = {
        correctWords: 0,
        incorrectWords: 0,
        totalCharacters: 0,
        incorrectCharacters: 0
    };
    typingStartTime = 0;
    typingEndTime = 0;
    typingTestActive = false;
    currentWordIndex = 0;
    
    document.getElementById('typing-wpm').textContent = '0';
    document.getElementById('typing-accuracy').textContent = '100%';
    document.getElementById('typing-words-count').textContent = '0';
    document.getElementById('typing-progress').style.width = '0%';
}

// ===== HISTORIQUE =====
function showTypingHistory() {
    const historyDiv = document.getElementById('typing-history');
    
    if (typingHistory.length === 0) {
        alert('Aucun test effectué pour le moment !');
        return;
    }
    
    const historyHTML = `
        <div class="reaction-history-table">
            <h3 style="color: var(--psych-sage); margin-bottom: 20px;">Historique des tests de frappe</h3>
            <div style="max-height: 400px; overflow-y: auto;">
                ${typingHistory.slice(-15).reverse().map((test, index) => `
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 2fr; gap: 15px; padding: 12px; border-bottom: 1px solid var(--psych-ivory); align-items: center;">
                        <div style="font-weight: 600; color: var(--psych-coral);">${test.wpm} WPM</div>
                        <div style="color: var(--psych-sage);">${test.accuracy}%</div>
                        <div style="color: var(--text-dark);">${test.correctWords} mots</div>
                        <div style="color: var(--text-light);">${test.duration}s</div>
                        <div style="color: var(--text-light); font-size: 0.8em;">${test.date}</div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="hideTypingHistory()" style="margin-top: 20px;">
                Fermer
            </button>
        </div>
    `;
    
    historyDiv.innerHTML = historyHTML;
    historyDiv.style.display = 'block';
}

function hideTypingHistory() {
    document.getElementById('typing-history').style.display = 'none';
}