<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

$pagination = paginate($pdo, "commandes", "id_commande");
$commandes = $pagination["rows"];
$clients = $pdo->query("SELECT id_client, nom_client FROM clients ORDER BY nom_client ASC")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Commandes</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="commandes">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">Ventes</p>
                        <h1>Commandes clients</h1>
                        <p>Notez les commandes, voyez l'état et mettez à jour rapidement.</p>
                        <small class="page-update">Mis à jour : <?= date("d/m/Y") ?></small>
                    </div>

                    <button class="btn btn-primary" type="button" id="btn-nouvelle-commande">
                        Nouvelle commande
                    </button>
                </section>

                <section class="status-tabs">
                    <a class="filtre-btn" href="commandes.php">Toutes</a>
                    <a class="filtre-btn" href="commandes.php?statut=En attente">En attente</a>
                    <a class="filtre-btn" href="commandes.php?statut=En cours">En cours</a>
                    <a class="filtre-btn" href="commandes.php?statut=Terminée">Terminée</a>
                    <a class="filtre-btn" href="commandes.php?statut=Livrée">Livrée</a>
                </section>

                <section class="toolbar">
                    <input type="search" data-table-search placeholder="Chercher une commande...">
                </section>

                <section class="panel">
                    <div class="table-wrap">
                        <table data-table>
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Produit</th>
                                    <th>Prix</th>
                                    <th>Date</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <?php if (count($commandes) > 0): ?>
                                    <?php foreach ($commandes as $commande): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($commande["client"]) ?></td>
                                            <td><?= htmlspecialchars($commande["produit"]) ?></td>
                                            <td><?= number_format($commande["prix"], 0, ',', ' ') ?> FCFA</td>
                                            <td><?= date("d/m/Y", strtotime($commande["date_commande"])) ?></td>
                                            <td>
                                                <span class="status 
                                                    <?= $commande["statut"] === "Livrée" ? "done" : "" ?>
                                                    <?= $commande["statut"] === "En cours" ? "progress" : "" ?>
                                                    <?= $commande["statut"] === "En attente" ? "pending" : "" ?>
                                                ">
                                                    <?= htmlspecialchars($commande["statut"]) ?>
                                                </span>
                                            </td>
                                            <td>
                                                <a class="mini-btn" href="changer_statut_commande.php?id=<?= $commande['id_commande'] ?>">
                                                    Suivre
                                                </a>
                                                <button
                                                    class="mini-btn"
                                                    data-open-modal="commandeModal"
                                                    data-field-id-commande="<?= $commande['id_commande'] ?>"
                                                    data-field-id-client="<?= (int) ($commande['id_client'] ?? 0) ?>"
                                                    data-field-produit="<?= htmlspecialchars($commande['produit'], ENT_QUOTES) ?>"
                                                    data-field-prix="<?= htmlspecialchars($commande['prix'], ENT_QUOTES) ?>"
                                                    data-field-date-commande="<?= htmlspecialchars($commande['date_commande'], ENT_QUOTES) ?>"
                                                    data-field-statut="<?= htmlspecialchars($commande['statut'], ENT_QUOTES) ?>"
                                                >Modifier</button>

                                                <a class="mini-btn danger" href="supprimer_commande.php?id=<?= $commande['id_commande'] ?>" data-confirm="Supprimer cette commande ? La suppression est bloquee si elle a des paiements ou factures.">
                                                    Supprimer
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="6">Aucune commande enregistrée.</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                    <?= pagination_links($pagination["page"], $pagination["pages"]) ?>
                </section>

                <section class="panel" id="form-nouvelle-commande" style="display:none">
                    <form class="modal-card" action="ajouter_commande.php" method="POST" enctype="multipart/form-data">
                        <?= csrf_field() ?>
                        <div class="panel-header">
                            <h2>Nouvelle commande</h2>
                        </div>

                        <label>
                            Client
                            <select name="id_client" required>
                                <?php foreach ($clients as $client): ?>
                                    <option value="<?= $client['id_client'] ?>"><?= htmlspecialchars($client['nom_client']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </label>

                        <label>
                            Produit
                            <input name="produit" required placeholder="Produit demandé">
                        </label>

                        <label>
                            Prix
                            <input name="prix" required type="number" placeholder="Ex: 250000">
                        </label>

                        <label>
                            Date
                            <input name="date_commande" required type="date">
                        </label>

                        <label>
                            Statut
                            <select name="statut">
                                <option>En attente</option>
                                <option>En cours</option>
                                <option>Terminée</option>
                                <option>Livrée</option>
                            </select>
                        </label>

                        <label>
                            Fichier lie
                            <input name="fichier_document" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf">
                        </label>

                        <div class="modal-actions">
                            <button class="btn btn-secondary" id="btn-annuler" type="button">
                                Annuler
                            </button>

                            <button class="btn btn-primary" type="submit">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    </div>

    <dialog class="modal" id="commandeModal">
        <form class="modal-card" action="ajouter_commande.php" method="POST">
            <?= csrf_field() ?>
            <input type="hidden" name="id_commande">
            <div class="panel-header">
                <h2>Modifier la commande</h2>
                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer"><i data-lucide="x"></i></button>
            </div>
            <label>
                Client
                <select name="id_client" required>
                    <?php foreach ($clients as $client): ?>
                        <option value="<?= $client['id_client'] ?>"><?= htmlspecialchars($client['nom_client']) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Produit<input name="produit" required></label>
            <label>Prix<input name="prix" required type="number"></label>
            <label>Date<input name="date_commande" required type="date"></label>
            <label>
                Statut
                <select name="statut">
                    <option>En attente</option>
                    <option>En cours</option>
                    <option>Terminée</option>
                    <option>Livrée</option>
                </select>
            </label>
            <div class="modal-actions">
                <button class="btn btn-secondary" value="cancel" type="button">Annuler</button>
                <button class="btn btn-primary" type="submit">Enregistrer</button>
            </div>
        </form>
    </dialog>

<script src="index.js"></script>
<script src="commandes.js"></script>
</body>
</html>
