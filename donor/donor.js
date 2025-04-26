document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadRecommendedProjects();
    loadDonationHistory();
    setupNavigation();
});

function loadUserData() {
    fetch('donor.php?action=get_donor_data')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const user = data.data;
            document.getElementById('username').textContent = user.name;
            document.getElementById('total-donated').textContent = user.total_donated + ' TND';
            document.getElementById('projects-supported').textContent = user.projects_supported;
            document.getElementById('last-donation').textContent = user.last_donation || 'Aucun';
        }
    })
    .catch(error => {
        console.error('Erreur chargement utilisateur:', error);
    });
}

function loadRecommendedProjects() {
    fetch('donor.php?action=get_recommended_projects')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const projects = data.projects;
            const container = document.getElementById('recommended-projects');
            container.innerHTML = '';

            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <div class="project-info">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="progress-container">
                            <div class="progress-label">
                                <span>${project.progress}% collecté</span>
                                <span>${project.collected_amount} / ${project.target_amount} TND</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${project.progress}%"></div>
                            </div>
                        </div>
                        <div class="project-actions">
                            <button class="btn-donate" data-project="${project.id}">Faire un don</button>
                        </div>
                    </div>
                `;
                container.appendChild(projectCard);
            });

            document.querySelectorAll('.btn-donate').forEach(button => {
                button.addEventListener('click', function() {
                    const projectId = this.getAttribute('data-project');
                    alert(`Faire un don pour le projet ${projectId}`);
                });
            });
        }
    })
    .catch(error => {
        console.error('Erreur chargement projets:', error);
    });
}

function loadDonationHistory() {
    fetch('donor.php?action=get_donation_history')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const donations = data.donations;
            const container = document.getElementById('donations-history');
            container.innerHTML = '';

            donations.forEach(donation => {
                const donationItem = document.createElement('div');
                donationItem.className = 'donation-item';
                donationItem.innerHTML = `
                    <div class="donation-info">
                        <h4>${donation.project_name}</h4>
                        <p>${donation.date}</p>
                    </div>
                    <div class="donation-amount">${donation.amount} TND</div>
                `;
                container.appendChild(donationItem);
            });
        }
    })
    .catch(error => {
        console.error('Erreur chargement historique:', error);
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = {
        dashboard: document.querySelector('.donor-stats'),
        projects: document.querySelector('.donor-projects'),
        history: document.querySelector('.donor-history')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const text = this.textContent.trim();

            for (const key in sections) {
                if (sections[key]) sections[key].style.display = 'none';
            }

            if (text.includes('Tableau')) {
                if (sections.dashboard) sections.dashboard.style.display = 'flex';
            }
            else if (text.includes('Projets')) {
                if (sections.projects) sections.projects.style.display = 'block';
            }
            else if (text.includes('Mes dons')) {
                if (sections.history) sections.history.style.display = 'block';
            }
            else if (text.includes('Mon profil')) {
                alert('La section Profil sera disponible bientôt.');
            }
            else if (text.includes('Déconnexion')) {
                if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                    window.location.href = '/auth/login/logout.php';
                }            
            }
        });
    });

    if (sections.dashboard) sections.dashboard.style.display = 'flex';
    if (sections.projects) sections.projects.style.display = 'none';
    if (sections.history) sections.history.style.display = 'none';
}

