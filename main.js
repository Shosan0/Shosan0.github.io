// ===== NAVIGATION GÉNÉRALE =====
function showSection(sectionName) {
    // Cacher toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    document.getElementById(sectionName).classList.add('active');
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Réactiver le bon lien de navigation
    const navLink = document.querySelector(`.nav-links a[onclick="showSection('${sectionName}')"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
}

// ===== FILTRAGE DES PROJETS =====
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const filters = document.querySelectorAll('.category-filter');
    
    // Mettre à jour les filtres actifs
    filters.forEach(filter => filter.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filtrer les cartes
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== GESTION REDIMENSIONNEMENT =====
// Gérer le redimensionnement de la fenêtre pour le graphique d'attachement
window.addEventListener('resize', function() {
    if (typeof drawChart === 'function' && document.getElementById('resultsContainer') && 
        document.getElementById('resultsContainer').style.display !== 'none') {
        setTimeout(() => {
            const anxiety = parseFloat(document.getElementById('anxietyScore').textContent);
            const avoidance = parseFloat(document.getElementById('avoidanceScore').textContent);
            if (!isNaN(anxiety) && !isNaN(avoidance)) {
                drawChart(anxiety, avoidance);
            }
        }, 100);
    }
});