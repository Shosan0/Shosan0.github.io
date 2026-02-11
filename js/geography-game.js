// ===== JEU DE GÉOGRAPHIE =====
// Note: Les données geographyData sont chargées depuis geography-data.js

// Variables globales
let allCountries = [];
let currentMode = 'flags'; // 'flags' ou 'capitals'
let currentDifficulty = 'all'; // 'all', 'tres_facile', 'facile', 'difficile', 'tres_difficile'
let currentAnswerMode = 'multiple'; // 'multiple' ou 'text'
let questionsPool = [];
let currentQuestionIndex = 0;
let currentQuestionGeo = null;
let geoScore = {
    correct: 0,
    incorrect: 0,
    streak: 0,
    bestStreak: 0
};
let geoHistory = [];

// ===== FONCTIONS DE CHARGEMENT =====
function loadGeographyData() {
    try {
        if (typeof geographyData === 'undefined') {
            console.error('geographyData non défini - Assurez-vous que geography-data.js est chargé');
            return false;
        }
        
        allCountries = [];
        for (let category in geographyData.categories) {
            allCountries = allCountries.concat(geographyData.categories[category]);
        }
        
        console.log(`${allCountries.length} pays chargés`);
        return true;
    } catch (error) {
        console.error('Erreur de chargement des données:', error);
        return false;
    }
}

// ===== FONCTIONS PRINCIPALES =====
function startGeographyGame() {
    showSection('geography-game');
    
    if (allCountries.length === 0) {
        const loaded = loadGeographyData();
        if (!loaded) {
            alert('Erreur lors du chargement des données géographiques');
            return;
        }
    }
    
    initGeographyGame();
}

function initGeographyGame() {
    const gameArea = document.getElementById('geography-game-area');
    
    gameArea.innerHTML = `
        <div class="geography-game">
            <!-- Menu de sélection -->
            <div class="geo-menu">
                <div class="geo-mode-selector">
                    <h3 style="color: var(--psych-sage); margin-bottom: 15px;">Mode de jeu</h3>
                    <div class="mode-buttons">
                        <button class="mode-btn active" onclick="selectGeoMode('flags')">
                            🚩 Drapeaux
                        </button>
                        <button class="mode-btn" onclick="selectGeoMode('capitals')">
                            🏛️ Capitales
                        </button>
                    </div>
                </div>
                
                <div class="geo-answer-mode-selector">
                    <h3 style="color: var(--psych-sage); margin-bottom: 15px;">Mode de réponse</h3>
                    <div class="answer-mode-buttons">
                        <button class="answer-mode-btn active" onclick="selectAnswerMode('multiple')">
                            ✅ Choix multiples
                        </button>
                        <button class="answer-mode-btn" onclick="selectAnswerMode('text')">
                            📝 Texte libre
                        </button>
                    </div>
                </div>
                
                <div class="geo-difficulty-selector">
                    <h3 style="color: var(--psych-sage); margin-bottom: 15px;">Difficulté</h3>
                    <div class="difficulty-buttons">
                        <button class="diff-btn active" onclick="selectGeoDifficulty('all')">
                            🌍 Tous les pays
                        </button>
                        <button class="diff-btn" onclick="selectGeoDifficulty('tres_facile')">
                            😊 Très facile
                        </button>
                        <button class="diff-btn" onclick="selectGeoDifficulty('facile')">
                            🙂 Facile
                        </button>
                        <button class="diff-btn" onclick="selectGeoDifficulty('difficile')">
                            😐 Difficile
                        </button>
                        <button class="diff-btn" onclick="selectGeoDifficulty('tres_difficile')">
                            😰 Très difficile
                        </button>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="startGeoQuiz()" style="margin-top: 30px; font-size: 1.2em; padding: 15px 40px;">
                    Commencer le quiz ! 🎯
                </button>
            </div>
            
            <!-- Zone de jeu -->
            <div class="geo-game-container" style="display: none;">
                <div class="geo-stats">
                    <div class="geo-stat">
                        <div class="geo-stat-value" id="geo-score-correct">0</div>
                        <div class="geo-stat-label">✅ Corrects</div>
                    </div>
                    <div class="geo-stat">
                        <div class="geo-stat-value" id="geo-score-incorrect">0</div>
                        <div class="geo-stat-label">❌ Incorrects</div>
                    </div>
                    <div class="geo-stat">
                        <div class="geo-stat-value" id="geo-streak">0</div>
                        <div class="geo-stat-label">🔥 Série</div>
                    </div>
                    <div class="geo-stat">
                        <div class="geo-stat-value" id="geo-progress">0/0</div>
                        <div class="geo-stat-label">📊 Progression</div>
                    </div>
                </div>
                
                <div class="geo-question-card" id="geo-question-card">
                    <!-- Question générée ici -->
                </div>
                
                <button class="btn btn-back" onclick="backToGeoMenu()" style="margin-top: 20px;">
                    ← Retour au menu
                </button>
            </div>
            
            <!-- Résultats -->
            <div class="geo-results" style="display: none;" id="geo-results">
                <!-- Résultats générés ici -->
            </div>
        </div>
    `;
}

// ===== SÉLECTION MODE ET DIFFICULTÉ =====
function selectGeoMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function selectAnswerMode(mode) {
    currentAnswerMode = mode;
    document.querySelectorAll('.answer-mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function selectGeoDifficulty(difficulty) {
    currentDifficulty = difficulty;
    document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// ===== DÉMARRAGE DU QUIZ =====
function startGeoQuiz() {
    geoScore = {
        correct: 0,
        incorrect: 0,
        streak: 0,
        bestStreak: 0
    };
    
    if (currentDifficulty === 'all') {
        questionsPool = [...allCountries];
    } else {
        questionsPool = [...geographyData.categories[currentDifficulty]];
    }
    
    shuffleArray(questionsPool);
    currentQuestionIndex = 0;
    
    document.querySelector('.geo-menu').style.display = 'none';
    document.querySelector('.geo-game-container').style.display = 'block';
    
    showNextQuestion();
}

// ===== GÉNÉRATION DES QUESTIONS =====
function showNextQuestion() {
    if (currentQuestionIndex >= questionsPool.length) {
        showGeoResults();
        return;
    }
    
    currentQuestionGeo = questionsPool[currentQuestionIndex];
    updateGeoStats();
    
    if (currentMode === 'flags') {
        if (currentAnswerMode === 'text') {
            generateFlagQuestionText();
        } else {
            generateFlagQuestionMultiple();
        }
    } else {
        if (currentAnswerMode === 'text') {
            generateCapitalQuestionText();
        } else {
            generateCapitalQuestionMultiple();
        }
    }
}

function generateFlagQuestionText() {
    const questionCard = document.getElementById('geo-question-card');
    
    questionCard.innerHTML = `
        <div class="geo-question-header">
            <h2 style="color: var(--psych-sage); margin-bottom: 10px;">Question ${currentQuestionIndex + 1} / ${questionsPool.length}</h2>
            <p style="color: var(--text-light); font-size: 1.1em;">Quel pays a ce drapeau ?</p>
        </div>
        
        <div class="geo-flag-display">
            <img src="${currentQuestionGeo.drapeau_png}" alt="Drapeau" class="flag-image" />
        </div>
        
        <div class="geo-text-input-container">
            <input type="text" id="geo-text-answer" class="geo-text-input" placeholder="Écris le nom du pays..." autocomplete="off" />
            <button class="btn btn-primary" onclick="checkTextAnswer()" style="margin-top: 15px;">
                Valider ✓
            </button>
        </div>
        
        <div class="geo-feedback" id="geo-feedback"></div>
    `;
    
    // Focus sur l'input
    setTimeout(() => {
        document.getElementById('geo-text-answer').focus();
        // Permettre validation avec Entrée
        document.getElementById('geo-text-answer').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkTextAnswer();
            }
        });
    }, 100);
}

function generateFlagQuestionMultiple() {
    const questionCard = document.getElementById('geo-question-card');
    const incorrectAnswers = getRandomCountriesSameDifficulty(currentQuestionGeo, 3);
    const allAnswers = [currentQuestionGeo, ...incorrectAnswers];
    shuffleArray(allAnswers);
    
    questionCard.innerHTML = `
        <div class="geo-question-header">
            <h2 style="color: var(--psych-sage); margin-bottom: 10px;">Question ${currentQuestionIndex + 1} / ${questionsPool.length}</h2>
            <p style="color: var(--text-light); font-size: 1.1em;">Quel pays a ce drapeau ?</p>
        </div>
        
        <div class="geo-flag-display">
            <img src="${currentQuestionGeo.drapeau_png}" alt="Drapeau" class="flag-image" />
        </div>
        
        <div class="geo-answers">
            ${allAnswers.map(country => `
                <button class="geo-answer-btn" onclick="checkMultipleAnswer('${escapeQuotes(country.pays)}')">
                    ${country.pays}
                </button>
            `).join('')}
        </div>
        
        <div class="geo-feedback" id="geo-feedback"></div>
    `;
}

function generateCapitalQuestionText() {
    const questionCard = document.getElementById('geo-question-card');
    
    questionCard.innerHTML = `
        <div class="geo-question-header">
            <h2 style="color: var(--psych-sage); margin-bottom: 10px;">Question ${currentQuestionIndex + 1} / ${questionsPool.length}</h2>
            <p style="color: var(--text-light); font-size: 1.1em;">Quelle est la capitale de ${currentQuestionGeo.pays} ?</p>
        </div>
        
        <div class="geo-country-info">
            <div class="geo-flag-small">${currentQuestionGeo.drapeau}</div>
            <h3 style="color: var(--psych-coral); margin: 20px 0;">${currentQuestionGeo.pays}</h3>
        </div>
        
        <div class="geo-text-input-container">
            <input type="text" id="geo-text-answer" class="geo-text-input" placeholder="Écris le nom de la capitale..." autocomplete="off" />
            <button class="btn btn-primary" onclick="checkTextAnswer()" style="margin-top: 15px;">
                Valider ✓
            </button>
        </div>
        
        <div class="geo-feedback" id="geo-feedback"></div>
    `;
    
    setTimeout(() => {
        document.getElementById('geo-text-answer').focus();
        document.getElementById('geo-text-answer').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkTextAnswer();
            }
        });
    }, 100);
}

