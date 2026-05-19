<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);

$id = (int) ($_GET["id"] ?? 0);

if ($id > 0) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM commandes WHERE id_client = :id");
    $stmt->execute([":id" => $id]);

    if ((int) $stmt->fetchColumn() === 0) {
        $delete = $pdo->prepare("DELETE FROM clients WHERE id_client = :id");
        $delete->execute([":id" => $id]);
        log_action($pdo, (int) $_SESSION["user_id"], "suppression", "clients", "Client ID: " . $id);
    }
}

header("Location: clients.php");
exit;
?>
