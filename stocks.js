(function () {
    if (document.body.dataset.page !== "stocks") return;

    const update = document.querySelector(".page-update");

    if (update) {
        update.textContent = `Mis à jour : ${new Date().toLocaleDateString("fr-FR")}`;
    }

    const searchInput = document.querySelector("[data-table-search]");
    const statusFilter = document.querySelector("[data-table-filter]");
    const table = document.querySelector("[data-table]");

    function filtrerTableau() {
        if (!table) return;

        const recherche = searchInput ? searchInput.value.toLowerCase() : "";
        const statut = statusFilter ? statusFilter.value.toLowerCase() : "";

        const rows = table.querySelectorAll("tbody tr");

        rows.forEach((row) => {
            const texte = row.textContent.toLowerCase();

            const correspondRecherche = texte.includes(recherche);
            const correspondStatut = !statut || texte.includes(statut);

            row.style.display = correspondRecherche && correspondStatut ? "" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filtrerTableau);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filtrerTableau);
    }
})();