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

// Navigation générale
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

// Gérer le redimensionnement de la fenêtre pour le graphique
window.addEventListener('resize', function() {
    if (document.getElementById('resultsContainer').style.display !== 'none') {
        setTimeout(() => {
            const anxiety = parseFloat(document.getElementById('anxietyScore').textContent);
            const avoidance = parseFloat(document.getElementById('avoidanceScore').textContent);
            drawChart(anxiety, avoidance);
        }, 100);
    }
});
