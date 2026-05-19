<?php
session_start();
require_once "db.php";
require_once "backend.php";

if (!empty($_SESSION["user_id"])) {
    log_action($pdo, (int) $_SESSION["user_id"], "deconnexion", "users", "Deconnexion utilisateur");
}

$_SESSION = [];

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), "", time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
}

session_destroy();

header("Location: login.php");
exit;
?>
