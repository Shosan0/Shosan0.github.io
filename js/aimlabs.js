// ===== AIM TRAINER =====

// Variables globales pour l'aim trainer
let aimGameActive = false;
let aimCurrentTarget = null;
let aimCurrentTargets = []; // Pour le mode gridshot
let aimTrackingTarget = null; // Pour le mode tracking
let aimTargetStartTime = 0;
let aimScore = 0;
let aimTargetsHit = 0;
let aimTargetsMissed = 0;
let aimTotalTargets = 0;
let aimGameDuration = 60; // secondes
let aimGameTimeLeft = 60;
let aimGameTimer = null;
let aimDifficulty = 'medium';
let aimGameMode = 'classic';
let aimTrackingDirection = 1; // 1 pour droite, -1 pour gauche
let aimTrackingPosition = { x: 0, y: 0 };
let aimTrackingAnimation = null;
let aimStats = {
    totalReactionTime: 0,
    totalAccuracy: 0,
    hits: 0,
    misses: 0
};
let aimHistory = [];

// Configuration des difficultés
const aimDifficultySettings = {
    easy: {
        targetSize: 80,
        targetDuration: 3000,
        spawnDelay: 1500,
        trackingSpeed: 100,
        name: 'Facile'
    },
    medium: {
        targetSize: 60,
        targetDuration: 2000,
        spawnDelay: 1000,
        trackingSpeed: 150,
        name: 'Moyen'
    },
    hard: {
        targetSize: 40,
        targetDuration: 1500,
        spawnDelay: 800,
        trackingSpeed: 200,
        name: 'Difficile'
    },
    insane: {
        targetSize: 25,
        targetDuration: 1000,
        spawnDelay: 600,
        trackingSpeed: 250,
        name: 'Insensé'
    }
};

// ===== FONCTIONS PRINCIPALES =====
function startAimTrainer() {
    showSection('aim-trainer');
    initAimTrainer();
}

function initAimTrainer() {
    const gameArea = document.getElementById('aim-game-area');
    
    gameArea.innerHTML = `
        <div class="aim-trainer-game">
            <div class="aim-setup">
                <div class="aim-controls">
                    <div class="control-group">
                        <label>Difficulté</label>
                        <select id="aim-difficulty" onchange="setAimDifficulty(this.value)">
                            <option value="easy">🟢 Facile (cibles grandes)</option>
                            <option value="medium" selected>🟡 Moyen (équilibré)</option>
                            <option value="hard">🔴 Difficile (cibles petites)</option>
                            <option value="insane">⚫ Insensé (micro cibles)</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Durée</label>
                        <select id="aim-duration" onchange="setAimDuration(this.value)">
                            <option value="30">30 secondes</option>
                            <option value="60" selected>60 secondes</option>
                            <option value="120">2 minutes</option>
                            <option value="300">5 minutes</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Mode</label>
                        <select id="aim-mode" onchange="setAimMode(this.value)">
                            <option value="classic" selected>🎯 Classique (Spawn/Despawn)</option>
                            <option value="gridshot">⚡ Gridshot (3 cibles fixes)</option>
                            <option value="tracking">🎢 Tracking (Cible mobile)</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="startAimGame()" id="start-aim-btn">
                    🎯 Commencer l'entraînement
                </button>
                <button class="btn btn-secondary" onclick="showAimHistory()" style="margin-left: 10px;">
                    📊 Voir l'historique
                </button>
            </div>
            
            <div class="aim-instructions">
                🎮 <strong>Instructions :</strong><br>
                <strong>Classique :</strong> Clique sur les cibles qui apparaissent/disparaissent<br>
                <strong>Gridshot :</strong> 3 cibles fixes dans une zone réduite, vitesse maximale<br>
                <strong>Tracking :</strong> Suis la cible qui se déplace horizontalement (vitesse variable)<br>
                💡 <strong>Astuce :</strong> Garde ton curseur centré entre les actions !
            </div>
            
            <div class="aim-stats-display">
                <div class="aim-stat">
                    <div class="aim-stat-value" id="aim-score-display">0</div>
                    <div class="aim-stat-label">Score</div>
                </div>
                <div class="aim-stat">
                    <div class="aim-stat-value" id="aim-accuracy-display">0%</div>
                    <div class="aim-stat-label">Précision</div>
                </div>
                <div class="aim-stat">
                    <div class="aim-stat-value" id="aim-targets-hit">0</div>
                    <div class="aim-stat-label">Touches</div>
                </div>
                <div class="aim-stat">
                    <div class="aim-stat-value" id="aim-reaction-time">0ms</div>
                    <div class="aim-stat-label">Temps moyen</div>
                </div>
                <div class="aim-stat">
                    <div class="aim-stat-value" id="aim-time-left">60</div>
                    <div class="aim-stat-label">Temps</div>
                </div>
            </div>
            
            <div class="aim-game-area" id="aim-play-area">
                <div class="aim-game-message" id="aim-message">
                    Clique sur "Commencer l'entraînement" pour débuter !
                </div>
            </div>
        </div>
    `;
    
    resetAimStats();
}

