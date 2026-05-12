(function () {
    if (document.body.dataset.page !== "stocks" || !window.AppData) return;

    const data = AppData.load();
    const tbody = document.querySelector("[data-table] tbody");

    const stockStatus = (item) => {
        if (Number(item.quantity) <= 0) return "Manquant";
        if (Number(item.quantity) <= Number(item.threshold || 0)) return "Stock faible";
        return "Disponible";
    };

    const statusClass = (status) => status === "Manquant" ? "danger" : status === "Stock faible" ? "pending" : "done";

    if (tbody) {
        tbody.innerHTML = data.stock.map((item) => {
            const max = Math.max(Number(item.entries || 0), Number(item.quantity || 0), Number(item.threshold || 0), 1);
            const percent = Math.min(100, Math.round((Number(item.quantity || 0) / max) * 100));
            const status = stockStatus(item);
            return `
                <tr class="${status === "Disponible" ? "" : "stock-alert-row"}">
                    <td>${item.name}</td>
                    <td>
                        <span>${item.quantity} ${item.unit}</span>
                        <span class="stock-progress" aria-hidden="true"><span data-stock-width="${percent}"></span></span>
                    </td>
                    <td>${item.supplier}</td>
                    <td>${item.entries || 0} ${item.unit}</td>
                    <td>${item.outputs || 0} ${item.unit}</td>
                    <td><span class="status ${statusClass(status)}">${status}</span></td>
                    <td><button class="mini-btn" data-stock-adjust="${item.id}">Entrée</button></td>
                </tr>
            `;
        }).join("");
    }

    document.querySelectorAll("[data-stock-width]").forEach((bar) => {
        const width = bar.dataset.stockWidth;
        bar.style.width = "0%";
        requestAnimationFrame(() => {
            bar.style.width = `${width}%`;
        });
    });

    const update = document.querySelector(".page-update");
    if (update) update.textContent = `Mis à jour : ${new Date().toLocaleDateString("fr-FR")}`;
})();
