<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier"]);

$id = (int) ($_GET["id"] ?? 0);

if ($id > 0) {
    $stmt = $pdo->prepare("DELETE FROM stocks WHERE id_stock = :id");
    $stmt->execute([":id" => $id]);
    log_action($pdo, (int) $_SESSION["user_id"], "suppression", "stocks", "Stock ID: " . $id);
}

header("Location: stocks.php");
exit;
?>
