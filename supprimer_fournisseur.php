<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier"]);

$id = (int) ($_GET["id"] ?? 0);

if ($id > 0) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM stocks WHERE id_fournisseur = :id");
    $stmt->execute([":id" => $id]);

    if ((int) $stmt->fetchColumn() === 0) {
        $delete = $pdo->prepare("DELETE FROM fournisseurs WHERE id_fournisseur = :id");
        $delete->execute([":id" => $id]);
        log_action($pdo, (int) $_SESSION["user_id"], "suppression", "fournisseurs", "Fournisseur ID: " . $id);
    }
}

header("Location: fournisseurs.php");
exit;
?>
