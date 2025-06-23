// ===== NAVIGATION GÉNÉRALE =====
function showSection(sectionName) {
    // Cacher toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    document.getElementById(sectionName).classList.add('active');
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Réactiver le bon lien de navigation
    const navLink = document.querySelector(`.nav-links a[onclick="showSection('${sectionName}')"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
}

// Filtrage des projets
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const filters = document.querySelectorAll('.category-filter');
    
    // Mettre à jour les filtres actifs
    filters.forEach(filter => filter.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filtrer les cartes
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== TEST D'ATTACHEMENT =====
// Questions ECR-R avec leurs propriétés
const questions = [
    {id: 1, text: "I'm afraid that I will lose my partner's love.", dimension: "anxiety", reverse: false},
    {id: 2, text: "I often worry that my partner will not want to stay with me.", dimension: "anxiety", reverse: false},
    {id: 3, text: "I often worry that my partner doesn't really love me.", dimension: "anxiety", reverse: false},
    {id: 4, text: "I worry that romantic partners won't care about me as much as I care about them.", dimension: "anxiety", reverse: false},
    {id: 5, text: "I often wish that my partner's feelings for me were as strong as my feelings for him or her.", dimension: "anxiety", reverse: false},
    {id: 6, text: "I worry a lot about my relationships.", dimension: "anxiety", reverse: false},
    {id: 7, text: "When my partner is out of sight, I worry that he or she might become interested in someone else.", dimension: "anxiety", reverse: false},
    {id: 8, text: "When I show my feelings for romantic partners, I'm afraid they will not feel the same about me.", dimension: "anxiety", reverse: false},
    {id: 9, text: "I rarely worry about my partner leaving me.", dimension: "anxiety", reverse: true},
    {id: 10, text: "My romantic partner makes me doubt myself.", dimension: "anxiety", reverse: false},
    {id: 11, text: "I do not often worry about being abandoned.", dimension: "anxiety", reverse: true},
    {id: 12, text: "I find that my partner(s) don't want to get as close as I would like.", dimension: "anxiety", reverse: false},
    {id: 13, text: "Sometimes romantic partners change their feelings about me for no apparent reason.", dimension: "anxiety", reverse: false},
    {id: 14, text: "My desire to be very close sometimes scares people away.", dimension: "anxiety", reverse: false},
    {id: 15, text: "I'm afraid that once a romantic partner gets to know me, he or she won't like who I really am.", dimension: "anxiety", reverse: false},
    {id: 16, text: "It makes me mad that I don't get the affection and support I need from my partner.", dimension: "anxiety", reverse: false},
    {id: 17, text: "I worry that I won't measure up to other people.", dimension: "anxiety", reverse: false},
    {id: 18, text: "My partner only seems to notice me when I'm angry.", dimension: "anxiety", reverse: false},
    {id: 19, text: "I prefer not to show a partner how I feel deep down.", dimension: "avoidance", reverse: false},
    {id: 20, text: "I feel comfortable sharing my private thoughts and feelings with my partner.", dimension: "avoidance", reverse: true},
    {id: 21, text: "I find it difficult to allow myself to depend on romantic partners.", dimension: "avoidance", reverse: false},
    {id: 22, text: "I am very comfortable being close to romantic partners.", dimension: "avoidance", reverse: true},
    {id: 23, text: "I don't feel comfortable opening up to romantic partners.", dimension: "avoidance", reverse: false},
    {id: 24, text: "I prefer not to be too close to romantic partners.", dimension: "avoidance", reverse: false},
    {id: 25, text: "I get uncomfortable when a romantic partner wants to be very close.", dimension: "avoidance", reverse: false},
    {id: 26, text: "I find it relatively easy to get close to my partner.", dimension: "avoidance", reverse: true},
    {id: 27, text: "It's not difficult for me to get close to my partner.", dimension: "avoidance", reverse: true},
    {id: 28, text: "I usually discuss my problems and concerns with my partner.", dimension: "avoidance", reverse: true},
    {id: 29, text: "It helps to turn to my romantic partner in times of need.", dimension: "avoidance", reverse: true},
    {id: 30, text: "I tell my partner just about everything.", dimension: "avoidance", reverse: true},
    {id: 31, text: "I talk things over with my partner.", dimension: "avoidance", reverse: true},
    {id: 32, text: "I am nervous when partners get too close to me.", dimension: "avoidance", reverse: false},
    {id: 33, text: "I feel comfortable depending on romantic partners.", dimension: "avoidance", reverse: true},
    {id: 34, text: "I find it easy to depend on romantic partners.", dimension: "avoidance", reverse: true},
    {id: 35, text: "It's easy for me to be affectionate with my partner.", dimension: "avoidance", reverse: true},
    {id: 36, text: "My partner really understands me and my needs.", dimension: "avoidance", reverse: true}
];

let currentQuestion = 0;
let responses = {};

// Fonctions du test d'attachement
function startAttachmentTest() {
    showSection('attachment-test');
}

function startQuestions() {
    document.getElementById('attachment-intro').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'block';
    generateQuestions();
    showQuestion(0);
}

function generateQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    questions.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.id = `question-${index}`;
        
        questionCard.innerHTML = `
            <div class="question-number">Question ${question.id} sur 36</div>
            <div class="question-text">${question.text}</div>
            
            <div class="scale-container">
                <div class="scale-options">
                    ${[1,2,3,4,5,6,7].map(value => `
                        <div class="scale-item">
                            <input type="radio" id="q${question.id}_${value}" name="question_${question.id}" value="${value}" onchange="handleResponse(${question.id}, ${value})">
                            <label for="q${question.id}_${value}">
                                <div class="scale-circle">${value}</div>
                                <div class="scale-label">${value === 1 ? 'Pas du tout' : value === 4 ? 'Neutre' : value === 7 ? 'Tout à fait' : ''}</div>
                            </label>
                        </div>
                    `).join('')}
                </div>
                
                <div class="scale-extremes">
                    <span>Pas du tout d'accord</span>
                    <span>Tout à fait d'accord</span>
                </div>
            </div>
            
            <div class="navigation">
                <button class="btn btn-back" onclick="previousQuestion()" ${index === 0 ? 'style="visibility: hidden;"' : ''}>
                    ← Précédent
                </button>
                <button class="btn btn-primary" id="nextBtn-${index}" onclick="nextQuestion()" disabled>
                    ${index === questions.length - 1 ? 'Voir les résultats' : 'Suivant →'}
                </button>
            </div>
        `;
        
        container.appendChild(questionCard);
    });
}

function showQuestion(index) {
    // Cacher toutes les questions
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Afficher la question actuelle
    document.getElementById(`question-${index}`).classList.add('active');
    
    // Mettre à jour la barre de progression
    const progress = ((index + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Question ${index + 1} sur ${questions.length}`;
    
    currentQuestion = index;
}

function handleResponse(questionId, value) {
    responses[questionId] = value;
    document.getElementById(`nextBtn-${currentQuestion}`).disabled = false;
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        calculateResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

function calculateResults() {
    let anxietySum = 0;
    let avoidanceSum = 0;
    let anxietyCount = 0;
    let avoidanceCount = 0;

    questions.forEach(question => {
        const response = responses[question.id];
        if (response !== undefined) {
            let score = question.reverse ? (8 - response) : response;
            
            if (question.dimension === 'anxiety') {
                anxietySum += score;
                anxietyCount++;
            } else {
                avoidanceSum += score;
                avoidanceCount++;
            }
        }
    });

    const anxietyScore = (anxietySum / anxietyCount).toFixed(1);
    const avoidanceScore = (avoidanceSum / avoidanceCount).toFixed(1);

    const style = getAttachmentStyle(anxietyScore, avoidanceScore);
    displayResults(anxietyScore, avoidanceScore, style);
}

function getAttachmentStyle(anxiety, avoidance) {
    if (anxiety < 4 && avoidance < 4) {
        return {
            name: "Sécure",
            description: "Vous vous sentez généralement à l'aise dans l'intimité et l'autonomie. Vous maintenez facilement des relations proches et stables."
        };
    } else if (anxiety >= 4 && avoidance < 4) {
        return {
            name: "Préoccupé",
            description: "Vous désirez des relations très proches mais vous inquiétez que les autres ne vous aiment pas autant que vous les aimez."
        };
    } else if (anxiety < 4 && avoidance >= 4) {
        return {
            name: "Évitant",
            description: "Vous valorisez l'indépendance et l'autonomie. Vous pouvez vous sentir mal à l'aise avec une trop grande intimité émotionnelle."
        };
    } else {
        return {
            name: "Désorganisé",
            description: "Vous ressentez un mélange d'anxiété et d'évitement dans les relations, pouvant créer des difficultés relationnelles."
        };
    }
}

function displayResults(anxiety, avoidance, style) {
    document.getElementById('questionsContainer').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';

    document.getElementById('anxietyScore').textContent = anxiety;
    document.getElementById('avoidanceScore').textContent = avoidance;
    document.getElementById('styleTitle').textContent = style.name;
    document.getElementById('styleDescription').textContent = style.description;

    drawChart(parseFloat(anxiety), parseFloat(avoidance));
}

function drawChart(anxiety, avoidance) {
    const canvas = document.getElementById('attachmentChart');
    const ctx = canvas.getContext('2d');
    
    // Définir la taille du canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;
    
    const width = canvas.width;
    const height = canvas.height;
    const margin = 60;
    
    // Nettoyer le canvas
    ctx.clearRect(0, 0, width, height);
    
    // Couleurs
    const gridColor = '#D5CD90';
    const textColor = '#4a4a4a';
    const pointColor = '#D7A28C';
    
    // Dessiner les axes
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    
    // Axe X (Évitement)
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    
    // Axe Y (Anxiété)
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();
    
    // Grille et labels
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = textColor;
    
    for (let i = 1; i <= 7; i++) {
        const x = margin + (i - 1) * (width - 2 * margin) / 6;
        const y = height - margin - (i - 1) * (height - 2 * margin) / 6;
        
        // Lignes verticales
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, height - margin);
        ctx.stroke();
        
        // Lignes horizontales
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
        
        // Labels X
        ctx.fillText(i.toString(), x - 5, height - margin + 20);
        
        // Labels Y
        ctx.fillText(i.toString(), margin - 20, y + 5);
    }
    
    // Ligne de séparation au milieu (4,4)
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 2;
    const midX = margin + 3 * (width - 2 * margin) / 6;
    const midY = height - margin - 3 * (height - 2 * margin) / 6;
    
    // Ligne verticale au milieu
    ctx.beginPath();
    ctx.moveTo(midX, margin);
    ctx.lineTo(midX, height - margin);
    ctx.stroke();
    
    // Ligne horizontale au milieu
    ctx.beginPath();
    ctx.moveTo(margin, midY);
    ctx.lineTo(width - margin, midY);
    ctx.stroke();
    
    // Labels des quadrants
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#A1A27E';
    
    const quarterWidth = (width - 2 * margin) / 4;
    const quarterHeight = (height - 2 * margin) / 4;
    
    // Sécure (bas-gauche)
    ctx.fillText('SÉCURE', margin + quarterWidth - 30, height - margin - quarterHeight);
    
    // Préoccupé (haut-gauche)
    ctx.fillText('PRÉOCCUPÉ', margin + quarterWidth - 40, margin + quarterHeight);
    
    // Évitant (bas-droite)
    ctx.fillText('ÉVITANT', width - margin - quarterWidth - 30, height - margin - quarterHeight);
    
    // Désorganisé (haut-droite)
    ctx.fillText('DÉSORGANISÉ', width - margin - quarterWidth - 45, margin + quarterHeight);
    
    // Point de l'utilisateur
    const userX = margin + (avoidance - 1) * (width - 2 * margin) / 6;
    const userY = height - margin - (anxiety - 1) * (height - 2 * margin) / 6;
    
    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(userX, userY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Bordure du point
    ctx.strokeStyle = '#BA8383';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Labels des axes
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = textColor;
    ctx.fillText('Évitement', width / 2 - 40, height - 10);
    
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Anxiété', -30, 0);
    ctx.restore();
}

function restartAttachmentTest() {
    currentQuestion = 0;
    responses = {};
    
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('attachment-intro').style.display = 'block';
    document.getElementById('progressContainer').style.display = 'none';
    
    // Réinitialiser toutes les réponses
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    // Réinitialiser les boutons
    document.querySelectorAll('[id^="nextBtn-"]').forEach(btn => {
        btn.disabled = true;
    });
}

// ===== TEST DE RÉACTION =====
// Variables pour le test de réaction
let reactionStartTime = 0;
let reactionTimeout = null;
let reactionHistory = [];
let reactionState = 'initial'; // 'initial', 'waiting', 'ready', 'result'

function startReactionTest() {
    showSection('reaction-test');
    initReactionTest();
}

function initReactionTest() {
    const gameArea = document.getElementById('reaction-game-area');
    
    gameArea.innerHTML = `
        <div class="reaction-game">
            <div id="reaction-screen" class="reaction-screen waiting" onclick="handleReactionClick()">
                <div id="reaction-message">Cliquez ici pour commencer !</div>
            </div>
            <button class="btn btn-secondary" onclick="showReactionHistory()" style="margin-top: 10px;">
                Voir l'historique
            </button>
        </div>
        
        <div class="reaction-stats">
            <div class="reaction-stat-card">
                <div class="reaction-stat-value" id="current-time">---</div>
                <div class="reaction-stat-label">Dernier temps (ms)</div>
            </div>
            <div class="reaction-stat-card">
                <div class="reaction-stat-value" id="best-time">---</div>
                <div class="reaction-stat-label">Meilleur temps (ms)</div>
            </div>
            <div class="reaction-stat-card">
                <div class="reaction-stat-value" id="average-time">---</div>
                <div class="reaction-stat-label">Moyenne (ms)</div>
            </div>
            <div class="reaction-stat-card">
                <div class="reaction-stat-value" id="total-tests">${reactionHistory.length}</div>
                <div class="reaction-stat-label">Tests effectués</div>
            </div>
        </div>
    `;
    
    reactionState = 'initial';
    updateReactionStats();
}

function handleReactionClick() {
    const screen = document.getElementById('reaction-screen');
    const message = document.getElementById('reaction-message');
    
    if (reactionState === 'initial' || reactionState === 'result') {
        // Commencer un nouveau test
        startReactionRound();
    } else if (reactionState === 'waiting') {
        // Clic trop tôt
        clearTimeout(reactionTimeout);
        reactionState = 'result';
        screen.className = 'reaction-screen clicked';
        message.innerHTML = `
            <div style="font-size: 1.2em; margin-bottom: 10px;">Trop tôt !</div>
            <div style="font-size: 0.9em; margin-bottom: 15px;">Attendez que l'écran devienne vert</div>
            <div style="font-size: 0.8em; opacity: 0.7;">Cliquez pour recommencer</div>
        `;
    } else if (reactionState === 'ready') {
        // Calcul du temps de réaction
        const reactionTime = Date.now() - reactionStartTime;
        reactionState = 'result';
        
        // Sauvegarde
        reactionHistory.push({
            time: reactionTime,
            date: new Date().toLocaleString()
        });
        
        // Affichage du résultat
        screen.className = 'reaction-screen clicked';
        message.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px; color: var(--psych-coral);">${reactionTime}ms</div>
            <div style="font-size: 1em; margin-bottom: 15px;">${getReactionRating(reactionTime)}</div>
            <div style="font-size: 0.8em; opacity: 0.7;">Cliquez pour recommencer</div>
        `;
        
        updateReactionStats();
    }
}

function startReactionRound() {
    const screen = document.getElementById('reaction-screen');
    const message = document.getElementById('reaction-message');
    
    // Reset
    clearTimeout(reactionTimeout);
    reactionState = 'waiting';
    
    // Phase d'attente
    screen.className = 'reaction-screen waiting';
    message.innerHTML = `
        <div style="font-size: 1.2em; margin-bottom: 10px;">Attendez...</div>
        <div style="font-size: 0.9em; opacity: 0.8;">L'écran va devenir vert</div>
    `;
    
    // Délai aléatoire entre 2 et 5 secondes
    const delay = Math.random() * 3000 + 2000;
    
    reactionTimeout = setTimeout(() => {
        if (reactionState === 'waiting') { // Vérifier qu'on n'a pas cliqué trop tôt
            screen.className = 'reaction-screen ready';
            message.innerHTML = `
                <div style="font-size: 1.5em; margin-bottom: 10px;">CLIQUEZ MAINTENANT !</div>
                <div style="font-size: 0.9em; opacity: 0.8;">⚡ Le plus vite possible ⚡</div>
            `;
            reactionStartTime = Date.now();
            reactionState = 'ready';
        }
    }, delay);
}

function getReactionRating(time) {
    if (time < 200) return '🚀 Incroyable ! La bête féroce !';
    if (time < 250) return "⚡ Excellent ! T'es presque aussi rapide que moi !";
    if (time < 300) return '👍 Très bon ! Belle perf !';
    if (time < 400) return '👌 Bon ! Dans la moyenne mais az';
    if (time < 500) return "😐 Moyen. Il faut regarder l'écran hein";
    return "🐌 Lent... Tu t'es endormi complet là ! 😴";
}

function updateReactionStats() {
    if (reactionHistory.length === 0) return;
    
    const times = reactionHistory.map(r => r.time);
    const currentTime = times[times.length - 1];
    const bestTime = Math.min(...times);
    const averageTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    
    document.getElementById('current-time').textContent = currentTime;
    document.getElementById('best-time').textContent = bestTime;
    document.getElementById('average-time').textContent = averageTime;
    document.getElementById('total-tests').textContent = reactionHistory.length;
}

function showReactionHistory() {
    const historyDiv = document.getElementById('reaction-history');
    
    if (reactionHistory.length === 0) {
        alert('Aucun test effectué pour le moment !');
        return;
    }
    
    const historyHTML = `
        <div class="reaction-history-table">
            <h3 style="color: var(--psych-sage); margin-bottom: 20px;">Historique des tests</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                ${reactionHistory.slice(-10).reverse().map((test, index) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--psych-ivory);">
                        <span>Test ${reactionHistory.length - index}</span>
                        <span style="font-weight: 600; color: var(--psych-coral);">${test.time}ms</span>
                        <span style="color: var(--text-light); font-size: 0.8em;">${test.date}</span>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="hideReactionHistory()" style="margin-top: 20px;">
                Fermer
            </button>
        </div>
    `;
    
    historyDiv.innerHTML = historyHTML;
    historyDiv.style.display = 'block';
}

function hideReactionHistory() {
    document.getElementById('reaction-history').style.display = 'none';
}
// ===== TEST DE DACTYLOGRAPHIE =====
// Liste de mots français courants pour le test
const frenchWords = [
    'le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour',
    'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'plus',
    'par', 'grand', 'mais', 'homme', 'vie', 'temps', 'jour', 'eau', 'monde', 'main',
    'premier', 'vous', 'lui', 'nous', 'comme', 'savoir', 'pouvoir', 'autre', 'année',
    'venir', 'deux', 'même', 'prendre', 'état', 'partie', 'entre', 'contre', 'tout',
    'place', 'sans', 'faire', 'aller', 'enfant', 'ville', 'métier', 'terre', 'point',
    'week', 'ciel', 'route', 'fin', 'raison', 'trouver', 'tête', 'donner', 'fait',
    'groupe', 'vers', 'chose', 'femme', 'créer', 'ouvrir', 'public', 'aussi', 'celui',
    'moment', 'dire', 'rendre', 'elle', 'tout', 'son', 'bien', 'où', 'jusque', 'forme',
    'école', 'maison', 'petit', 'encore', 'laisser', 'mot', 'rester', 'partir', 'père',
    'tenir', 'mois', 'passer', 'vouloir', 'parler', 'jeu', 'tant', 'mener', 'ordre',
    'loi', 'ligne', 'tard', 'force', 'beau', 'soir', 'créer', 'population', 'retour',
    'travail', 'commune', 'prix', 'livre', 'certain', 'commerce', 'question', 'politique'
];

// Variables pour le test de dactylographie
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
                    <div class="control-group">
                        <label>Difficulté</label>
                        <select id="typing-difficulty">
                            <option value="easy" selected>Facile (mots courts)</option>
                            <option value="medium">Moyen (mots variés)</option>
                            <option value="hard">Difficile (mots longs)</option>
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
}

function setTypingDuration(duration) {
    typingDuration = parseInt(duration);
    typingTimeLeft = typingDuration;
    document.getElementById('typing-time').textContent = typingDuration;
}

function generateTypingWords() {
    const difficulty = document.getElementById('typing-difficulty').value;
    let wordPool = [...frenchWords];
    
    // Filtrer selon la difficulté
    if (difficulty === 'easy') {
        wordPool = wordPool.filter(word => word.length <= 4);
    } else if (difficulty === 'medium') {
        wordPool = wordPool.filter(word => word.length <= 7);
    }
    // Pour 'hard', on garde tous les mots
    
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
        nextWordElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

function getTypingRating(wpm) {
    if (wpm >= 80) return '🚀 Exceptionnellement rapide ! Vous êtes un vrai pro du clavier !';
    if (wpm >= 60) return '⚡ Très rapide ! Excellente vitesse de frappe !';
    if (wpm >= 40) return '👍 Bonne vitesse ! Au-dessus de la moyenne !';
    if (wpm >= 25) return '👌 Vitesse correcte ! Continuez à vous entraîner !';
    if (wpm >= 15) return '🏃 Vitesse de base. Avec de la pratique, vous progresserez !';
    return '🐢 Début de l\'apprentissage. Prenez votre temps et focalisez-vous sur la précision !';
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

// ===== GESTION REDIMENSIONNEMENT =====
// Gérer le redimensionnement de la fenêtre pour le graphique d'attachement
window.addEventListener('resize', function() {
    if (document.getElementById('resultsContainer').style.display !== 'none') {
        setTimeout(() => {
            const anxiety = parseFloat(document.getElementById('anxietyScore').textContent);
            const avoidance = parseFloat(document.getElementById('avoidanceScore').textContent);
            drawChart(anxiety, avoidance);
        }, 100);
    }
});