<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);

$id = (int) ($_GET["id"] ?? 0);

if ($id > 0) {
    $stmt = $pdo->prepare("DELETE FROM employes WHERE id_employe = :id");
    $stmt->execute([":id" => $id]);
    log_action($pdo, (int) $_SESSION["user_id"], "suppression", "employes", "Employe ID: " . $id);
}

header("Location: employes.php");
exit;
?>
