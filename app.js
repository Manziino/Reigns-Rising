// ==========================================
// 1. LA BASE DE DONNÉES (Les cartes & l'histoire)
// ==========================================

// Les Jauges : 1: Sénat 🏛️ | 2: Vox Populi ✊ | 3: Armée ⚔️ | 4: Ressources 💎

const gameCards = [
    // --- CARTES GÉNÉRIQUES (Disponibles dès le début) ---
    {
        id: "taxe_helium",
        character: "Quicksilver (Vif-Argent)",
        text: "Souveraine, les syndicats miniers de Mars exigent une baisse des taxes sur l'Hélium-3. C'est inacceptable pour le Sénat.",
        // Pas de condition, cette carte peut apparaître n'importe quand
        leftChoice: {
            text: "Céder au peuple",
            impacts: [-15, 20, 0, -10] 
        },
        rightChoice: {
            text: "Maintenir la taxe",
            impacts: [15, -20, 0, 10]
        }
    },
    {
        id: "requete_darrow",
        character: "Darrow, le Faucheur",
        text: "Virginia, Atalantia rassemble ses forces sur Mercure. J'ai besoin de lancer une Pluie de Fer préventive. Donne-moi le feu vert.",
        leftChoice: {
            text: "Trop risqué (Refus)",
            impacts: [10, 0, -20, 10],
            setFlags: ["darrow_furieux"] // 🚩 On mémorise que Darrow est en colère !
        },
        rightChoice: {
            text: "Pars en guerre (Accord)",
            impacts: [-20, -10, 20, -20],
            setFlags: ["guerre_mercure"] // 🚩 On déclenche la guerre de Mercure
        }
    },

    // --- CARTES CONDITIONNELLES (Débloquées par vos choix) ---
    {
        id: "consequence_darrow_furieux",
        conditions: ["darrow_furieux"], // N'apparaît QUE SI le flag "darrow_furieux" a été activé
        character: "Danseur",
        text: "Le Faucheur a ignoré les ordres du Sénat ! Il a volé une flotte et fait route vers Mercure. C'est une mutinerie !",
        leftChoice: {
            text: "Le déclarer hors-la-loi",
            impacts: [20, 10, -30, 0]
        },
        rightChoice: {
            text: "Couvrir ses arrières",
            impacts: [-30, -10, 10, -10]
        }
    }
];

// ==========================================
// 2. LE CERVEAU DU JEU (Avec Compteur de Survie)
// ==========================================
let stats = [50, 50, 50, 50];
let gameFlags = {}; 
let currentCardData = null;
let lastCardId = null; 

// ⏳ NOUVEAU : Gestion du temps et du meilleur score
let reignMonths = 1;
// Va chercher le record dans la mémoire du téléphone (ou met 0 par défaut)
let bestScore = localStorage.getItem('redRisingBestScore') || 0; 

const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.08;

const card = document.getElementById('current-card');
const decisionLeft = document.getElementById('decision-left');
const decisionRight = document.getElementById('decision-right');
const indicators = document.querySelectorAll('.indicator');
const fills = document.querySelectorAll('.fill');
const monthsDisplay = document.getElementById('months-count'); // Élément HTML du score

let isDragging = false;
let startX = 0;
let currentX = 0;

function drawNextCard() {
    let availableCards = gameCards.filter(c => {
        if (!c.conditions) return true;
        return c.conditions.every(flag => gameFlags[flag] === true);
    });

    if (availableCards.length > 1 && lastCardId !== null) {
        availableCards = availableCards.filter(c => c.id !== lastCardId);
    }

    if (availableCards.length === 0) {
        document.getElementById('card-text').innerText = "Le destin de la République est scellé.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    currentCardData = availableCards[randomIndex];
    lastCardId = currentCardData.id;

    document.getElementById('card-text').innerText = currentCardData.text;
    document.getElementById('character-name').innerText = currentCardData.character;
    decisionLeft.innerText = currentCardData.leftChoice.text;
    decisionRight.innerText = currentCardData.rightChoice.text;
    
    card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    card.style.transform = 'translate(0px, 0px) rotate(0deg)';
    decisionLeft.style.opacity = 0;
    decisionRight.style.opacity = 0;
    hideIndicators();
}

card.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    card.style.transition = 'none';
});

