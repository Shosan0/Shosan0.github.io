// ===== BLACKJACK GAME =====

// Variables globales pour le jeu de blackjack
let blackjackDeck = [];
let playerHand = [];
let dealerHand = [];
let gameActive = false;
let gameStats = {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0
};

// Cartes et valeurs
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// ===== FONCTIONS PRINCIPALES =====
function startBlackjackGame() {
    showSection('blackjack-game');
    initBlackjackGame();
}

function initBlackjackGame() {
    const gameArea = document.getElementById('blackjack-game-area');
    
    gameArea.innerHTML = `
        <div class="blackjack-game">
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-value" id="games-played">${gameStats.gamesPlayed}</div>
                    <div class="game-stat-label">Parties</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-value" id="games-won">${gameStats.wins}</div>
                    <div class="game-stat-label">Victoires</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-value" id="games-lost">${gameStats.losses}</div>
                    <div class="game-stat-label">Défaites</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-value" id="games-tied">${gameStats.ties}</div>
                    <div class="game-stat-label">Égalités</div>
                </div>
            </div>
            
            <div class="blackjack-table">
                <div class="dealer-section">
                    <div class="section-title">🎩 Croupier</div>
                    <div class="cards-container" id="dealer-cards">
                        <!-- Cartes du croupier -->
                    </div>
                    <div class="score-display" id="dealer-score">Score: ?</div>
                </div>
                
                <div class="game-message message-playing" id="game-message">
                    Cliquez sur "Nouvelle Partie" pour commencer !
                </div>
                
                <div class="player-section">
                    <div class="section-title">🙋‍♂️ Vous</div>
                    <div class="cards-container" id="player-cards">
                        <!-- Cartes du joueur -->
                    </div>
                    <div class="score-display" id="player-score">Score: 0</div>
                </div>
            </div>
            
            <div class="game-controls">
                <button class="blackjack-btn btn-hit" id="hit-btn" onclick="playerHit()" disabled>
                    Carte ! 🃏
                </button>
                <button class="blackjack-btn btn-stand" id="stand-btn" onclick="playerStand()" disabled>
                    Rester 🛑
                </button>
                <button class="blackjack-btn btn-new-game" onclick="newBlackjackGame()">
                    Nouvelle Partie 🎮
                </button>
                <button class="blackjack-btn btn-secondary" onclick="showBlackjackRules()">
                    Règles 📖
                </button>
            </div>
        </div>
    `;
}

// ===== GESTION DU DECK =====
function createDeck() {
    blackjackDeck = [];
    for (let suit of suits) {
        for (let value of values) {
            blackjackDeck.push({ suit, value });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = blackjackDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [blackjackDeck[i], blackjackDeck[j]] = [blackjackDeck[j], blackjackDeck[i]];
    }
}

function dealCard() {
    return blackjackDeck.pop();
}

// ===== CALCUL DES VALEURS =====
function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    
    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            value += 11;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    
    // Ajuster les As si nécessaire
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    
    return value;
}

