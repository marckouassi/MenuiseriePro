<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier"]);

$pagination = paginate($pdo, "fournisseurs", "id_fournisseur");
$fournisseurs = $pagination["rows"];
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Fournisseurs</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="fournisseurs">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">Achats</p>
                        <h1>Fournisseurs</h1>
                        <p>Gardez les contacts et les derniers achats au même endroit.</p>
                        <small class="page-update">Mis à jour : <?= date("d/m/Y") ?></small>
                    </div>

                    <button class="btn btn-primary" data-open-modal="supplierModal" data-reset-form>
                        Ajouter un fournisseur
                    </button>
                </section>

                <section class="supplier-grid">
                    <?php if (count($fournisseurs) > 0): ?>
                        <?php foreach ($fournisseurs as $fournisseur): ?>
                            <article class="panel supplier-card">
                                <h2><?= htmlspecialchars($fournisseur["nom_fournisseur"]) ?></h2>
                                <p><?= htmlspecialchars($fournisseur["materiaux"]) ?></p>
                                <strong><?= htmlspecialchars($fournisseur["nombre_achats"]) ?> achats</strong>
                                <span><?= htmlspecialchars($fournisseur["contact"]) ?></span>
                            </article>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <article class="panel supplier-card">
                            <h2>Aucun fournisseur</h2>
                            <p>Ajoutez votre premier fournisseur.</p>
                            <strong>0 achat</strong>
                            <span>-</span>
                        </article>
                    <?php endif; ?>
                </section>

                <section class="panel">
                    <div class="panel-header">
                        <div>
                            <h2>Historique d'achats</h2>
                            <p>Les derniers achats faits.</p>
                        </div>
                    </div>

                    <div class="table-wrap">
                        <table data-table>
                            <thead>
                                <tr>
                                    <th>Fournisseur</th>
                                    <th>Matériaux</th>
                                    <th>Contact</th>
                                    <th>Dernier achat</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <?php if (count($fournisseurs) > 0): ?>
                                    <?php foreach ($fournisseurs as $fournisseur): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($fournisseur["nom_fournisseur"]) ?></td>
                                            <td><?= htmlspecialchars($fournisseur["materiaux"]) ?></td>
                                            <td><?= htmlspecialchars($fournisseur["contact"]) ?></td>
                                            <td>
                                                <?= $fournisseur["dernier_achat"] 
                                                    ? date("d/m/Y", strtotime($fournisseur["dernier_achat"])) 
                                                    : "-" ?>
                                            </td>
                                            <td><?= number_format($fournisseur["total_achats"], 0, ',', ' ') ?> FCFA</td>
                                            <td>
                                                <button
                                                    class="mini-btn"
                                                    data-open-modal="supplierModal"
                                                    data-field-id-fournisseur="<?= $fournisseur['id_fournisseur'] ?>"
                                                    data-field-nom-fournisseur="<?= htmlspecialchars($fournisseur['nom_fournisseur'], ENT_QUOTES) ?>"
                                                    data-field-materiaux="<?= htmlspecialchars($fournisseur['materiaux'], ENT_QUOTES) ?>"
                                                    data-field-contact="<?= htmlspecialchars($fournisseur['contact'], ENT_QUOTES) ?>"
                                                    data-field-nombre-achats="<?= htmlspecialchars($fournisseur['nombre_achats'], ENT_QUOTES) ?>"
                                                    data-field-dernier-achat="<?= htmlspecialchars($fournisseur['dernier_achat'], ENT_QUOTES) ?>"
                                                    data-field-total-achats="<?= htmlspecialchars($fournisseur['total_achats'], ENT_QUOTES) ?>"
                                                >Modifier</button>
                                                <a class="mini-btn danger" href="supprimer_fournisseur.php?id=<?= $fournisseur['id_fournisseur'] ?>" data-confirm="Supprimer ce fournisseur ? La suppression est bloquee si du stock y est lie.">Supprimer</a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="6">Aucun achat enregistré.</td>
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

    <dialog class="modal" id="supplierModal">
        <form action="ajouter_fournisseur.php" method="POST" class="modal-card">
            <?= csrf_field() ?>
            <input type="hidden" name="id_fournisseur">
            <div class="panel-header">
                <h2>Ajouter un fournisseur</h2>
                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <label>
                Nom
                <input name="nom_fournisseur" required placeholder="Nom du fournisseur">
            </label>

            <label>
                Matériaux fournis
                <input name="materiaux" required placeholder="Bois, vernis, colle...">
            </label>

            <label>
                Contact
                <input name="contact" required placeholder="Téléphone ou email du fournisseur">
            </label>

            <label>
                Nombre d'achats
                <input name="nombre_achats" type="number" value="0">
            </label>

            <label>
                Dernier achat
                <input name="dernier_achat" type="date">
            </label>

            <label>
                Total achats
                <input name="total_achats" type="number" value="0" placeholder="Ex : 980000">
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
