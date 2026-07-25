// ==========================================
// 1. LA BASE DE DONNÉES (Génériques + Histoire)
// ==========================================
// Jauges : 1: Sénat 🏛️ | 2: Vox Populi ✊ | 3: Armée ⚔️ | 4: Ressources 💎

const gameCards = [
    // ----------------------------------------------------
    // CARTES GÉNÉRIQUES (Répétables à l'infini)
    // ----------------------------------------------------
    { id: "gen_taxe", character: "Ministre Cuivre", text: "Les marchands Argents se plaignent des taxes portuaires sur Luna. Doit-on les baisser ?", leftChoice: { text: "Maintenir la taxe", impacts: [10, 0, 0, 15] }, rightChoice: { text: "Alléger", impacts: [15, 0, 0, -15] } },
    { id: "gen_fete", character: "Sénateur Or", text: "Le peuple est tendu. Organisons-nous des Jeux (sans mise à mort) pour les divertir ? Cela coûtera cher.", leftChoice: { text: "Trop cher", impacts: [10, -15, 0, 15] }, rightChoice: { text: "Que la fête commence", impacts: [-10, 20, 0, -20] } },
    { id: "gen_contrebande", character: "Gris de la Garde", text: "Nous avons intercepté un vaisseau de contrebande d'Hélium-3. Confisquer pour l'État ou laisser l'Armée se servir ?", leftChoice: { text: "Pour l'État (Ressources)", impacts: [10, 0, -10, 15] }, rightChoice: { text: "Pour la Légion", impacts: [-10, 0, 15, 0] } },
    { id: "gen_greve", character: "Représentant Rouge", text: "Les dockers demandent une journée de repos en mémoire des martyrs de la Révolte. La production va ralentir.", leftChoice: { text: "Refusé, au travail", impacts: [10, -15, 0, 15] }, rightChoice: { text: "Accordé", impacts: [-10, 15, 0, -15] } },
    { id: "gen_escarmouche", character: "Officier de la Légion", text: "Des pirates liés au Syndicat harcèlent nos convois près de Jupiter. Envoyons-nous une patrouille lourde ?", leftChoice: { text: "Ignorer", impacts: [0, -10, -10, 15] }, rightChoice: { text: "Écraser les pirates", impacts: [0, 10, 15, -15] } },
    { id: "gen_religion", character: "Prêcheur Blanc", text: "Souveraine, permettez-moi de diffuser un message de paix sur les canaux publics pour apaiser les esprits.", leftChoice: { text: "Faites (Vox+)", impacts: [-10, 15, 0, 0] }, rightChoice: { text: "La religion est morte", impacts: [15, -15, 0, 0] } },

    // ----------------------------------------------------
    // CARTES HISTOIRE (Uniques par partie)
    // ----------------------------------------------------
    { id: "hist_reconstruction", isUnique: true, character: "Daxo au Telemanus", text: "Souveraine, Luna est encore en ruine. Nous devons financer la reconstruction. Allons-nous taxer les anciennes maisons Or ?", leftChoice: { text: "Taxer les Ors", impacts: [-15, 10, 0, 15] }, rightChoice: { text: "Réduire l'Armée", impacts: [0, 15, -20, 10] } },
    { id: "hist_robots", isUnique: true, character: "Regulus ag Sun (Vif-Argent)", text: "L'automatisation est l'avenir. Laissez-moi remplacer les mineurs Rouges de Phobos par des robots.", leftChoice: { text: "Protéger les Rouges", impacts: [0, 15, 0, -15], setFlags: ["automatisation_refusee"] }, rightChoice: { text: "Accordé", impacts: [10, -25, 0, 25], setFlags: ["chomage_rouge"] } },
    { id: "hist_egalite", isUnique: true, character: "Danseur", text: "La Vox Populi exige une loi imposant un vote par tête au Sénat, peu importe la Couleur.", leftChoice: { text: "Pas encore", impacts: [15, -20, 0, 0] }, rightChoice: { text: "L'égalité totale", impacts: [-25, 25, -10, 0], setFlags: ["senat_affaibli"] } },
    { id: "hist_tribunaux", isUnique: true, character: "Publius cu Caraval", text: "Les anciens esclavagistes Ors se pavanent ! La Vox exige des exécutions publiques immédiates !", leftChoice: { text: "La justice, pas la vengeance", impacts: [15, -20, 0, 0] }, rightChoice: { text: "Qu'ils pendent", impacts: [-30, 20, 0, 20], setFlags: ["terreur_rouge"] } },
    { id: "hist_pluie_fer", isUnique: true, character: "Darrow (Le Faucheur)", text: "Virginia, la résistance sur Mercure faiblit. Il faut envoyer la Légion Libre pour une Pluie de Fer immédiate.", leftChoice: { text: "Ordre refusé", impacts: [15, 0, -25, 10], setFlags: ["darrow_isole"] }, rightChoice: { text: "Que la Pluie tombe", impacts: [-10, -10, 20, -25], setFlags: ["guerre_mercure"] } },
    { id: "hist_flotte_orion", isUnique: true, character: "Amiral Orion", text: "Ma flotte a besoin d'Hélium-3 de toute urgence pour sécuriser l'orbite de Vénus. Réquisitionnez les stocks civils !", leftChoice: { text: "La flotte d'abord", impacts: [0, -20, 15, -10] }, rightChoice: { text: "Le peuple d'abord", impacts: [0, 15, -20, 10] } },
    { id: "hist_hurleurs", isUnique: true, character: "Sevro au Barca", text: "Des rumeurs disent que le Syndicat vend des armes. Laisse les Hurleurs 'nettoyer' les bas-fonds de Luna.", leftChoice: { text: "Fais un carnage", impacts: [-15, -10, 15, 10], setFlags: ["syndicat_frappe"] }, rightChoice: { text: "Pas de meurtre sans loi", impacts: [15, 10, -15, 0] } },
    { id: "hist_sefi", isUnique: true, character: "Sefi la Volva", text: "Mes guerriers saignent. En échange, l'Allia exige que le continent d'Ilium nous soit donné en pleine propriété.", leftChoice: { text: "Refus catégorique", impacts: [15, 10, -20, 0] }, rightChoice: { text: "C'est à vous", impacts: [-20, -15, 15, -10], setFlags: ["sefi_autonome"] } },
    { id: "hist_minotaure", isUnique: true, character: "Gardien de Deepgrave", text: "Apollonius le Minotaure offre de nous livrer des codes de défense d'Atalantia... en échange d'une cellule luxueuse.", leftChoice: { text: "Qu'il pourrisse", impacts: [0, 10, -10, 0] }, rightChoice: { text: "Accepter l'offre", impacts: [-15, -10, 15, 0] } },

    // ----------------------------------------------------
    // CARTES CONDITIONNELLES (Conséquences - Uniques)
    // ----------------------------------------------------
    { id: "cons_chomage", isUnique: true, conditions: ["chomage_rouge"], character: "Danseur", text: "Vif-Argent remplace nos frères par des machines ! Des émeutes éclatent sur Phobos. Taxez ses robots !", leftChoice: { text: "Taxer Vif-Argent", impacts: [-15, 20, 0, -15] }, rightChoice: { text: "Envoyer les Pacificateurs", impacts: [10, -30, 10, 10] } },
    { id: "cons_terreur", isUnique: true, conditions: ["terreur_rouge"], character: "Sénateur Argent", text: "Les exécutions terrifient les investisseurs ! Les grandes familles fuient vers la Ceinture.", leftChoice: { text: "Geler leurs comptes", impacts: [-25, 10, 0, 20] }, rightChoice: { text: "Les laisser fuir", impacts: [15, 0, 0, -25] } },
    { id: "cons_guerre", isUnique: true, conditions: ["guerre_mercure"], character: "Général de la Légion", text: "La Pluie de Fer sur Mercure s'enlise. Les pertes sont effroyables. Darrow exige une conscription obligatoire.", leftChoice: { text: "Refuser (Trahir Darrow)", impacts: [10, 15, -25, 0] }, rightChoice: { text: "L'imposer au peuple", impacts: [-10, -30, 20, -10] } },
    { id: "cons_syndicat", isUnique: true, conditions: ["syndicat_frappe"], character: "Duc des Mains", text: "Les Hurleurs ont frappé mes affaires... Une de vos raffineries d'Hélium vient d'exploser 'mystérieusement'.", leftChoice: { text: "Enquêter", impacts: [0, -10, 0, -15] }, rightChoice: { text: "Faire taire la presse", impacts: [-10, -15, 0, -10] } },
    { id: "cons_darrow_isole", isUnique: true, conditions: ["darrow_isole"], character: "Victra au Julii", text: "Tu as abandonné Darrow. Il menace de prendre sa propre flotte et de partir sans l'accord du Sénat !", leftChoice: { text: "Qu'il essaie", impacts: [15, 0, -25, 0] }, rightChoice: { text: "Lui envoyer des fonds discrets", impacts: [-15, 0, 15, -20] } }
];

