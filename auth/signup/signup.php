<?php
session_start();
require_once 'config.php'; // adjust path if needed

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Méthode de requête invalide");
}

// Get and clean form data
$user_type = isset($_POST['user_type']) ? trim($_POST['user_type']) : '';
$pseudo = isset($_POST['pseudo']) ? trim($_POST['pseudo']) : '';
$password = isset($_POST['pwrd']) ? trim($_POST['pwrd']) : '';

if (empty($user_type) || empty($pseudo) || empty($password)) {
    die("Veuillez remplir tous les champs obligatoires.");
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Create PDO connection
try {
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données.");
}

// Check if pseudo already exists
try {
    $stmt = $pdo->prepare("
        SELECT pseudo FROM donateur WHERE pseudo = :pseudo
        UNION 
        SELECT pseudo FROM responsable_association WHERE pseudo = :pseudo
    ");
    $stmt->execute([':pseudo' => $pseudo]);

    if ($stmt->rowCount() > 0) {
        die("Ce pseudo est déjà utilisé. Veuillez en choisir un autre.");
    }

    if ($user_type === 'donor') {
        // Insert new donor
        $stmt = $pdo->prepare("
            INSERT INTO donateur (nom, prenom, email, CIN, pseudo, pwrd)
            VALUES (:nom, :prenom, :email, :cin, :pseudo, :pwrd)
        ");
        $stmt->execute([
            ':nom' => $_POST['nom'],
            ':prenom' => $_POST['prenom'],
            ':email' => $_POST['email'],
            ':cin' => $_POST['CIN'],
            ':pseudo' => $pseudo,
            ':pwrd' => $hashedPassword
        ]);

    } elseif ($user_type === 'association') {
        // Handle logo upload
        $logo = null;
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $logo = file_get_contents($_FILES['logo']['tmp_name']);
        }

        // Insert new association
        $stmt = $pdo->prepare("
            INSERT INTO responsable_association
            (nom, prenom, email, CIN, nom_association, adresse_association, matricule_fiscal, logo, pseudo, pwrd)
            VALUES (:nom, :prenom, :email, :cin, :nom_association, :adresse_association, :matricule_fiscal, :logo, :pseudo, :pwrd)
        ");

        $stmt->bindParam(':nom', $_POST['nom']);
        $stmt->bindParam(':prenom', $_POST['prenom']);
        $stmt->bindParam(':email', $_POST['email']);
        $stmt->bindParam(':cin', $_POST['CIN']);
        $stmt->bindParam(':nom_association', $_POST['nom_association']);
        $stmt->bindParam(':adresse_association', $_POST['adresse_association']);
        $stmt->bindParam(':matricule_fiscal', $_POST['matricule_fiscal']);
        $stmt->bindParam(':logo', $logo, PDO::PARAM_LOB);
        $stmt->bindParam(':pseudo', $pseudo);
        $stmt->bindParam(':pwrd', $hashedPassword);
        $stmt->execute();
    } else {
        die("Type d'utilisateur invalide.");
    }

    // Save user in session
    $_SESSION['user_id'] = $pdo->lastInsertId();
    $_SESSION['user_type'] = $user_type;
    $_SESSION['user_pseudo'] = $pseudo;

    // Redirect to the correct dashboard
    if ($user_type === 'donor') {
        header('Location: helphubPweb/donor/donor.html');
        exit;
    } else {
        header('Location: helphubPweb/association/association.html');
        exit;
    }

} catch (PDOException $e) {
    die("Erreur lors de l'inscription : " . $e->getMessage());
}
?>