// ===== CONFIGURATION =====
function setAimDifficulty(difficulty) {
    aimDifficulty = difficulty;
}

function setAimDuration(duration) {
    aimGameDuration = parseInt(duration);
    aimGameTimeLeft = aimGameDuration;
    document.getElementById('aim-time-left').textContent = aimGameDuration;
}

function setAimMode(mode) {
    aimGameMode = mode;
}

// ===== LOGIQUE DU JEU =====
function startAimGame() {
    const playArea = document.getElementById('aim-play-area');
    const startBtn = document.getElementById('start-aim-btn');
    const message = document.getElementById('aim-message');
    
    // Préparer l'aire de jeu - taille adaptée au mode
    if (aimGameMode === 'gridshot') {
        playArea.style.height = '400px';  // Zone plus petite pour gridshot
        playArea.style.width = '600px';
        playArea.style.margin = '0 auto';
    } else {
        playArea.style.height = '500px';
        playArea.style.width = '100%';
        playArea.style.margin = '0';
    }
    
    playArea.style.position = 'relative';
    playArea.style.background = '#f8f9fa';
    playArea.style.border = '3px solid var(--psych-sage)';
    playArea.style.borderRadius = '15px';
    playArea.style.cursor = 'crosshair';
    
    // Masquer le bouton et le message
    startBtn.style.display = 'none';
    message.style.display = 'none';
    
    // Reset des variables
    aimGameActive = true;
    aimScore = 0;
    aimTargetsHit = 0;
    aimTargetsMissed = 0;
    aimTotalTargets = 0;
    aimGameTimeLeft = aimGameDuration;
    aimCurrentTargets = [];
    aimTrackingTarget = null;
    resetAimStats();
    
    // Démarrer le timer
    startAimTimer();
    
    // Gestionnaire de clic pour les ratés
    playArea.addEventListener('click', handleAimAreaClick);
    
    // Démarrer selon le mode
    setTimeout(() => {
        if (aimGameMode === 'classic') {
            spawnAimTarget();
        } else if (aimGameMode === 'gridshot') {
            startGridshotMode();
        } else if (aimGameMode === 'tracking') {
            startTrackingMode();
        }
    }, 1000);
}

function startAimTimer() {
    aimGameTimer = setInterval(() => {
        aimGameTimeLeft--;
        document.getElementById('aim-time-left').textContent = aimGameTimeLeft;
        
        if (aimGameTimeLeft <= 0) {
            endAimGame();
        }
    }, 1000);
}

// ===== MODE CLASSIQUE =====
function spawnAimTarget() {
    if (!aimGameActive) return;
    
    const playArea = document.getElementById('aim-play-area');
    const settings = aimDifficultySettings[aimDifficulty];
    
    // Supprimer l'ancienne cible si elle existe
    if (aimCurrentTarget) {
        aimCurrentTarget.remove();
        aimTargetsMissed++;
        aimTotalTargets++;
    }
    
    // Créer la nouvelle cible
    const target = createTargetElement(settings.targetSize);
    
    // Position aléatoire
    const position = getRandomPosition(playArea, settings.targetSize);
    target.style.left = position.x + 'px';
    target.style.top = position.y + 'px';
    
    // Ajouter au DOM
    playArea.appendChild(target);
    aimCurrentTarget = target;
    aimTargetStartTime = Date.now();
    aimTotalTargets++;
    
    // Gestionnaire de clic sur la cible
    target.addEventListener('click', handleTargetHit);
    
    // Faire disparaître automatiquement
    setTimeout(() => {
        if (target.parentNode && aimGameActive) {
            target.remove();
            if (aimCurrentTarget === target) {
                aimCurrentTarget = null;
                aimTargetsMissed++;
                scheduleNextTarget();
            }
        }
    }, settings.targetDuration);
}

