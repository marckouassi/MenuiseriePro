<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "comptable"]);

$pagination = paginate($pdo, "factures", "id_facture");
$factures = $pagination["rows"];
$commandes = $pdo->query("SELECT id_commande, client, produit, prix FROM commandes ORDER BY id_commande DESC")->fetchAll(PDO::FETCH_ASSOC);
$paiements = $pdo->query("SELECT id_paiement, commande, client, montant_paye FROM paiements ORDER BY id_paiement DESC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Factures et devis</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="factures">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">Documents</p>
                        <h1>Factures / Devis</h1>
                        <p>Les devis et factures sont générés depuis les commandes.</p>
                        <small class="page-update">Mis à jour : <?= date("d/m/Y") ?></small>
                    </div>

                    <button class="btn btn-primary" data-open-modal="factureModal" data-reset-form>
                        Ajouter un document
                    </button>
                </section>

                <section class="toolbar">
                    <input type="search" data-table-search placeholder="Chercher un devis, une facture, un client...">

                    <select data-dynamic-filter>
                        <option value="">Tous les documents</option>
                        <option>Devis</option>
                        <option>Facture</option>
                    </select>

                    <input type="date" data-date-filter aria-label="Filtrer par date">

                    <select data-table-sort>
                        <option value="">Trier</option>
                        <option value="0:text">Numéro</option>
                        <option value="4:date">Date</option>
                        <option value="5:money">Total</option>
                    </select>
                </section>

                <section class="panel">
                    <div class="table-wrap">
                        <table data-table>
                            <thead>
                                <tr>
                                    <th>Numéro</th>
                                    <th>Type</th>
                                    <th>Commande</th>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <?php if (count($factures) > 0): ?>
                                    <?php foreach ($factures as $facture): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($facture["numero"]) ?></td>
                                            <td><?= htmlspecialchars($facture["type_document"]) ?></td>
                                            <td><?= htmlspecialchars($facture["commande"]) ?></td>
                                            <td><?= htmlspecialchars($facture["client"]) ?></td>
                                            <td><?= date("d/m/Y", strtotime($facture["date_document"])) ?></td>
                                            <td><?= number_format($facture["total"], 0, ',', ' ') ?> FCFA</td>
                                            <td>
                                                <a class="mini-btn" href="generer_facture_pdf.php?id=<?= $facture['id_facture'] ?>">PDF</a>
                                                <button
                                                    class="mini-btn"
                                                    data-open-modal="factureModal"
                                                    data-field-id-facture="<?= $facture['id_facture'] ?>"
                                                    data-field-id-commande="<?= (int) ($facture['id_commande'] ?? 0) ?>"
                                                    data-field-id-paiement="<?= (int) ($facture['id_paiement'] ?? 0) ?>"
                                                    data-field-numero="<?= htmlspecialchars($facture['numero'], ENT_QUOTES) ?>"
                                                    data-field-type-document="<?= htmlspecialchars($facture['type_document'], ENT_QUOTES) ?>"
                                                    data-field-date-document="<?= htmlspecialchars($facture['date_document'], ENT_QUOTES) ?>"
                                                    data-field-total="<?= htmlspecialchars($facture['total'], ENT_QUOTES) ?>"
                                                >Modifier</button>

                                                <a class="mini-btn danger" href="supprimer_facture.php?id=<?= $facture['id_facture'] ?>" data-confirm="Supprimer ce document ?">
                                                    Supprimer
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="7">Aucun document enregistré.</td>
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

    <dialog class="modal" id="factureModal">
        <form action="ajouter_facture.php" method="POST" class="modal-card">
            <?= csrf_field() ?>
            <input type="hidden" name="id_facture">
            <div class="panel-header">
                <h2>Ajouter une facture / un devis</h2>

                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <label>
                Numéro
                <input name="numero" required placeholder="Ex : FAC-001 ou DEV-001">
            </label>

            <label>
                Type
                <select name="type_document">
                    <option>Devis</option>
                    <option>Facture</option>
                </select>
            </label>

            <label>
                Commande
                <select name="id_commande" required>
                    <?php foreach ($commandes as $commande): ?>
                        <option value="<?= $commande['id_commande'] ?>">
                            CMD-<?= str_pad((string) $commande['id_commande'], 3, "0", STR_PAD_LEFT) ?> -
                            <?= htmlspecialchars($commande['client']) ?> -
                            <?= htmlspecialchars($commande['produit']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </label>

            <label>
                Paiement lie
                <select name="id_paiement">
                    <option value="">Aucun paiement</option>
                    <?php foreach ($paiements as $paiement): ?>
                        <option value="<?= $paiement['id_paiement'] ?>">
                            <?= htmlspecialchars($paiement['commande']) ?> -
                            <?= htmlspecialchars($paiement['client']) ?> -
                            <?= number_format($paiement['montant_paye'], 0, ',', ' ') ?> FCFA
                        </option>
                    <?php endforeach; ?>
                </select>
            </label>

            <label>
                Date
                <input name="date_document" type="date" required>
            </label>

            <label>
                Total
                <input name="total" type="number" required placeholder="Ex : 420000">
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
