<?php
require_once "../auth.php";
require_once "../config/database.php";

require_role(["administrateur", "gerant", "magasinier"]);
header("Content-Type: application/json; charset=UTF-8");

$stmt = $pdo->query("SELECT id_stock, materiau, quantite, fournisseur, statut FROM stocks ORDER BY id_stock DESC LIMIT 50");
echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)], JSON_UNESCAPED_UNICODE);
?>