// ==========================================
// 2. LE CERVEAU DU JEU
// ==========================================
let stats = [50, 50, 50, 50];
let gameFlags = {}; 
let currentCardData = null;

let recentCards = []; // Anti-répétition pour les cartes génériques
let playedUniqueCards = []; // 🛡️ NOUVEAU : Mémoire des cartes Histoire jouées cette partie

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
        // 1. On vérifie les conditions d'apparition (Flags)
        if (c.conditions && !c.conditions.every(flag => gameFlags[flag] === true)) return false;
        // 2. On vérifie si c'est une carte Histoire UNIQUE qui a DÉJÀ été jouée
        if (c.isUnique && playedUniqueCards.includes(c.id)) return false;
        
        return true;
    });

    // Filtre anti-répétition immédiat pour les cartes génériques
    if (availableCards.length > recentCards.length) {
        availableCards = availableCards.filter(c => !recentCards.includes(c.id));
    }

    if (availableCards.length === 0) {
        // Au cas où le joueur survit si longtemps qu'il vide le paquet générique (peu probable avec le reset recentCards)
        document.getElementById('card-text').innerText = "La République est en paix. Rien à signaler.";
        return;
    }

    // On tire une carte au sort
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    currentCardData = availableCards[randomIndex];
    
    // On met à jour la mémoire des cartes récentes (pour ne pas voir 2 fois la même grève de suite)
    recentCards.push(currentCardData.id);
    if (recentCards.length > 4) {
        recentCards.shift();
    }

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
    
    // Activation des Flags
    if (choice.setFlags) {
        choice.setFlags.forEach(flag => {
            gameFlags[flag] = true;
        });
    }

    // 🛡️ NOUVEAU : Si la carte est "Unique (Histoire)", on la marque comme jouée pour cette vie
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
    if (statIndex === 0) cause = value >= 100 ? "Le Sénat vous a destituée. L'Oligarchie est de retour." : "Le Sénat s'est effondré. Plus aucune loi ne tient la République.";
    if (statIndex === 1) cause = value >= 100 ? "La Vox Populi a lancé le Jour des Colombes Rouges." : "La grève générale a mis la République à genoux.";
    if (statIndex === 2) cause = value >= 100 ? "La Légion Libre a pris le contrôle par un putsch militaire." : "La République est sans défense. Atalantia a gagné.";
    if (statIndex === 3) cause = value >= 100 ? "Le Syndicat a littéralement racheté la République de l'intérieur." : "La famine et la faillite ont eu raison de votre règne.";

    let recordMessage = "";
    if (reignMonths > bestScore) {
        bestScore = reignMonths;
        localStorage.setItem('redRisingBestScore', bestScore);
        recordMessage = `🎉 NOUVEAU RECORD ABSOLU !\n`;
    }

    alert(`FIN DU RÈGNE !\n\n${cause}\n\n${recordMessage}Vous avez survécu : ${reignMonths} mois.\nMeilleur score : ${bestScore} mois.`);
    
    // Remise à zéro totale pour une nouvelle vie !
    stats = [50, 50, 50, 50];
    fills.forEach(fill => fill.style.height = '50%');
    reignMonths = 1;
    monthsDisplay.innerText = reignMonths;
    playedUniqueCards = []; // 🛡️ On libère les cartes Histoires pour les revivre !
    
    drawNextCard();
}

drawNextCard();
