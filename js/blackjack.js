// ===== BLACKJACK GAME COMPLET =====

// Variables globales pour le jeu de blackjack
let blackjackDeck = [];
let playerHand = [];
let dealerHand = [];
let splitHand = []; // Main séparée pour le split
let gameActive = false;
let isSplitGame = false;
let currentSplitHand = 0; // 0 = main principale, 1 = main séparée
let playerBalance = 1000; // Solde virtuel
let currentBet = 10; // Mise actuelle
let splitBet = 0; // Mise pour la main séparée
let mainHandDoubled = false; // Track si la main principale a été doublée
let splitHandDoubled = false; // Track si la main séparée a été doublée
let gameStats = {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    totalWinnings: 0
};

// Cartes et valeurs
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Tableau de stratégie de base du blackjack
const basicStrategy = {
    // Mains dures (sans As ou As comptant pour 1)
    'hard': {
        21: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        20: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        19: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        18: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        17: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        16: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        15: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        14: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        13: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        12: { 2: 'H', 3: 'H', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        11: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'D', 'A': 'H' },
        10: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'H', 'A': 'H' },
        9: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        8: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' }
    },
    // Mains souples (avec As comptant pour 11)
    'soft': {
        21: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        20: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        19: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'D', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        18: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'S', 8: 'S', 9: 'H', 10: 'H', 'A': 'H' },
        17: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        16: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        15: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        14: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        13: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' }
    },
    // Paires
    'pairs': {
        'A-A': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'P', 'A': 'P' },
        '10-10': { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
        '9-9': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'S', 8: 'P', 9: 'P', 10: 'S', 'A': 'S' },
        '8-8': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'P', 'A': 'P' },
        '7-7': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        '6-6': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        '5-5': { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'H', 'A': 'H' },
        '4-4': { 2: 'H', 3: 'H', 4: 'H', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        '3-3': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
        '2-2': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' }
    }
};

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
                    <div class="game-stat-value" id="player-balance">€${playerBalance}</div>
                    <div class="game-stat-label">Solde</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-value" id="current-bet">€${currentBet}</div>
                    <div class="game-stat-label">Mise</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-value" id="games-won">${gameStats.wins}</div>
                    <div class="game-stat-label">Victoires</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-value" id="total-winnings">€${gameStats.totalWinnings}</div>
                    <div class="game-stat-label">Gains totaux</div>
                </div>
            </div>
            
            <div class="betting-controls">
                <div class="betting-section">
                    <label>Mise:</label>
                    <div class="bet-buttons">
                        <button class="bet-btn" onclick="setBet(5)">€5</button>
                        <button class="bet-btn active" onclick="setBet(10)">€10</button>
                        <button class="bet-btn" onclick="setBet(25)">€25</button>
                        <button class="bet-btn" onclick="setBet(50)">€50</button>
                        <button class="bet-btn" onclick="setBet(100)">€100</button>
                    </div>
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
                    Choisissez votre mise et cliquez sur "Nouvelle Partie" !
                </div>
                
                <div class="strategy-advice" id="strategy-advice" style="display: none;">
                    <div class="advice-title">💡 Conseil de stratégie:</div>
                    <div class="advice-text" id="advice-text"></div>
                </div>
                
                <div class="player-section" id="main-hand">
                    <div class="section-title">🙋‍♂️ Vous</div>
                    <div class="cards-container" id="player-cards">
                        <!-- Cartes du joueur -->
                    </div>
                    <div class="score-display" id="player-score">Score: 0</div>
                </div>
                
                <div class="player-section" id="split-hand" style="display: none;">
                    <div class="section-title">🙋‍♂️ Vous (Main 2)</div>
                    <div class="cards-container" id="split-cards">
                        <!-- Cartes de la main séparée -->
                    </div>
                    <div class="score-display" id="split-score">Score: 0</div>
                </div>
            </div>
            
            <div class="game-controls">
                <button class="blackjack-btn btn-hit" id="hit-btn" onclick="playerHit()" disabled>
                    Carte ! 🃏
                </button>
                <button class="blackjack-btn btn-stand" id="stand-btn" onclick="playerStand()" disabled>
                    Rester 🛑
                </button>
                <button class="blackjack-btn btn-double" id="double-btn" onclick="playerDouble()" disabled>
                    Doubler 💰
                </button>
                <button class="blackjack-btn btn-split" id="split-btn" onclick="playerSplit()" disabled style="display: none;">
                    Séparer ✂️
                </button>
                <button class="blackjack-btn btn-advice" id="advice-btn" onclick="showAdvice()" disabled>
                    Conseil 💡
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
    
    updateGameStats();
}

