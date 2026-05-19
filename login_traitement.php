<?php
session_start();
require_once "db.php";
require_once "backend.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":email" => $email
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        $_SESSION["user_id"] = $user["id_user"];
        $_SESSION["user_nom"] = $user["nom"];
        $_SESSION["user_role"] = $user["role"];
        log_action($pdo, (int) $user["id_user"], "connexion", "users", "Connexion utilisateur");

        header("Location: index.php");
        exit;
    } else {
        header("Location: login.php?error=1");
        exit;
    }
}
