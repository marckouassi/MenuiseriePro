<?php
require_once "../auth.php";
require_once "../config/database.php";

require_role(["administrateur", "gerant", "ouvrier"]);
header("Content-Type: application/json; charset=UTF-8");

$stmt = $pdo->query("SELECT id_commande, numero_commande, client, produit, prix, date_commande, statut FROM commandes ORDER BY id_commande DESC LIMIT 50");
echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
?>
