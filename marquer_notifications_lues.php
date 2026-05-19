<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier", "comptable", "ouvrier"]);

$sql = "UPDATE notifications SET est_lue = 1 WHERE id_user IS NULL OR id_user = :id_user";
$stmt = $pdo->prepare($sql);
$stmt->execute([":id_user" => $_SESSION["user_id"]]);

header("Location: notifications.php");
exit;
?>
