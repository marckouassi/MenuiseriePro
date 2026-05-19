<?php
session_start();

if (isset($_SESSION["user_id"])) {
    header("Location: index.php");
    exit;
}

$error = $_GET["error"] ?? "";
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Connexion</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="auth-page">
    <main class="auth-layout">
        <section class="auth-brand">
            <a class="brand large" href="index.php">
                <span class="brand-mark">MP</span>
                <span>MenuiseriePro</span>
            </a>

            <h1>Connectez-vous à MenuiseriePro.</h1>
            <p>Entrez dans votre espace pour gérer l'atelier rapidement.</p>
        </section>

        <form class="auth-card" action="login_traitement.php" method="POST">
            <p class="eyebrow">Connexion</p>
            <h2>Bienvenue</h2>

            <?php if ($error): ?>
                <p style="color:red;">Email ou mot de passe incorrect.</p>
            <?php endif; ?>

            <label>
                Email
                <input type="email" name="email" required placeholder="admin@menuiseriepro.ci">
            </label>

            <label>
                Mot de passe
                <input type="password" name="password" required placeholder="Votre mot de passe">
            </label>

            <button class="btn btn-primary" type="submit">Se connecter</button>

            <a class="text-link" href="forgot-password.php">Mot de passe oublié ?</a>

            <p>
                Pas encore de compte ?
                <a class="text-link" href="register.php">Créer un compte</a>
            </p>
        </form>
    </main>

</body>
</html>