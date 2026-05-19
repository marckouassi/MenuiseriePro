<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier", "ouvrier"]);

$pagination = paginate($pdo, "produits", "id_produit");
$produits = $pagination["rows"];
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Produits</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="produits">

    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>

        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">

            <header class="topbar" data-topbar></header>

            <main class="page-content">

                <section class="page-title">
                    <div>
                        <p class="eyebrow">Catalogue</p>
                        <h1>Produits</h1>
                        <p>Listez vos meubles, portes, lits, cuisines et prix.</p>
                        <small class="page-update">Mis à jour : <?= date("d/m/Y") ?></small>
                    </div>

                    <button class="btn btn-primary" data-open-modal="productModal" data-reset-form>
                        Ajouter un produit
                    </button>
                </section>

                <section class="product-admin-grid">

                    <?php if (count($produits) > 0): ?>

                        <?php foreach ($produits as $produit): ?>

                            <article class="catalog-card">

                                <img
                                    class="catalog-visual"
                                    src="<?= !empty($produit['image']) ? htmlspecialchars($produit['image']) : 'assets/images/meuble.png' ?>"
                                    alt="<?= htmlspecialchars($produit['nom_produit']) ?>"
                                >

                                <h3><?= htmlspecialchars($produit['categorie']) ?></h3>

                                <p><?= htmlspecialchars($produit['quantite']) ?> produits</p>

                                <strong>
                                    À partir de <?= number_format($produit['prix'], 0, ',', ' ') ?> FCFA
                                </strong>

                            </article>

                        <?php endforeach; ?>

                    <?php endif; ?>

                </section>

                <section class="panel">

                    <div class="panel-header">
                        <div>
                            <h2>Liste des produits</h2>
                            <p>Prix, photos et quantités disponibles.</p>
                        </div>
                    </div>

                    <div class="table-wrap">

                        <table data-table>

                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Catégorie</th>
                                    <th>Prix</th>
                                    <th>Quantité</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                <?php if (count($produits) > 0): ?>

                                    <?php foreach ($produits as $produit): ?>

                                        <tr>

                                            <td>
                                                <?= htmlspecialchars($produit['nom_produit']) ?>
                                            </td>

                                            <td>
                                                <?= htmlspecialchars($produit['categorie']) ?>
                                            </td>

                                            <td>
                                                <?= number_format($produit['prix'], 0, ',', ' ') ?> FCFA
                                            </td>

                                            <td>
                                                <?= htmlspecialchars($produit['quantite']) ?>
                                            </td>

                                            <td>
                                                <img
                                                    class="product-thumb"
                                                    src="<?= !empty($produit['image']) ? htmlspecialchars($produit['image']) : 'assets/images/meuble.png' ?>"
                                                    alt="<?= htmlspecialchars($produit['nom_produit']) ?>"
                                                >
                                            </td>

                                            <td>

                                                <button
                                                    class="mini-btn"
                                                    data-open-modal="productModal"
                                                    data-field-id-produit="<?= $produit['id_produit'] ?>"
                                                    data-field-nom-produit="<?= htmlspecialchars($produit['nom_produit'], ENT_QUOTES) ?>"
                                                    data-field-categorie="<?= htmlspecialchars($produit['categorie'], ENT_QUOTES) ?>"
                                                    data-field-prix="<?= htmlspecialchars($produit['prix'], ENT_QUOTES) ?>"
                                                    data-field-quantite="<?= htmlspecialchars($produit['quantite'], ENT_QUOTES) ?>"
                                                    data-field-image-actuelle="<?= htmlspecialchars($produit['image'], ENT_QUOTES) ?>"
                                                >
                                                    Modifier
                                                </button>

                                                <a
                                                    class="mini-btn danger"
                                                    href="supprimer_produit.php?id=<?= $produit['id_produit'] ?>"
                                                    data-confirm="Supprimer ce produit ?"
                                                >
                                                    Supprimer
                                                </a>

                                            </td>

                                        </tr>

                                    <?php endforeach; ?>

                                <?php else: ?>

                                    <tr>
                                        <td colspan="6">
                                            Aucun produit enregistré.
                                        </td>
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

    <dialog class="modal" id="productModal">

        <form
            action="ajouter_produit.php"
            method="POST"
            enctype="multipart/form-data"
            class="modal-card"
        >
            <?= csrf_field() ?>
            <input type="hidden" name="id_produit">
            <input type="hidden" name="image_actuelle" value="assets/images/meuble.png">

            <div class="panel-header">

                <h2>Ajouter un produit</h2>

                <button
                    class="icon-btn"
                    value="cancel"
                    type="button"
                    aria-label="Fermer"
                >
                    <i data-lucide="x"></i>
                </button>

            </div>

            <label>
                Nom
                <input
                    name="nom_produit"
                    required
                    placeholder="Nom du produit"
                >
            </label>

            <label>
                Catégorie

                <select name="categorie">

                    <option>Meubles</option>
                    <option>Armoires</option>
                    <option>Tables</option>
                    <option>Lits</option>
                    <option>Cuisines</option>
                    <option>Portes</option>
                    <option>Meubles TV</option>

                </select>

            </label>

            <label>
                Prix

                <input
                    name="prix"
                    type="number"
                    required
                    placeholder="120000"
                >

            </label>

            <label>
                Quantité

                <input
                    name="quantite"
                    type="number"
                    min="0"
                    required
                    placeholder="0"
                >

            </label>

            <label>
                Image produit

                <input
                    name="image_file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                >

            </label>

            <div class="modal-actions">

                <button
                    class="btn btn-secondary"
                    value="cancel"
                    type="button"
                >
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
