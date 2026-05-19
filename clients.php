<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);

$pagination = paginate($pdo, "clients", "id_client");
$clients = $pagination["rows"];
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Clients</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="clients">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">Clients</p>
                        <h1>Clients</h1>
                        <p>Retrouvez les contacts clients et leurs commandes au même endroit.</p>
                        <small class="page-update">Mis à jour : 18/05/2026</small>
                    </div>

                    <button class="btn btn-primary" data-open-modal="clientModal" data-reset-form>
                        Ajouter un client
                    </button>
                </section>

                <section class="toolbar">
                    <input type="search" data-table-search placeholder="Chercher un nom, un email, un téléphone...">

                    <select data-table-filter>
                        <option value="">Tous les types</option>
                        <option>Particulier</option>
                        <option>Entreprise</option>
                    </select>
                </section>

                <section class="panel">
                    <div class="table-wrap">
                        <table data-table>
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Téléphone</th>
                                    <th>Email</th>
                                    <th>Adresse</th>
                                    <th>Historique</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <?php if (count($clients) > 0): ?>
                                    <?php foreach ($clients as $client): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($client['nom_client']) ?></td>
                                            <td><?= htmlspecialchars($client['telephone']) ?></td>
                                            <td><?= htmlspecialchars($client['email']) ?></td>
                                            <td><?= htmlspecialchars($client['adresse']) ?></td>
                                            <td>0 commande</td>
                                            <td><?= htmlspecialchars($client['type_client']) ?></td>
                                            <td>
                                                <button
                                                    class="mini-btn"
                                                    data-open-modal="clientModal"
                                                    data-field-id-client="<?= $client['id_client'] ?>"
                                                    data-field-nom-client="<?= htmlspecialchars($client['nom_client'], ENT_QUOTES) ?>"
                                                    data-field-telephone="<?= htmlspecialchars($client['telephone'], ENT_QUOTES) ?>"
                                                    data-field-email="<?= htmlspecialchars($client['email'], ENT_QUOTES) ?>"
                                                    data-field-adresse="<?= htmlspecialchars($client['adresse'], ENT_QUOTES) ?>"
                                                    data-field-type-client="<?= htmlspecialchars($client['type_client'], ENT_QUOTES) ?>"
                                                >Modifier</button>
                                                <a
                                                    class="mini-btn danger"
                                                    href="supprimer_client.php?id=<?= $client['id_client'] ?>"
                                                    data-confirm="Supprimer ce client ? La suppression est bloquee si des commandes y sont liees."
                                                >
                                                    Supprimer
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="7">Aucun client enregistré pour le moment.</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                    <?= pagination_links($pagination["page"], $pagination["pages"]) ?>
                </section>
            </main>
        </div>
    </div>

    <dialog class="modal" id="clientModal">
        <form action="ajouter_client.php" method="POST" class="modal-card">
            <?= csrf_field() ?>
            <input type="hidden" name="id_client">
            <div class="panel-header">
                <h2>Ajouter un client</h2>

                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <label>
                Nom
                <input name="nom_client" required placeholder="Nom et prénom">
            </label>

            <label>
                Téléphone
                <input name="telephone" required placeholder="+225 ...">
            </label>

            <label>
                Email
                <input name="email" type="email" required placeholder="email@exemple.com">
            </label>

            <label>
                Adresse
                <input name="adresse" required placeholder="Adresse">
            </label>

            <label>
                Type
                <select name="type_client">
                    <option>Particulier</option>
                    <option>Entreprise</option>
                </select>
            </label>

            <div class="modal-actions">
                <button class="btn btn-secondary" value="cancel" type="button">
                    Annuler
                </button>

                <button class="btn btn-primary" type="submit">
                    Enregistrer
                </button>
            </div>
        </form>
    </dialog>

    <script src="index.js"></script>
</body>
</html>
