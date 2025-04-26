document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        errorMessage.textContent = '';

        const pseudo = document.getElementById('pseudo').value.trim();
        const password = document.getElementById('password').value.trim();

        // Regex control for pseudo and password
        const pseudoRegex = /^[A-Za-z]+$/;
        const passwordRegex = /^[A-Za-z0-9]{8,}[$#]$/;

        if (!pseudo || !password) {
            errorMessage.textContent = 'Veuillez remplir tous les champs';
            return;
        }

        if (!pseudoRegex.test(pseudo)) {
            errorMessage.textContent = 'Le pseudo doit contenir uniquement des lettres';
            return;
        }

        if (!passwordRegex.test(password)) {
            errorMessage.textContent = 'Le mot de passe doit contenir au moins 8 caractères (lettres/chiffres) et se terminer par $ ou #';
            return;
        }

        // Submit form
        fetch('/auth/login/login.php', {
            method: 'POST',
            body: new FormData(loginForm)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                errorMessage.textContent = data.message || 'Erreur de connexion';
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Erreur réseau';
        });
    });
});
