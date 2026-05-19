<?php
session_start();

if (empty($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}

require_once "auth.php";
require_once "db.php";
require_once "backend.php";

verify_csrf();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: parametres.php");
    exit;
}

$idUser = (int) $_SESSION["user_id"];

$stmt = $pdo->prepare("SELECT role, photo_profil FROM users WHERE id_user = :id LIMIT 1");
$stmt->execute([":id" => $idUser]);
$currentUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$currentUser) {
    session_destroy();
    header("Location: login.php");
    exit;
}

$nom = trim((string) ($_POST["nom"] ?? ""));
$email = trim((string) ($_POST["email"] ?? ""));
$telephone = trim((string) ($_POST["telephone"] ?? ""));
$fonction = trim((string) ($_POST["fonction"] ?? ""));
$role = trim((string) ($_POST["role"] ?? $currentUser["role"]));
$allowedRoles = ["administrateur", "gerant", "magasinier", "ouvrier", "comptable"];
$isAdmin = in_array(strtolower((string) $currentUser["role"]), ["administrateur", "admin"], true);

if ($nom === "" || strlen($nom) > 120) {
    header("Location: parametres.php?error=nom");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
    header("Location: parametres.php?error=email");
    exit;
}

if (strlen($telephone) > 60 || strlen($fonction) > 120) {
    header("Location: parametres.php?error=profil");
    exit;
}

if (!$isAdmin || !in_array($role, $allowedRoles, true)) {
    $role = $currentUser["role"];
}

$emailStmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = :email AND id_user <> :id");
$emailStmt->execute([
    ":email" => $email,
    ":id" => $idUser,
]);

if ((int) $emailStmt->fetchColumn() > 0) {
    header("Location: parametres.php?error=email_exists");
    exit;
}

$photoProfil = $currentUser["photo_profil"] ?? null;
$uploadedPhoto = upload_profile_image($_FILES["photo_profil"] ?? []);

if ($uploadedPhoto) {
    $photoProfil = $uploadedPhoto;
}

$update = $pdo->prepare("
    UPDATE users
    SET nom = :nom,
        email = :email,
        telephone = :telephone,
        fonction = :fonction,
        role = :role,
        photo_profil = :photo_profil
    WHERE id_user = :id
");

$update->execute([
    ":nom" => $nom,
    ":email" => $email,
    ":telephone" => $telephone !== "" ? $telephone : null,
    ":fonction" => $fonction !== "" ? $fonction : null,
    ":role" => $role,
    ":photo_profil" => $photoProfil,
    ":id" => $idUser,
]);

$_SESSION["user_nom"] = $nom;

header("Location: parametres.php?updated=1");
exit;
?>
