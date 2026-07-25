// ==========================================
// 1. LA BASE DE DONNÉES (Les cartes du jeu)
// ==========================================

const gameCards = [
    {
        id: 1,
        character: "Souveraine Octavia",
        text: "Une révolte de Rouges a éclaté dans les mines d'Hélium de Mars. Faut-il envoyer les cohortes Grises ?",
        leftChoice: {
            text: "Écrasez-les",
            impacts: [10, 15, -20, 10] // Impacts sur les 4 jauges [Jauge 1, Jauge 2, Jauge 3, Jauge 4]
        },
        rightChoice: {
            text: "Négocions",
            impacts: [-15, -10, 20, -10]
        }
    },
    {
        id: 2,
        character: "Kavax au Telemanus",
        text: "Sophocles a mangé mes jelly beans ! Dois-je le punir ?",
        leftChoice: {
            text: "C'est un renard...",
            impacts: [0, 0, 10, 0]
        },
        rightChoice: {
            text: "Discipline de Fer",
            impacts: [0, -5, -5, 0]
        }
    }
];

// ==========================================
// 2. LE CERVEAU DU JEU (Le Moteur)
// ==========================================

// --- ÉTAT DU JEU ---
let stats = [50, 50, 50, 50]; // Les 4 jauges commencent à 50%
let currentCardIndex = 0;
let currentCardData = null;

// --- CONFIGURATION PHYSIQUE ---
const SWIPE_THRESHOLD = 120; // Distance à parcourir pour valider un choix
const ROTATION_FACTOR = 0.08; // Vitesse de rotation de la carte

// --- ELEMENTS HTML (DOM) ---
const card = document.getElementById('current-card');
const decisionLeft = document.getElementById('decision-left');
const decisionRight = document.getElementById('decision-right');
const indicators = document.querySelectorAll('.indicator');
const fills = document.querySelectorAll('.fill');

// --- GESTIONNAIRE TACTILE ---
let isDragging = false;
let startX = 0;
let currentX = 0;

function loadCard(index) {
    if (index >= gameCards.length) {
        document.getElementById('card-text').innerText = "Fin de la démo. Plus de cartes !";
        document.getElementById('character-name').innerText = "Terminé";
        return;
    }
    
    currentCardData = gameCards[index];
    document.getElementById('card-text').innerText = currentCardData.text;
    document.getElementById('character-name').innerText = currentCardData.character;
    
    // Prépare les textes "Oui/Non"
    decisionLeft.innerText = currentCardData.leftChoice.text;
    decisionRight.innerText = currentCardData.rightChoice.text;
    
    // Remet la carte au centre
    card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    card.style.transform = 'translate(0px, 0px) rotate(0deg)';
    decisionLeft.style.opacity = 0;
    decisionRight.style.opacity = 0;
    hideIndicators();
}

// Le doigt touche l'écran
card.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    card.style.transition = 'none'; // Coupe l'animation pour que ça suive le doigt
});

// Le doigt glisse sur l'écran
window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    
    currentX = e.clientX;
    const diffX = currentX - startX;
    const rotate = diffX * ROTATION_FACTOR;
    
    // Bouge la carte
    card.style.transform = `translate(${diffX}px, 0px) rotate(${rotate}deg)`;
    
    // Affiche le texte du choix et les petits points au dessus des jauges
    if (diffX > 0) { // Glissement à droite
        decisionRight.style.opacity = diffX / SWIPE_THRESHOLD;
        decisionLeft.style.opacity = 0;
        showImpacts(currentCardData.rightChoice.impacts);
    } else { // Glissement à gauche
        decisionLeft.style.opacity = Math.abs(diffX) / SWIPE_THRESHOLD;
        decisionRight.style.opacity = 0;
        showImpacts(currentCardData.leftChoice.impacts);
    }
});

// Le doigt lâche l'écran
window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const diffX = currentX - startX;
    
    // Valide le choix si on a glissé assez loin
    if (diffX > SWIPE_THRESHOLD) {
        handleSwipe('right');
    } else if (diffX < -SWIPE_THRESHOLD) {
        handleSwipe('left');
    } else {
        // Sinon, la carte revient au centre (on a changé d'avis)
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = 'translate(0px, 0px) rotate(0deg)';
        decisionLeft.style.opacity = 0;
        decisionRight.style.opacity = 0;
        hideIndicators();
    }
    
    startX = 0;
    currentX = 0;
});

// --- LOGIQUE DE CONSÉQUENCES ---
function handleSwipe(direction) {
    // Fait sortir la carte de l'écran
    const endX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    card.style.transition = 'transform 0.4s ease-out';
    card.style.transform = `translate(${endX}px, 0px) rotate(${direction === 'right' ? 30 : -30}deg)`;
    
    // Applique les bonus/malus
    const impacts = direction === 'right' ? currentCardData.rightChoice.impacts : currentCardData.leftChoice.impacts;
    updateStats(impacts);
    
    // Charge la carte suivante après un petit délai
    setTimeout(() => {
        currentCardIndex++;
        loadCard(currentCardIndex);
    }, 400);
}

function updateStats(impacts) {
    for (let i = 0; i < 4; i++) {
        stats[i] += impacts[i];
        
        // Empêche la jauge de dépasser 100% ou de descendre sous 0%
        if (stats[i] > 100) stats[i] = 100;
        if (stats[i] < 0) stats[i] = 0;
        
        // Fait bouger le niveau de la jauge visuellement
        fills[i].style.height = `${stats[i]}%`;
        
        // Si une jauge est vide ou pleine : GAME OVER
        if (stats[i] <= 0 || stats[i] >= 100) {
            triggerGameOver(i, stats[i]);
        }
    }
}

function showImpacts(impacts) {
    impacts.forEach((impact, index) => {
        if (impact !== 0) {
            indicators[index].style.opacity = 1;
            indicators[index].style.transform = Math.abs(impact) > 15 ? 'scale(1.5)' : 'scale(1)';
        } else {
            indicators[index].style.opacity = 0;
        }
    });
}

function hideIndicators() {
    indicators.forEach(ind => ind.style.opacity = 0);
}

function triggerGameOver(statIndex, value) {
    alert(`GAME OVER ! La jauge numéro ${statIndex + 1} a atteint ${value}%.`);
    // Remise à zéro pour rejouer
    stats = [50, 50, 50, 50];
    fills.forEach(fill => fill.style.height = '50%');
    currentCardIndex = 0;
    loadCard(0);
}

// Lancement du jeu à l'ouverture de la page
loadCard(0);
