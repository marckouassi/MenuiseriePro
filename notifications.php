<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

generate_automatic_notifications($pdo);

$sql = "SELECT * FROM notifications WHERE id_user IS NULL OR id_user = :id_user ORDER BY id_notification DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute([":id_user" => $_SESSION["user_id"]]);
$notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Notifications</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="notifications">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">Alertes</p>
                        <h1>Notifications</h1>
                        <p>Commandes, stock, argent et rappels importants.</p>
                        <small class="page-update">Mis à jour : <?= date("d/m/Y") ?></small>
                    </div>

                    <a class="btn btn-secondary" href="marquer_notifications_lues.php">
                        Marquer comme lues
                    </a>
                </section>

                <section class="notification-page-list">
                    <?php if (count($notifications) > 0): ?>
                        <?php foreach ($notifications as $notification): ?>
                            <article class="notification-item <?= $notification['est_lue'] == 0 ? 'unread' : '' ?>">
                                <span class="alert-dot <?= $notification['type_notification'] === 'danger' ? 'danger' : '' ?>"></span>

                                <div>
                                    <h3><?= htmlspecialchars($notification["titre"]) ?></h3>
                                    <p><?= htmlspecialchars($notification["message"]) ?></p>
                                </div>

                                <small>
                                    <?= date("d/m/Y H:i", strtotime($notification["created_at"])) ?>
                                </small>
                            </article>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <article class="notification-item">
                            <span class="alert-dot"></span>
                            <div>
                                <h3>Aucune notification</h3>
                                <p>Vous n’avez aucune alerte pour le moment.</p>
                            </div>
                            <small>-</small>
                        </article>
                    <?php endif; ?>
                </section>
            </main>
        </div>
    </div>

    <script src="index.js"></script>
</body>
</html>