function handleTargetHit(event) {
    event.stopPropagation();
    
    if (!aimGameActive || !aimCurrentTarget) return;
    
    const target = event.currentTarget;
    const reactionTime = Date.now() - aimTargetStartTime;
    
    // Calculer la précision
    const accuracy = calculateTargetAccuracy(event, target);
    
    // Calculer le score basé sur la précision et la vitesse
    const speedBonus = Math.max(0.1, (1500 - reactionTime) / 1500);
    const points = Math.round(100 * accuracy * (0.7 + 0.3 * speedBonus));
    
    aimScore += points;
    aimTargetsHit++;
    
    // Mise à jour des stats
    aimStats.totalReactionTime += reactionTime;
    aimStats.totalAccuracy += accuracy;
    aimStats.hits++;
    
    // Animation de hit
    target.style.background = 'radial-gradient(circle, #2ed573 0%, #1dd1a1 50%, #26de81 100%)';
    target.style.transform = 'scale(1.3)';
    
    // Affichage du score flottant
    showFloatingScore(points, accuracy, reactionTime, event.clientX, event.clientY);
    
    // Retirer la cible
    setTimeout(() => target.remove(), 200);
    aimCurrentTarget = null;
    
    // Programmer la prochaine cible
    scheduleNextTarget();
    
    // Mettre à jour l'affichage
    updateAimDisplay();
}

function scheduleNextTarget() {
    if (!aimGameActive) return;
    
    const settings = aimDifficultySettings[aimDifficulty];
    setTimeout(spawnAimTarget, settings.spawnDelay);
}

// ===== MODE GRIDSHOT =====
function startGridshotMode() {
    if (!aimGameActive) return;
    
    // Créer 3 cibles fixes
    for (let i = 0; i < 3; i++) {
        spawnGridshotTarget();
    }
}

function spawnGridshotTarget() {
    if (!aimGameActive) return;
    
    const playArea = document.getElementById('aim-play-area');
    const settings = aimDifficultySettings[aimDifficulty];
    
    // Créer la nouvelle cible
    const target = createTargetElement(settings.targetSize);
    
    // Position aléatoire (en évitant les collisions)
    let position = getRandomPosition(playArea, settings.targetSize);
    let attempts = 0;
    
    // Éviter les collisions avec les autres cibles
    while (attempts < 50 && isPositionOccupied(position, settings.targetSize)) {
        position = getRandomPosition(playArea, settings.targetSize);
        attempts++;
    }
    
    target.style.left = position.x + 'px';
    target.style.top = position.y + 'px';
    
    // Ajouter au DOM et à la liste
    playArea.appendChild(target);
    aimCurrentTargets.push(target);
    aimTotalTargets++;
    
    // Gestionnaire de clic
    target.addEventListener('click', handleGridshotHit);
}

function handleGridshotHit(event) {
    event.stopPropagation();
    
    if (!aimGameActive) return;
    
    const target = event.currentTarget;
    const reactionTime = 200; // Gridshot se concentre sur la vitesse, pas la réaction
    
    // Calculer la précision
    const accuracy = calculateTargetAccuracy(event, target);
    
    // Score pour gridshot (favorise la vitesse)
    const points = Math.round(50 + (accuracy * 50));
    aimScore += points;
    aimTargetsHit++;
    
    // Mise à jour des stats
    aimStats.totalReactionTime += reactionTime;
    aimStats.totalAccuracy += accuracy;
    aimStats.hits++;
    
    // Animation de hit
    target.style.background = 'radial-gradient(circle, #2ed573 0%, #1dd1a1 50%, #26de81 100%)';
    target.style.transform = 'scale(1.3)';
    
    // Affichage du score flottant
    showFloatingScore(points, accuracy, reactionTime, event.clientX, event.clientY);
    
    // Retirer de la liste et du DOM
    const index = aimCurrentTargets.indexOf(target);
    if (index > -1) {
        aimCurrentTargets.splice(index, 1);
    }
    
    setTimeout(() => target.remove(), 200);
    
    // Créer une nouvelle cible immédiatement
    setTimeout(spawnGridshotTarget, 100);
    
    updateAimDisplay();
}

