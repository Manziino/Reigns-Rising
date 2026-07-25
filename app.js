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
// 2. LE CERVEAU DU JEU (Le Moteur V2)
// ==========================================

// --- ÉTAT DU JEU ET MÉMOIRE ---
let stats = [50, 50, 50, 50];
let gameFlags = {}; // 🚩 Le dictionnaire qui mémorise les événements débloqués
let currentCardData = null;

const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.08;

// --- ELEMENTS HTML (DOM) ---
const card = document.getElementById('current-card');
const decisionLeft = document.getElementById('decision-left');
const decisionRight = document.getElementById('decision-right');
const indicators = document.querySelectorAll('.indicator');
const fills = document.querySelectorAll('.fill');

let isDragging = false;
let startX = 0;
let currentX = 0;

// 🎲 NOUVELLE FONCTION : Piocher une carte au hasard selon les conditions
function drawNextCard() {
    // 1. On filtre les cartes qui ont le droit d'apparaître
    const availableCards = gameCards.filter(c => {
        if (!c.conditions) return true; // Si pas de condition, c'est ok
        // Vérifie si TOUS les flags requis par la carte sont dans notre mémoire
        return c.conditions.every(flag => gameFlags[flag] === true);
    });

    if (availableCards.length === 0) {
        document.getElementById('card-text').innerText = "Le destin de la République est scellé. Plus aucune intrigue...";
        return;
    }

    // 2. On choisit une carte au hasard parmi celles disponibles
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    currentCardData = availableCards[randomIndex];

    // 3. Affichage
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

// Le doigt touche l'écran
card.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    card.style.transition = 'none';
});

// Le doigt glisse
window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const diffX = currentX - startX;
    card.style.transform = `translate(${diffX}px, 0px) rotate(${diffX * ROTATION_FACTOR}deg)`;
    
    if (diffX > 0) { // Droite
        decisionRight.style.opacity = diffX / SWIPE_THRESHOLD;
        decisionLeft.style.opacity = 0;
        showImpacts(currentCardData.rightChoice.impacts);
    } else { // Gauche
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
    
    // On cible le choix fait
    const choice = direction === 'right' ? currentCardData.rightChoice : currentCardData.leftChoice;
    
    // 🚩 On vérifie si ce choix active un Flag (mémoire)
    if (choice.setFlags) {
        choice.setFlags.forEach(flag => {
            gameFlags[flag] = true;
            console.log("Nouvel événement débloqué : " + flag);
        });
    }

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
            return; // Stoppe la boucle si on meurt
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
    if (statIndex === 0) cause = value >= 100 ? "Le Sénat vous a destituée." : "Le Sénat s'est effondré dans le chaos.";
    if (statIndex === 1) cause = value >= 100 ? "La Vox Populi a lancé une nouvelle révolution rouge." : "La grève générale a détruit la République.";
    if (statIndex === 2) cause = value >= 100 ? "La Légion Libre a pris le contrôle par un putsch." : "La République est sans défense, Atalantia a gagné.";
    if (statIndex === 3) cause = value >= 100 ? "Le Syndicat a racheté la République." : "La famine et la pénurie d'Hélium-3 ont eu raison de vous.";

    alert(`FIN DU RÈGNE !\n\n${cause}\n\nUn nouveau dirigeant prend votre place... mais les décisions passées laissent des traces.`);
    
    // Remise à zéro des stats, MAIS on garde les gameFlags pour la partie suivante !
    stats = [50, 50, 50, 50];
    fills.forEach(fill => fill.style.height = '50%');
    drawNextCard();
}

// Lancement de la première partie
drawNextCard();
