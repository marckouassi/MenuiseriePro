<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

$dashboardData = [
    "kpis" => [
        "ca" => 0,
        "benefice" => 0,
        "sorties" => 0,
        "projets" => 0,
        "commandes" => 0,
        "clients" => 0,
        "produits" => 0,
        "stocks_faibles" => 0,
        "paiements_restants" => 0,
    ],
    "mois" => [],
    "ventes" => [],
];
$stocksFaibles = [];
$dernieresCommandes = [];
$dernieresTransactions = [];

$monthLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
$firstMonth = new DateTime("first day of -5 months");
$monthlySales = [];

for ($i = 0; $i < 6; $i++) {
    $month = (clone $firstMonth)->modify("+$i month");
    $key = $month->format("Y-m");
    $dashboardData["mois"][] = $monthLabels[(int) $month->format("n") - 1];
    $monthlySales[$key] = 0;
}

try {
    $financeStmt = $pdo->query("
        SELECT
            COALESCE(SUM(CASE WHEN type_transaction = 'Recette' THEN montant ELSE 0 END), 0) AS recettes,
            COALESCE(SUM(CASE WHEN type_transaction = 'Dépense' THEN montant ELSE 0 END), 0) AS depenses
        FROM finances
    ");
    $finance = $financeStmt->fetch(PDO::FETCH_ASSOC) ?: ["recettes" => 0, "depenses" => 0];

    $recettes = (float) $finance["recettes"];
    $depenses = (float) $finance["depenses"];

    $dashboardData["kpis"]["ca"] = $recettes;
    $dashboardData["kpis"]["sorties"] = $depenses;
    $dashboardData["kpis"]["benefice"] = $recettes - $depenses;

    $projectStmt = $pdo->query("SELECT COUNT(*) FROM commandes WHERE statut NOT IN ('Terminée', 'Livrée')");
    $dashboardData["kpis"]["projets"] = (int) $projectStmt->fetchColumn();

    $dashboardData["kpis"]["commandes"] = (int) $pdo->query("SELECT COUNT(*) FROM commandes")->fetchColumn();
    $dashboardData["kpis"]["clients"] = (int) $pdo->query("SELECT COUNT(*) FROM clients")->fetchColumn();
    $dashboardData["kpis"]["produits"] = (int) $pdo->query("SELECT COUNT(*) FROM produits")->fetchColumn();
    $dashboardData["kpis"]["stocks_faibles"] = (int) $pdo->query("SELECT COUNT(*) FROM stocks WHERE statut IN ('Stock faible', 'Manquant')")->fetchColumn();
    $dashboardData["kpis"]["paiements_restants"] = (float) $pdo->query("SELECT COALESCE(SUM(total - montant_paye), 0) FROM paiements")->fetchColumn();

    $stocksFaibles = $pdo->query("SELECT materiau, quantite, statut FROM stocks WHERE statut IN ('Stock faible', 'Manquant') ORDER BY id_stock DESC LIMIT 4")->fetchAll(PDO::FETCH_ASSOC);
    $dernieresCommandes = $pdo->query("SELECT client, produit, prix, date_commande, statut FROM commandes ORDER BY id_commande DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    $dernieresTransactions = $pdo->query("SELECT type_transaction, description_transaction, montant, date_transaction FROM finances ORDER BY id_transaction DESC LIMIT 4")->fetchAll(PDO::FETCH_ASSOC);

    $salesStmt = $pdo->prepare("
        SELECT DATE_FORMAT(date_commande, '%Y-%m') AS mois, COALESCE(SUM(prix), 0) AS total
        FROM commandes
        WHERE date_commande >= :start_date
        GROUP BY DATE_FORMAT(date_commande, '%Y-%m')
        ORDER BY mois ASC
    ");
    $salesStmt->execute(["start_date" => $firstMonth->format("Y-m-01")]);

    foreach ($salesStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        if (array_key_exists($row["mois"], $monthlySales)) {
            $monthlySales[$row["mois"]] = (float) $row["total"];
        }
    }
} catch (PDOException $e) {
    $monthlySales = array_fill_keys(array_keys($monthlySales), 0);
}

$dashboardData["ventes"] = array_values($monthlySales);
?>


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MenuiseriePro | Tableau de bord</title>
    <meta name="description" content="Logiciel simple de gestion pour menuiserie en Côte d'Ivoire.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body data-page="dashboard">
    <div class="app-shell">
        <aside class="sidebar" data-sidebar></aside>
        <button class="sidebar-overlay" type="button" data-sidebar-overlay aria-label="Fermer le menu"></button>

        <div class="app-main">
            <header class="topbar" data-topbar></header>

            <main class="page-content">
                <section class="page-hero">
                    <div>
                        <p class="eyebrow">Vue globale</p>
                        <h1>Tableau de bord MenuiseriePro</h1>
                        <p>Tout ce qui compte pour l'atelier : ventes, commandes, stock et alertes.</p>
                        <small class="page-update">Mis à jour : <span id="date-maj"></span></small>
                    </div>
                    <div class="hero-panel">
                        <span>Entreprise</span>
                        <strong>Atelier MenuiseriePro</strong>
                        <small>Le mois avance bien : +18%</small>
                    </div>
                </section>

                <section class="stat-grid">
                    <article class="stat-card">
                        <span>Chiffre d'affaires</span>
                        <strong><span id="kpi-ca"></span></strong>
                        <small class="positive">+12.4% ce mois</small>
                    </article>
                    <article class="stat-card">
                        <span>Bénéfice</span>
                        <strong><span id="kpi-benefice"></span></strong>
                        <small class="positive">+8.7% ce mois</small>
                    </article>
                    <article class="stat-card">
                        <span>Sorties d'argent</span>
                        <strong><span id="kpi-sorties"></span></strong>
                        <small class="warning">Bois +4%</small>
                    </article>
                    <article class="stat-card">
                        <span>Commandes du jour</span>
                        <strong>18</strong>
                        <small>7 en fabrication</small>
                    </article>
                    <article class="stat-card">
                        <span>Stock restant</span>
                        <strong>74%</strong>
                        <small>Bois et accessoires</small>
                    </article>
                    <article class="stat-card">
                        <span>Projets en cours</span>
                        <strong><span id="kpi-projets"></span></strong>
                        <small>12 livraisons à faire</small>
                    </article>
                </section>

                <section class="dashboard-grid">
                    <article class="panel panel-large">
                        <div class="panel-header">
                            <div>
                                <h2>Ventes du mois</h2>
                                <p>Voir vos ventes et bénéfices en un coup d'oeil.</p>
                            </div>
                            <button class="icon-btn" type="button" title="Actualiser" aria-label="Actualiser"><i data-lucide="refresh-cw"></i></button>
                        </div>
                        <div class="bar-chart chart-panel" aria-label="Graphique ventes">
                            <canvas id="chartVentes" height="120"></canvas>
                        </div>
                    </article>

                    <article class="panel">
                        <div class="panel-header">
                            <div>
                                <h2>Stock à surveiller</h2>
                                <p>Bois disponible et produits qui manquent.</p>
                            </div>
                        </div>
                        <div class="stock-list">
                            <div><span>Chene massif</span><b>42 m3</b></div>
                            <div><span>Teck</span><b>18 m3</b></div>
                            <div class="low"><span>Contreplaque</span><b>5 m3</b></div>
                            <div class="low"><span>Vernis mat</span><b>3 pots</b></div>
                        </div>
                    </article>

                    <article class="panel">
                        <div class="panel-header">
                            <div>
                                <h2>Ce qui vient de bouger</h2>
                                <p>Dernières actions de l'atelier.</p>
                            </div>
                        </div>
                        <ul class="activity-list">
                            <li><span></span>Commande #MP-238 livree chez Kouadio M.</li>
                            <li><span></span>Stock de teck mis à jour par Awa.</li>
                            <li><span></span>Devis cuisine validé.</li>
                            <li><span></span>Alerte stock faible: vernis mat.</li>
                        </ul>
                    </article>

                    <article class="panel">
                        <div class="panel-header">
                            <div>
                                <h2>Notifications</h2>
                                <p>À voir aujourd'hui.</p>
                            </div>
                        </div>
                        <div class="notification-stack">
                            <div class="notice urgent">3 commandes en retard</div>
                            <div class="notice">2 nouveaux messages clients</div>
                            <div class="notice">Inventaire aujourd'hui à 09h</div>
                        </div>
                    </article>

                    <article class="panel">
                        <div class="panel-header">
                            <div>
                                <h2>Calendrier</h2>
                                <p>Programme de fabrication.</p>
                            </div>
                        </div>
                        <div class="calendar-mini">
                            <div id="calendrier-grid"></div>
                        </div>
                    </article>

                    <article class="panel panel-large">
                        <div class="panel-header">
                            <div>
                                <h2>Dernieres commandes</h2>
                                <p>Les commandes à suivre vite.</p>
                            </div>
                            <a class="text-link" href="commandes.php">Tout voir</a>
                        </div>
                        <div class="table-wrap">
                            <table class="dashboard-orders">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Produit</th>
                                        <th>Prix</th>
                                        <th>Date</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Kouadio Marc</td>
                                        <td>Cuisine complète</td>
                                        <td>1 850 000 FCFA</td>
                                        <td>08/05/2026</td>
                                        <td><span class="status done">Livrée</span></td>
                                    </tr>
                                    <tr>
                                        <td>Akexie R.</td>
                                        <td>Armoire 4 portes</td>
                                        <td>420 000 FCFA</td>
                                        <td>08/05/2026</td>
                                        <td><span class="status progress">En cours</span></td>
                                    </tr>
                                    <tr>
                                        <td>Studio Nova</td>
                                        <td>Comptoir accueil</td>
                                        <td>950 000 FCFA</td>
                                        <td>07/05/2026</td>
                                        <td><span class="status pending">En attente</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    </div>

    <script>
// Date
const dashboardData = <?= json_encode($dashboardData, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK) ?>;
document.getElementById('date-maj').textContent = new Date().toLocaleDateString('fr-FR');

// KPIs
document.getElementById('kpi-ca').textContent = dashboardData.kpis.ca.toLocaleString('fr-FR') + ' FCFA';
document.getElementById('kpi-benefice').textContent = dashboardData.kpis.benefice.toLocaleString('fr-FR') + ' FCFA';
document.getElementById('kpi-sorties').textContent = dashboardData.kpis.sorties.toLocaleString('fr-FR') + ' FCFA';
document.getElementById('kpi-projets').textContent = dashboardData.kpis.projets;
document.querySelectorAll('.stat-card')[3].querySelector('strong').textContent = dashboardData.kpis.commandes;
document.querySelectorAll('.stat-card')[4].querySelector('strong').textContent = dashboardData.kpis.clients;
document.querySelectorAll('.stat-card')[5].querySelector('strong').textContent = dashboardData.kpis.paiements_restants.toLocaleString('fr-FR') + ' FCFA';

// Graphique
const ctx = document.getElementById('chartVentes').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: dashboardData.mois,
    datasets: [{
      label: 'Ventes (FCFA)',
      data: dashboardData.ventes,
      backgroundColor: '#b87333',
      borderRadius: 6
    }]
  },
  options: { responsive: true, plugins: { legend: { display: false } } }
});
// Calendrier
const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const grid = document.getElementById('calendrier-grid');
const calendarPanel = grid.closest('.panel');
const detailPanel = document.createElement('div');
detailPanel.className = 'calendar-details';
calendarPanel.appendChild(detailPanel);
grid.innerHTML = '';
grid.style.display = 'grid';
grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
grid.style.gap = '4px';
['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].forEach(j => {
  const h = document.createElement('div');
  h.textContent = j;
  h.className = 'calendar-heading';
  grid.appendChild(h);
});
const showTransactions = (date) => {
  const isoDate = toIsoDate(date);
  const rows = transactionsForDate(isoDate);
  grid.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.date === isoDate));
  const balance = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  detailPanel.innerHTML = `<h3>${date.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</h3>${rows.length ? `<div class="calendar-transaction-list">${rows.map(row => `<article><span>${row.type}</span><strong>${row.label}</strong><small>${row.status} · ${formatMoney(Math.abs(row.amount))}</small></article>`).join('')}</div><p class="calendar-balance">Solde du jour : <b>${formatMoney(balance)}</b></p>` : '<p>Aucune transaction enregistrée pour cette date.</p>'}`;
};
const offset = (firstDay === 0 ? 6 : firstDay - 1);
for (let i = 0; i < offset; i++) grid.appendChild(document.createElement('div'));
for (let d = 1; d <= daysInMonth; d++) {
  const date = new Date(today.getFullYear(), today.getMonth(), d);
  const isoDate = toIsoDate(date);
  const rows = transactionsForDate(isoDate);
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.dataset.date = isoDate;
  cell.className = rows.length ? 'has-transactions' : '';
  cell.innerHTML = `<span>${d}</span>${rows.length ? `<b>${rows.length}</b>` : ''}`;
  cell.addEventListener('click', () => showTransactions(date));
  grid.appendChild(cell);
}
    </script>
    <script src="index.js"></script>
</body>
</html>