// ===== MODE TRACKING =====
function startTrackingMode() {
    if (!aimGameActive) return;
    
    spawnTrackingTarget();
    startTrackingAnimation();
}

function spawnTrackingTarget() {
    if (!aimGameActive) return;
    
    const playArea = document.getElementById('aim-play-area');
    const settings = aimDifficultySettings[aimDifficulty];
    
    // Créer la cible de tracking
    const target = createTargetElement(settings.targetSize);
    target.classList.add('tracking-target');
    
    // Position initiale au centre verticalement, côté gauche
    const startX = 20;
    const startY = (playArea.offsetHeight - settings.targetSize) / 2;
    
    target.style.left = startX + 'px';
    target.style.top = startY + 'px';
    
    aimTrackingPosition = { x: startX, y: startY };
    aimTrackingDirection = 1;
    
    // Ajouter au DOM
    playArea.appendChild(target);
    aimTrackingTarget = target;
    aimTotalTargets = 1; // En tracking, on compte différemment
    
    // Gestionnaire de clic
    target.addEventListener('click', handleTrackingHit);
}

function startTrackingAnimation() {
    if (!aimGameActive || !aimTrackingTarget) return;
    
    const playArea = document.getElementById('aim-play-area');
    const settings = aimDifficultySettings[aimDifficulty];
    let baseSpeed = settings.trackingSpeed / 60; // pixels per frame
    let currentSpeed = baseSpeed;
    
    function animate() {
        if (!aimGameActive || !aimTrackingTarget) return;
        
        // Variation aléatoire de la vitesse (±30%)
        if (Math.random() < 0.02) { // 2% de chance par frame de changer la vitesse
            const speedVariation = 0.7 + Math.random() * 0.6; // Entre 70% et 130%
            currentSpeed = baseSpeed * speedVariation;
        }
        
        // Changement de direction aléatoire occasionnel
        if (Math.random() < 0.005) { // 0.5% de chance par frame
            aimTrackingDirection *= -1;
        }
        
        // Calculer la nouvelle position horizontale
        aimTrackingPosition.x += aimTrackingDirection * currentSpeed;
        
        // Changer de direction si on atteint les bords
        const maxX = playArea.offsetWidth - settings.targetSize - 20;
        if (aimTrackingPosition.x <= 20) {
            aimTrackingDirection = 1;
            aimTrackingPosition.x = 20;
        } else if (aimTrackingPosition.x >= maxX) {
            aimTrackingDirection = -1;
            aimTrackingPosition.x = maxX;
        }
        
        // La position Y reste fixe au centre (pas de mouvement vertical)
        // aimTrackingPosition.y reste inchangé
        
        // Appliquer la position
        if (aimTrackingTarget) {
            aimTrackingTarget.style.left = aimTrackingPosition.x + 'px';
            aimTrackingTarget.style.top = aimTrackingPosition.y + 'px';
        }
        
        aimTrackingAnimation = requestAnimationFrame(animate);
    }
    
    animate();
}

function handleTrackingHit(event) {
    event.stopPropagation();
    
    if (!aimGameActive) return;
    
    const target = event.currentTarget;
    const reactionTime = 150; // Tracking se concentre sur le suivi, pas la réaction
    
    // Calculer la précision
    const accuracy = calculateTargetAccuracy(event, target);
    
    // Score pour tracking (favorise la précision du suivi)
    const points = Math.round(30 + (accuracy * 70));
    aimScore += points;
    aimTargetsHit++;
    
    // Mise à jour des stats
    aimStats.totalReactionTime += reactionTime;
    aimStats.totalAccuracy += accuracy;
    aimStats.hits++;
    
    // Animation de hit temporaire
    const originalBg = target.style.background;
    target.style.background = 'radial-gradient(circle, #2ed573 0%, #1dd1a1 50%, #26de81 100%)';
    target.style.transform = 'scale(1.2)';
    
    // Affichage du score flottant
    showFloatingScore(points, accuracy, reactionTime, event.clientX, event.clientY);
    
    // Remettre l'apparence normale après un court instant
    setTimeout(() => {
        if (target) {
            target.style.background = originalBg;
            target.style.transform = 'scale(1)';
        }
    }, 200);
    
    updateAimDisplay();
}

