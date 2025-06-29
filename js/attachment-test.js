// ===== TEST D'ATTACHEMENT ECR-R AMÉLIORÉ =====

// Nouvelles questions en français inspirées de l'ECR-R mais reformulées
// pour éviter les problèmes de droits d'auteur
const attachmentQuestions = [
    // Questions dimension "anxiété" (18 questions)
    {id: 1, text: "J'ai peur que mon/ma partenaire ne m'aime plus autant qu'avant.", dimension: "anxiety", reverse: false},
    {id: 2, text: "Je m'inquiète souvent que mon/ma partenaire veuille me quitter.", dimension: "anxiety", reverse: false},
    {id: 3, text: "Je doute parfois de l'amour que me porte mon/ma partenaire.", dimension: "anxiety", reverse: false},
    {id: 4, text: "J'ai l'impression d'aimer plus fort que je ne suis aimé(e) en retour.", dimension: "anxiety", reverse: false},
    {id: 5, text: "J'aimerais que mon/ma partenaire ressente des sentiments aussi intenses que les miens.", dimension: "anxiety", reverse: false},
    {id: 6, text: "Les relations amoureuses me préoccupent beaucoup.", dimension: "anxiety", reverse: false},
    {id: 7, text: "Quand mon/ma partenaire sort sans moi, je crains qu'il/elle rencontre quelqu'un d'autre.", dimension: "anxiety", reverse: false},
    {id: 8, text: "J'hésite à exprimer mes sentiments de peur qu'ils ne soient pas partagés.", dimension: "anxiety", reverse: false},
    {id: 9, text: "Je ne me fais pas de souci à l'idée d'être abandonné(e).", dimension: "anxiety", reverse: true},
    {id: 10, text: "Mon/ma partenaire me fait parfois douter de ma valeur.", dimension: "anxiety", reverse: false},
    {id: 11, text: "L'abandon ne fait pas partie de mes préoccupations.", dimension: "anxiety", reverse: true},
    {id: 12, text: "Mon/ma partenaire semble moins proche de moi que je le souhaiterais.", dimension: "anxiety", reverse: false},
    {id: 13, text: "L'attitude de mon/ma partenaire envers moi change parfois sans raison apparente.", dimension: "anxiety", reverse: false},
    {id: 14, text: "Mon besoin de proximité fait parfois fuir les gens.", dimension: "anxiety", reverse: false},
    {id: 15, text: "J'ai peur qu'en apprenant à me connaître vraiment, mon/ma partenaire soit déçu(e).", dimension: "anxiety", reverse: false},
    {id: 16, text: "Cela m'agace de ne pas recevoir assez d'affection et de soutien.", dimension: "anxiety", reverse: false},
    {id: 17, text: "Je m'inquiète de ne pas être à la hauteur des autres.", dimension: "anxiety", reverse: false},
    {id: 18, text: "Mon/ma partenaire ne fait attention à moi que lorsque je suis en colère.", dimension: "anxiety", reverse: false},
    
    // Questions dimension "évitement" (18 questions)
    {id: 19, text: "Je préfère garder mes sentiments profonds pour moi.", dimension: "avoidance", reverse: false},
    {id: 20, text: "J'aime partager mes pensées intimes avec mon/ma partenaire.", dimension: "avoidance", reverse: true},
    {id: 21, text: "Il m'est difficile de compter sur mon/ma partenaire.", dimension: "avoidance", reverse: false},
    {id: 22, text: "Je me sens à l'aise dans l'intimité avec mon/ma partenaire.", dimension: "avoidance", reverse: true},
    {id: 23, text: "M'ouvrir émotionnellement à mon/ma partenaire me met mal à l'aise.", dimension: "avoidance", reverse: false},
    {id: 24, text: "Je préfère maintenir une certaine distance avec mon/ma partenaire.", dimension: "avoidance", reverse: false},
    {id: 25, text: "Quand mon/ma partenaire veut être très proche, je me sens étouffé(e).", dimension: "avoidance", reverse: false},
    {id: 26, text: "Il m'est naturel de me rapprocher de mon/ma partenaire.", dimension: "avoidance", reverse: true},
    {id: 27, text: "Créer de l'intimité avec mon/ma partenaire ne me pose pas de problème.", dimension: "avoidance", reverse: true},
    {id: 28, text: "Je discute facilement de mes problèmes avec mon/ma partenaire.", dimension: "avoidance", reverse: true},
    {id: 29, text: "Me tourner vers mon/ma partenaire dans les moments difficiles m'aide.", dimension: "avoidance", reverse: true},
    {id: 30, text: "Je raconte presque tout à mon/ma partenaire.", dimension: "avoidance", reverse: true},
    {id: 31, text: "J'échange régulièrement avec mon/ma partenaire sur ce qui m'arrive.", dimension: "avoidance", reverse: true},
    {id: 32, text: "Je deviens nerveux/nerveuse quand mon/ma partenaire devient trop proche.", dimension: "avoidance", reverse: false},
    {id: 33, text: "Je me sens en sécurité en dépendant de mon/ma partenaire.", dimension: "avoidance", reverse: true},
    {id: 34, text: "Compter sur mon/ma partenaire me vient facilement.", dimension: "avoidance", reverse: true},
    {id: 35, text: "Exprimer de l'affection à mon/ma partenaire me vient naturellement.", dimension: "avoidance", reverse: true},
    {id: 36, text: "Mon/ma partenaire comprend vraiment mes besoins et qui je suis.", dimension: "avoidance", reverse: true},
    
    // Questions supplémentaires pour enrichir le test (12 questions)
    {id: 37, text: "Je vérifie souvent si mon/ma partenaire m'aime encore.", dimension: "anxiety", reverse: false},
    {id: 38, text: "Les disputes me font craindre la fin de ma relation.", dimension: "anxiety", reverse: false},
    {id: 39, text: "J'ai besoin de beaucoup de réassurance de la part de mon/ma partenaire.", dimension: "anxiety", reverse: false},
    {id: 40, text: "Je me sens en sécurité dans ma relation amoureuse.", dimension: "anxiety", reverse: true},
    {id: 41, text: "L'indépendance est très importante pour moi dans une relation.", dimension: "avoidance", reverse: false},
    {id: 42, text: "Trop d'intimité émotionnelle me rend inconfortable.", dimension: "avoidance", reverse: false},
    {id: 43, text: "Je préfère résoudre mes problèmes seul(e) plutôt qu'avec mon/ma partenaire.", dimension: "avoidance", reverse: false},
    {id: 44, text: "Montrer mes faiblesses à mon/ma partenaire ne me dérange pas.", dimension: "avoidance", reverse: true},
    {id: 45, text: "Je m'inquiète souvent de décevoir mon/ma partenaire.", dimension: "anxiety", reverse: false},
    {id: 46, text: "Les moments de silence avec mon/ma partenaire me mettent mal à l'aise.", dimension: "anxiety", reverse: false},
    {id: 47, text: "J'aime avoir du temps pour moi, loin de mon/ma partenaire.", dimension: "avoidance", reverse: false},
    {id: 48, text: "Je fais confiance à mon/ma partenaire pour être là quand j'en ai besoin.", dimension: "avoidance", reverse: true}
];