// ===== GESTION DES MISES =====
function setBet(amount) {
    if (gameActive) return;
    if (amount > playerBalance) {
        alert('Mise trop élevée ! Solde insuffisant.');
        return;
    }
    
    currentBet = amount;
    document.getElementById('current-bet').textContent = `€${currentBet}`;
    
    // Mettre à jour les boutons de mise
    document.querySelectorAll('.bet-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
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

// ===== ANALYSE DES MAINS =====
function getHandType(hand) {
    if (hand.length < 2) return { type: 'incomplete' };
    
    // Vérifier si c'est une paire
    if (hand.length === 2) {
        const val1 = hand[0].value === 'A' ? 'A' : (getCardValue(hand[0]) >= 10 ? '10' : hand[0].value);
        const val2 = hand[1].value === 'A' ? 'A' : (getCardValue(hand[1]) >= 10 ? '10' : hand[1].value);
        
        if (val1 === val2) {
            return { type: 'pair', key: `${val1}-${val1}` };
        }
    }
    
    // Vérifier si c'est une main souple (As comptant pour 11)
    let hasUsableAce = false;
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
    
    // Ajuster les As
    let originalAces = aces;
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    
    if (originalAces > 0 && aces > 0 && value <= 21) {
        hasUsableAce = true;
    }
    
    return {
        type: hasUsableAce ? 'soft' : 'hard',
        value: value
    };
}

function canSplit() {
    if (!gameActive || isSplitGame || playerHand.length !== 2) return false;
    
    const val1 = playerHand[0].value === 'A' ? 'A' : (getCardValue(playerHand[0]) >= 10 ? '10' : playerHand[0].value);
    const val2 = playerHand[1].value === 'A' ? 'A' : (getCardValue(playerHand[1]) >= 10 ? '10' : playerHand[1].value);
    
    return val1 === val2 && playerBalance >= currentBet;
}

function canDouble() {
    const activeHand = currentSplitHand === 0 ? playerHand : splitHand;
    return gameActive && activeHand.length === 2 && playerBalance >= currentBet;
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
    const splitCardsContainer = document.getElementById('split-cards');
    const dealerScoreElement = document.getElementById('dealer-score');
    const playerScoreElement = document.getElementById('player-score');
    const splitScoreElement = document.getElementById('split-score');
    
    // Afficher les cartes du joueur (main principale)
    playerCardsContainer.innerHTML = '';
    playerHand.forEach(card => {
        playerCardsContainer.appendChild(createCardElement(card));
    });
    
    // Afficher les cartes de la main séparée si elle existe
    if (isSplitGame && splitCardsContainer) {
        splitCardsContainer.innerHTML = '';
        splitHand.forEach(card => {
            splitCardsContainer.appendChild(createCardElement(card));
        });
        
        // Mettre à jour le titre
        document.querySelector('#main-hand .section-title').textContent = '🙋‍♂️ Vous (Main 1)';
    } else {
        document.querySelector('#main-hand .section-title').textContent = '🙋‍♂️ Vous';
    }
    
    // Afficher les cartes du croupier
    dealerCardsContainer.innerHTML = '';
    dealerHand.forEach((card, index) => {
        const isHidden = gameActive && index === 1;
        dealerCardsContainer.appendChild(createCardElement(card, isHidden));
    });
    
    // Mettre à jour les scores
    const playerScore = calculateHandValue(playerHand);
    playerScoreElement.textContent = `Score: ${playerScore}`;
    
    if (isSplitGame && splitScoreElement) {
        const splitScore = calculateHandValue(splitHand);
        splitScoreElement.textContent = `Score: ${splitScore}`;
    }
    
    if (gameActive) {
        const visibleDealerScore = getCardValue(dealerHand[0]);
        dealerScoreElement.textContent = `Score: ${visibleDealerScore} + ?`;
    } else {
        const dealerScore = calculateHandValue(dealerHand);
        dealerScoreElement.textContent = `Score: ${dealerScore}`;
    }
    
    // Mettre à jour les boutons selon les possibilités
    updateGameButtons();
    
    // Surligner la main active en cas de split
    if (isSplitGame) {
        const mainHand = document.getElementById('main-hand');
        const splitHandEl = document.getElementById('split-hand');
        
        if (currentSplitHand === 0) {
            mainHand.style.opacity = '1';
            splitHandEl.style.opacity = '0.6';
        } else {
            mainHand.style.opacity = '0.6';
            splitHandEl.style.opacity = '1';
        }
    } else {
        document.getElementById('main-hand').style.opacity = '1';
    }
}

function updateGameButtons() {
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const doubleBtn = document.getElementById('double-btn');
    const splitBtn = document.getElementById('split-btn');
    const adviceBtn = document.getElementById('advice-btn');
    
    if (!gameActive) {
        hitBtn.disabled = true;
        standBtn.disabled = true;
        doubleBtn.disabled = true;
        splitBtn.style.display = 'none';
        adviceBtn.disabled = true;
        return;
    }
    
    hitBtn.disabled = false;
    standBtn.disabled = false;
    adviceBtn.disabled = false;
    
    // Bouton doubler
    doubleBtn.disabled = !canDouble();
    
    // Bouton split
    if (canSplit()) {
        splitBtn.style.display = 'inline-block';
        splitBtn.disabled = false;
    } else {
        splitBtn.style.display = 'none';
    }
}

// ===== LOGIQUE DU JEU =====
function newBlackjackGame() {
    if (playerBalance < currentBet) {
        alert('Solde insuffisant ! Réduisez votre mise.');
        return;
    }
    
    createDeck();
    playerHand = [];
    dealerHand = [];
    splitHand = [];
    gameActive = true;
    isSplitGame = false;
    currentSplitHand = 0;
    splitBet = 0;
    mainHandDoubled = false;
    splitHandDoubled = false;
    
    // Déduire la mise du solde
    playerBalance -= currentBet;
    updateGameStats();
    
    // Masquer la main séparée et les conseils
    document.getElementById('split-hand').style.display = 'none';
    document.getElementById('strategy-advice').style.display = 'none';
    
    // Distribuer les cartes initiales
    playerHand.push(dealCard());
    dealerHand.push(dealCard());
    playerHand.push(dealCard());
    dealerHand.push(dealCard());
    
    updateDisplay();
    updateGameMessage("À vous de jouer ! Voulez-vous une carte ou rester ?");
    
    // Vérifier blackjack naturel
    if (calculateHandValue(playerHand) === 21) {
        if (calculateHandValue(dealerHand) === 21) {
            endGame('tie', 'Égalité ! Vous avez tous les deux un Blackjack ! 🎭');
        } else {
            endGame('win', 'BLACKJACK ! Félicitations ! 🎉', 1.5);
        }
    }
}

function playerHit() {
    if (!gameActive) return;
    
    const activeHand = currentSplitHand === 0 ? playerHand : splitHand;
    activeHand.push(dealCard());
    updateDisplay();
    
    const playerScore = calculateHandValue(activeHand);
    
    if (playerScore > 21) {
        if (isSplitGame && currentSplitHand === 0) {
            currentSplitHand = 1;
            updateGameMessage("Main 1 bust ! Jouez votre deuxième main.");
            updateDisplay();
        } else if (isSplitGame && currentSplitHand === 1) {
            endGame('lose', 'Bust sur les deux mains ! Vous perdez ! 💥');
        } else {
            endGame('lose', `Bust ! Vous dépassez 21 avec ${playerScore} points ! 💥`);
        }
    } else if (playerScore === 21) {
        if (isSplitGame && currentSplitHand === 0) {
            currentSplitHand = 1;
            updateGameMessage("21 ! Jouez maintenant votre deuxième main.");
            updateDisplay();
        } else {
            playerStand();
        }
    } else {
        const handText = isSplitGame ? ` (Main ${currentSplitHand + 1})` : '';
        updateGameMessage(`Score${handText}: ${playerScore}. Votre choix ?`);
    }
}

function playerStand() {
    if (!gameActive) return;
    
    if (isSplitGame && currentSplitHand === 0) {
        currentSplitHand = 1;
        updateGameMessage("Jouez maintenant votre deuxième main.");
        updateDisplay();
        return;
    }
    
    gameActive = false;
    
    // Le croupier joue
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(dealCard());
    }
    
    updateDisplay();
    
    // Déterminer les gagnants
    if (isSplitGame) {
        determineSplitWinners();
    } else {
        determineSingleWinner();
    }
}

function playerDouble() {
    if (!canDouble()) return;
    
    // Déduire la mise supplémentaire
    playerBalance -= currentBet;
    
    // Tracker quelle main a été doublée
    if (currentSplitHand === 0) {
        mainHandDoubled = true;
    } else {
        splitHandDoubled = true;
    }
    
    updateGameStats();
    
    // Tirer une seule carte
    const activeHand = currentSplitHand === 0 ? playerHand : splitHand;
    activeHand.push(dealCard());
    updateDisplay();
    
    const playerScore = calculateHandValue(activeHand);
    
    if (playerScore > 21) {
        if (isSplitGame && currentSplitHand === 0) {
            currentSplitHand = 1;
            updateGameMessage("Double et bust sur la main 1 ! Jouez votre deuxième main.");
            updateDisplay();
        } else {
            endGame('lose', `Double et bust avec ${playerScore} points ! 💥`);
        }
    } else {
        if (isSplitGame && currentSplitHand === 0) {
            currentSplitHand = 1;
            updateGameMessage("Double effectué ! Jouez maintenant votre deuxième main.");
            updateDisplay();
        } else {
            playerStand();
        }
    }
}

function playerSplit() {
    if (!canSplit()) return;
    
    // Déduire la mise pour la main séparée
    playerBalance -= currentBet;
    splitBet = currentBet;
    isSplitGame = true;
    updateGameStats();
    
    // Séparer les cartes
    splitHand = [playerHand.pop()];
    
    // Donner une nouvelle carte à chaque main
    playerHand.push(dealCard());
    splitHand.push(dealCard());
    
    // Afficher la main séparée
    document.getElementById('split-hand').style.display = 'block';
    
    updateDisplay();
    updateGameMessage("Mains séparées ! Jouez votre première main.");
}

function determineSingleWinner() {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);
    
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

function determineSplitWinners() {
    const playerScore1 = calculateHandValue(playerHand);
    const playerScore2 = calculateHandValue(splitHand);
    const dealerScore = calculateHandValue(dealerHand);
    
    let wins = 0;
    let ties = 0;
    let losses = 0;
    let message = '';
    let totalWinnings = 0;
    
    // Calculer les mises effectives pour chaque main
    const mainHandBet = mainHandDoubled ? currentBet * 2 : currentBet;
    const splitHandBet = splitHandDoubled ? splitBet * 2 : splitBet;
    
    // Évaluer main 1
    if (playerScore1 > 21) {
        losses++;
        message += `Main 1: Bust (${playerScore1}). `;
    } else if (dealerScore > 21 || playerScore1 > dealerScore) {
        wins++;
        totalWinnings += mainHandBet * 2; // Mise + gain
        message += `Main 1: Victoire (${playerScore1} vs ${dealerScore})${mainHandDoubled ? ' (Doublée)' : ''}. `;
    } else if (playerScore1 === dealerScore) {
        ties++;
        totalWinnings += mainHandBet; // Remboursement
        message += `Main 1: Égalité (${playerScore1})${mainHandDoubled ? ' (Doublée)' : ''}. `;
    } else {
        losses++;
        message += `Main 1: Défaite (${playerScore1} vs ${dealerScore})${mainHandDoubled ? ' (Doublée)' : ''}. `;
    }
    
    // Évaluer main 2
    if (playerScore2 > 21) {
        losses++;
        message += `Main 2: Bust (${playerScore2}).`;
    } else if (dealerScore > 21 || playerScore2 > dealerScore) {
        wins++;
        totalWinnings += splitHandBet * 2; // Mise + gain
        message += `Main 2: Victoire (${playerScore2} vs ${dealerScore})${splitHandDoubled ? ' (Doublée)' : ''}.`;
    } else if (playerScore2 === dealerScore) {
        ties++;
        totalWinnings += splitHandBet; // Remboursement
        message += `Main 2: Égalité (${playerScore2})${splitHandDoubled ? ' (Doublée)' : ''}.`;
    } else {
        losses++;
        message += `Main 2: Défaite (${playerScore2} vs ${dealerScore})${splitHandDoubled ? ' (Doublée)' : ''}.`;
    }
    
    // Ajouter les gains au solde
    playerBalance += totalWinnings;
    const totalBetAmount = mainHandBet + splitHandBet;
    const netGain = totalWinnings - totalBetAmount;
    gameStats.totalWinnings += netGain;
    
    // Déterminer le résultat global
    if (wins > losses) {
        gameStats.wins++;
        endGameSplit('win', `${message} 🎉 Gain net: €${netGain}`);
    } else if (losses > wins) {
        gameStats.losses++;
        endGameSplit('lose', `${message} 😔 Perte: €${totalBetAmount}`);
    } else {
        gameStats.ties++;
        endGameSplit('tie', `${message} 🎭 Résultat neutre: €${netGain}`);
    }
}

// ===== CONSEILS DE STRATÉGIE =====
function showAdvice() {
    if (!gameActive) return;
    
    const activeHand = currentSplitHand === 0 ? playerHand : splitHand;
    const dealerUpCard = dealerHand[0];
    const advice = getStrategyAdvice(activeHand, dealerUpCard);
    
    document.getElementById('advice-text').textContent = advice;
    document.getElementById('strategy-advice').style.display = 'block';
    
    // Masquer le conseil après 5 secondes
    setTimeout(() => {
        document.getElementById('strategy-advice').style.display = 'none';
    }, 5000);
}

function getStrategyAdvice(hand, dealerCard) {
    const handType = getHandType(hand);
    const dealerValue = dealerCard.value === 'A' ? 'A' : (getCardValue(dealerCard) >= 10 ? 10 : parseInt(dealerCard.value));
    
    let advice = '';
    
    if (handType.type === 'pair' && handType.key) {
        const strategy = basicStrategy.pairs[handType.key];
        if (strategy && strategy[dealerValue]) {
            advice = strategy[dealerValue];
        }
    } else if (handType.type === 'soft' && handType.value) {
        const strategy = basicStrategy.soft[handType.value];
        if (strategy && strategy[dealerValue]) {
            advice = strategy[dealerValue];
        }
    } else if (handType.type === 'hard' && handType.value) {
        const strategy = basicStrategy.hard[handType.value];
        if (strategy && strategy[dealerValue]) {
            advice = strategy[dealerValue];
        }
    }
    
    // Traduire les codes en conseils
    const translations = {
        'H': 'Tirer une carte',
        'S': 'Rester',
        'D': 'Doubler (ou tirer si impossible)',
        'P': 'Séparer',
        'A': 'Abandonner (non disponible)'
    };
    
    const translatedAdvice = translations[advice] || 'Conseil non disponible';
    const explanation = getAdviceExplanation(advice, handType, dealerValue);
    
    return `${translatedAdvice}. ${explanation}`;
}

function getAdviceExplanation(advice, handType, dealerValue) {
    switch (advice) {
        case 'H':
            return "Votre main est trop faible pour rester.";
        case 'S':
            return "Votre main est assez forte, le croupier risque de faire bust.";
        case 'D':
            return "Situation favorable pour doubler votre mise.";
        case 'P':
            return "Séparer cette paire est mathématiquement avantageux.";
        default:
            return "Suivez votre instinct !";
    }
}

// ===== FIN DE PARTIE ET STATISTIQUES =====
function endGame(result, message, multiplier = 1) {
    gameActive = false;
    
    // Désactiver les boutons
    updateGameButtons();
    
    // Calculer les gains en tenant compte du double
    const effectiveBet = mainHandDoubled ? currentBet * 2 : currentBet;
    let winnings = 0;
    
    if (result === 'win') {
        winnings = Math.round(effectiveBet * (1 + multiplier));
        playerBalance += winnings;
        gameStats.wins++;
        gameStats.totalWinnings += winnings - effectiveBet;
    } else if (result === 'tie') {
        winnings = effectiveBet; // Remboursement complet
        playerBalance += winnings;
        gameStats.ties++;
    } else {
        gameStats.losses++;
        gameStats.totalWinnings -= effectiveBet;
    }
    
    gameStats.gamesPlayed++;
    updateGameStats();
    updateGameMessage(message, result);
    updateDisplay();
    
    // Vérifier si le joueur peut encore jouer
    if (playerBalance < 5) {
        setTimeout(() => {
            alert('Vous n\'avez plus assez d\'argent ! Votre solde a été remis à €1000.');
            playerBalance = 1000;
            gameStats.totalWinnings = 0;
            updateGameStats();
        }, 2000);
    }
}

function endGameSplit(result, message) {
    gameActive = false;
    updateGameButtons();
    gameStats.gamesPlayed++;
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
    document.getElementById('player-balance').textContent = `€${playerBalance}`;
    document.getElementById('current-bet').textContent = `€${currentBet}`;
    document.getElementById('games-won').textContent = gameStats.wins;
    document.getElementById('total-winnings').textContent = `€${gameStats.totalWinnings}`;
}

// ===== RÈGLES DU JEU =====
function showBlackjackRules() {
    const rulesDiv = document.getElementById('blackjack-rules');
    
    const rulesHTML = `
        <div class="blackjack-rules">
            <h3 class="rules-title">🃏 Règles du Blackjack Avancé</h3>
            
            <div class="rules-section">
                <h4>🎯 Objectif</h4>
                <ul>
                    <li>Battez le croupier en vous approchant le plus possible de 21 sans dépasser</li>
                    <li>Si vous dépassez 21, vous perdez automatiquement (Bust)</li>
                </ul>
            </div>
            
            <div class="rules-section">
                <h4>💰 Système de mises</h4>
                <ul>
                    <li>Choisissez votre mise avant chaque partie (€5 à €100)</li>
                    <li>Votre solde démarre à €1000</li>
                    <li>Les gains sont ajoutés à votre solde après chaque victoire</li>
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
                <h4>🎮 Actions disponibles</h4>
                <ul>
                    <li><strong>Carte :</strong> Demander une carte supplémentaire</li>
                    <li><strong>Rester :</strong> Garder votre main actuelle</li>
                    <li><strong>Doubler :</strong> Doubler votre mise et recevoir une seule carte</li>
                    <li><strong>Séparer :</strong> Diviser une paire en deux mains séparées</li>
                </ul>
            </div>
            
            <div class="rules-section">
                <h4>✂️ Règles du Split</h4>
                <ul>
                    <li>Disponible uniquement avec une paire (même valeur)</li>
                    <li>Chaque main nécessite une mise égale à la mise initiale</li>
                    <li>Jouez chaque main séparément</li>
                    <li>Les As séparés ne reçoivent qu'une carte chacun</li>
                </ul>
            </div>
            
            <div class="rules-section">
                <h4>💡 Conseils de stratégie</h4>
                <ul>
                    <li>Utilisez le bouton "Conseil" pour obtenir la stratégie optimale</li>
                    <li>Suivez les conseils pour optimiser vos chances de gain</li>
                    <li>La stratégie de base réduit l'avantage du casino à moins de 1%</li>
                </ul>
            </div>
            
            <div class="rules-section">
                <h4>🏆 Conditions de victoire</h4>
                <ul>
                    <li><strong>Blackjack :</strong> 21 avec 2 cartes (paiement 3:2)</li>
                    <li><strong>Victoire normale :</strong> score > croupier sans dépasser 21</li>
                    <li><strong>Défaite :</strong> vous dépassez 21 ou score < croupier</li>
                    <li><strong>Égalité :</strong> même score que le croupier (mise remboursée)</li>
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