// ===== FONCTIONS UTILITAIRES =====
function createTargetElement(size) {
    const target = document.createElement('div');
    target.className = 'aim-target';
    
    target.style.width = size + 'px';
    target.style.height = size + 'px';
    target.style.position = 'absolute';
    target.style.borderRadius = '50%';
    target.style.background = 'radial-gradient(circle, #ff4757 0%, #ff3838 30%, #ff6b6b 70%, #ff9999 100%)';
    target.style.border = '3px solid #fff';
    target.style.boxShadow = '0 4px 15px rgba(255, 71, 87, 0.4), inset 0 0 0 2px #ff3838';
    target.style.cursor = 'crosshair'; // CORRECTION: Forcer le curseur crosshair
    target.style.transition = 'transform 0.1s ease';
    target.style.animation = 'aimTargetAppear 0.2s ease-out';
    
    // Centre de la cible (pour la précision)
    const centerDot = document.createElement('div');
    centerDot.style.position = 'absolute';
    centerDot.style.top = '50%';
    centerDot.style.left = '50%';
    centerDot.style.transform = 'translate(-50%, -50%)';
    centerDot.style.width = '8px';
    centerDot.style.height = '8px';
    centerDot.style.borderRadius = '50%';
    centerDot.style.background = '#fff';
    centerDot.style.boxShadow = '0 0 3px rgba(0,0,0,0.5)';
    centerDot.style.pointerEvents = 'none'; // Important pour ne pas interférer avec les clics
    target.appendChild(centerDot);
    
    // Animation hover
    target.addEventListener('mouseover', () => {
        target.style.transform = 'scale(1.05)';
    });
    target.addEventListener('mouseout', () => {
        target.style.transform = 'scale(1)';
    });
    
    return target;
}

function getRandomPosition(playArea, targetSize) {
    const maxX = playArea.offsetWidth - targetSize - 20;
    const maxY = playArea.offsetHeight - targetSize - 20;
    return {
        x: Math.random() * maxX + 10,
        y: Math.random() * maxY + 10
    };
}

function isPositionOccupied(position, targetSize) {
    const minDistance = targetSize + 20; // Distance minimale entre cibles
    
    for (let target of aimCurrentTargets) {
        const targetRect = target.getBoundingClientRect();
        const playAreaRect = document.getElementById('aim-play-area').getBoundingClientRect();
        
        const targetX = targetRect.left - playAreaRect.left;
        const targetY = targetRect.top - playAreaRect.top;
        
        const distance = Math.sqrt(
            Math.pow(position.x - targetX, 2) + 
            Math.pow(position.y - targetY, 2)
        );
        
        if (distance < minDistance) {
            return true;
        }
    }
    
    return false;
}

function calculateTargetAccuracy(event, target) {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
    const maxDistance = rect.width / 2; // Rayon de la cible
    return Math.max(0, (maxDistance - distance) / maxDistance);
}

function showFloatingScore(points, accuracy, reactionTime, x, y) {
    const floatingScore = document.createElement('div');
    floatingScore.style.position = 'fixed';
    floatingScore.style.left = x + 'px';
    floatingScore.style.top = y + 'px';
    floatingScore.style.color = points > 80 ? '#2ed573' : points > 50 ? '#ffa502' : '#ff4757';
    floatingScore.style.fontSize = '18px';
    floatingScore.style.fontWeight = 'bold';
    floatingScore.style.pointerEvents = 'none';
    floatingScore.style.animation = 'aimFloatingScore 1s ease-out forwards';
    floatingScore.style.zIndex = '1000';
    floatingScore.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
    
    floatingScore.innerHTML = `
        +${points}
        <div style="font-size: 12px; opacity: 0.8;">
            ${Math.round(accuracy * 100)}% • ${reactionTime}ms
        </div>
    `;
    
    document.body.appendChild(floatingScore);
    setTimeout(() => floatingScore.remove(), 1000);
}

function handleAimAreaClick(event) {
    // Clic raté (pas sur une cible)
    if (event.target.classList.contains('aim-target')) return;
    
    aimTargetsMissed++;
    aimStats.misses++;
    
    // Animation de raté
    const miss = document.createElement('div');
    miss.style.position = 'absolute';
    miss.style.left = (event.offsetX - 10) + 'px';
    miss.style.top = (event.offsetY - 10) + 'px';
    miss.style.width = '20px';
    miss.style.height = '20px';
    miss.style.borderRadius = '50%';
    miss.style.background = '#ffd966';
    miss.style.opacity = '0.7';
    miss.style.animation = 'aimMissEffect 0.5s ease-out forwards';
    miss.style.pointerEvents = 'none';
    
    event.currentTarget.appendChild(miss);
    setTimeout(() => miss.remove(), 500);
    
    updateAimDisplay();
}

