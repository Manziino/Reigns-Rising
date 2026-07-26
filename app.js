// ==========================================
// 1. LA BASE DE DONNÉES (V4 - Arcs Profonds et Fins Épiques)
// ==========================================

const gameCards = [
    // --- CARTES GÉNÉRIQUES (Répétables) ---
    { id: "gen_taxe", character: "Ministre Cuivre", text: "Les marchands Argents se plaignent des taxes portuaires sur Luna. Doit-on les baisser ?", leftChoice: { text: "Maintenir", impacts: [10, 0, 0, 15] }, rightChoice: { text: "Alléger", impacts: [15, 0, 0, -15] } },
    { id: "gen_fete", character: "Sénateur Or", text: "Le peuple est tendu. Organisons-nous des Jeux pour les divertir ?", leftChoice: { text: "Trop cher", impacts: [10, -15, 0, 15] }, rightChoice: { text: "Que la fête commence", impacts: [-10, 20, 0, -20] } },
    { id: "gen_greve", character: "Représentant Rouge", text: "Les dockers demandent une journée de repos en mémoire des martyrs.", leftChoice: { text: "Au travail !", impacts: [10, -15, 0, 15] }, rightChoice: { text: "Accordé", impacts: [-10, 15, 0, -15] } },
    { id: "gen_sophocles", character: "Kavax au Telemanus", text: "Sophocles a encore volé des jelly beans de contrebande ! Dois-je le réprimander ?", leftChoice: { text: "Laisse le renard", impacts: [0, 10, 0, 0] }, rightChoice: { text: "Discipline", impacts: [10, -5, 0, 0] } },

    // =========================================================
    // ARC PROFOND 1 : L'ABOMINATION ET LE JOUR DES COLOMBES ROUGES
    // =========================================================
    
    // Étape 1 : L'offre (Départ)
    { id: "hist_syndicat_offre", isUnique: true, character: "Duc des Mains", text: "Le Syndicat peut sécuriser Luna. La criminalité baissera et vos caisses se rempliront. Laissez-nous faire.", 
        leftChoice: { text: "Refuser (Guerre des gangs)", impacts: [15, 10, -10, -20], setFlags: ["syndicat_ennemi"] }, 
        rightChoice: { text: "Accepter l'argent", impacts: [-15, -10, 0, 30], setFlags: ["syndicat_infiltre"] } 
    },
    
    // Étape 2 : Le Soupçon
    { id: "cons_syndicat_infiltre", isUnique: true, conditions: ["syndicat_infiltre"], character: "Victra au Julii", text: "Virginia, le Syndicat infiltre le Sénat. Le chef de la Vox, Publius, a été vu avec eux !", 
        leftChoice: { text: "Enquêter via Ephraim", impacts: [0, -15, 15, -10], setFlags: ["enquete_ephraim"] }, 
        rightChoice: { text: "Ignorer Victra", impacts: [0, 10, -10, 15], setFlags: ["piege_abomination"] } 
    },

    // Étape 3a : L'Enquête (Branche A)
    { id: "cons_enquete_ephraim", isUnique: true, conditions: ["enquete_ephraim"], character: "Ephraim ti Horn", text: "(Top Secret) Souveraine, le chef du Syndicat n'est pas la Reine. C'est un clone enfant de votre frère... Le Chacal !", 
        leftChoice: { text: "Faites-le assassiner", impacts: [0, -10, 0, -25], setFlags: ["clone_mort"] }, 
        rightChoice: { text: "Arrêtez-le légalement", impacts: [20, -20, 0, 0], setFlags: ["proces_clone"] } 
    },

    // Étape 4a : Le Procès qui tourne mal (Fin tragique)
    { id: "cons_proces_clone", isUnique: true, conditions: ["proces_clone"], character: "Juge Cuivre", text: "Le clone a acheté le jury. Il est acquitté. Ses agents de la Main Rouge viennent d'entrer dans le Sénat avec des armes !", 
        leftChoice: { text: "Fuir avec Pax", impacts: [-40, -40, -40, -40], setFlags: ["colombes_rouges"] }, 
        rightChoice: { text: "Combattre", impacts: [-40, -40, -40, -40], setFlags: ["colombes_rouges"] } 
    },

    // Étape 5 : Le Climax (Changement total du monde)
    { id: "climax_colombes_rouges", isUnique: true, conditions: ["colombes_rouges"], character: "L'Abomination", text: "Le Jour des Colombes Rouges... Daxo est mort. Danseur est mort. Le Sénat m'appartient, soeur chérie.", 
        leftChoice: { text: "Tu vas payer !", impacts: [-100, -100, -100, -100] }, // Provoque un Game Over scénarisé
        rightChoice: { text: "Je me rends...", impacts: [-100, -100, -100, -100] } 
    },

    // Étape 4b : L'assassinat réussi (Fin héroïque mais coûteuse)
    { id: "cons_clone_mort", isUnique: true, conditions: ["clone_mort"], character: "Ephraim ti Horn", text: "Le clone est mort. Mais ses gardes Obsidiens ont détruit la moitié de la capitale avant de fuir. Luna est en ruine.", 
        leftChoice: { text: "Reconstruire (Victoire)", impacts: [30, 30, 0, -40] }, // L'arc se termine ici par une grosse victoire politique, mais ruine l'économie
        rightChoice: { text: "Poursuivre les fuyards", impacts: [10, 10, -30, -10] } 
    },


    // =========================================================
    // ARC PROFOND 2 : LA GUERRE DE MERCURE
    // =========================================================

    // Étape 1 : La demande
    { id: "hist_mercure", isUnique: true, character: "Darrow", text: "Virginia, je dois lancer une Pluie de Fer sur Mercure avant qu'Atalantia ne consolide ses forces.", 
        leftChoice: { text: "Interdit !", impacts: [15, 0, -25, 10], setFlags: ["darrow_rebelle"] }, 
        rightChoice: { text: "Vas-y", impacts: [-15, -10, 20, -20], setFlags: ["guerre_mercure_on"] } 
    },

    // Étape 2 : L'enlisement
    { id: "cons_guerre_mercure_on", isUnique: true, conditions: ["guerre_mercure_on"], character: "Général Harnassus", text: "Mercure est un enfer. Darrow déploie les Dieux Tempêtes (Storm Gods) ! Les tsunamis tuent des millions de civils.", 
        leftChoice: { text: "Ordonner l'arrêt", impacts: [20, -30, -20, 0], setFlags: ["darrow_isole"] }, 
        rightChoice: { text: "C'est la guerre", impacts: [-25, -40, 25, -10], setFlags: ["troupes_bloquees"] } 
    },

    // Étape 3 : Le Piège d'Atalantia
    { id: "cons_troupes_bloquees", isUnique: true, conditions: ["troupes_bloquees"], character: "Amiral Orion", text: "Atalantia a utilisé une IEM géante. La flotte de Darrow tombe du ciel. Ils sont coincés à Héliopolis !", 
        leftChoice: { text: "Envoyer la flotte de réserve", impacts: [-20, 0, -40, -30], setFlags: ["luna_sans_defense"] }, 
        rightChoice: { text: "Abandonner Darrow", impacts: [10, 20, -50, 10], setFlags: ["darrow_vaincu"] } 
    },

    // Étape 4a : La chute de la République
    { id: "cons_luna_sans_defense", isUnique: true, conditions: ["luna_sans_defense"], character: "Magnus au Grimmus", text: "Vous avez envoyé tous vos vaisseaux sauver votre mari. Luna n'a plus de bouclier. Regardez le ciel, Virginia. Nous arrivons.", 
        leftChoice: { text: "GAME OVER", impacts: [-100, -100, -100, -100] }, 
        rightChoice: { text: "GAME OVER", impacts: [-100, -100, -100, -100] } 
    },

    // Étape 4b : Le deuil
    { id: "cons_darrow_vaincu", isUnique: true, conditions: ["darrow_vaincu"], character: "Lysander au Lune", text: "(Transmission publique) Le Faucheur de Lykos a été exécuté sur les sables de Mercure. Rendez-vous, Souveraine.", 
        leftChoice: { text: "Hurler de douleur", impacts: [-50, -50, -50, 0] }, // Un coup critique à toutes les stats, tu devras survivre à ça
        rightChoice: { text: "Préparer la vengeance", impacts: [20, 20, 20, -50] } 
    }
];