window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const diffX = currentX - startX;
    card.style.transform = `translate(${diffX}px, 0px) rotate(${diffX * ROTATION_FACTOR}deg)`;
    
    if (diffX > 0) { 
        decisionRight.style.opacity = diffX / SWIPE_THRESHOLD;
        decisionLeft.style.opacity = 0;
        showImpacts(currentCardData.rightChoice.impacts);
    } else { 
        decisionLeft.style.opacity = Math.abs(diffX) / SWIPE_THRESHOLD;
        decisionRight.style.opacity = 0;
        showImpacts(currentCardData.leftChoice.impacts);
    }
});

window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = currentX - startX;
    
    if (diffX > SWIPE_THRESHOLD) handleSwipe('right');
    else if (diffX < -SWIPE_THRESHOLD) handleSwipe('left');
    else {
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = 'translate(0px, 0px) rotate(0deg)';
        decisionLeft.style.opacity = 0;
        decisionRight.style.opacity = 0;
        hideIndicators();
    }
    startX = 0; currentX = 0;
});

function handleSwipe(direction) {
    const endX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    card.style.transition = 'transform 0.4s ease-out';
    card.style.transform = `translate(${endX}px, 0px) rotate(${direction === 'right' ? 30 : -30}deg)`;
    
    const choice = direction === 'right' ? currentCardData.rightChoice : currentCardData.leftChoice;
    
    if (choice.setFlags) {
        choice.setFlags.forEach(flag => {
            gameFlags[flag] = true;
        });
    }

    // ⏳ Le temps passe : on ajoute 1 mois au compteur
    reignMonths++;
    monthsDisplay.innerText = reignMonths;

    updateStats(choice.impacts);
    
    setTimeout(() => {
        drawNextCard();
    }, 400);
}

function updateStats(impacts) {
    for (let i = 0; i < 4; i++) {
        stats[i] += impacts[i];
        if (stats[i] > 100) stats[i] = 100;
        if (stats[i] < 0) stats[i] = 0;
        fills[i].style.height = `${stats[i]}%`;
        
        if (stats[i] <= 0 || stats[i] >= 100) {
            triggerGameOver(i, stats[i]);
            return;
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
    let cause = "";
    if (statIndex === 0) cause = value >= 100 ? "Le Sénat vous a destituée. L'Oligarchie est de retour." : "Le Sénat s'est effondré. Plus aucune loi ne tient la République.";
    if (statIndex === 1) cause = value >= 100 ? "La Vox Populi a lancé le Jour des Colombes Rouges." : "La grève générale a mis la République à genoux.";
    if (statIndex === 2) cause = value >= 100 ? "La Légion Libre a pris le contrôle par un putsch militaire." : "La République est sans défense. Atalantia a gagné.";
    if (statIndex === 3) cause = value >= 100 ? "Le Syndicat a littéralement racheté la République de l'intérieur." : "La famine et la faillite ont eu raison de votre règne.";

    // ⏳ Sauvegarde du meilleur score
    let recordMessage = "";
    if (reignMonths > bestScore) {
        bestScore = reignMonths;
        localStorage.setItem('redRisingBestScore', bestScore); // Enregistre dans le téléphone
        recordMessage = `🎉 NOUVEAU RECORD ABSOLU !\n`;
    }

    alert(`FIN DU RÈGNE !\n\n${cause}\n\n${recordMessage}Vous avez survécu : ${reignMonths} mois.\nMeilleur score : ${bestScore} mois.`);
    
    // Remise à zéro pour la nouvelle partie
    stats = [50, 50, 50, 50];
    fills.forEach(fill => fill.style.height = '50%');
    reignMonths = 1;
    monthsDisplay.innerText = reignMonths;
    drawNextCard();
}

drawNextCard();
