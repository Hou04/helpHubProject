document.addEventListener('DOMContentLoaded', function() {
    loadAssociationData();
    loadRecentProjects();
    loadRecentDonations();
    setupNavigation();
});

function loadAssociationData() {
    fetch('association.php?action=get_association_data')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const association = data.data;
            document.getElementById('association-name').textContent = association.name;
            document.getElementById('active-projects').textContent = association.active_projects;
            document.getElementById('total-collected').textContent = association.total_collected + ' TND';
            document.getElementById('total-donors').textContent = association.total_donors;
            document.getElementById('ending-projects').textContent = association.ending_projects;
        }
    })
    .catch(error => {
        console.error('Erreur chargement association:', error);
    });
}

function loadRecentProjects() {
    fetch('association.php?action=get_recent_projects')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const projects = data.projects;
            const container = document.getElementById('recent-projects');
            container.innerHTML = '';

            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <div class="project-header">
                        <span>${project.status}</span>
                        <span class="project-status">${project.progress}%</span>
                    </div>
                    <div class="project-body">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="progress-container">
                            <div class="progress-label">
                                <span>Collecté: ${project.collected_amount} TND</span>
                                <span>Objectif: ${project.target_amount} TND</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${project.progress}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="project-footer">
                        <span class="project-date">Date limite: ${project.deadline}</span>
                        <button class="btn-manage" data-project="${project.id}">Gérer</button>
                    </div>
                `;
                container.appendChild(projectCard);
            });

            document.querySelectorAll('.btn-manage').forEach(button => {
                button.addEventListener('click', function() {
                    const projectId = this.getAttribute('data-project');
                    alert(`Gérer le projet ${projectId}`);
                });
            });
        }
    })
    .catch(error => {
        console.error('Erreur chargement projets:', error);
    });
}

function loadRecentDonations() {
    fetch('association.php?action=get_recent_donations')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const donations = data.donations;
            const container = document.getElementById('recent-donations');
            container.innerHTML = '';

            donations.forEach(donation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${donation.project_name}</td>
                    <td>
                        <div class="donor-info">
                            <img src="/assets/user-avatar.jpg" alt="${donation.donor_name}" class="donor-avatar">
                            <span>${donation.donor_name}</span>
                        </div>
                    </td>
                    <td class="donation-amount">${donation.amount} TND</td>
                    <td class="donation-date">${donation.date}</td>
                `;
                container.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.error('Erreur chargement dons:', error);
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const text = this.textContent.trim();

            if (text.includes('Déconnexion')) {
                if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                    window.location.href = '/auth/login/logout.php';
                }
            }
            else if (text.includes('Créer un projet')) {
                openCreateProjectForm();
            }
            else {
                alert(`Section "${text}" en construction...`);
            }            
        });
    });
    function openCreateProjectForm() {
        const titre = prompt('Titre du projet:');
        if (!titre) return;
    
        const description = prompt('Description du projet:');
        if (!description) return;
    
        const montant_total = prompt('Montant total à collecter (TND):');
        if (!montant_total || isNaN(montant_total)) {
            alert('Montant invalide');
            return;
        }
    
        const date_limite = prompt('Date limite (format AAAA-MM-JJ):');
        if (!date_limite) return;
    
        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('montant_total', montant_total);
        formData.append('date_limite', date_limite);
    
        fetch('create_project.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Projet créé avec succès!');
                location.reload();
            } else {
                alert('Erreur: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erreur création projet:', error);
        });
    }
    
}
