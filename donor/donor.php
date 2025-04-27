<?php
session_start();
require_once '../../config.php'; // Adjust if needed

header('Content-Type: application/json');

// Check user session
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'donor') {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
    exit;
}

// Database connection
try {
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit;
}

$userId = $_SESSION['user_id'];

// Handle the action
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];

    if ($action === 'get_donor_data') {
        // Fetch donor data
        $stmt = $pdo->prepare("
            SELECT nom, prenom, 
                   IFNULL(SUM(p.montant), 0) AS total_donated,
                   COUNT(DISTINCT p.id_projet) AS projects_supported,
                   MAX(p.date_participation) AS last_donation
            FROM donateur d
            LEFT JOIN participation p ON d.id_donateur = p.id_donateur
            WHERE d.id_donateur = :id
            GROUP BY d.id_donateur
        ");
        $stmt->execute([':id' => $userId]);
        $donor = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($donor) {
            echo json_encode([
                'success' => true,
                'data' => [
                    'name' => $donor['prenom'] . ' ' . $donor['nom'],
                    'total_donated' => $donor['total_donated'],
                    'projects_supported' => $donor['projects_supported'],
                    'last_donation' => $donor['last_donation']
                ]
            ]);
        } else {
            echo json_encode(['success' => true, 'data' => [
                'name' => 'Donateur',
                'total_donated' => 0,
                'projects_supported' => 0,
                'last_donation' => null
            ]]);
        }
    }

    elseif ($action === 'get_recommended_projects') {
        $today = date('Y-m-d');
        $stmt = $pdo->query("
            SELECT id_projet, titre, description, montant_total, montant_collecte, date_limite
            FROM projet
            WHERE date_limite >= '$today' AND montant_collecte < montant_total
            ORDER BY date_limite ASC
            LIMIT 6
        ");
        $projects = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $progress = ($row['montant_collecte'] / $row['montant_total']) * 100;
            $projects[] = [
                'id' => $row['id_projet'],
                'title' => $row['titre'],
                'description' => $row['description'],
                'image' => '/helphubPweb/assets/default-project.jpg', // default image
                'progress' => round($progress),
                'target_amount' => $row['montant_total'],
                'collected_amount' => $row['montant_collecte']
            ];
        }
        echo json_encode(['success' => true, 'projects' => $projects]);
    }

    elseif ($action === 'get_donation_history') {
        $stmt = $pdo->prepare("
            SELECT p.id_participation, pr.titre AS project_name, p.montant, p.date_participation
            FROM participation p
            INNER JOIN projet pr ON p.id_projet = pr.id_projet
            WHERE p.id_donateur = :id
            ORDER BY p.date_participation DESC
        ");
        $stmt->execute([':id' => $userId]);
        $donations = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $donations[] = [
                'id' => $row['id_participation'],
                'project_name' => $row['project_name'],
                'amount' => $row['montant'],
                'date' => $row['date_participation']
            ];
        }
        echo json_encode(['success' => true, 'donations' => $donations]);
    }

    else {
        echo json_encode(['success' => false, 'message' => 'Action non reconnue']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}
?>