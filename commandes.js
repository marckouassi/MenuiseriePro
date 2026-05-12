(function () {
    if (document.body.dataset.page !== "commandes" || !window.AppData) return;

    const data = AppData.load();
    let orders = data.orders;
    let activeStatus = "";
    let searchQuery = "";
    let sortState = { index: null, direction: 1 };

    const table = document.querySelector("[data-table]");
    const tbody = table?.querySelector("tbody");
    const searchInput = document.querySelector("[data-table-search]");
    const tabs = document.querySelector("[data-status-tabs]");
    const form = document.querySelector('[data-add-row="order"]');
    const modal = document.getElementById("orderModal");

    const statusClass = (status) => ({
        "En attente": "pending",
        "En cours": "progress",
        "Terminée": "finished",
        "Livrée": "done",
    }[AppData.normalizeStatus(status)] || "pending");

    const badge = (status) => `<span class="status ${statusClass(status)}">${AppData.normalizeStatus(status)}</span>`;

    const persist = () => {
        data.orders = orders;
        AppData.save(data);
    };

    const rowValue = (order, index) => [order.client, order.produit, order.total, order.deliveryDate, order.status][index] || "";

    const visibleOrders = () => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = orders.filter((order) => {
            const matchesStatus = !activeStatus || order.status === activeStatus;
            const matchesSearch = !query || `${order.client} ${order.produit}`.toLowerCase().includes(query);
            return matchesStatus && matchesSearch;
        });

        if (sortState.index !== null) {
            filtered.sort((a, b) => {
                const av = rowValue(a, sortState.index);
                const bv = rowValue(b, sortState.index);
                if (sortState.index === 2) return (Number(av) - Number(bv)) * sortState.direction;
                if (sortState.index === 3) return (new Date(av) - new Date(bv)) * sortState.direction;
                return String(av).localeCompare(String(bv), "fr") * sortState.direction;
            });
        }

        return filtered;
    };

    const render = () => {
        if (!tbody) return;
        tbody.innerHTML = visibleOrders().map((order) => `
            <tr data-order-id="${order.id}">
                <td>${order.client}</td>
                <td>${order.produit}</td>
                <td>${AppData.money(order.total)}</td>
                <td>${AppData.formatDate(order.deliveryDate)}</td>
                <td>${badge(order.status)}</td>
                <td>
                    <button class="mini-btn" data-follow-order="${order.id}">Suivre</button>
                    <button class="mini-btn danger" data-delete-order="${order.id}">Supprimer</button>
                </td>
            </tr>
        `).join("") || `<tr><td colspan="6">Aucune commande trouvée.</td></tr>`;
    };

    const openModal = () => {
        if (!modal) return;
        if (modal.open) return;
        if (typeof modal.showModal === "function") modal.showModal();
        else modal.style.display = "block";
    };

    const closeModal = () => {
        if (!modal) return;
        if (typeof modal.close === "function") modal.close();
        else modal.style.display = "none";
    };

    const initFilters = () => {
        if (tabs) {
            tabs.innerHTML = '<button class="active" data-status-filter="">Toutes</button>'
                + AppData.statusCycle.map((status) => `<button data-status-filter="${status}">${status}</button>`).join("");
        }

        tabs?.querySelectorAll("[data-status-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                tabs.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
                button.classList.add("active");
                activeStatus = button.dataset.statusFilter || "";
                render();
            });
        });

        searchInput?.addEventListener("input", () => {
            searchQuery = searchInput.value;
            render();
        });
    };

    const initSorting = () => {
        table?.querySelectorAll("th").forEach((header, index) => {
            if (index >= 5) return;
            header.tabIndex = 0;
            header.dataset.sortable = "true";
            header.addEventListener("click", () => {
                sortState = sortState.index === index
                    ? { index, direction: sortState.direction * -1 }
                    : { index, direction: 1 };
                table.querySelectorAll("th").forEach((item) => item.removeAttribute("aria-sort"));
                header.setAttribute("aria-sort", sortState.direction === 1 ? "ascending" : "descending");
                render();
            });
        });
    };

    const initActions = () => {
        document.querySelector('[data-open-modal="orderModal"]')?.addEventListener("click", openModal);

        form?.addEventListener("submit", (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (event.submitter?.value === "cancel") {
                form.reset();
                closeModal();
                return;
            }

            const values = new FormData(form);
            const order = {
                id: `MP-${Date.now().toString().slice(-5)}`,
                client: String(values.get("client") || "").trim(),
                produit: String(values.get("produit") || "").trim(),
                total: AppData.parseMoney(values.get("prix")),
                deliveryDate: values.get("date") || AppData.todayIso(),
                dueDate: values.get("date") || AppData.todayIso(),
                status: AppData.normalizeStatus(values.get("statut")),
                createdAt: new Date().toISOString(),
            };

            orders.unshift(order);
            persist();
            form.reset();
            closeModal();
            render();
        }, true);

        table?.addEventListener("click", (event) => {
            const deleteButton = event.target.closest("[data-delete-order]");
            const followButton = event.target.closest("[data-follow-order]");

            if (deleteButton) {
                orders = orders.filter((order) => order.id !== deleteButton.dataset.deleteOrder);
                persist();
                render();
                return;
            }

            if (followButton) {
                const order = orders.find((item) => item.id === followButton.dataset.followOrder);
                if (!order) return;
                const currentIndex = AppData.statusCycle.indexOf(order.status);
                order.status = AppData.statusCycle[(currentIndex + 1) % AppData.statusCycle.length];
                persist();
                render();
            }
        });
    };

    const initPageDate = () => {
        const update = document.querySelector(".page-update");
        if (update) update.textContent = `Mis à jour : ${new Date().toLocaleDateString("fr-FR")}`;
    };

    initPageDate();
    initFilters();
    initSorting();
    initActions();
    render();
})();
