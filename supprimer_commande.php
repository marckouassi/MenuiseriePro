<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);

$id = (int) ($_GET["id"] ?? 0);

if ($id > 0) {
    $linked = $pdo->prepare("
        SELECT
            (SELECT COUNT(*) FROM paiements WHERE id_commande = :id) +
            (SELECT COUNT(*) FROM factures WHERE id_commande = :id)
    ");
    $linked->execute([":id" => $id]);

    if ((int) $linked->fetchColumn() === 0) {
        $stmt = $pdo->prepare("DELETE FROM commandes WHERE id_commande = :id");
        $stmt->execute([":id" => $id]);
        log_action($pdo, (int) $_SESSION["user_id"], "suppression", "commandes", "Commande ID: " . $id);
    }
}

header("Location: commandes.php");
exit;
?>
