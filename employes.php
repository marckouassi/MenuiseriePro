<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);

$pagination = paginate($pdo, "employes", "id_employe");
$employes = $pagination["rows"];
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Employ�s</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-page="employes">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-title">
                    <div>
                        <p class="eyebrow">�quipe</p>
                        <h1>Employ�s</h1>
                        <p>Voyez les r�les, salaires, pr�sences et t�ches de chacun.</p>
                        <small class="page-update">Mis � jour : 18/05/2026</small>
                    </div>

                    <button class="btn btn-primary" data-open-modal="employeeModal" data-reset-form>
                        Ajouter un employ�
                    </button>
                </section>

                <section class="panel">
                    <div class="table-wrap">
                        <table data-table>
                            <thead>
                                <tr>
                                    <th>Employ�</th>
                                    <th>R�le</th>
                                    <th>Salaire</th>
                                    <th>Pr�sence</th>
                                    <th>T�ches assign�es</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <?php if (count($employes) > 0): ?>
                                    <?php foreach ($employes as $employe): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($employe['nom_employe']) ?></td>
                                            <td><?= htmlspecialchars($employe['role_employe']) ?></td>
                                            <td><?= number_format($employe['salaire'], 0, ',', ' ') ?> FCFA</td>
                                            <td>
                                                <span class="status <?= $employe['presence'] === 'Pr�sent' ? 'done' : 'pending' ?>">
                                                    <?= htmlspecialchars($employe['presence']) ?>
                                                </span>
                                            </td>
                                            <td><?= htmlspecialchars($employe['taches_assignees']) ?></td>
                                            <td>
                                                <button
                                                    class="mini-btn"
                                                    data-open-modal="employeeModal"
                                                    data-field-id-employe="<?= $employe['id_employe'] ?>"
                                                    data-field-nom-employe="<?= htmlspecialchars($employe['nom_employe'], ENT_QUOTES) ?>"
                                                    data-field-role-employe="<?= htmlspecialchars($employe['role_employe'], ENT_QUOTES) ?>"
                                                    data-field-salaire="<?= htmlspecialchars($employe['salaire'], ENT_QUOTES) ?>"
                                                    data-field-presence="<?= htmlspecialchars($employe['presence'], ENT_QUOTES) ?>"
                                                    data-field-taches-assignees="<?= htmlspecialchars($employe['taches_assignees'], ENT_QUOTES) ?>"
                                                >Modifier</button>
                                                <a class="mini-btn danger" href="supprimer_employe.php?id=<?= $employe['id_employe'] ?>" data-confirm="Supprimer cet employe ?">Supprimer</a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="6">Aucun employ� enregistr�.</td>
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

    <dialog class="modal" id="employeeModal">
        <form action="ajouter_employe.php" method="POST" class="modal-card">
            <?= csrf_field() ?>
            <input type="hidden" name="id_employe">
            <div class="panel-header">
                <h2>Ajouter un employ�</h2>

                <button class="icon-btn" value="cancel" type="button" aria-label="Fermer">
                    <i data-lucide="x"></i>
                </button>
            </div>

            <label>
                Nom
                <input name="nom_employe" required placeholder="Nom">
            </label>

            <label>
                R�le
                <input name="role_employe" required placeholder="Ex : menuisier, vendeur, chef d'atelier">
            </label>

            <label>
                Salaire
                <input name="salaire" type="number" required placeholder="280000">
            </label>

            <label>
                Pr�sence
                <select name="presence">
                    <option>Pr�sent</option>
                    <option>Absent</option>
                    <option>En cong�</option>
                </select>
            </label>

            <label>
                T�ches
                <textarea name="taches_assignees" placeholder="T�ches assign�es"></textarea>
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