function generateCapitalQuestionMultiple() {
    const questionCard = document.getElementById('geo-question-card');
    const incorrectAnswers = getRandomCountriesSameDifficulty(currentQuestionGeo, 3);
    const allCapitals = [
        {country: currentQuestionGeo.pays, capital: currentQuestionGeo.capitale, correct: true},
        ...incorrectAnswers.map(c => ({country: c.pays, capital: c.capitale, correct: false}))
    ];
    shuffleArray(allCapitals);
    
    questionCard.innerHTML = `
        <div class="geo-question-header">
            <h2 style="color: var(--psych-sage); margin-bottom: 10px;">Question ${currentQuestionIndex + 1} / ${questionsPool.length}</h2>
            <p style="color: var(--text-light); font-size: 1.1em;">Quelle est la capitale de ${currentQuestionGeo.pays} ?</p>
        </div>
        
        <div class="geo-country-info">
            <div class="geo-flag-small">${currentQuestionGeo.drapeau}</div>
            <h3 style="color: var(--psych-coral); margin: 20px 0;">${currentQuestionGeo.pays}</h3>
        </div>
        
        <div class="geo-answers">
            ${allCapitals.map(item => `
                <button class="geo-answer-btn" onclick="checkMultipleAnswer('${escapeQuotes(item.capital)}')">
                    ${item.capital}
                </button>
            `).join('')}
        </div>
        
        <div class="geo-feedback" id="geo-feedback"></div>
    `;
}

// ===== VÉRIFICATION DES RÉPONSES =====
function checkTextAnswer() {
    const input = document.getElementById('geo-text-answer');
    if (!input) return;
    
    const answer = input.value.trim();
    if (!answer) {
        alert('Merci d\'écrire une réponse !');
        return;
    }
    
    const correctAnswer = currentMode === 'flags' ? currentQuestionGeo.pays : currentQuestionGeo.capitale;
    const isCorrect = normalizeString(answer) === normalizeString(correctAnswer);
    
    input.disabled = true;
    document.querySelector('.geo-text-input-container button').disabled = true;
    
    showFeedback(isCorrect, answer, correctAnswer);
}

function checkMultipleAnswer(answer) {
    const buttons = document.querySelectorAll('.geo-answer-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    const correctAnswer = currentMode === 'flags' ? currentQuestionGeo.pays : currentQuestionGeo.capitale;
    const isCorrect = answer === correctAnswer;
    
    showFeedback(isCorrect, answer, correctAnswer);
}

function showFeedback(isCorrect, userAnswer, correctAnswer) {
    const feedback = document.getElementById('geo-feedback');
    
    if (isCorrect) {
        geoScore.correct++;
        geoScore.streak++;
        if (geoScore.streak > geoScore.bestStreak) {
            geoScore.bestStreak = geoScore.streak;
        }
        
        feedback.innerHTML = `
            <div class="feedback-correct">
                <div style="font-size: 2em; margin-bottom: 10px;">✅ Correct !</div>
                <div style="font-size: 1.2em; margin-bottom: 15px;">C'est bien <strong>${correctAnswer}</strong></div>
                <div class="country-details">
                    <div>🏛️ <strong>Capitale :</strong> ${currentQuestionGeo.capitale}</div>
                    <div>📏 <strong>Superficie :</strong> ${formatSuperficie(currentQuestionGeo.superficie)}</div>
                    <div>👥 <strong>Population :</strong> ${formatNumber(currentQuestionGeo.population)}</div>
                </div>
                <button class="btn btn-primary" onclick="nextGeoQuestion()" style="margin-top: 20px;">
                    Question suivante →
                </button>
            </div>
        `;
    } else {
        geoScore.incorrect++;
        geoScore.streak = 0;
        
        feedback.innerHTML = `
            <div class="feedback-incorrect">
                <div style="font-size: 2em; margin-bottom: 10px;">❌ Incorrect</div>
                <div style="font-size: 1.2em; margin-bottom: 15px;">
                    ${userAnswer !== correctAnswer ? `Tu as répondu : <strong>${userAnswer}</strong><br>` : ''}
                    La bonne réponse était <strong>${correctAnswer}</strong>
                </div>
                <div class="country-details">
                    <div>🏛️ <strong>Capitale :</strong> ${currentQuestionGeo.capitale}</div>
                    <div>📏 <strong>Superficie :</strong> ${formatSuperficie(currentQuestionGeo.superficie)}</div>
                    <div>👥 <strong>Population :</strong> ${formatNumber(currentQuestionGeo.population)}</div>
                </div>
                <button class="btn btn-primary" onclick="nextGeoQuestion()" style="margin-top: 20px;">
                    Question suivante →
                </button>
            </div>
        `;
    }
    
    geoHistory.push({
        question: currentMode === 'flags' ? currentQuestionGeo.pays : `Capitale de ${currentQuestionGeo.pays}`,
        answer: userAnswer,
        correct: isCorrect,
        mode: currentMode,
        date: new Date().toLocaleString()
    });
}

// ===== NAVIGATION =====
function nextGeoQuestion() {
    currentQuestionIndex++;
    showNextQuestion();
}

function backToGeoMenu() {
    document.querySelector('.geo-menu').style.display = 'block';
    document.querySelector('.geo-game-container').style.display = 'none';
    document.querySelector('.geo-results').style.display = 'none';
}

// ===== MISE À JOUR DES STATISTIQUES =====
function updateGeoStats() {
    document.getElementById('geo-score-correct').textContent = geoScore.correct;
    document.getElementById('geo-score-incorrect').textContent = geoScore.incorrect;
    document.getElementById('geo-streak').textContent = geoScore.streak;
    document.getElementById('geo-progress').textContent = `${currentQuestionIndex + 1}/${questionsPool.length}`;
}

// ===== RÉSULTATS =====
function showGeoResults() {
    document.querySelector('.geo-game-container').style.display = 'none';
    const resultsDiv = document.getElementById('geo-results');
    resultsDiv.style.display = 'block';
    
    const total = geoScore.correct + geoScore.incorrect;
    const percentage = total > 0 ? Math.round((geoScore.correct / total) * 100) : 0;
    
    let emoji = '🎉';
    let message = 'Bravo !';
    
    if (percentage >= 90) {
        emoji = '🏆';
        message = 'Excellent ! Champion de géographie !';
    } else if (percentage >= 75) {
        emoji = '⭐';
        message = 'Très bien ! Tu connais ta géographie !';
    } else if (percentage >= 50) {
        emoji = '👍';
        message = 'Pas mal ! Continue comme ça !';
    } else {
        emoji = '📚';
        message = 'Il faut réviser un peu la géographie !';
    }
    
    resultsDiv.innerHTML = `
        <div class="geo-results-card">
            <h2 style="color: var(--psych-sage); font-size: 2.5em; margin-bottom: 20px;">
                ${emoji} Résultats ${emoji}
            </h2>
            
            <div class="geo-final-message">
                <div style="font-size: 1.5em; margin-bottom: 20px;">${message}</div>
                <div style="font-size: 3em; font-weight: 700; color: var(--psych-coral); margin: 20px 0;">
                    ${percentage}%
                </div>
                <div style="font-size: 1.2em; color: var(--text-light);">
                    ${geoScore.correct} bonnes réponses sur ${total}
                </div>
            </div>
            
            <div class="geo-results-stats">
                <div class="result-stat-card">
                    <div class="result-stat-value" style="color: #28a745;">✅ ${geoScore.correct}</div>
                    <div class="result-stat-label">Corrects</div>
                </div>
                <div class="result-stat-card">
                    <div class="result-stat-value" style="color: #dc3545;">❌ ${geoScore.incorrect}</div>
                    <div class="result-stat-label">Incorrects</div>
                </div>
                <div class="result-stat-card">
                    <div class="result-stat-value" style="color: #ff6b35;">🔥 ${geoScore.bestStreak}</div>
                    <div class="result-stat-label">Meilleure série</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="startGeoQuiz()">
                    Rejouer 🔄
                </button>
                <button class="btn btn-secondary" onclick="backToGeoMenu()">
                    Changer de mode 🎯
                </button>
            </div>
        </div>
    `;
}

// ===== FONCTIONS UTILITAIRES =====
function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever les accents
        .replace(/[^\w\s]/g, '') // Enlever la ponctuation
        .replace(/\s+/g, ' ') // Normaliser les espaces
        .trim();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomCountries(exclude, count) {
    const available = allCountries.filter(c => c.pays !== exclude.pays);
    const selected = [];
    
    for (let i = 0; i < count && available.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * available.length);
        selected.push(available[randomIndex]);
        available.splice(randomIndex, 1);
    }
    
    return selected;
}

function getRandomCountriesSameDifficulty(exclude, count) {
    const available = allCountries.filter(c => c.pays !== exclude.pays && c.difficulte === exclude.difficulte);
    const selected = [];
    
    for (let i = 0; i < count && available.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * available.length);
        selected.push(available[randomIndex]);
        available.splice(randomIndex, 1);
    }
    
    return selected;
}

function escapeQuotes(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + ' Mrd';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + ' M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + ' K';
    }
    return num.toString();
}

function formatSuperficie(superficie) {
    if (superficie >= 1000000) {
        return (superficie / 1000000).toFixed(2) + ' M km²';
    } else if (superficie >= 1000) {
        return (superficie / 1000).toFixed(0) + ' k km²';
    }
    return superficie.toFixed(0) + ' km²';
}

// ===== PROBLEME DE JSON DONC ON FAIT COMME CA =====

