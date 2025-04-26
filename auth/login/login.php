<?php
session_start();
require_once '../../config.php'; // adjust path if needed

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Méthode de requête invalide");
}

// Get user input
$pseudo = isset($_POST['pseudo']) ? trim($_POST['pseudo']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Basic input check
if (empty($pseudo) || empty($password)) {
    die("Veuillez fournir le pseudo et le mot de passe.");
}

try {
    // Create PDO connection
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // First check donateur table
    $stmt = $pdo->prepare("SELECT id_donateur AS id, pseudo, pwrd FROM donateur WHERE pseudo = :pseudo");
    $stmt->bindParam(':pseudo', $pseudo);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $userType = 'donor';

    if (!$user) {
        // If not found, check responsable_association table
        $stmt = $pdo->prepare("SELECT id_responsable AS id, pseudo, pwrd FROM responsable_association WHERE pseudo = :pseudo");
        $stmt->bindParam(':pseudo', $pseudo);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $userType = 'association';
    }

    if ($user) {
        if (password_verify($password, $user['pwrd'])) {
            // Success: create session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_type'] = $userType;
            $_SESSION['user_pseudo'] = $user['pseudo'];

            // Redirect user to their dashboard
            if ($userType == 'donor') {
                header('Location: /helphubPweb/donor/donor.html');
                exit;
            } else {
                header('Location: /helphubPweb/association/association.html');
                exit;
            }
        } else {
            // Wrong password
            echo "Mot de passe incorrect.";
        }
    } else {
        // Pseudo not found
        echo "Pseudo introuvable.";
    }
} catch (PDOException $e) {
    echo "Erreur de connexion à la base de données.";
}
?>

