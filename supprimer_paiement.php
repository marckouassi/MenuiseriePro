<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "comptable"]);

$id = (int) ($_GET["id"] ?? 0);

if ($id > 0) {
    $linked = $pdo->prepare("SELECT COUNT(*) FROM factures WHERE id_paiement = :id");
    $linked->execute([":id" => $id]);

    if ((int) $linked->fetchColumn() === 0) {
        $stmt = $pdo->prepare("DELETE FROM paiements WHERE id_paiement = :id");
        $stmt->execute([":id" => $id]);
        log_action($pdo, (int) $_SESSION["user_id"], "suppression", "paiements", "Paiement ID: " . $id);
    }
}

header("Location: paiements.php");
exit;
?>