const geographyData = 
{
  "metadata": {
    "description": "Catégorisation des pays selon la difficulté de reconnaissance de leur drapeau",
    "source": "Quiz de reconnaissance de drapeaux",
    "categories": {
      "tres_facile": "80-98% de reconnaissance",
      "facile": "60-79% de reconnaissance",
      "difficile": "40-59% de reconnaissance",
      "tres_difficile": "12-39% de reconnaissance"
    }
  },
  "categories": {
    "tres_facile": [
      {
        "pays": "Etats-Unis",
        "pourcentage": 98,
        "drapeau": "🇺🇸",
        "capitale": "Washington D.C.",
        "population": 331900000,
        "superficie": 9833517,
        "drapeau_png": "https://flagcdn.com/w320/us.png",
        "drapeau_svg": "https://flagcdn.com/us.svg"
      },
      {
        "pays": "Canada",
        "pourcentage": 96,
        "drapeau": "🇨🇦",
        "capitale": "Ottawa",
        "population": 38000000,
        "superficie": 9984670,
        "drapeau_png": "https://flagcdn.com/w320/ca.png",
        "drapeau_svg": "https://flagcdn.com/ca.svg"
      },
      {
        "pays": "France",
        "pourcentage": 96,
        "drapeau": "🇫🇷",
        "capitale": "Paris",
        "population": 67390000,
        "superficie": 643801,
        "drapeau_png": "https://flagcdn.com/w320/fr.png",
        "drapeau_svg": "https://flagcdn.com/fr.svg"
      },
      {
        "pays": "Royaume-Uni",
        "pourcentage": 96,
        "drapeau": "🇬🇧",
        "capitale": "Londres",
        "population": 67220000,
        "superficie": 243610,
        "drapeau_png": "https://flagcdn.com/w320/gb.png",
        "drapeau_svg": "https://flagcdn.com/gb.svg"
      },
      {
        "pays": "Italie",
        "pourcentage": 95,
        "drapeau": "🇮🇹",
        "capitale": "Rome",
        "population": 60360000,
        "superficie": 301340,
        "drapeau_png": "https://flagcdn.com/w320/it.png",
        "drapeau_svg": "https://flagcdn.com/it.svg"
      },
      {
        "pays": "Australie",
        "pourcentage": 92,
        "drapeau": "🇦🇺",
        "capitale": "Canberra",
        "population": 25690000,
        "superficie": 7692024,
        "drapeau_png": "https://flagcdn.com/w320/au.png",
        "drapeau_svg": "https://flagcdn.com/au.svg"
      },
      {
        "pays": "Japon",
        "pourcentage": 92,
        "drapeau": "🇯🇵",
        "capitale": "Tokyo",
        "population": 125800000,
        "superficie": 377975,
        "drapeau_png": "https://flagcdn.com/w320/jp.png",
        "drapeau_svg": "https://flagcdn.com/jp.svg"
      },
      {
        "pays": "Brésil",
        "pourcentage": 91,
        "drapeau": "🇧🇷",
        "capitale": "Brasília",
        "population": 215300000,
        "superficie": 8515767,
        "drapeau_png": "https://flagcdn.com/w320/br.png",
        "drapeau_svg": "https://flagcdn.com/br.svg"
      },
      {
        "pays": "Corée du Sud",
        "pourcentage": 90,
        "drapeau": "🇰🇷",
        "capitale": "Séoul",
        "population": 51780000,
        "superficie": 100210,
        "drapeau_png": "https://flagcdn.com/w320/kr.png",
        "drapeau_svg": "https://flagcdn.com/kr.svg"
      },
      {
        "pays": "Russie",
        "pourcentage": 90,
        "drapeau": "🇷🇺",
        "capitale": "Moscou",
        "population": 146170000,
        "superficie": 17098242,
        "drapeau_png": "https://flagcdn.com/w320/ru.png",
        "drapeau_svg": "https://flagcdn.com/ru.svg"
      },
      {
        "pays": "Irlande",
        "pourcentage": 88,
        "drapeau": "🇮🇪",
        "capitale": "Dublin",
        "population": 4990000,
        "superficie": 70273,
        "drapeau_png": "https://flagcdn.com/w320/ie.png",
        "drapeau_svg": "https://flagcdn.com/ie.svg"
      },
      {
        "pays": "Belgique",
        "pourcentage": 87,
        "drapeau": "🇧🇪",
        "capitale": "Bruxelles",
        "population": 11590000,
        "superficie": 30528,
        "drapeau_png": "https://flagcdn.com/w320/be.png",
        "drapeau_svg": "https://flagcdn.com/be.svg"
      },
      {
        "pays": "Chine",
        "pourcentage": 87,
        "drapeau": "🇨🇳",
        "capitale": "Pékin",
        "population": 1439323776,
        "superficie": 9596960,
        "drapeau_png": "https://flagcdn.com/w320/cn.png",
        "drapeau_svg": "https://flagcdn.com/cn.svg"
      },
      {
        "pays": "Suède",
        "pourcentage": 87,
        "drapeau": "🇸🇪",
        "capitale": "Stockholm",
        "population": 10350000,
        "superficie": 450295,
        "drapeau_png": "https://flagcdn.com/w320/se.png",
        "drapeau_svg": "https://flagcdn.com/se.svg"
      },
      {
        "pays": "Suisse",
        "pourcentage": 87,
        "drapeau": "🇨🇭",
        "capitale": "Berne",
        "population": 8650000,
        "superficie": 41285,
        "drapeau_png": "https://flagcdn.com/w320/ch.png",
        "drapeau_svg": "https://flagcdn.com/ch.svg"
      },
      {
        "pays": "Espagne",
        "pourcentage": 86,
        "drapeau": "🇪🇸",
        "capitale": "Madrid",
        "population": 47350000,
        "superficie": 505992,
        "drapeau_png": "https://flagcdn.com/w320/es.png",
        "drapeau_svg": "https://flagcdn.com/es.svg"
      },
      {
        "pays": "Grèce",
        "pourcentage": 86,
        "drapeau": "🇬🇷",
        "capitale": "Athènes",
        "population": 10720000,
        "superficie": 131957,
        "drapeau_png": "https://flagcdn.com/w320/gr.png",
        "drapeau_svg": "https://flagcdn.com/gr.svg"
      },
      {
        "pays": "Pays-Bas",
        "pourcentage": 86,
        "drapeau": "🇳🇱",
        "capitale": "Amsterdam",
        "population": 17440000,
        "superficie": 41850,
        "drapeau_png": "https://flagcdn.com/w320/nl.png",
        "drapeau_svg": "https://flagcdn.com/nl.svg"
      },
      {
        "pays": "Algérie",
        "pourcentage": 85,
        "drapeau": "🇩🇿",
        "capitale": "Alger",
        "population": 44620000,
        "superficie": 2381741,
        "drapeau_png": "https://flagcdn.com/w320/dz.png",
        "drapeau_svg": "https://flagcdn.com/dz.svg"
      },
      {
        "pays": "Allemagne",
        "pourcentage": 85,
        "drapeau": "🇩🇪",
        "capitale": "Berlin",
        "population": 83240000,
        "superficie": 357114,
        "drapeau_png": "https://flagcdn.com/w320/de.png",
        "drapeau_svg": "https://flagcdn.com/de.svg"
      },
      {
        "pays": "Turquie",
        "pourcentage": 84,
        "drapeau": "🇹🇷",
        "capitale": "Ankara",
        "population": 84340000,
        "superficie": 783562,
        "drapeau_png": "https://flagcdn.com/w320/tr.png",
        "drapeau_svg": "https://flagcdn.com/tr.svg"
      },
      {
        "pays": "Nouvelle-Zélande",
        "pourcentage": 83,
        "drapeau": "🇳🇿",
        "capitale": "Wellington",
        "population": 5080000,
        "superficie": 268838,
        "drapeau_png": "https://flagcdn.com/w320/nz.png",
        "drapeau_svg": "https://flagcdn.com/nz.svg"
      },
      {
        "pays": "Argentine",
        "pourcentage": 82,
        "drapeau": "🇦🇷",
        "capitale": "Buenos Aires",
        "population": 45380000,
        "superficie": 2780400,
        "drapeau_png": "https://flagcdn.com/w320/ar.png",
        "drapeau_svg": "https://flagcdn.com/ar.svg"
      },
      {
        "pays": "Israël",
        "pourcentage": 82,
        "drapeau": "🇮🇱",
        "capitale": "Jérusalem",
        "population": 9364000,
        "superficie": 20770,
        "drapeau_png": "https://flagcdn.com/w320/il.png",
        "drapeau_svg": "https://flagcdn.com/il.svg"
      },
      {
        "pays": "Norvège",
        "pourcentage": 82,
        "drapeau": "🇳🇴",
        "capitale": "Oslo",
        "population": 5420000,
        "superficie": 323802,
        "drapeau_png": "https://flagcdn.com/w320/no.png",
        "drapeau_svg": "https://flagcdn.com/no.svg"
      },
      {
        "pays": "Afrique du Sud",
        "pourcentage": 81,
        "drapeau": "🇿🇦",
        "capitale": "Le Cap",
        "population": 59310000,
        "superficie": 1221037,
        "drapeau_png": "https://flagcdn.com/w320/za.png",
        "drapeau_svg": "https://flagcdn.com/za.svg"
      },
      {
        "pays": "Inde",
        "pourcentage": 81,
        "drapeau": "🇮🇳",
        "capitale": "New Delhi",
        "population": 1380004385,
        "superficie": 3287263,
        "drapeau_png": "https://flagcdn.com/w320/in.png",
        "drapeau_svg": "https://flagcdn.com/in.svg"
      }
    ],
    "facile": [
      {
        "pays": "Finlande",
        "pourcentage": 80,
        "drapeau": "🇫🇮",
        "capitale": "Helsinki",
        "population": 5540000,
        "superficie": 338424,
        "drapeau_png": "https://flagcdn.com/w320/fi.png",
        "drapeau_svg": "https://flagcdn.com/fi.svg"
      },
      {
        "pays": "Mexique",
        "pourcentage": 80,
        "drapeau": "🇲🇽",
        "capitale": "Mexico",
        "population": 128930000,
        "superficie": 1964375,
        "drapeau_png": "https://flagcdn.com/w320/mx.png",
        "drapeau_svg": "https://flagcdn.com/mx.svg"
      },
      {
        "pays": "Tunisie",
        "pourcentage": 79,
        "drapeau": "🇹🇳",
        "capitale": "Tunis",
        "population": 11820000,
        "superficie": 163610,
        "drapeau_png": "https://flagcdn.com/w320/tn.png",
        "drapeau_svg": "https://flagcdn.com/tn.svg"
      },
      {
        "pays": "Chypre",
        "pourcentage": 77,
        "drapeau": "🇨🇾",
        "capitale": "Nicosie",
        "population": 1210000,
        "superficie": 9251,
        "drapeau_png": "https://flagcdn.com/w320/cy.png",
        "drapeau_svg": "https://flagcdn.com/cy.svg"
      },
      {
        "pays": "Albanie",
        "pourcentage": 76,
        "drapeau": "🇦🇱",
        "capitale": "Tirana",
        "population": 2880000,
        "superficie": 28748,
        "drapeau_png": "https://flagcdn.com/w320/al.png",
        "drapeau_svg": "https://flagcdn.com/al.svg"
      },
      {
        "pays": "Jamaïque",
        "pourcentage": 76,
        "drapeau": "🇯🇲",
        "capitale": "Kingston",
        "population": 2960000,
        "superficie": 10991,
        "drapeau_png": "https://flagcdn.com/w320/jm.png",
        "drapeau_svg": "https://flagcdn.com/jm.svg"
      },
      {
        "pays": "Pologne",
        "pourcentage": 76,
        "drapeau": "🇵🇱",
        "capitale": "Varsovie",
        "population": 37950000,
        "superficie": 312696,
        "drapeau_png": "https://flagcdn.com/w320/pl.png",
        "drapeau_svg": "https://flagcdn.com/pl.svg"
      },
      {
        "pays": "Côte d'Ivoire",
        "pourcentage": 75,
        "drapeau": "🇨🇮",
        "capitale": "Yamoussoukro",
        "population": 26380000,
        "superficie": 322463,
        "drapeau_png": "https://flagcdn.com/w320/ci.png",
        "drapeau_svg": "https://flagcdn.com/ci.svg"
      },
      {
        "pays": "Arabie Saoudite",
        "pourcentage": 73,
        "drapeau": "🇸🇦",
        "capitale": "Riyad",
        "population": 34810000,
        "superficie": 2149690,
        "drapeau_png": "https://flagcdn.com/w320/sa.png",
        "drapeau_svg": "https://flagcdn.com/sa.svg"
      },
      {
        "pays": "Danemark",
        "pourcentage": 73,
        "drapeau": "🇩🇰",
        "capitale": "Copenhague",
        "population": 5830000,
        "superficie": 43094,
        "drapeau_png": "https://flagcdn.com/w320/dk.png",
        "drapeau_svg": "https://flagcdn.com/dk.svg"
      },
      {
        "pays": "Portugal",
        "pourcentage": 72,
        "drapeau": "🇵🇹",
        "capitale": "Lisbonne",
        "population": 10290000,
        "superficie": 92090,
        "drapeau_png": "https://flagcdn.com/w320/pt.png",
        "drapeau_svg": "https://flagcdn.com/pt.svg"
      },
      {
        "pays": "Liban",
        "pourcentage": 71,
        "drapeau": "🇱🇧",
        "capitale": "Beyrouth",
        "population": 6830000,
        "superficie": 10452,
        "drapeau_png": "https://flagcdn.com/w320/lb.png",
        "drapeau_svg": "https://flagcdn.com/lb.svg"
      },
      {
        "pays": "Croatie",
        "pourcentage": 70,
        "drapeau": "🇭🇷",
        "capitale": "Zagreb",
        "population": 4060000,
        "superficie": 56594,
        "drapeau_png": "https://flagcdn.com/w320/hr.png",
        "drapeau_svg": "https://flagcdn.com/hr.svg"
      },
      {
        "pays": "Maroc",
        "pourcentage": 70,
        "drapeau": "🇲🇦",
        "capitale": "Rabat",
        "population": 37460000,
        "superficie": 446550,
        "drapeau_png": "https://flagcdn.com/w320/ma.png",
        "drapeau_svg": "https://flagcdn.com/ma.svg"
      },
      {
        "pays": "Égypte",
        "pourcentage": 69,
        "drapeau": "🇪🇬",
        "capitale": "Le Caire",
        "population": 102330000,
        "superficie": 1001450,
        "drapeau_png": "https://flagcdn.com/w320/eg.png",
        "drapeau_svg": "https://flagcdn.com/eg.svg"
      },
      {
        "pays": "Viêt Nam",
        "pourcentage": 67,
        "drapeau": "🇻🇳",
        "capitale": "Hanoï",
        "population": 97340000,
        "superficie": 331212,
        "drapeau_png": "https://flagcdn.com/w320/vn.png",
        "drapeau_svg": "https://flagcdn.com/vn.svg"
      },
      {
        "pays": "Bulgarie",
        "pourcentage": 66,
        "drapeau": "🇧🇬",
        "capitale": "Sofia",
        "population": 6950000,
        "superficie": 110879,
        "drapeau_png": "https://flagcdn.com/w320/bg.png",
        "drapeau_svg": "https://flagcdn.com/bg.svg"
      },
      {
        "pays": "Islande",
        "pourcentage": 66,
        "drapeau": "🇮🇸",
        "capitale": "Reykjavik",
        "population": 341000,
        "superficie": 103000,
        "drapeau_png": "https://flagcdn.com/w320/is.png",
        "drapeau_svg": "https://flagcdn.com/is.svg"
      },
      {
        "pays": "Népal",
        "pourcentage": 66,
        "drapeau": "🇳🇵",
        "capitale": "Katmandou",
        "population": 29140000,
        "superficie": 147181,
        "drapeau_png": "https://flagcdn.com/w320/np.png",
        "drapeau_svg": "https://flagcdn.com/np.svg"
      },
      {
        "pays": "Uruguay",
        "pourcentage": 65,
        "drapeau": "🇺🇾",
        "capitale": "Montevideo",
        "population": 3470000,
        "superficie": 176215,
        "drapeau_png": "https://flagcdn.com/w320/uy.png",
        "drapeau_svg": "https://flagcdn.com/uy.svg"
      },
      {
        "pays": "Géorgie",
        "pourcentage": 64,
        "drapeau": "🇬🇪",
        "capitale": "Tbilissi",
        "population": 3990000,
        "superficie": 69700,
        "drapeau_png": "https://flagcdn.com/w320/ge.png",
        "drapeau_svg": "https://flagcdn.com/ge.svg"
      },
      {
        "pays": "Autriche",
        "pourcentage": 63,
        "drapeau": "🇦🇹",
        "capitale": "Vienne",
        "population": 9010000,
        "superficie": 83871,
        "drapeau_png": "https://flagcdn.com/w320/at.png",
        "drapeau_svg": "https://flagcdn.com/at.svg"
      },
      {
        "pays": "Cameroun",
        "pourcentage": 63,
        "drapeau": "🇨🇲",
        "capitale": "Yaoundé",
        "population": 26550000,
        "superficie": 475442,
        "drapeau_png": "https://flagcdn.com/w320/cm.png",
        "drapeau_svg": "https://flagcdn.com/cm.svg"
      },
      {
        "pays": "Hongrie",
        "pourcentage": 62,
        "drapeau": "🇭🇺",
        "capitale": "Budapest",
        "population": 9660000,
        "superficie": 93028,
        "drapeau_png": "https://flagcdn.com/w320/hu.png",
        "drapeau_svg": "https://flagcdn.com/hu.svg"
      },
      {
        "pays": "Macédoine du Nord",
        "pourcentage": 62,
        "drapeau": "🇲🇰",
        "capitale": "Skopje",
        "population": 2080000,
        "superficie": 25713,
        "drapeau_png": "https://flagcdn.com/w320/mk.png",
        "drapeau_svg": "https://flagcdn.com/mk.svg"
      },
      {
        "pays": "Roumanie",
        "pourcentage": 62,
        "drapeau": "🇷🇴",
        "capitale": "Bucarest",
        "population": 19240000,
        "superficie": 238391,
        "drapeau_png": "https://flagcdn.com/w320/ro.png",
        "drapeau_svg": "https://flagcdn.com/ro.svg"
      },
      {
        "pays": "Monaco",
        "pourcentage": 60,
        "drapeau": "🇲🇨",
        "capitale": "Monaco",
        "population": 39000,
        "superficie": 2,
        "drapeau_png": "https://flagcdn.com/w320/mc.png",
        "drapeau_svg": "https://flagcdn.com/mc.svg"
      },
      {
        "pays": "Vatican",
        "pourcentage": 60,
        "drapeau": "🇻🇦",
        "capitale": "Vatican",
        "population": 800,
        "superficie": 0.44,
        "drapeau_png": "https://flagcdn.com/w320/va.png",
        "drapeau_svg": "https://flagcdn.com/va.svg"
      }
    ],
    "difficile": [
      {
        "pays": "République démocratique du Congo",
        "pourcentage": 59,
        "drapeau": "🇨🇩",
        "capitale": "Kinshasa",
        "population": 89560000,
        "superficie": 2344858,
        "drapeau_png": "https://flagcdn.com/w320/cd.png",
        "drapeau_svg": "https://flagcdn.com/cd.svg"
      },
      {
        "pays": "Bangladesh",
        "pourcentage": 58,
        "drapeau": "🇧🇩",
        "capitale": "Dhaka",
        "population": 164690000,
        "superficie": 148460,
        "drapeau_png": "https://flagcdn.com/w320/bd.png",
        "drapeau_svg": "https://flagcdn.com/bd.svg"
      },
      {
        "pays": "Corée du Nord",
        "pourcentage": 58,
        "drapeau": "🇰🇵",
        "capitale": "Pyongyang",
        "population": 25780000,
        "superficie": 120538,
        "drapeau_png": "https://flagcdn.com/w320/kp.png",
        "drapeau_svg": "https://flagcdn.com/kp.svg"
      },
      {
        "pays": "Kenya",
        "pourcentage": 58,
        "drapeau": "🇰🇪",
        "capitale": "Nairobi",
        "population": 53770000,
        "superficie": 580367,
        "drapeau_png": "https://flagcdn.com/w320/ke.png",
        "drapeau_svg": "https://flagcdn.com/ke.svg"
      },
      {
        "pays": "Malte",
        "pourcentage": 58,
        "drapeau": "🇲🇹",
        "capitale": "La Valette",
        "population": 441000,
        "superficie": 316,
        "drapeau_png": "https://flagcdn.com/w320/mt.png",
        "drapeau_svg": "https://flagcdn.com/mt.svg"
      },
      {
        "pays": "Pakistan",
        "pourcentage": 58,
        "drapeau": "🇵🇰",
        "capitale": "Islamabad",
        "population": 220890000,
        "superficie": 881913,
        "drapeau_png": "https://flagcdn.com/w320/pk.png",
        "drapeau_svg": "https://flagcdn.com/pk.svg"
      },
      {
        "pays": "Ukraine",
        "pourcentage": 57,
        "drapeau": "🇺🇦",
        "capitale": "Kiev",
        "population": 44130000,
        "superficie": 603550,
        "drapeau_png": "https://flagcdn.com/w320/ua.png",
        "drapeau_svg": "https://flagcdn.com/ua.svg"
      },
      {
        "pays": "Cuba",
        "pourcentage": 55,
        "drapeau": "🇨🇺",
        "capitale": "La Havane",
        "population": 11330000,
        "superficie": 109884,
        "drapeau_png": "https://flagcdn.com/w320/cu.png",
        "drapeau_svg": "https://flagcdn.com/cu.svg"
      },
      {
        "pays": "Kosovo",
        "pourcentage": 54,
        "drapeau": "🇽🇰",
        "capitale": "Pristina",
        "population": 1870000,
        "superficie": 10887,
        "drapeau_png": "https://flagcdn.com/w320/xk.png",
        "drapeau_svg": "https://flagcdn.com/xk.svg"
      },
      {
        "pays": "Qatar",
        "pourcentage": 54,
        "drapeau": "🇶🇦",
        "capitale": "Doha",
        "population": 2880000,
        "superficie": 11586,
        "drapeau_png": "https://flagcdn.com/w320/qa.png",
        "drapeau_svg": "https://flagcdn.com/qa.svg"
      },
      {
        "pays": "Chili",
        "pourcentage": 53,
        "drapeau": "🇨🇱",
        "capitale": "Santiago",
        "population": 19120000,
        "superficie": 756102,
        "drapeau_png": "https://flagcdn.com/w320/cl.png",
        "drapeau_svg": "https://flagcdn.com/cl.svg"
      },
      {
        "pays": "République tchèque",
        "pourcentage": 53,
        "drapeau": "🇨🇿",
        "capitale": "Prague",
        "population": 10710000,
        "superficie": 78867,
        "drapeau_png": "https://flagcdn.com/w320/cz.png",
        "drapeau_svg": "https://flagcdn.com/cz.svg"
      },
      {
        "pays": "Iran",
        "pourcentage": 52,
        "drapeau": "🇮🇷",
        "capitale": "Téhéran",
        "population": 83990000,
        "superficie": 1648195,
        "drapeau_png": "https://flagcdn.com/w320/ir.png",
        "drapeau_svg": "https://flagcdn.com/ir.svg"
      },
      {
        "pays": "Slovaquie",
        "pourcentage": 52,
        "drapeau": "🇸🇰",
        "capitale": "Bratislava",
        "population": 5460000,
        "superficie": 49037,
        "drapeau_png": "https://flagcdn.com/w320/sk.png",
        "drapeau_svg": "https://flagcdn.com/sk.svg"
      },
      {
        "pays": "Irak",
        "pourcentage": 51,
        "drapeau": "🇮🇶",
        "capitale": "Bagdad",
        "population": 40220000,
        "superficie": 438317,
        "drapeau_png": "https://flagcdn.com/w320/iq.png",
        "drapeau_svg": "https://flagcdn.com/iq.svg"
      },
      {
        "pays": "Luxembourg",
        "pourcentage": 51,
        "drapeau": "🇱🇺",
        "capitale": "Luxembourg",
        "population": 626000,
        "superficie": 2586,
        "drapeau_png": "https://flagcdn.com/w320/lu.png",
        "drapeau_svg": "https://flagcdn.com/lu.svg"
      },
      {
        "pays": "Sénégal",
        "pourcentage": 51,
        "drapeau": "🇸🇳",
        "capitale": "Dakar",
        "population": 16740000,
        "superficie": 196722,
        "drapeau_png": "https://flagcdn.com/w320/sn.png",
        "drapeau_svg": "https://flagcdn.com/sn.svg"
      },
      {
        "pays": "Serbie",
        "pourcentage": 51,
        "drapeau": "🇷🇸",
        "capitale": "Belgrade",
        "population": 8740000,
        "superficie": 77474,
        "drapeau_png": "https://flagcdn.com/w320/rs.png",
        "drapeau_svg": "https://flagcdn.com/rs.svg"
      },
      {
        "pays": "Indonésie",
        "pourcentage": 50,
        "drapeau": "🇮🇩",
        "capitale": "Jakarta",
        "population": 273520000,
        "superficie": 1904569,
        "drapeau_png": "https://flagcdn.com/w320/id.png",
        "drapeau_svg": "https://flagcdn.com/id.svg"
      },
      {
        "pays": "Madagascar",
        "pourcentage": 50,
        "drapeau": "🇲🇬",
        "capitale": "Antananarivo",
        "population": 27690000,
        "superficie": 587041,
        "drapeau_png": "https://flagcdn.com/w320/mg.png",
        "drapeau_svg": "https://flagcdn.com/mg.svg"
      },
      {
        "pays": "Pérou",
        "pourcentage": 50,
        "drapeau": "🇵🇪",
        "capitale": "Lima",
        "population": 32970000,
        "superficie": 1285216,
        "drapeau_png": "https://flagcdn.com/w320/pe.png",
        "drapeau_svg": "https://flagcdn.com/pe.svg"
      },
      {
        "pays": "Venezuela",
        "pourcentage": 50,
        "drapeau": "🇻🇪",
        "capitale": "Caracas",
        "population": 28440000,
        "superficie": 912050,
        "drapeau_png": "https://flagcdn.com/w320/ve.png",
        "drapeau_svg": "https://flagcdn.com/ve.svg"
      },
      {
        "pays": "Colombie",
        "pourcentage": 49,
        "drapeau": "🇨🇴",
        "capitale": "Bogotá",
        "population": 50880000,
        "superficie": 1141748,
        "drapeau_png": "https://flagcdn.com/w320/co.png",
        "drapeau_svg": "https://flagcdn.com/co.svg"
      },
      {
        "pays": "Panama",
        "pourcentage": 49,
        "drapeau": "🇵🇦",
        "capitale": "Panama",
        "population": 4310000,
        "superficie": 75417,
        "drapeau_png": "https://flagcdn.com/w320/pa.png",
        "drapeau_svg": "https://flagcdn.com/pa.svg"
      },
      {
        "pays": "Nigeria",
        "pourcentage": 48,
        "drapeau": "🇳🇬",
        "capitale": "Abuja",
        "population": 206140000,
        "superficie": 923768,
        "drapeau_png": "https://flagcdn.com/w320/ng.png",
        "drapeau_svg": "https://flagcdn.com/ng.svg"
      },
      {
        "pays": "Slovénie",
        "pourcentage": 48,
        "drapeau": "🇸🇮",
        "capitale": "Ljubljana",
        "population": 2080000,
        "superficie": 20273,
        "drapeau_png": "https://flagcdn.com/w320/si.png",
        "drapeau_svg": "https://flagcdn.com/si.svg"
      },
      {
        "pays": "Saint-Marin",
        "pourcentage": 47,
        "drapeau": "🇸🇲",
        "capitale": "Saint-Marin",
        "population": 34000,
        "superficie": 61,
        "drapeau_png": "https://flagcdn.com/w320/sm.png",
        "drapeau_svg": "https://flagcdn.com/sm.svg"
      },
      {
        "pays": "Bosnie-Herzégovine",
        "pourcentage": 46,
        "drapeau": "🇧🇦",
        "capitale": "Sarajevo",
        "population": 3280000,
        "superficie": 51197,
        "drapeau_png": "https://flagcdn.com/w320/ba.png",
        "drapeau_svg": "https://flagcdn.com/ba.svg"
      },
      {
        "pays": "Estonie",
        "pourcentage": 46,
        "drapeau": "🇪🇪",
        "capitale": "Tallinn",
        "population": 1330000,
        "superficie": 45228,
        "drapeau_png": "https://flagcdn.com/w320/ee.png",
        "drapeau_svg": "https://flagcdn.com/ee.svg"
      },
      {
        "pays": "Kazakhstan",
        "pourcentage": 46,
        "drapeau": "🇰🇿",
        "capitale": "Nur-Sultan",
        "population": 18780000,
        "superficie": 2724900,
        "drapeau_png": "https://flagcdn.com/w320/kz.png",
        "drapeau_svg": "https://flagcdn.com/kz.svg"
      },
      {
        "pays": "Malaisie",
        "pourcentage": 46,
        "drapeau": "🇲🇾",
        "capitale": "Kuala Lumpur",
        "population": 32370000,
        "superficie": 329847,
        "drapeau_png": "https://flagcdn.com/w320/my.png",
        "drapeau_svg": "https://flagcdn.com/my.svg"
      },
      {
        "pays": "Bhoutan",
        "pourcentage": 44,
        "drapeau": "🇧🇹",
        "capitale": "Thimphou",
        "population": 772000,
        "superficie": 38394,
        "drapeau_png": "https://flagcdn.com/w320/bt.png",
        "drapeau_svg": "https://flagcdn.com/bt.svg"
      },
      {
        "pays": "Cambodge",
        "pourcentage": 44,
        "drapeau": "🇰🇭",
        "capitale": "Phnom Penh",
        "population": 16720000,
        "superficie": 181035,
        "drapeau_png": "https://flagcdn.com/w320/kh.png",
        "drapeau_svg": "https://flagcdn.com/kh.svg"
      },
      {
        "pays": "République dominicaine",
        "pourcentage": 44,
        "drapeau": "🇩🇴",
        "capitale": "Saint-Domingue",
        "population": 10850000,
        "superficie": 48671,
        "drapeau_png": "https://flagcdn.com/w320/do.png",
        "drapeau_svg": "https://flagcdn.com/do.svg"
      },
      {
        "pays": "Singapour",
        "pourcentage": 44,
        "drapeau": "🇸🇬",
        "capitale": "Singapour",
        "population": 5850000,
        "superficie": 719,
        "drapeau_png": "https://flagcdn.com/w320/sg.png",
        "drapeau_svg": "https://flagcdn.com/sg.svg"
      },
      {
        "pays": "Thaïlande",
        "pourcentage": 44,
        "drapeau": "🇹🇭",
        "capitale": "Bangkok",
        "population": 69800000,
        "superficie": 513120,
        "drapeau_png": "https://flagcdn.com/w320/th.png",
        "drapeau_svg": "https://flagcdn.com/th.svg"
      },
      {
        "pays": "Angola",
        "pourcentage": 42,
        "drapeau": "🇦🇴",
        "capitale": "Luanda",
        "population": 32860000,
        "superficie": 1246700,
        "drapeau_png": "https://flagcdn.com/w320/ao.png",
        "drapeau_svg": "https://flagcdn.com/ao.svg"
      },
      {
        "pays": "Syrie",
        "pourcentage": 42,
        "drapeau": "🇸🇾",
        "capitale": "Damas",
        "population": 17500000,
        "superficie": 185180,
        "drapeau_png": "https://flagcdn.com/w320/sy.png",
        "drapeau_svg": "https://flagcdn.com/sy.svg"
      },
      {
        "pays": "Azerbaïdjan",
        "pourcentage": 40,
        "drapeau": "🇦🇿",
        "capitale": "Bakou",
        "population": 10140000,
        "superficie": 86600,
        "drapeau_png": "https://flagcdn.com/w320/az.png",
        "drapeau_svg": "https://flagcdn.com/az.svg"
      },
      {
        "pays": "Burkina Faso",
        "pourcentage": 40,
        "drapeau": "🇧🇫",
        "capitale": "Ouagadougou",
        "population": 20900000,
        "superficie": 274200,
        "drapeau_png": "https://flagcdn.com/w320/bf.png",
        "drapeau_svg": "https://flagcdn.com/bf.svg"
      },
      {
        "pays": "Équateur",
        "pourcentage": 40,
        "drapeau": "🇪🇨",
        "capitale": "Quito",
        "population": 17640000,
        "superficie": 283561,
        "drapeau_png": "https://flagcdn.com/w320/ec.png",
        "drapeau_svg": "https://flagcdn.com/ec.svg"
      },
      {
        "pays": "Sri Lanka",
        "pourcentage": 40,
        "drapeau": "🇱🇰",
        "capitale": "Colombo",
        "population": 21410000,
        "superficie": 65610,
        "drapeau_png": "https://flagcdn.com/w320/lk.png",
        "drapeau_svg": "https://flagcdn.com/lk.svg"
      }
    ],
    "tres_difficile": [
      {
        "pays": "Gabon",
        "pourcentage": 39,
        "drapeau": "🇬🇦",
        "capitale": "Libreville",
        "population": 2230000,
        "superficie": 267668,
        "drapeau_png": "https://flagcdn.com/w320/ga.png",
        "drapeau_svg": "https://flagcdn.com/ga.svg"
      },
      {
        "pays": "Mali",
        "pourcentage": 39,
        "drapeau": "🇲🇱",
        "capitale": "Bamako",
        "population": 20250000,
        "superficie": 1240192,
        "drapeau_png": "https://flagcdn.com/w320/ml.png",
        "drapeau_svg": "https://flagcdn.com/ml.svg"
      },
      {
        "pays": "Somalie",
        "pourcentage": 39,
        "drapeau": "🇸🇴",
        "capitale": "Mogadiscio",
        "population": 15890000,
        "superficie": 637657,
        "drapeau_png": "https://flagcdn.com/w320/so.png",
        "drapeau_svg": "https://flagcdn.com/so.svg"
      },
      {
        "pays": "Seychelles",
        "pourcentage": 38,
        "drapeau": "🇸🇨",
        "capitale": "Victoria",
        "population": 98000,
        "superficie": 452,
        "drapeau_png": "https://flagcdn.com/w320/sc.png",
        "drapeau_svg": "https://flagcdn.com/sc.svg"
      },
      {
        "pays": "Comores",
        "pourcentage": 37,
        "drapeau": "🇰🇲",
        "capitale": "Moroni",
        "population": 870000,
        "superficie": 2235,
        "drapeau_png": "https://flagcdn.com/w320/km.png",
        "drapeau_svg": "https://flagcdn.com/km.svg"
      },
      {
        "pays": "Émirats arabes unis",
        "pourcentage": 37,
        "drapeau": "🇦🇪",
        "capitale": "Abou Dabi",
        "population": 9890000,
        "superficie": 83600,
        "drapeau_png": "https://flagcdn.com/w320/ae.png",
        "drapeau_svg": "https://flagcdn.com/ae.svg"
      },
      {
        "pays": "Mauritanie",
        "pourcentage": 37,
        "drapeau": "🇲🇷",
        "capitale": "Nouakchott",
        "population": 4650000,
        "superficie": 1030700,
        "drapeau_png": "https://flagcdn.com/w320/mr.png",
        "drapeau_svg": "https://flagcdn.com/mr.svg"
      },
      {
        "pays": "Andorre",
        "pourcentage": 36,
        "drapeau": "🇦🇩",
        "capitale": "Andorre-la-Vieille",
        "population": 77000,
        "superficie": 468,
        "drapeau_png": "https://flagcdn.com/w320/ad.png",
        "drapeau_svg": "https://flagcdn.com/ad.svg"
      },
      {
        "pays": "Arménie",
        "pourcentage": 36,
        "drapeau": "🇦🇲",
        "capitale": "Erevan",
        "population": 2960000,
        "superficie": 29743,
        "drapeau_png": "https://flagcdn.com/w320/am.png",
        "drapeau_svg": "https://flagcdn.com/am.svg"
      },
      {
        "pays": "Barbade",
        "pourcentage": 36,
        "drapeau": "🇧🇧",
        "capitale": "Bridgetown",
        "population": 287000,
        "superficie": 430,
        "drapeau_png": "https://flagcdn.com/w320/bb.png",
        "drapeau_svg": "https://flagcdn.com/bb.svg"
      },
      {
        "pays": "Biélorussie",
        "pourcentage": 36,
        "drapeau": "🇧🇾",
        "capitale": "Minsk",
        "population": 9450000,
        "superficie": 207600,
        "drapeau_png": "https://flagcdn.com/w320/by.png",
        "drapeau_svg": "https://flagcdn.com/by.svg"
      },
      {
        "pays": "Costa Rica",
        "pourcentage": 36,
        "drapeau": "🇨🇷",
        "capitale": "San José",
        "population": 5090000,
        "superficie": 51100,
        "drapeau_png": "https://flagcdn.com/w320/cr.png",
        "drapeau_svg": "https://flagcdn.com/cr.svg"
      },
      {
        "pays": "Honduras",
        "pourcentage": 36,
        "drapeau": "🇭🇳",
        "capitale": "Tegucigalpa",
        "population": 9900000,
        "superficie": 112492,
        "drapeau_png": "https://flagcdn.com/w320/hn.png",
        "drapeau_svg": "https://flagcdn.com/hn.svg"
      },
      {
        "pays": "Laos",
        "pourcentage": 36,
        "drapeau": "🇱🇦",
        "capitale": "Vientiane",
        "population": 7280000,
        "superficie": 236800,
        "drapeau_png": "https://flagcdn.com/w320/la.png",
        "drapeau_svg": "https://flagcdn.com/la.svg"
      },
      {
        "pays": "Philippines",
        "pourcentage": 36,
        "drapeau": "🇵🇭",
        "capitale": "Manille",
        "population": 109580000,
        "superficie": 300000,
        "drapeau_png": "https://flagcdn.com/w320/ph.png",
        "drapeau_svg": "https://flagcdn.com/ph.svg"
      },
      {
        "pays": "Niger",
        "pourcentage": 35,
        "drapeau": "🇳🇪",
        "capitale": "Niamey",
        "population": 24210000,
        "superficie": 1267000,
        "drapeau_png": "https://flagcdn.com/w320/ne.png",
        "drapeau_svg": "https://flagcdn.com/ne.svg"
      },
      {
        "pays": "Jordanie",
        "pourcentage": 34,
        "drapeau": "🇯🇴",
        "capitale": "Amman",
        "population": 10200000,
        "superficie": 89342,
        "drapeau_png": "https://flagcdn.com/w320/jo.png",
        "drapeau_svg": "https://flagcdn.com/jo.svg"
      },
      {
        "pays": "Ouzbékistan",
        "pourcentage": 34,
        "drapeau": "🇺🇿",
        "capitale": "Tachkent",
        "population": 33470000,
        "superficie": 447400,
        "drapeau_png": "https://flagcdn.com/w320/uz.png",
        "drapeau_svg": "https://flagcdn.com/uz.svg"
      },
      {
        "pays": "Papouasie-Nouvelle-Guinée",
        "pourcentage": 34,
        "drapeau": "🇵🇬",
        "capitale": "Port Moresby",
        "population": 8950000,
        "superficie": 462840,
        "drapeau_png": "https://flagcdn.com/w320/pg.png",
        "drapeau_svg": "https://flagcdn.com/pg.svg"
      },
      {
        "pays": "Éthiopie",
        "pourcentage": 33,
        "drapeau": "🇪🇹",
        "capitale": "Addis-Abeba",
        "population": 115000000,
        "superficie": 1104300,
        "drapeau_png": "https://flagcdn.com/w320/et.png",
        "drapeau_svg": "https://flagcdn.com/et.svg"
      },
      {
        "pays": "Palaos",
        "pourcentage": 33,
        "drapeau": "🇵🇼",
        "capitale": "Ngerulmud",
        "population": 18000,
        "superficie": 459,
        "drapeau_png": "https://flagcdn.com/w320/pw.png",
        "drapeau_svg": "https://flagcdn.com/pw.svg"
      },
      {
        "pays": "Lettonie",
        "pourcentage": 32,
        "drapeau": "🇱🇻",
        "capitale": "Riga",
        "population": 1890000,
        "superficie": 64589,
        "drapeau_png": "https://flagcdn.com/w320/lv.png",
        "drapeau_svg": "https://flagcdn.com/lv.svg"
      },
      {
        "pays": "Libye",
        "pourcentage": 32,
        "drapeau": "🇱🇾",
        "capitale": "Tripoli",
        "population": 6870000,
        "superficie": 1759540,
        "drapeau_png": "https://flagcdn.com/w320/ly.png",
        "drapeau_svg": "https://flagcdn.com/ly.svg"
      },
      {
        "pays": "Moldavie",
        "pourcentage": 32,
        "drapeau": "🇲🇩",
        "capitale": "Chișinău",
        "population": 4040000,
        "superficie": 33851,
        "drapeau_png": "https://flagcdn.com/w320/md.png",
        "drapeau_svg": "https://flagcdn.com/md.svg"
      },
      {
        "pays": "Tanzanie",
        "pourcentage": 32,
        "drapeau": "🇹🇿",
        "capitale": "Dodoma",
        "population": 59730000,
        "superficie": 947303,
        "drapeau_png": "https://flagcdn.com/w320/tz.png",
        "drapeau_svg": "https://flagcdn.com/tz.svg"
      },
      {
        "pays": "Tchad",
        "pourcentage": 32,
        "drapeau": "🇹🇩",
        "capitale": "N'Djamena",
        "population": 16430000,
        "superficie": 1284000,
        "drapeau_png": "https://flagcdn.com/w320/td.png",
        "drapeau_svg": "https://flagcdn.com/td.svg"
      },
      {
        "pays": "Haïti",
        "pourcentage": 31,
        "drapeau": "🇭🇹",
        "capitale": "Port-au-Prince",
        "population": 11400000,
        "superficie": 27750,
        "drapeau_png": "https://flagcdn.com/w320/ht.png",
        "drapeau_svg": "https://flagcdn.com/ht.svg"
      },
      {
        "pays": "Liberia",
        "pourcentage": 31,
        "drapeau": "🇱🇷",
        "capitale": "Monrovia",
        "population": 5060000,
        "superficie": 111369,
        "drapeau_png": "https://flagcdn.com/w320/lr.png",
        "drapeau_svg": "https://flagcdn.com/lr.svg"
      },
      {
        "pays": "Liechtenstein",
        "pourcentage": 31,
        "drapeau": "🇱🇮",
        "capitale": "Vaduz",
        "population": 38000,
        "superficie": 160,
        "drapeau_png": "https://flagcdn.com/w320/li.png",
        "drapeau_svg": "https://flagcdn.com/li.svg"
      },
      {
        "pays": "Taïwan",
        "pourcentage": 31,
        "drapeau": "🇹🇼",
        "capitale": "Taipei",
        "population": 23570000,
        "superficie": 36193,
        "drapeau_png": "https://flagcdn.com/w320/tw.png",
        "drapeau_svg": "https://flagcdn.com/tw.svg"
      },
      {
        "pays": "Tonga",
        "pourcentage": 31,
        "drapeau": "🇹🇴",
        "capitale": "Nuku'alofa",
        "population": 105000,
        "superficie": 747,
        "drapeau_png": "https://flagcdn.com/w320/to.png",
        "drapeau_svg": "https://flagcdn.com/to.svg"
      },
      {
        "pays": "Ghana",
        "pourcentage": 30,
        "drapeau": "🇬🇭",
        "capitale": "Accra",
        "population": 31070000,
        "superficie": 238533,
        "drapeau_png": "https://flagcdn.com/w320/gh.png",
        "drapeau_svg": "https://flagcdn.com/gh.svg"
      },
      {
        "pays": "Monténégro",
        "pourcentage": 30,
        "drapeau": "🇲🇪",
        "capitale": "Podgorica",
        "population": 628000,
        "superficie": 13812,
        "drapeau_png": "https://flagcdn.com/w320/me.png",
        "drapeau_svg": "https://flagcdn.com/me.svg"
      },
      {
        "pays": "Paraguay",
        "pourcentage": 30,
        "drapeau": "🇵🇾",
        "capitale": "Asunción",
        "population": 7130000,
        "superficie": 406752,
        "drapeau_png": "https://flagcdn.com/w320/py.png",
        "drapeau_svg": "https://flagcdn.com/py.svg"
      },
      {
        "pays": "République du Congo",
        "pourcentage": 30,
        "drapeau": "🇨🇬",
        "capitale": "Brazzaville",
        "population": 5520000,
        "superficie": 342000,
        "drapeau_png": "https://flagcdn.com/w320/cg.png",
        "drapeau_svg": "https://flagcdn.com/cg.svg"
      },
      {
        "pays": "Turkménistan",
        "pourcentage": 30,
        "drapeau": "🇹🇲",
        "capitale": "Achgabat",
        "population": 6000000,
        "superficie": 488100,
        "drapeau_png": "https://flagcdn.com/w320/tm.png",
        "drapeau_svg": "https://flagcdn.com/tm.svg"
      },
      {
        "pays": "Yémen",
        "pourcentage": 30,
        "drapeau": "🇾🇪",
        "capitale": "Sanaa",
        "population": 29800000,
        "superficie": 527968,
        "drapeau_png": "https://flagcdn.com/w320/ye.png",
        "drapeau_svg": "https://flagcdn.com/ye.svg"
      },
      {
        "pays": "Afghanistan",
        "pourcentage": 29,
        "drapeau": "🇦🇫",
        "capitale": "Kaboul",
        "population": 38930000,
        "superficie": 652230,
        "drapeau_png": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png",
        "drapeau_svg": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg"
      },
      {
        "pays": "Cap-Vert",
        "pourcentage": 29,
        "drapeau": "🇨🇻",
        "capitale": "Praia",
        "population": 556000,
        "superficie": 4033,
        "drapeau_png": "https://flagcdn.com/w320/cv.png",
        "drapeau_svg": "https://flagcdn.com/cv.svg"
      },
      {
        "pays": "Lituanie",
        "pourcentage": 29,
        "drapeau": "🇱🇹",
        "capitale": "Vilnius",
        "population": 2720000,
        "superficie": 65300,
        "drapeau_png": "https://flagcdn.com/w320/lt.png",
        "drapeau_svg": "https://flagcdn.com/lt.svg"
      },
      {
        "pays": "Birmanie",
        "pourcentage": 28,
        "drapeau": "🇲🇲",
        "capitale": "Naypyidaw",
        "population": 54410000,
        "superficie": 676578,
        "drapeau_png": "https://flagcdn.com/w320/mm.png",
        "drapeau_svg": "https://flagcdn.com/mm.svg"
      },
      {
        "pays": "Mongolie",
        "pourcentage": 28,
        "drapeau": "🇲🇳",
        "capitale": "Oulan-Bator",
        "population": 3280000,
        "superficie": 1564110,
        "drapeau_png": "https://flagcdn.com/w320/mn.png",
        "drapeau_svg": "https://flagcdn.com/mn.svg"
      },
      {
        "pays": "Oman",
        "pourcentage": 28,
        "drapeau": "🇴🇲",
        "capitale": "Mascate",
        "population": 5110000,
        "superficie": 309500,
        "drapeau_png": "https://flagcdn.com/w320/om.png",
        "drapeau_svg": "https://flagcdn.com/om.svg"
      },
      {
        "pays": "Ouganda",
        "pourcentage": 28,
        "drapeau": "🇺🇬",
        "capitale": "Kampala",
        "population": 45740000,
        "superficie": 241038,
        "drapeau_png": "https://flagcdn.com/w320/ug.png",
        "drapeau_svg": "https://flagcdn.com/ug.svg"
      },
      {
        "pays": "Bahreïn",
        "pourcentage": 27,
        "drapeau": "🇧🇭",
        "capitale": "Manama",
        "population": 1700000,
        "superficie": 765,
        "drapeau_png": "https://flagcdn.com/w320/bh.png",
        "drapeau_svg": "https://flagcdn.com/bh.svg"
      },
      {
        "pays": "Eswatini",
        "pourcentage": 27,
        "drapeau": "🇸🇿",
        "capitale": "Mbabane",
        "population": 1160000,
        "superficie": 17364,
        "drapeau_png": "https://flagcdn.com/w320/sz.png",
        "drapeau_svg": "https://flagcdn.com/sz.svg"
      },
      {
        "pays": "Koweït",
        "pourcentage": 27,
        "drapeau": "🇰🇼",
        "capitale": "Koweït",
        "population": 4270000,
        "superficie": 17818,
        "drapeau_png": "https://flagcdn.com/w320/kw.png",
        "drapeau_svg": "https://flagcdn.com/kw.svg"
      },
      {
        "pays": "Maldives",
        "pourcentage": 27,
        "drapeau": "🇲🇻",
        "capitale": "Malé",
        "population": 540000,
        "superficie": 298,
        "drapeau_png": "https://flagcdn.com/w320/mv.png",
        "drapeau_svg": "https://flagcdn.com/mv.svg"
      },
      {
        "pays": "Fidji",
        "pourcentage": 26,
        "drapeau": "🇫🇯",
        "capitale": "Suva",
        "population": 896000,
        "superficie": 18274,
        "drapeau_png": "https://flagcdn.com/w320/fj.png",
        "drapeau_svg": "https://flagcdn.com/fj.svg"
      },
      {
        "pays": "Mozambique",
        "pourcentage": 26,
        "drapeau": "🇲🇿",
        "capitale": "Maputo",
        "population": 31260000,
        "superficie": 801590,
        "drapeau_png": "https://flagcdn.com/w320/mz.png",
        "drapeau_svg": "https://flagcdn.com/mz.svg"
      },
      {
        "pays": "Togo",
        "pourcentage": 26,
        "drapeau": "🇹🇬",
        "capitale": "Lomé",
        "population": 8280000,
        "superficie": 56785,
        "drapeau_png": "https://flagcdn.com/w320/tg.png",
        "drapeau_svg": "https://flagcdn.com/tg.svg"
      },
      {
        "pays": "Bahamas",
        "pourcentage": 25,
        "drapeau": "🇧🇸",
        "capitale": "Nassau",
        "population": 393000,
        "superficie": 13943,
        "drapeau_png": "https://flagcdn.com/w320/bs.png",
        "drapeau_svg": "https://flagcdn.com/bs.svg"
      },
      {
        "pays": "Malawi",
        "pourcentage": 25,
        "drapeau": "🇲🇼",
        "capitale": "Lilongwe",
        "population": 19130000,
        "superficie": 118484,
        "drapeau_png": "https://flagcdn.com/w320/mw.png",
        "drapeau_svg": "https://flagcdn.com/mw.svg"
      },
      {
        "pays": "Bénin",
        "pourcentage": 24,
        "drapeau": "🇧🇯",
        "capitale": "Porto-Novo",
        "population": 12120000,
        "superficie": 112622,
        "drapeau_png": "https://flagcdn.com/w320/bj.png",
        "drapeau_svg": "https://flagcdn.com/bj.svg"
      },
      {
        "pays": "Guinée",
        "pourcentage": 24,
        "drapeau": "🇬🇳",
        "capitale": "Conakry",
        "population": 13130000,
        "superficie": 245857,
        "drapeau_png": "https://flagcdn.com/w320/gn.png",
        "drapeau_svg": "https://flagcdn.com/gn.svg"
      },
      {
        "pays": "Nicaragua",
        "pourcentage": 24,
        "drapeau": "🇳🇮",
        "capitale": "Managua",
        "population": 6620000,
        "superficie": 130373,
        "drapeau_png": "https://flagcdn.com/w320/ni.png",
        "drapeau_svg": "https://flagcdn.com/ni.svg"
      },
      {
        "pays": "Soudan",
        "pourcentage": 24,
        "drapeau": "🇸🇩",
        "capitale": "Khartoum",
        "population": 43850000,
        "superficie": 1861484,
        "drapeau_png": "https://flagcdn.com/w320/sd.png",
        "drapeau_svg": "https://flagcdn.com/sd.svg"
      },
      {
        "pays": "Salvador",
        "pourcentage": 23,
        "drapeau": "🇸🇻",
        "capitale": "San Salvador",
        "population": 6490000,
        "superficie": 21041,
        "drapeau_png": "https://flagcdn.com/w320/sv.png",
        "drapeau_svg": "https://flagcdn.com/sv.svg"
      },
      {
        "pays": "Soudan du Sud",
        "pourcentage": 23,
        "drapeau": "🇸🇸",
        "capitale": "Djouba",
        "population": 11190000,
        "superficie": 644329,
        "drapeau_png": "https://flagcdn.com/w320/ss.png",
        "drapeau_svg": "https://flagcdn.com/ss.svg"
      },
      {
        "pays": "Zimbabwe",
        "pourcentage": 23,
        "drapeau": "🇿🇼",
        "capitale": "Harare",
        "population": 14860000,
        "superficie": 390757,
        "drapeau_png": "https://flagcdn.com/w320/zw.png",
        "drapeau_svg": "https://flagcdn.com/zw.svg"
      },
      {
        "pays": "Belize",
        "pourcentage": 22,
        "drapeau": "🇧🇿",
        "capitale": "Belmopan",
        "population": 398000,
        "superficie": 22966,
        "drapeau_png": "https://flagcdn.com/w320/bz.png",
        "drapeau_svg": "https://flagcdn.com/bz.svg"
      },
      {
        "pays": "Brunei",
        "pourcentage": 22,
        "drapeau": "🇧🇳",
        "capitale": "Bandar Seri Begawan",
        "population": 437000,
        "superficie": 5765,
        "drapeau_png": "https://flagcdn.com/w320/bn.png",
        "drapeau_svg": "https://flagcdn.com/bn.svg"
      },
      {
        "pays": "Burundi",
        "pourcentage": 22,
        "drapeau": "🇧🇮",
        "capitale": "Gitega",
        "population": 11890000,
        "superficie": 27834,
        "drapeau_png": "https://flagcdn.com/w320/bi.png",
        "drapeau_svg": "https://flagcdn.com/bi.svg"
      },
      {
        "pays": "Djibouti",
        "pourcentage": 22,
        "drapeau": "🇩🇯",
        "capitale": "Djibouti",
        "population": 988000,
        "superficie": 23200,
        "drapeau_png": "https://flagcdn.com/w320/dj.png",
        "drapeau_svg": "https://flagcdn.com/dj.svg"
      },
      {
        "pays": "Érythrée",
        "pourcentage": 22,
        "drapeau": "🇪🇷",
        "capitale": "Asmara",
        "population": 3540000,
        "superficie": 117600,
        "drapeau_png": "https://flagcdn.com/w320/er.png",
        "drapeau_svg": "https://flagcdn.com/er.svg"
      },
      {
        "pays": "Micronésie",
        "pourcentage": 22,
        "drapeau": "🇫🇲",
        "capitale": "Palikir",
        "population": 115000,
        "superficie": 702,
        "drapeau_png": "https://flagcdn.com/w320/fm.png",
        "drapeau_svg": "https://flagcdn.com/fm.svg"
      },
      {
        "pays": "Namibie",
        "pourcentage": 22,
        "drapeau": "🇳🇦",
        "capitale": "Windhoek",
        "population": 2540000,
        "superficie": 825615,
        "drapeau_png": "https://flagcdn.com/w320/na.png",
        "drapeau_svg": "https://flagcdn.com/na.svg"
      },
      {
        "pays": "République Centrafricaine",
        "pourcentage": 22,
        "drapeau": "🇨🇫",
        "capitale": "Bangui",
        "population": 4830000,
        "superficie": 622984,
        "drapeau_png": "https://flagcdn.com/w320/cf.png",
        "drapeau_svg": "https://flagcdn.com/cf.svg"
      },
      {
        "pays": "Tadjikistan",
        "pourcentage": 22,
        "drapeau": "🇹🇯",
        "capitale": "Douchanbé",
        "population": 9540000,
        "superficie": 143100,
        "drapeau_png": "https://flagcdn.com/w320/tj.png",
        "drapeau_svg": "https://flagcdn.com/tj.svg"
      },
      {
        "pays": "Trinité-et-Tobago",
        "pourcentage": 22,
        "drapeau": "🇹🇹",
        "capitale": "Port-d'Espagne",
        "population": 1400000,
        "superficie": 5130,
        "drapeau_png": "https://flagcdn.com/w320/tt.png",
        "drapeau_svg": "https://flagcdn.com/tt.svg"
      },
      {
        "pays": "Antigua-et-Barbuda",
        "pourcentage": 21,
        "drapeau": "🇦🇬",
        "capitale": "Saint John's",
        "population": 98000,
        "superficie": 442,
        "drapeau_png": "https://flagcdn.com/w320/ag.png",
        "drapeau_svg": "https://flagcdn.com/ag.svg"
      },
      {
        "pays": "Botswana",
        "pourcentage": 21,
        "drapeau": "🇧🇼",
        "capitale": "Gaborone",
        "population": 2350000,
        "superficie": 581730,
        "drapeau_png": "https://flagcdn.com/w320/bw.png",
        "drapeau_svg": "https://flagcdn.com/bw.svg"
      },
      {
        "pays": "Îles Marshall",
        "pourcentage": 21,
        "drapeau": "🇲🇭",
        "capitale": "Majuro",
        "population": 59000,
        "superficie": 181,
        "drapeau_png": "https://flagcdn.com/w320/mh.png",
        "drapeau_svg": "https://flagcdn.com/mh.svg"
      },
      {
        "pays": "Kiribati",
        "pourcentage": 21,
        "drapeau": "🇰🇮",
        "capitale": "Tarawa",
        "population": 119000,
        "superficie": 811,
        "drapeau_png": "https://flagcdn.com/w320/ki.png",
        "drapeau_svg": "https://flagcdn.com/ki.svg"
      },
      {
        "pays": "Rwanda",
        "pourcentage": 21,
        "drapeau": "🇷🇼",
        "capitale": "Kigali",
        "population": 12950000,
        "superficie": 26338,
        "drapeau_png": "https://flagcdn.com/w320/rw.png",
        "drapeau_svg": "https://flagcdn.com/rw.svg"
      },
      {
        "pays": "Sainte-Lucie",
        "pourcentage": 21,
        "drapeau": "🇱🇨",
        "capitale": "Castries",
        "population": 184000,
        "superficie": 616,
        "drapeau_png": "https://flagcdn.com/w320/lc.png",
        "drapeau_svg": "https://flagcdn.com/lc.svg"
      },
      {
        "pays": "Guatemala",
        "pourcentage": 20,
        "drapeau": "🇬🇹",
        "capitale": "Guatemala",
        "population": 16860000,
        "superficie": 108889,
        "drapeau_png": "https://flagcdn.com/w320/gt.png",
        "drapeau_svg": "https://flagcdn.com/gt.svg"
      },
      {
        "pays": "Kirghizistan",
        "pourcentage": 20,
        "drapeau": "🇰🇬",
        "capitale": "Bichkek",
        "population": 6520000,
        "superficie": 199951,
        "drapeau_png": "https://flagcdn.com/w320/kg.png",
        "drapeau_svg": "https://flagcdn.com/kg.svg"
      },
      {
        "pays": "Lesotho",
        "pourcentage": 20,
        "drapeau": "🇱🇸",
        "capitale": "Maseru",
        "population": 2140000,
        "superficie": 30355,
        "drapeau_png": "https://flagcdn.com/w320/ls.png",
        "drapeau_svg": "https://flagcdn.com/ls.svg"
      },
      {
        "pays": "Île Maurice",
        "pourcentage": 19,
        "drapeau": "🇲🇺",
        "capitale": "Port-Louis",
        "population": 1270000,
        "superficie": 2040,
        "drapeau_png": "https://flagcdn.com/w320/mu.png",
        "drapeau_svg": "https://flagcdn.com/mu.svg"
      },
      {
        "pays": "Nauru",
        "pourcentage": 19,
        "drapeau": "🇳🇷",
        "capitale": "Yaren",
        "population": 10800,
        "superficie": 21,
        "drapeau_png": "https://flagcdn.com/w320/nr.png",
        "drapeau_svg": "https://flagcdn.com/nr.svg"
      },
      {
        "pays": "Sierra Leone",
        "pourcentage": 19,
        "drapeau": "🇸🇱",
        "capitale": "Freetown",
        "population": 7980000,
        "superficie": 71740,
        "drapeau_png": "https://flagcdn.com/w320/sl.png",
        "drapeau_svg": "https://flagcdn.com/sl.svg"
      },
      {
        "pays": "Suriname",
        "pourcentage": 19,
        "drapeau": "🇸🇷",
        "capitale": "Paramaribo",
        "population": 586000,
        "superficie": 163820,
        "drapeau_png": "https://flagcdn.com/w320/sr.png",
        "drapeau_svg": "https://flagcdn.com/sr.svg"
      },
      {
        "pays": "Zambie",
        "pourcentage": 19,
        "drapeau": "🇿🇲",
        "capitale": "Lusaka",
        "population": 18380000,
        "superficie": 752618,
        "drapeau_png": "https://flagcdn.com/w320/zm.png",
        "drapeau_svg": "https://flagcdn.com/zm.svg"
      },
      {
        "pays": "Dominique",
        "pourcentage": 18,
        "drapeau": "🇩🇲",
        "capitale": "Roseau",
        "population": 72000,
        "superficie": 751,
        "drapeau_png": "https://flagcdn.com/w320/dm.png",
        "drapeau_svg": "https://flagcdn.com/dm.svg"
      },
      {
        "pays": "Grenade",
        "pourcentage": 18,
        "drapeau": "🇬🇩",
        "capitale": "Saint-Georges",
        "population": 112000,
        "superficie": 344,
        "drapeau_png": "https://flagcdn.com/w320/gd.png",
        "drapeau_svg": "https://flagcdn.com/gd.svg"
      },
      {
        "pays": "Guyana",
        "pourcentage": 18,
        "drapeau": "🇬🇾",
        "capitale": "Georgetown",
        "population": 787000,
        "superficie": 214969,
        "drapeau_png": "https://flagcdn.com/w320/gy.png",
        "drapeau_svg": "https://flagcdn.com/gy.svg"
      },
      {
        "pays": "Guinée équatoriale",
        "pourcentage": 17,
        "drapeau": "🇬🇶",
        "capitale": "Malabo",
        "population": 1400000,
        "superficie": 28051,
        "drapeau_png": "https://flagcdn.com/w320/gq.png",
        "drapeau_svg": "https://flagcdn.com/gq.svg"
      },
      {
        "pays": "Samoa",
        "pourcentage": 17,
        "drapeau": "🇼🇸",
        "capitale": "Apia",
        "population": 198000,
        "superficie": 2842,
        "drapeau_png": "https://flagcdn.com/w320/ws.png",
        "drapeau_svg": "https://flagcdn.com/ws.svg"
      },
      {
        "pays": "Bolivie",
        "pourcentage": 16,
        "drapeau": "🇧🇴",
        "capitale": "Sucre",
        "population": 11670000,
        "superficie": 1098581,
        "drapeau_png": "https://flagcdn.com/w320/bo.png",
        "drapeau_svg": "https://flagcdn.com/bo.svg"
      },
      {
        "pays": "Guinée-Bissau",
        "pourcentage": 16,
        "drapeau": "🇬🇼",
        "capitale": "Bissau",
        "population": 1970000,
        "superficie": 36125,
        "drapeau_png": "https://flagcdn.com/w320/gw.png",
        "drapeau_svg": "https://flagcdn.com/gw.svg"
      },
      {
        "pays": "Saint-Vincent-et-les-Grenadines",
        "pourcentage": 16,
        "drapeau": "🇻🇨",
        "capitale": "Kingstown",
        "population": 111000,
        "superficie": 389,
        "drapeau_png": "https://flagcdn.com/w320/vc.png",
        "drapeau_svg": "https://flagcdn.com/vc.svg"
      },
      {
        "pays": "Timor oriental",
        "pourcentage": 16,
        "drapeau": "🇹🇱",
        "capitale": "Dili",
        "population": 1320000,
        "superficie": 14874,
        "drapeau_png": "https://flagcdn.com/w320/tl.png",
        "drapeau_svg": "https://flagcdn.com/tl.svg"
      },
      {
        "pays": "Vanuatu",
        "pourcentage": 16,
        "drapeau": "🇻🇺",
        "capitale": "Port-Vila",
        "population": 307000,
        "superficie": 12189,
        "drapeau_png": "https://flagcdn.com/w320/vu.png",
        "drapeau_svg": "https://flagcdn.com/vu.svg"
      },
      {
        "pays": "Gambie",
        "pourcentage": 15,
        "drapeau": "🇬🇲",
        "capitale": "Banjul",
        "population": 2420000,
        "superficie": 11295,
        "drapeau_png": "https://flagcdn.com/w320/gm.png",
        "drapeau_svg": "https://flagcdn.com/gm.svg"
      },
      {
        "pays": "Saint-Christophe-et-Niévès",
        "pourcentage": 14,
        "drapeau": "🇰🇳",
        "capitale": "Basseterre",
        "population": 53000,
        "superficie": 261,
        "drapeau_png": "https://flagcdn.com/w320/kn.png",
        "drapeau_svg": "https://flagcdn.com/kn.svg"
      },
      {
        "pays": "Sao Tomé-et-Principe",
        "pourcentage": 14,
        "drapeau": "🇸🇹",
        "capitale": "São Tomé",
        "population": 219000,
        "superficie": 964,
        "drapeau_png": "https://flagcdn.com/w320/st.png",
        "drapeau_svg": "https://flagcdn.com/st.svg"
      },
      {
        "pays": "Tuvalu",
        "pourcentage": 14,
        "drapeau": "🇹🇻",
        "capitale": "Funafuti",
        "population": 12000,
        "superficie": 26,
        "drapeau_png": "https://flagcdn.com/w320/tv.png",
        "drapeau_svg": "https://flagcdn.com/tv.svg"
      },
      {
        "pays": "Salomon",
        "pourcentage": 12,
        "drapeau": "🇸🇧",
        "capitale": "Honiara",
        "population": 687000,
        "superficie": 28896,
        "drapeau_png": "https://flagcdn.com/w320/sb.png",
        "drapeau_svg": "https://flagcdn.com/sb.svg"
      }
    ]
  }
};