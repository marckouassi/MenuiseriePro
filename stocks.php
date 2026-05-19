<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier"]);

$pagination = paginate($pdo, "stocks", "id_stock");
$stocks = $pagination["rows"];
$fournisseurs = $pdo->query("SELECT id_fournisseur, nom_fournisseur FROM fournisseurs ORDER BY nom_fournisseur ASC")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Gestion des stocks</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="stocks">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">Inventaire</p>
                        <h1>Gestion des stocks</h1>
                        <p>Ajoutez les entrées, notez les sorties et voyez vite ce qui manque.</p>
                        <small class="page-update">Mis à jour : <?= date("d/m/Y") ?></small>
                    </div>

                    <button class="btn btn-primary" data-open-modal="stockModal" data-reset-form>
                        Ajouter du stock
                    </button>
                </section>

                <section class="toolbar">
                    <input type="search" data-table-search placeholder="Chercher du bois, du vernis, un fournisseur...">

                    <select data-table-filter>
                        <option value="">Tous les statuts</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Stock faible">Stock faible</option>
                        <option value="Manquant">Manquant</option>
                    </select>
                </section>

                <section class="panel">
                    <div class="panel-header">
                        <div>
                            <h2>Stock restant</h2>
                            <p>Ce qui est disponible et ce qui sort.</p>
                        </div>
                    </div>

                    <div class="table-wrap">
                        <table data-table>
                            <thead>
                                <tr>
                                    <th>Matériau</th>
                                    <th>Quantité</th>
                                    <th>Fournisseur</th>
                                    <th>Entrées</th>
                                    <th>Sorties</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <?php if (count($stocks) > 0): ?>
                                    <?php foreach ($stocks as $stock): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($stock["materiau"]) ?></td>
                                            <td><?= htmlspecialchars($stock["quantite"]) ?></td>
                                            <td><?= htmlspecialchars($stock["fournisseur"]) ?></td>
                                            <td><?= htmlspecialchars($stock["entrees"]) ?></td>
                                            <td><?= htmlspecialchars($stock["sorties"]) ?></td>
                                            <td>
                                                <span class="status
                                                    <?= $stock["statut"] === "Disponible" ? "done" : "" ?>
                                                    <?= $stock["statut"] === "Stock faible" ? "pending" : "" ?>
                                                    <?= $stock["statut"] === "Manquant" ? "danger" : "" ?>
                                                ">
                                                    <?= htmlspecialchars($stock["statut"]) ?>
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    class="mini-btn"
                                                    data-open-modal="stockModal"
                                                    data-field-id-stock="<?= $stock['id_stock'] ?>"
                                                    data-field-id-fournisseur="<?= (int) ($stock['id_fournisseur'] ?? 0) ?>"
                                                    data-field-materiau="<?= htmlspecialchars($stock['materiau'], ENT_QUOTES) ?>"
                                                    data-field-quantite="<?= htmlspecialchars($stock['quantite'], ENT_QUOTES) ?>"
                                                    data-field-entrees="<?= htmlspecialchars($stock['entrees'], ENT_QUOTES) ?>"
                                                    data-field-sorties="<?= htmlspecialchars($stock['sorties'], ENT_QUOTES) ?>"
                                                    data-field-statut="<?= htmlspecialchars($stock['statut'], ENT_QUOTES) ?>"
                                                >Modifier</button>

                                                <a class="mini-btn danger" href="supprimer_stock.php?id=<?= $stock['id_stock'] ?>" data-confirm="Supprimer cette ligne de stock ?">
                                                    Supprimer
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="7">Aucun stock enregistré.</td>
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

    <dialog class="modal" id="stockModal">
        <form action="ajouter_stock.php" method="POST" class="modal-card">
            <?= csrf_field() ?>
            <input type="hidden" name="id_stock">
            <div class="panel-header">
                <h2>Ajouter un stock entrant</h2>

                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <label>
                Matériau
                <input name="materiau" required placeholder="Ex : teck">
            </label>

            <label>
                Quantité
                <input name="quantite" required placeholder="Ex : 12 m3">
            </label>

            <label>
                Fournisseur
                <select name="id_fournisseur" required>
                    <?php foreach ($fournisseurs as $fournisseur): ?>
                        <option value="<?= $fournisseur['id_fournisseur'] ?>"><?= htmlspecialchars($fournisseur['nom_fournisseur']) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>

            <label>
                Entrées
                <input name="entrees" required placeholder="Ex : 12 m3">
            </label>

            <label>
                Sorties
                <input name="sorties" placeholder="Ex : 0">
            </label>

            <label>
                Statut
                <select name="statut">
                    <option>Disponible</option>
                    <option>Stock faible</option>
                    <option>Manquant</option>
                </select>
            </label>

            <div class="modal-actions">
                <button class="btn btn-secondary" value="cancel" type="button">Annuler</button>
                <button class="btn btn-primary" type="submit">Enregistrer</button>
            </div>
        </form>
    </dialog>

    <script src="index.js"></script>
    <script src="stocks.js"></script>
</body>
</html>