// ===== MISE À JOUR DE L'AFFICHAGE =====
function updateAimDisplay() {
    const accuracy = aimTotalTargets > 0 ? Math.round((aimTargetsHit / aimTotalTargets) * 100) : 0;
    const avgReactionTime = aimStats.hits > 0 ? Math.round(aimStats.totalReactionTime / aimStats.hits) : 0;
    
    document.getElementById('aim-score-display').textContent = aimScore;
    document.getElementById('aim-accuracy-display').textContent = accuracy + '%';
    document.getElementById('aim-targets-hit').textContent = aimTargetsHit;
    document.getElementById('aim-reaction-time').textContent = avgReactionTime + 'ms';
}

// ===== FIN DU JEU =====
function endAimGame() {
    aimGameActive = false;
    clearInterval(aimGameTimer);
    
    // Arrêter l'animation de tracking
    if (aimTrackingAnimation) {
        cancelAnimationFrame(aimTrackingAnimation);
        aimTrackingAnimation = null;
    }
    
    // Supprimer toutes les cibles
    if (aimCurrentTarget) {
        aimCurrentTarget.remove();
        aimCurrentTarget = null;
    }
    
    aimCurrentTargets.forEach(target => target.remove());
    aimCurrentTargets = [];
    
    if (aimTrackingTarget) {
        aimTrackingTarget.remove();
        aimTrackingTarget = null;
    }
    
    // Calculer les statistiques finales
    const finalAccuracy = aimTotalTargets > 0 ? (aimTargetsHit / aimTotalTargets) * 100 : 0;
    const avgReactionTime = aimStats.hits > 0 ? aimStats.totalReactionTime / aimStats.hits : 0;
    const avgPrecision = aimStats.hits > 0 ? (aimStats.totalAccuracy / aimStats.hits) * 100 : 0;
    
    // Calculer le score final ajusté
    const timeBonus = aimGameDuration >= 60 ? 1 : aimGameDuration / 60;
    const difficultyMultiplier = {
        easy: 0.8,
        medium: 1.0,
        hard: 1.3,
        insane: 1.7
    }[aimDifficulty];
    
    const modeMultiplier = {
        classic: 1.0,
        gridshot: 0.9, // Légèrement moins car plus facile
        tracking: 1.2  // Plus car plus difficile
    }[aimGameMode];
    
    const finalScore = Math.round(aimScore * timeBonus * difficultyMultiplier * modeMultiplier);
    
    // Sauvegarder dans l'historique
    aimHistory.push({
        score: finalScore,
        accuracy: Math.round(finalAccuracy),
        avgReactionTime: Math.round(avgReactionTime),
        avgPrecision: Math.round(avgPrecision),
        targetsHit: aimTargetsHit,
        totalTargets: aimTotalTargets,
        difficulty: aimDifficulty,
        mode: aimGameMode,
        duration: aimGameDuration,
        date: new Date().toLocaleString()
    });
    
    // Afficher les résultats
    displayAimResults(finalScore, finalAccuracy, avgReactionTime, avgPrecision);
}

