<?php
require_once "../auth.php";
require_once "../config/database.php";

header("Content-Type: application/json; charset=UTF-8");

$data = [
    "clients" => (int) $pdo->query("SELECT COUNT(*) FROM clients")->fetchColumn(),
    "commandes" => (int) $pdo->query("SELECT COUNT(*) FROM commandes")->fetchColumn(),
    "stocks_faibles" => (int) $pdo->query("SELECT COUNT(*) FROM stocks WHERE statut IN ('Stock faible', 'Manquant')")->fetchColumn(),
    "paiements_restants" => (float) $pdo->query("SELECT COALESCE(SUM(total - montant_paye), 0) FROM paiements")->fetchColumn(),
];

echo json_encode(["success" => true, "data" => $data], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
?>
