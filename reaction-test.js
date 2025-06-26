// ===== TEST DE RÉACTION =====

// Variables globales pour le test de réaction
let reactionStartTime = 0;
let reactionTimeout = null;
let reactionHistory = [];
let reactionState = 'initial'; // 'initial', 'waiting', 'ready', 'result'

// ===== FONCTIONS PRINCIPALES =====
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

// ===== LOGIQUE DU JEU =====
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

// ===== ÉVALUATION ET STATISTIQUES =====
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

// ===== HISTORIQUE =====
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