// ===== AFFICHAGE DES CARTES =====
function createCardElement(card, isHidden = false) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.suit}`;
    
    if (isHidden) {
        cardElement.classList.add('card-back');
        cardElement.innerHTML = '🂠';
    } else {
        cardElement.innerHTML = `
            <div class="card-value">${card.value}</div>
            <div class="card-suit">${suitSymbols[card.suit]}</div>
            <div class="card-value" style="transform: rotate(180deg);">${card.value}</div>
        `;
    }
    
    return cardElement;
}

function updateDisplay() {
    const dealerCardsContainer = document.getElementById('dealer-cards');
    const playerCardsContainer = document.getElementById('player-cards');
    const dealerScoreElement = document.getElementById('dealer-score');
    const playerScoreElement = document.getElementById('player-score');
    
    // Afficher les cartes du joueur
    playerCardsContainer.innerHTML = '';
    playerHand.forEach(card => {
        playerCardsContainer.appendChild(createCardElement(card));
    });
    
    // Afficher les cartes du croupier
    dealerCardsContainer.innerHTML = '';
    dealerHand.forEach((card, index) => {
        const isHidden = gameActive && index === 1; // Cache la 2ème carte du croupier pendant le jeu
        dealerCardsContainer.appendChild(createCardElement(card, isHidden));
    });
    
    // Mettre à jour les scores
    const playerScore = calculateHandValue(playerHand);
    playerScoreElement.textContent = `Score: ${playerScore}`;
    
    if (gameActive) {
        // Pendant le jeu, ne montrer que la première carte du croupier
        const visibleDealerScore = getCardValue(dealerHand[0]);
        dealerScoreElement.textContent = `Score: ${visibleDealerScore} + ?`;
    } else {
        const dealerScore = calculateHandValue(dealerHand);
        dealerScoreElement.textContent = `Score: ${dealerScore}`;
    }
}

// ===== LOGIQUE DU JEU =====
function newBlackjackGame() {
    createDeck();
    playerHand = [];
    dealerHand = [];
    gameActive = true;
    
    // Distribuer les cartes initiales
    playerHand.push(dealCard());
    dealerHand.push(dealCard());
    playerHand.push(dealCard());
    dealerHand.push(dealCard());
    
    updateDisplay();
    updateGameMessage("À vous de jouer ! Voulez-vous une carte ou rester ?");
    
    // Activer les boutons
    document.getElementById('hit-btn').disabled = false;
    document.getElementById('stand-btn').disabled = false;
    
    // Vérifier blackjack naturel
    if (calculateHandValue(playerHand) === 21) {
        if (calculateHandValue(dealerHand) === 21) {
            endGame('tie', 'Égalité ! Vous avez tous les deux un Blackjack ! 🎭');
        } else {
            endGame('win', 'BLACKJACK ! Félicitations ! 🎉');
        }
    }
}

function playerHit() {
    if (!gameActive) return;
    
    playerHand.push(dealCard());
    updateDisplay();
    
    const playerScore = calculateHandValue(playerHand);
    
    if (playerScore > 21) {
        endGame('lose', `Bust ! Vous dépassez 21 avec ${playerScore} points ! 💥`);
    } else if (playerScore === 21) {
        playerStand();
    } else {
        updateGameMessage(`Votre score: ${playerScore}. Voulez-vous une autre carte ?`);
    }
}

function playerStand() {
    if (!gameActive) return;
    
    gameActive = false;
    
    // Le croupier joue
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(dealCard());
    }
    
    updateDisplay();
    
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);
    
    // Déterminer le gagnant
    if (dealerScore > 21) {
        endGame('win', `Le croupier fait Bust avec ${dealerScore} ! Vous gagnez ! 🎉`);
    } else if (dealerScore > playerScore) {
        endGame('lose', `Le croupier gagne avec ${dealerScore} contre ${playerScore} ! 😔`);
    } else if (playerScore > dealerScore) {
        endGame('win', `Vous gagnez avec ${playerScore} contre ${dealerScore} ! 🎉`);
    } else {
        endGame('tie', `Égalité ! Vous avez tous les deux ${playerScore} points ! 🎭`);
    }
}

// ===== FIN DE PARTIE ET STATISTIQUES =====
function endGame(result, message) {
    gameActive = false;
    
    // Désactiver les boutons
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    
    // Mettre à jour les statistiques
    gameStats.gamesPlayed++;
    if (result === 'win') {
        gameStats.wins++;
    } else if (result === 'lose') {
        gameStats.losses++;
    } else {
        gameStats.ties++;
    }
    
    updateGameStats();
    updateGameMessage(message, result);
    updateDisplay();
}

function updateGameMessage(message, type = 'playing') {
    const messageElement = document.getElementById('game-message');
    messageElement.textContent = message;
    messageElement.className = `game-message message-${type}`;
}

function updateGameStats() {
    document.getElementById('games-played').textContent = gameStats.gamesPlayed;
    document.getElementById('games-won').textContent = gameStats.wins;
    document.getElementById('games-lost').textContent = gameStats.losses;
    document.getElementById('games-tied').textContent = gameStats.ties;
}

// ===== RÈGLES DU JEU =====
function showBlackjackRules() {
    const rulesDiv = document.getElementById('blackjack-rules');
    
    const rulesHTML = `
        <div class="blackjack-rules">
            <h3 class="rules-title">🃏 Règles du Blackjack</h3>
            
            <div class="rules-section">
                <h4>🎯 Objectif</h4>
                <ul>
                    <li>Battez le croupier en vous approchant le plus possible de 21 sans dépasser</li>
                    <li>Si vous dépassez 21, vous perdez automatiquement (Bust)</li>
                </ul>
            </div>
            
            <div class="rules-section">
                <h4>🃏 Valeur des cartes</h4>
                <ul>
                    <li><strong>As :</strong> 1 ou 11 (automatiquement ajusté)</li>
                    <li><strong>Figures (J, Q, K) :</strong> 10 points</li>
                    <li><strong>Autres cartes :</strong> valeur nominale</li>
                </ul>
            </div>
            
            <div class="rules-section">
                <h4>🎮 Déroulement</h4>
                <ul>
                    <li>Vous et le croupier recevez 2 cartes</li>
                    <li>Une carte du croupier reste cachée</li>
                    <li>Vous pouvez demander des cartes (<strong>Hit</strong>) ou rester (<strong>Stand</strong>)</li>
                    <li>Le croupier tire obligatoirement jusqu'à 17 minimum</li>
                </ul>
            </div>
            
            <div class="rules-section">
                <h4>🏆 Conditions de victoire</h4>
                <ul>
                    <li><strong>Blackjack :</strong> 21 avec 2 cartes (As + figure/10)</li>
                    <li><strong>Vous gagnez si :</strong> score > croupier sans dépasser 21</li>
                    <li><strong>Vous perdez si :</strong> vous dépassez 21 ou score < croupier</li>
                    <li><strong>Égalité :</strong> même score que le croupier</li>
                </ul>
            </div>
            
            <button class="blackjack-btn btn-secondary" onclick="hideBlackjackRules()" style="margin-top: 20px; display: block; margin-left: auto; margin-right: auto;">
                Fermer
            </button>
        </div>
    `;
    
    rulesDiv.innerHTML = rulesHTML;
    rulesDiv.style.display = 'block';
}

function hideBlackjackRules() {
    document.getElementById('blackjack-rules').style.display = 'none';
}