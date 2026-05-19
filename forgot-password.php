<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Mot de passe oublié</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="auth-page">
    <!-- Page simple pour récupérer l'accès au compte -->
    <main class="auth-layout">
        <section class="auth-brand">
            <a class="brand large" href="index.php"><span class="brand-mark">MP</span><span>MenuiseriePro</span></a>
            <h1>Récupérez votre accès.</h1>
            <p>Entrez l'email du compte pour recevoir les instructions.</p>
        </section>
        <form class="auth-card" data-auth-form novalidate>
            <p class="eyebrow">Sécurité</p>
            <h2>Mot de passe oublié</h2>
            <label>Email<input type="email" name="email" required placeholder="admin@menuiseriepro.ci"></label>
            <button class="btn btn-primary" type="submit">Envoyer le lien</button>
            <a class="text-link" href="login.php" data-back>Retour à la connexion</a>
        </form>
    </main>
    <script src="index.js"></script>
</body>
</html>