// ==========================================
// MOTEUR DU JEU
// ==========================================
let stats = [50, 50, 50, 50];
let gameFlags = {}; 
let currentCardData = null;

let recentCards = []; 
let playedUniqueCards = []; 

let reignMonths = 1;
let bestScore = localStorage.getItem('redRisingBestScore') || 0; 

const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.08;

const card = document.getElementById('current-card');
const decisionLeft = document.getElementById('decision-left');
const decisionRight = document.getElementById('decision-right');
const indicators = document.querySelectorAll('.indicator');
const fills = document.querySelectorAll('.fill');
const monthsDisplay = document.getElementById('months-count');

let isDragging = false;
let startX = 0;
let currentX = 0;

function drawNextCard() {
    let availableCards = gameCards.filter(c => {
        if (c.conditions && !c.conditions.every(flag => gameFlags[flag] === true)) return false;
        if (c.isUnique && playedUniqueCards.includes(c.id)) return false;
        return true;
    });

    if (availableCards.length > recentCards.length) {
        availableCards = availableCards.filter(c => !recentCards.includes(c.id));
    }

    if (availableCards.length === 0) {
        document.getElementById('card-text').innerText = "La République est en paix. Rien à signaler.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    currentCardData = availableCards[randomIndex];
    
    recentCards.push(currentCardData.id);
    if (recentCards.length > 5) {
        recentCards.shift();
    }

        document.getElementById('card-text').innerText = currentCardData.text;
    document.getElementById('character-name').innerText = currentCardData.character;
    
    // Charge l'image du personnage, ou met un fond noir par défaut si elle n'existe pas encore
    const artDiv = document.getElementById('character-art');
    if (currentCardData.image) {
        artDiv.style.backgroundImage = `url('${currentCardData.image}')`;
    } else {
        // Silhouette par défaut
        artDiv.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/></svg>')`;
    }

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

    if (currentCardData.isUnique) {
        playedUniqueCards.push(currentCardData.id);
    }

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
    if (statIndex === 0) cause = value >= 100 ? "Le Sénat a voté votre destitution. L'Oligarchie des Argents et Ors est restaurée." : "Le Sénat s'est effondré. C'est l'anarchie au sommet de l'État.";
    if (statIndex === 1) cause = value >= 100 ? "La Vox Populi a pris les armes : Le Jour des Colombes Rouges a balayé la République." : "La grève générale de toutes les Basses Couleurs a paralysé la République.";
    if (statIndex === 2) cause = value >= 100 ? "La Légion Libre, lassée des politiciens, a pris le pouvoir par la force." : "La République est sans défense. L'Ash Lord a repris Luna.";
    if (statIndex === 3) cause = value >= 100 ? "Le Syndicat a racheté la République. Vous avez été empoisonnée en silence." : "La famine et la faillite totale ont provoqué la chute de votre règne.";

    let recordMessage = "";
    if (reignMonths > bestScore) {
        bestScore = reignMonths;
        localStorage.setItem('redRisingBestScore', bestScore);
        recordMessage = `🎉 NOUVEAU RECORD ABSOLU !
`;
    }

    alert(`FIN DU RÈGNE !

${cause}

${recordMessage}Vous avez survécu : ${reignMonths} mois.
Meilleur score : ${bestScore} mois.`);
    
    stats = [50, 50, 50, 50];
    fills.forEach(fill => fill.style.height = '50%');
    reignMonths = 1;
    monthsDisplay.innerText = reignMonths;
    playedUniqueCards = []; 
    gameFlags = {}; // RESET DES CHOIX POUR LA PROCHAINE PARTIE
    
    drawNextCard();
}

drawNextCard();

