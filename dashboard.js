(function () {
    if (document.body.dataset.page !== "dashboard" || !window.AppData) return;

    const data = AppData.load();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const isThisMonth = (value) => {
        const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    };

    const statusClass = (status) => ({
        "En attente": "pending",
        "En cours": "progress",
        "Terminée": "finished",
        "Livrée": "done",
    }[AppData.normalizeStatus(status)] || "pending");

    const badge = (status) => `<span class="status ${statusClass(status)}">${AppData.normalizeStatus(status)}</span>`;

    const renderStats = () => {
        const monthOrders = data.orders.filter((order) => isThisMonth(order.deliveryDate || order.createdAt));
        const revenue = monthOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
        const expenses = data.expenses.filter((item) => isThisMonth(item.date)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const todayOrders = data.orders.filter((order) => String(order.createdAt || "").slice(0, 10) === AppData.todayIso()).length;
        const stockTotal = data.stock.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        const stockCapacity = data.stock.reduce((sum, item) => sum + Math.max(Number(item.entries || 0), Number(item.quantity || 0), 1), 0);
        const stockPercent = Math.round((stockTotal / stockCapacity) * 100);
        const activeProjects = data.orders.filter((order) => !["Livrée"].includes(order.status)).length;

        const stats = [
            ["Chiffre d'affaires", AppData.money(revenue), "Ce mois", "positive"],
            ["Bénéfice", AppData.money(revenue - expenses), "Après sorties", revenue >= expenses ? "positive" : "warning"],
            ["Sorties", AppData.money(expenses), "Achats et charges", "warning"],
            ["Commandes du jour", todayOrders, `${data.orders.filter((order) => order.status === "En cours").length} en fabrication`, ""],
            ["Stock", `${stockPercent}%`, "Bois et accessoires", ""],
            ["Projets", activeProjects, `${data.orders.filter((order) => order.status === "Livrée").length} livraisons terminées`, ""],
        ];

        const grid = document.querySelector(".stat-grid");
        if (grid) {
            grid.innerHTML = stats.map(([label, value, help, tone]) => `
                <article class="stat-card">
                    <span>${label}</span>
                    <strong>${value}</strong>
                    <small class="${tone}">${help}</small>
                </article>
            `).join("");
        }
    };

    const renderChart = () => {
        const chartHost = document.querySelector(".bar-chart");
        if (!chartHost || !window.Chart) return;
        chartHost.innerHTML = '<canvas id="salesChart" aria-label="Ventes du mois"></canvas>';
        const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"];
        const values = labels.map((_, index) => data.orders
            .filter((order) => {
                const date = new Date(`${String(order.deliveryDate || order.createdAt).slice(0, 10)}T00:00:00`);
                return date.getFullYear() === currentYear && date.getMonth() === index;
            })
            .reduce((sum, order) => sum + Number(order.total || 0), 0));

        new Chart(document.getElementById("salesChart"), {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Ventes",
                    data: values,
                    backgroundColor: "rgba(167, 102, 63, 0.78)",
                    borderColor: "#5a3523",
                    borderWidth: 1,
                    borderRadius: 8,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (item) => AppData.money(item.parsed.y) } },
                },
                scales: {
                    y: { ticks: { callback: (value) => `${Number(value).toLocaleString("fr-FR")} FCFA` } },
                },
            },
        });
    };

    const renderCalendar = () => {
        const calendar = document.querySelector(".calendar-mini");
        if (!calendar) return;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const days = new Date(year, month + 1, 0).getDate();
        const offset = (firstDay.getDay() + 6) % 7;
        const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
        const blanks = Array.from({ length: offset }, () => '<span class="calendar-empty"></span>').join("");
        const buttons = Array.from({ length: days }, (_, index) => {
            const day = index + 1;
            return `<button class="${day === now.getDate() ? "active" : ""}" type="button">${day}</button>`;
        }).join("");
        calendar.innerHTML = labels.map((label) => `<span>${label}</span>`).join("") + blanks + buttons;
    };

    const renderLists = () => {
        const stockList = document.querySelector(".stock-list");
        if (stockList) {
            stockList.innerHTML = data.stock.slice(0, 5).map((item) => {
                const low = Number(item.quantity) <= Number(item.threshold || 0);
                return `<div class="${low ? "low" : ""}"><span>${item.name}</span><b>${item.quantity} ${item.unit}</b></div>`;
            }).join("");
        }

        const notifications = document.querySelector(".notification-stack");
        if (notifications) {
            notifications.innerHTML = AppData.getNotifications(data).slice(0, 4).map((item) => `
                <div class="notice ${item.level === "danger" ? "urgent" : ""}">${item.text}</div>
            `).join("");
        }

        const activity = document.querySelector(".activity-list");
        if (activity) {
            activity.innerHTML = data.orders.slice(0, 4).map((order) => `
                <li><span></span>${order.client} - ${order.produit} : ${order.status}</li>
            `).join("");
        }

        const tbody = document.querySelector(".dashboard-orders tbody");
        if (tbody) {
            tbody.innerHTML = data.orders.slice(0, 5).map((order) => `
                <tr>
                    <td>${order.client}</td>
                    <td>${order.produit}</td>
                    <td>${AppData.money(order.total)}</td>
                    <td>${AppData.formatDate(order.deliveryDate)}</td>
                    <td>${badge(order.status)}</td>
                </tr>
            `).join("");
        }
    };

    const initPageDate = () => {
        const update = document.querySelector(".page-update");
        if (update) update.textContent = `Mis à jour : ${new Date().toLocaleDateString("fr-FR")}`;
    };

    initPageDate();
    renderStats();
    renderChart();
    renderCalendar();
    renderLists();
})();
