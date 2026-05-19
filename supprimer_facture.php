<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "comptable"]);

if (isset($_GET["id"])) {
    $id = $_GET["id"];

    $sql = "DELETE FROM factures WHERE id_facture = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id" => $id
    ]);
}

header("Location: factures.php");
exit;
?>
