(function () {
    if (document.body.dataset.page !== "commandes") return;

    const btnNouvelleCommande = document.getElementById("btn-nouvelle-commande");
    const formNouvelleCommande = document.getElementById("form-nouvelle-commande");
    const btnAnnuler = document.getElementById("btn-annuler");
    const searchInput = document.querySelector("[data-table-search]");
    const tableRows = document.querySelectorAll("[data-table] tbody tr");

    if (btnNouvelleCommande && formNouvelleCommande) {
        btnNouvelleCommande.addEventListener("click", function () {
            formNouvelleCommande.style.display = "block";
        });
    }

    if (btnAnnuler && formNouvelleCommande) {
        btnAnnuler.addEventListener("click", function () {
            formNouvelleCommande.style.display = "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const recherche = searchInput.value.toLowerCase();

            tableRows.forEach(function (row) {
                const texte = row.textContent.toLowerCase();
                row.style.display = texte.includes(recherche) ? "" : "none";
            });
        });
    }
})();