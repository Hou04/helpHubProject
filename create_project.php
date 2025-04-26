<?php
require_once 'config.php';
header('Content-Type: application/json');

// Check if user is association
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'association') {
    echo json_encode(['success' => false, 'message' => 'Accès refusé']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $titre = $_POST['titre'] ?? '';
    $description = $_POST['description'] ?? '';
    $montant_total = $_POST['montant_total'] ?? '';
    $date_limite = $_POST['date_limite'] ?? '';

    if (empty($titre) || empty($description) || empty($montant_total) || empty($date_limite)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires']);
        exit;
    }

    try {
        $stmt = $conn->prepare("
            INSERT INTO projet (titre, description, montant_total, montant_collecte, date_limite, id_responsable)
            VALUES (:titre, :description, :montant_total, 0, :date_limite, :id_responsable)
        ");
        $stmt->execute([
            ':titre' => $titre,
            ':description' => $description,
            ':montant_total' => $montant_total,
            ':date_limite' => $date_limite,
            ':id_responsable' => $_SESSION['user_id']
        ]);

        echo json_encode(['success' => true, 'message' => 'Projet créé avec succès']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la création du projet']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}
?>