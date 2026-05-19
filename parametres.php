<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

$id_user = $_SESSION["user_id"];

$sql = "SELECT * FROM users WHERE id_user = :id LIMIT 1";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    ":id" => $id_user
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);
$photoProfil = !empty($user["photo_profil"] ?? "") ? $user["photo_profil"] : "assets/icons/profil.png";
$isAdmin = in_array(strtolower((string) ($user["role"] ?? "")), ["administrateur", "admin"], true);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Paramètres</title>
    <link rel="stylesheet" href="style.css">
</head>

<body data-page="parametres">

    <div class="app-shell">

        <aside class="sidebar" data-sidebar></aside>

        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">

            <header class="topbar" data-topbar></header>

            <main class="page-content settings-page">

                <section class="page-title settings-hero">

                    <div>
                        <p class="eyebrow">Réglages</p>

                        <h1>Paramètres</h1>

                        <p>
                            Réglez le profil, les alertes, la sécurité et l'affichage de MenuiseriePro.
                        </p>

                        <small class="page-update">
                            Mis à jour : <?= date("d/m/Y") ?>
                        </small>
                    </div>

                    <a class="btn btn-danger logout-main" href="logout.php">
                        <span>Se déconnecter</span>
                    </a>

                </section>

                <section class="settings-layout">

                    <article class="settings-card profile-card">

                        <div class="profile-cover"></div>

                        <div class="profile-body">

                            <div class="profile-avatar">

                                <img
                                    src="<?= e($photoProfil) ?>"
                                    alt="Profil utilisateur"
                                >

                            </div>

                            <div class="profile-meta">

                                <p class="settings-kicker">
                                    Profil utilisateur
                                </p>

                                <h2>
                                    <?= e($user["nom"] ?? "") ?>
                                </h2>

                                <span class="role-badge">
                                    <?= e($user["role"] ?? "") ?>
                                </span>

                            </div>

                            <div class="profile-details">

                                <span>
                                    <?= e($user["email"] ?? "") ?>
                                </span>

                                <span>
                                    <?= !empty($user["telephone"] ?? "")
                                        ? e($user["telephone"])
                                        : "Téléphone non renseigné" ?>
                                </span>

                                <span>
                                    <?= !empty($user["fonction"] ?? "")
                                        ? e($user["fonction"])
                                        : "Fonction non renseignÃ©e" ?>
                                </span>

                            </div>

                            <button class="btn btn-primary" type="button" data-open-modal="profileModal">
                                <i data-lucide="pencil"></i>
                                Modifier le profil
                            </button>

                        </div>

                    </article>

                    <article class="settings-card span-2">

                        <div class="settings-card-head">

                            <div>
                                <p class="settings-kicker">
                                    Notifications
                                </p>

                                <h2>
                                    Alertes intelligentes
                                </h2>
                            </div>

                        </div>

                        <div class="settings-list">

                            <label class="setting-row">

                                <span>
                                    <strong>
                                        Activer les notifications
                                    </strong>

                                    <small>
                                        Recevoir les alertes utiles de l'atelier.
                                    </small>
                                </span>

                                <input class="switch-input" type="checkbox" checked>

                            </label>

                            <label class="setting-row">

                                <span>
                                    <strong>
                                        Alertes nouvelles commandes
                                    </strong>

                                    <small>
                                        Prévenir quand une nouvelle commande arrive.
                                    </small>
                                </span>

                                <input class="switch-input" type="checkbox" checked>

                            </label>

                            <label class="setting-row">

                                <span>
                                    <strong>
                                        Alertes stock faible
                                    </strong>

                                    <small>
                                        Signaler les produits bientôt terminés.
                                    </small>
                                </span>

                                <input class="switch-input" type="checkbox" checked>

                            </label>

                        </div>

                    </article>

                    <article class="settings-card danger-zone">

                        <div class="settings-card-head">

                            <div>
                                <p class="settings-kicker">
                                    Session
                                </p>

                                <h2>
                                    Déconnexion
                                </h2>
                            </div>

                        </div>

                        <p>
                            Fermer le compte sur cet appareil.
                        </p>

                        <a class="btn btn-danger btn-wide" href="logout.php">
                            Se déconnecter
                        </a>

                    </article>

                </section>

            </main>

        </div>

    </div>

    <dialog class="modal" id="profileModal">
        <form action="modifier_profil.php" method="POST" enctype="multipart/form-data" class="modal-card">
            <?= csrf_field() ?>
            <div class="panel-header">
                <h2>Modifier le profil</h2>
                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <label>
                Nom
                <input name="nom" required maxlength="120" value="<?= e($user["nom"] ?? "") ?>">
            </label>

            <label>
                Email
                <input name="email" type="email" required maxlength="190" value="<?= e($user["email"] ?? "") ?>">
            </label>

            <label>
                TÃ©lÃ©phone
                <input name="telephone" maxlength="60" value="<?= e($user["telephone"] ?? "") ?>">
            </label>

            <label>
                Fonction
                <input name="fonction" maxlength="120" value="<?= e($user["fonction"] ?? "") ?>">
            </label>

            <?php if ($isAdmin): ?>
                <label>
                    RÃ´le
                    <select name="role">
                        <?php foreach (["administrateur", "gerant", "magasinier", "ouvrier", "comptable"] as $role): ?>
                            <option value="<?= e($role) ?>" <?= ($user["role"] ?? "") === $role ? "selected" : "" ?>>
                                <?= e(ucfirst($role)) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </label>
            <?php endif; ?>

            <label>
                Photo de profil
                <input name="photo_profil" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp">
            </label>

            <div class="modal-actions">
                <button class="btn btn-secondary" value="cancel" type="button">Annuler</button>
                <button class="btn btn-primary" type="submit">Enregistrer</button>
            </div>
        </form>
    </dialog>

    <script src="index.js"></script>

</body>
</html>
