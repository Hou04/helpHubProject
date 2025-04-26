<?php
session_start();
require_once '../../config.php'; // Adjust path if needed

header('Content-Type: application/json');

// Database connection
try {
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit;
}

// Check if user is logged in and is an association
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'association') {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
    exit;
}

$userId = $_SESSION['user_id'];

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];

    if ($action === 'get_association_data') {
        $stmt = $pdo->prepare("
            SELECT nom_association
            FROM responsable_association
            WHERE id_responsable = :id
        ");
        $stmt->execute([':id' => $userId]);
        $assoc = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($assoc) {
            // Dummy numbers for now (replace later with real counts if you want)
            echo json_encode([
                'success' => true,
                'data' => [
                    'name' => $assoc['nom_association'],
                    'active_projects' => 5,
                    'total_collected' => 24500,
                    'total_donors' => 127,
                    'ending_projects' => 2
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Association non trouvée']);
        }
    }

    elseif ($action === 'get_recent_projects') {
        $stmt = $pdo->prepare("
            SELECT id_projet, titre, description, montant_total, montant_collecte, date_limite
            FROM projet
            WHERE id_responsable = :id
            ORDER BY date_limite DESC
            LIMIT 6
        ");
        $stmt->execute([':id' => $userId]);

        $projects = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $progress = 0;
            if ($row['montant_total'] > 0) {
                $progress = ($row['montant_collecte'] / $row['montant_total']) * 100;
            }

            $projects[] = [
                'id' => $row['id_projet'],
                'title' => $row['titre'],
                'description' => $row['description'],
                'status' => 'Actif',
                'progress' => round($progress),
                'target_amount' => $row['montant_total'],
                'collected_amount' => $row['montant_collecte'],
                'deadline' => $row['date_limite']
            ];
        }

        echo json_encode(['success' => true, 'projects' => $projects]);
    }

    elseif ($action === 'get_recent_donations') {
        $stmt = $pdo->prepare("
            SELECT p.id_participation, d.nom AS donor_name, pr.titre AS project_name, p.montant, p.date_participation
            FROM participation p
            INNER JOIN projet pr ON p.id_projet = pr.id_projet
            INNER JOIN donateur d ON p.id_donateur = d.id_donateur
            WHERE pr.id_responsable = :id
            ORDER BY p.date_participation DESC
            LIMIT 5
        ");
        $stmt->execute([':id' => $userId]);

        $donations = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $donations[] = [
                'project_name' => $row['project_name'],
                'donor_name' => $row['donor_name'],
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