// Variables globales du test
let currentQuestion = 0;
let responses = {};
let randomizedQuestions = [];
let selectedQuestions = [];

// ===== FONCTIONS PRINCIPALES =====
function startAttachmentTest() {
    showSection('attachment-test');
}

function startQuestions() {
    document.getElementById('attachment-intro').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'block';
    
    // Sélectionner et randomiser 48 questions
    selectAndRandomizeQuestions();
    generateQuestions();
    showQuestion(0);
}

function selectAndRandomizeQuestions() {
    // Séparer les questions par dimension
    const anxietyQuestions = attachmentQuestions.filter(q => q.dimension === 'anxiety');
    const avoidanceQuestions = attachmentQuestions.filter(q => q.dimension === 'avoidance');
    
    // Sélectionner 18 questions de chaque dimension aléatoirement
    const selectedAnxiety = shuffleArray([...anxietyQuestions]).slice(0, 24);
    const selectedAvoidance = shuffleArray([...avoidanceQuestions]).slice(0, 24);
    
    // Combiner et mélanger l'ordre final
    selectedQuestions = shuffleArray([...selectedAnxiety, ...selectedAvoidance]);
    
    // Réassigner les IDs pour l'affichage (1 à 48)
    selectedQuestions.forEach((question, index) => {
        question.displayId = index + 1;
    });
    
    console.log('Questions sélectionnées et randomisées:', selectedQuestions.length);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    selectedQuestions.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.id = `question-${index}`;
        
        questionCard.innerHTML = `
            <div class="question-number">Question ${question.displayId} sur 48</div>
            <div class="question-text">${question.text}</div>
            
            <div class="scale-container">
                <div class="scale-options">
                    ${[1,2,3,4,5,6,7].map(value => `
                        <div class="scale-item">
                            <input type="radio" id="q${question.displayId}_${value}" name="question_${question.displayId}" value="${value}" onchange="handleResponse(${question.id}, ${value})">
                            <label for="q${question.displayId}_${value}">
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
                    ${index === selectedQuestions.length - 1 ? 'Voir les résultats' : 'Suivant →'}
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
    const progress = ((index + 1) / selectedQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Question ${index + 1} sur ${selectedQuestions.length}`;
    
    currentQuestion = index;
}

function handleResponse(questionId, value) {
    responses[questionId] = value;
    document.getElementById(`nextBtn-${currentQuestion}`).disabled = false;
}

function nextQuestion() {
    if (currentQuestion < selectedQuestions.length - 1) {
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

// ===== CALCUL DES RÉSULTATS =====
function calculateResults() {
    let anxietySum = 0;
    let avoidanceSum = 0;
    let anxietyCount = 0;
    let avoidanceCount = 0;

    selectedQuestions.forEach(question => {
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
            name: "Sécure (56-58% de la population)",
            description: "Vous vous sentez généralement à l'aise dans l'intimité et l'autonomie. Vous maintenez facilement des relations proches et stables. Vous communiquez directement vos besoins, gérez bien les conflits et faites confiance à vos partenaires tout en gardant une bonne estime de vous-même. Vous êtes capable d'être seul(e) sans souffrir et en couple sans vous perdre."
        };
    } else if (anxiety >= 4 && avoidance < 4) {
        return {
            name: "Anxieux/Préoccupé (18-20% de la population)",
            description: "Vous désirez des relations très proches mais vous vous inquiétez que les autres ne vous aiment pas autant que vous les aimez. Vous avez tendance à avoir besoin de beaucoup de réassurance de votre partenaire et analysez souvent ses comportements pour déceler des signes de rejet. Vous pouvez parfois idéaliser votre partenaire tout en vous dévalorisant."
        };
    } else if (anxiety < 4 && avoidance >= 4) {
        return {
            name: "Évitant/Détaché (22-25% de la population)",
            description: "Vous valorisez l'indépendance et l'autonomie. Vous pouvez vous sentir mal à l'aise avec une trop grande intimité émotionnelle. Vous avez appris que compter sur les autres peut mener à la déception et préférez maintenir une certaine distance émotionnelle. Vous avez du mal à exprimer vos sentiments profonds et évitez parfois les conversations trop personnelles."
        };
    } else {
        return {
            name: "Désorganisé/Craintif-Évitant (5-10% de la population)",
            description: "Vous ressentez un mélange d'anxiété et d'évitement dans les relations. Vous voulez l'amour mais paniquez parfois quand vous l'obtenez. Votre comportement peut être imprévisible : très proche un jour et distant le lendemain. Vous avez du mal à faire confiance mais souffrez de la solitude. C'est un style complexe qui peut créer des cycles d'approche-fuite dans les relations."
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

// ===== GRAPHIQUE D'ATTACHEMENT =====
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

// ===== RESTART TEST =====
function restartAttachmentTest() {
    currentQuestion = 0;
    responses = {};
    selectedQuestions = [];
    
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