function displayAimResults(finalScore, accuracy, avgReactionTime, avgPrecision) {
    const gameArea = document.getElementById('aim-game-area');
    
    const performanceRating = getAimRating(finalScore, accuracy);
    const difficultyName = aimDifficultySettings[aimDifficulty].name;
    const modeName = {
        classic: 'Classique',
        gridshot: 'Gridshot',
        tracking: 'Tracking'
    }[aimGameMode];
    
    gameArea.innerHTML = `
        <div class="aim-results">
            <h3>🎯 Résultats de l'Entraînement</h3>
            
            <div class="aim-results-grid">
                <div class="aim-result-card">
                    <div class="aim-result-value">${finalScore}</div>
                    <div class="aim-result-label">Score Final</div>
                    <div class="aim-result-description">${modeName} • ${difficultyName}</div>
                </div>
                
                <div class="aim-result-card">
                    <div class="aim-result-value">${Math.round(accuracy)}%</div>
                    <div class="aim-result-label">Précision</div>
                    <div class="aim-result-description">${aimTargetsHit}/${aimTotalTargets} cibles</div>
                </div>
                
                <div class="aim-result-card">
                    <div class="aim-result-value">${Math.round(avgReactionTime)}ms</div>
                    <div class="aim-result-label">Temps Moyen</div>
                    <div class="aim-result-description">Vitesse de réaction</div>
                </div>
                
                <div class="aim-result-card">
                    <div class="aim-result-value">${Math.round(avgPrecision)}%</div>
                    <div class="aim-result-label">Précision Moy.</div>
                    <div class="aim-result-description">Distance du centre</div>
                </div>
            </div>
            
            <div style="background: var(--psych-ivory); padding: 20px; border-radius: 15px; margin-bottom: 30px;">
                <h4 style="color: var(--psych-sage); margin-bottom: 10px;">🎮 Évaluation</h4>
                <p style="font-size: 1.1em; margin: 0; color: var(--text-dark);">${performanceRating}</p>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="initAimTrainer()">
                    🔄 Recommencer
                </button>
                <button class="btn btn-secondary" onclick="showAimHistory()">
                    📊 Voir l'historique
                </button>
            </div>
        </div>
    `;
}

// ===== ÉVALUATION =====
function getAimRating(score, accuracy) {
    if (score >= 5000 && accuracy >= 80) {
        return '🔥 RADIANT ! Aim de pro, tu peux carry tes teammates les yeux fermés !';
    }
    if (score >= 3500 && accuracy >= 70) {
        return '💎 IMMORTAL ! Excellent aim, tu vas détruire en ranked !';
    }
    if (score >= 2500 && accuracy >= 60) {
        return '⚡ ASCENDANT ! Très bon niveau, continue comme ça !';
    }
    if (score >= 1500 && accuracy >= 50) {
        return '🎯 DIAMOND ! Solide performance, tu progresses bien !';
    }
    if (score >= 1000 && accuracy >= 40) {
        return '🥈 PLATINUM ! Pas mal, mais tu peux faire mieux !';
    }
    if (score >= 600 && accuracy >= 30) {
        return '🥉 GOLD ! Bon début, continue à t\'entraîner !';
    }
    if (score >= 300) {
        return '🏅 SILVER ! Tu débutes, l\'entraînement va payer !';
    }
    return '🆕 BRONZE ! Tout le monde commence quelque part, persévère !';
}

// ===== UTILITAIRES =====
function resetAimStats() {
    aimStats = {
        totalReactionTime: 0,
        totalAccuracy: 0,
        hits: 0,
        misses: 0
    };
    
    document.getElementById('aim-score-display').textContent = '0';
    document.getElementById('aim-accuracy-display').textContent = '0%';
    document.getElementById('aim-targets-hit').textContent = '0';
    document.getElementById('aim-reaction-time').textContent = '0ms';
    document.getElementById('aim-time-left').textContent = aimGameDuration;
}

// ===== HISTORIQUE =====
function showAimHistory() {
    const historyDiv = document.getElementById('aim-history');
    
    if (aimHistory.length === 0) {
        alert('Aucun entraînement effectué pour le moment !');
        return;
    }
    
    const historyHTML = `
        <div class="aim-history-table">
            <h3 style="color: var(--psych-sage); margin-bottom: 20px;">📊 Historique des Entraînements</h3>
            <div style="max-height: 400px; overflow-y: auto;">
                ${aimHistory.slice(-15).reverse().map((session, index) => `
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr; gap: 15px; padding: 12px; border-bottom: 1px solid var(--psych-ivory); align-items: center;">
                        <div style="font-weight: 600; color: var(--psych-coral);">${session.score} pts</div>
                        <div style="color: var(--psych-sage);">${session.accuracy}%</div>
                        <div style="color: var(--text-dark);">${session.avgReactionTime}ms</div>
                        <div style="color: var(--text-light);">${session.targetsHit}/${session.totalTargets}</div>
                        <div style="color: var(--text-light); font-size: 0.9em;">
                            ${aimDifficultySettings[session.difficulty].name}
                        </div>
                        <div style="color: var(--text-light); font-size: 0.8em;">${session.date}</div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="hideAimHistory()" style="margin-top: 20px;">
                Fermer
            </button>
        </div>
    `;
    
    historyDiv.innerHTML = historyHTML;
    historyDiv.style.display = 'block';
}

function hideAimHistory() {
    document.getElementById('aim-history').style.display = 'none';
}