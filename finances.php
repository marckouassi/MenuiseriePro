<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "comptable"]);

$pagination = paginate($pdo, "finances", "id_transaction");
$transactions = $pagination["rows"];

$recettes = 0;
$depenses = 0;

foreach ($transactions as $transaction) {
    if ($transaction["type_transaction"] === "Recette") {
        $recettes += $transaction["montant"];
    } elseif ($transaction["type_transaction"] === "Dépense") {
        $depenses += $transaction["montant"];
    }
}

$benefice = $recettes - $depenses;
$nombre_transactions = count($transactions);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Finances</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="finances">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">Argent</p>
                        <h1>Finances</h1>
                        <p>Voyez les entrées, les sorties et le bénéfice de l'atelier.</p>
                        <small class="page-update">Mis à jour : <?= date("d/m/Y") ?></small>
                    </div>

                    <button class="btn btn-primary" data-open-modal="transactionModal" data-reset-form>
                        Ajouter une transaction
                    </button>
                </section>

                <section class="stat-grid compact">
                    <article class="stat-card">
                        <span>Chiffre d'affaires</span>
                        <strong><?= number_format($recettes, 0, ',', ' ') ?> FCFA</strong>
                        <small class="positive">Recettes</small>
                    </article>

                    <article class="stat-card">
                        <span>Sorties d'argent</span>
                        <strong><?= number_format($depenses, 0, ',', ' ') ?> FCFA</strong>
                        <small class="warning">Dépenses</small>
                    </article>

                    <article class="stat-card">
                        <span>Bénéfice</span>
                        <strong><?= number_format($benefice, 0, ',', ' ') ?> FCFA</strong>
                        <small class="<?= $benefice >= 0 ? 'positive' : 'warning' ?>">
                            <?= $benefice >= 0 ? 'Positif' : 'Négatif' ?>
                        </small>
                    </article>

                    <article class="stat-card">
                        <span>Transactions</span>
                        <strong><?= $nombre_transactions ?></strong>
                        <small>Total enregistré</small>
                    </article>
                </section>

                <section class="dashboard-grid">
                    <article class="panel panel-large">
                        <div class="panel-header">
                            <div>
                                <h2>Ventes du mois</h2>
                                <p>Évolution des ventes.</p>
                            </div>
                        </div>

                        <div class="line-chart">
                            <span style="--h:35%"></span>
                            <span style="--h:58%"></span>
                            <span style="--h:48%"></span>
                            <span style="--h:72%"></span>
                            <span style="--h:64%"></span>
                            <span style="--h:86%"></span>
                        </div>
                    </article>

                    <article class="panel">
                        <div class="panel-header">
                            <div>
                                <h2>Où part l'argent</h2>
                                <p>Achats et charges.</p>
                            </div>
                        </div>

                        <div class="donut">
                            <span>
                                <?= $recettes > 0 ? round(($depenses / $recettes) * 100) : 0 ?>%
                            </span>
                        </div>
                    </article>

                    <article class="panel panel-large">
                        <div class="panel-header">
                            <div>
                                <h2>Derniers mouvements</h2>
                                <p>Paiements clients et achats atelier.</p>
                            </div>
                        </div>

                        <div class="table-wrap">
                            <table data-table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Montant</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <?php if (count($transactions) > 0): ?>
                                        <?php foreach ($transactions as $transaction): ?>
                                            <tr>
                                                <td>
                                                    <?= $transaction["date_transaction"] 
                                                        ? date("d/m/Y", strtotime($transaction["date_transaction"])) 
                                                        : "-" ?>
                                                </td>

                                                <td><?= htmlspecialchars($transaction["type_transaction"]) ?></td>

                                                <td><?= htmlspecialchars($transaction["description_transaction"]) ?></td>

                                                <td><?= number_format($transaction["montant"], 0, ',', ' ') ?> FCFA</td>

                                                <td>
                                                    <span class="status 
                                                        <?= $transaction["statut"] === "Validé" ? "done" : "" ?>
                                                        <?= $transaction["statut"] === "Comptabilisé" ? "progress" : "" ?>
                                                        <?= $transaction["statut"] === "En attente" ? "pending" : "" ?>
                                                    ">
                                                        <?= htmlspecialchars($transaction["statut"]) ?>
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        class="mini-btn"
                                                        data-open-modal="transactionModal"
                                                        data-field-id-transaction="<?= $transaction['id_transaction'] ?>"
                                                        data-field-type-transaction="<?= htmlspecialchars($transaction['type_transaction'], ENT_QUOTES) ?>"
                                                        data-field-description-transaction="<?= htmlspecialchars($transaction['description_transaction'], ENT_QUOTES) ?>"
                                                        data-field-montant="<?= htmlspecialchars($transaction['montant'], ENT_QUOTES) ?>"
                                                        data-field-statut="<?= htmlspecialchars($transaction['statut'], ENT_QUOTES) ?>"
                                                        data-field-date-transaction="<?= htmlspecialchars($transaction['date_transaction'], ENT_QUOTES) ?>"
                                                    >Modifier</button>
                                                    <a class="mini-btn danger" href="supprimer_transaction.php?id=<?= $transaction['id_transaction'] ?>" data-confirm="Supprimer cette transaction ?">
                                                        Supprimer
                                                    </a>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <tr>
                                            <td colspan="6">Aucune transaction enregistrée.</td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                        <?= pagination_links($pagination["page"], $pagination["pages"]) ?>
                    </article>
                </section>
            </main>
        </div>
    </div>

    <dialog class="modal" id="transactionModal">
        <form action="ajouter_transaction.php" method="POST" class="modal-card">
            <?= csrf_field() ?>
            <input type="hidden" name="id_transaction">
            <div class="panel-header">
                <h2>Ajouter une transaction</h2>

                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <label>
                Type
                <select name="type_transaction">
                    <option>Recette</option>
                    <option>Dépense</option>
                </select>
            </label>

            <label>
                Description
                <input name="description_transaction" required placeholder="Description">
            </label>

            <label>
                Montant
                <input name="montant" type="number" required placeholder="Montant">
            </label>

            <label>
                Statut
                <select name="statut">
                    <option>Validé</option>
                    <option>Comptabilisé</option>
                    <option>En attente</option>
                </select>
            </label>

            <label>
                Date
                <input name="date_transaction" type="date">
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
