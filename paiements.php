<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "comptable"]);

$pagination = paginate($pdo, "paiements", "id_paiement");
$paiements = $pagination["rows"];
$commandes = $pdo->query("SELECT id_commande, client, produit, prix FROM commandes ORDER BY id_commande DESC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Paiements</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="paiements">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">Encaissements</p>
                        <h1>Paiements</h1>
                        <p>Suivez les acomptes, les restes à payer et les commandes soldées.</p>
                        <small class="page-update">Mis à jour : <?= date("d/m/Y") ?></small>
                    </div>

                    <button class="btn btn-primary" data-open-modal="paymentModal" data-reset-form>
                        Ajouter un paiement
                    </button>
                </section>

                <section class="toolbar">
                    <input type="search" data-table-search placeholder="Chercher une commande, un client, un statut...">

                    <select data-dynamic-filter>
                        <option value="">Tous les statuts</option>
                        <option>non payé</option>
                        <option>partiellement payé</option>
                        <option>payé</option>
                    </select>

                    <select data-table-sort>
                        <option value="">Trier</option>
                        <option value="1:text">Client</option>
                        <option value="2:money">Total</option>
                        <option value="5:text">Statut</option>
                    </select>
                </section>

                <section class="panel">
                    <div class="table-wrap">
                        <table data-table>
                            <thead>
                                <tr>
                                    <th>Commande</th>
                                    <th>Client</th>
                                    <th>Total</th>
                                    <th>Payé</th>
                                    <th>Reste</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <?php if (count($paiements) > 0): ?>
                                    <?php foreach ($paiements as $paiement): ?>
                                        <?php
                                            $reste = $paiement["total"] - $paiement["montant_paye"];
                                        ?>
                                        <tr>
                                            <td><?= htmlspecialchars($paiement["commande"]) ?></td>
                                            <td><?= htmlspecialchars($paiement["client"]) ?></td>
                                            <td><?= number_format($paiement["total"], 0, ',', ' ') ?> FCFA</td>
                                            <td><?= number_format($paiement["montant_paye"], 0, ',', ' ') ?> FCFA</td>
                                            <td><?= number_format($reste, 0, ',', ' ') ?> FCFA</td>
                                            <td>
                                                <span class="status
                                                    <?= $paiement["statut"] === "payé" ? "done" : "" ?>
                                                    <?= $paiement["statut"] === "partiellement payé" ? "pending" : "" ?>
                                                    <?= $paiement["statut"] === "non payé" ? "danger" : "" ?>
                                                ">
                                                    <?= htmlspecialchars($paiement["statut"]) ?>
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    class="mini-btn"
                                                    data-open-modal="paymentModal"
                                                    data-field-id-paiement="<?= $paiement['id_paiement'] ?>"
                                                    data-field-id-commande="<?= (int) ($paiement['id_commande'] ?? 0) ?>"
                                                    data-field-total="<?= htmlspecialchars($paiement['total'], ENT_QUOTES) ?>"
                                                    data-field-montant-paye="<?= htmlspecialchars($paiement['montant_paye'], ENT_QUOTES) ?>"
                                                    data-field-statut="<?= htmlspecialchars($paiement['statut'], ENT_QUOTES) ?>"
                                                >Modifier</button>
                                                <a class="mini-btn danger" href="supprimer_paiement.php?id=<?= $paiement['id_paiement'] ?>" data-confirm="Supprimer ce paiement ? La suppression est bloquee si une facture y est liee.">
                                                    Supprimer
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="7">Aucun paiement enregistré.</td>
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

    <dialog class="modal" id="paymentModal">
        <form action="ajouter_paiement.php" method="POST" class="modal-card">
            <?= csrf_field() ?>
            <input type="hidden" name="id_paiement">
            <div class="panel-header">
                <h2>Ajouter un paiement</h2>
                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer">
                    <i data-lucide="x"></i>
                </button>
            </div>

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
                Total
                <input name="total" type="number" required placeholder="Ex : 420000">
            </label>

            <label>
                Montant payé
                <input name="montant_paye" type="number" required placeholder="Ex : 200000">
            </label>

            <label>
                Statut
                <select name="statut">
                    <option>non payé</option>
                    <option>partiellement payé</option>
                    <option>payé</option>
                </select>
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
