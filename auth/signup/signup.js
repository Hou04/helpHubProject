document.addEventListener('DOMContentLoaded', function() {
    const donorBtn = document.getElementById('donorBtn');
    const associationBtn = document.getElementById('associationBtn');
    const donorForm = document.getElementById('donorForm');
    const associationForm = document.getElementById('associationForm');
    const errorMessage = document.getElementById('errorMessage');

    // Switch between forms
    donorBtn.addEventListener('click', function() {
        donorBtn.classList.add('active');
        associationBtn.classList.remove('active');
        donorForm.style.display = 'block';
        associationForm.style.display = 'none';
    });

    associationBtn.addEventListener('click', function() {
        associationBtn.classList.add('active');
        donorBtn.classList.remove('active');
        associationForm.style.display = 'block';
        donorForm.style.display = 'none';
    });

    function validateForm(form) {
        let isValid = true;
        const pseudo = form.querySelector('input[name="pseudo"]').value.trim();
        const password = form.querySelector('input[name="pwrd"]').value.trim();
        const cin = form.querySelector('input[name="CIN"]')?.value.trim();
        const matriculeFiscal = form.querySelector('input[name="matricule_fiscal"]')?.value.trim();

        const pseudoRegex = /^[A-Za-z]+$/;
        const passwordRegex = /^[A-Za-z0-9]{8,}[$#]$/;
        const cinRegex = /^\d{8}$/;
        const matriculeRegex = /^\$[A-Z]{3}\d{2}$/;

        if (!pseudoRegex.test(pseudo)) {
            errorMessage.textContent = 'Le pseudo doit contenir uniquement des lettres';
            return false;
        }

        if (!passwordRegex.test(password)) {
            errorMessage.textContent = 'Le mot de passe doit contenir au moins 8 lettres/chiffres et se terminer par $ ou #';
            return false;
        }

        if (cin && !cinRegex.test(cin)) {
            errorMessage.textContent = 'Le CIN doit contenir exactement 8 chiffres';
            return false;
        }

        if (matriculeFiscal && !matriculeRegex.test(matriculeFiscal)) {
            errorMessage.textContent = "Le matricule fiscal doit être sous la forme $XXX00";
            return false;
        }

        return true;
    }

    function handleFormSubmit(form, e) {
        e.preventDefault();
        errorMessage.textContent = '';

        // Validate form fields
        const inputs = form.querySelectorAll('input[required]');
        let filled = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                filled = false;
            } else {
                input.style.borderColor = '#ddd';
            }
        });

        if (!filled) {
            errorMessage.textContent = 'Veuillez remplir tous les champs obligatoires';
            return;
        }

        if (!validateForm(form)) {
            return;
        }
        // Submit form
        const formData = new FormData(form);
        fetch('helphubPweb/auth/signup/signup.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                errorMessage.textContent = data.message || "Erreur lors de l'inscription";
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Erreur réseau';
        });
    }
        

    donorForm.addEventListener('submit', (e) => handleFormSubmit(donorForm, e));
    associationForm.addEventListener('submit', (e) => handleFormSubmit(associationForm, e));
    });
