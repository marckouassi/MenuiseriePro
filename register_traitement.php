<?php
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nom = $_POST["nom"];
    $email = $_POST["email"];
    $role = $_POST["role"];
    $password = $_POST["password"];
    $confirmPassword = $_POST["confirmPassword"];

    if ($password !== $confirmPassword) {
        die("Les mots de passe ne correspondent pas.");
    }

    $allowedRoles = ["administrateur", "gerant", "magasinier", "ouvrier", "comptable"];
    if (!in_array($role, $allowedRoles, true)) {
        $role = "ouvrier";
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (nom, email, role, password)
            VALUES (:nom, :email, :role, :password)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":nom" => $nom,
        ":email" => $email,
        ":role" => $role,
        ":password" => $passwordHash
    ]);

    header("Location: login.php");
    exit;
}
?>
