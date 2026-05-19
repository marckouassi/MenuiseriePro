<?php
require_once "../auth.php";
require_once "../config/database.php";

require_role(["administrateur", "gerant"]);
header("Content-Type: application/json; charset=UTF-8");

$stmt = $pdo->query("SELECT id_client, nom_client, telephone, email, type_client FROM clients ORDER BY id_client DESC LIMIT 50");
echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)], JSON_UNESCAPED_UNICODE);
?>
