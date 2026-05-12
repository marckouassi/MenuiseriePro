(function () {
    const storageKey = "menuiseriepro-business-v2";
    const statusCycle = ["En attente", "En cours", "Terminée", "Livrée"];

    const todayIso = () => new Date().toISOString().slice(0, 10);
    const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const parseMoney = (value) => Number(String(value || "0").replace(/[^\d-]/g, "")) || 0;
    const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;
    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
    };

    const defaultState = () => ({
        stock: [
            { id: "mat-bois", name: "Bois", unit: "m3", quantity: 42, threshold: 10, supplier: "Bois Ivoire", entries: 54, outputs: 12 },
            { id: "mat-teck", name: "Teck", unit: "m3", quantity: 18, threshold: 7, supplier: "Atlas Matériaux", entries: 24, outputs: 6 },
            { id: "mat-vernis", name: "Vernis mat", unit: "pots", quantity: 3, threshold: 5, supplier: "ColorBois", entries: 12, outputs: 9 },
            { id: "mat-contreplaque", name: "Contreplaqué", unit: "m3", quantity: 5, threshold: 6, supplier: "Atelier Plus", entries: 16, outputs: 11 },
        ],
        orders: [
            { id: "MP-238", client: "Kouadio Marc", produit: "Cuisine complète", total: 1850000, status: "Livrée", dueDate: todayIso(), deliveryDate: todayIso(), createdAt: new Date().toISOString() },
            { id: "MP-239", client: "Aminata Koné", produit: "Armoire 4 portes", total: 420000, status: "En attente", dueDate: todayIso(), deliveryDate: todayIso(), createdAt: new Date().toISOString() },
            { id: "MP-240", client: "Studio Nova", produit: "Comptoir accueil", total: 950000, status: "En cours", dueDate: todayIso(), deliveryDate: todayIso(), createdAt: new Date().toISOString() },
        ],
        payments: [
            { id: "pay-1", orderId: "MP-238", amount: 1850000, date: todayIso(), method: "Virement", note: "Solde cuisine complète" },
            { id: "pay-2", orderId: "MP-239", amount: 150000, date: todayIso(), method: "Espèces", note: "Acompte armoire" },
        ],
        expenses: [
            { id: "exp-1", date: todayIso(), type: "Dépense", description: "Achat bois", amount: 980000, status: "Comptabilisé" },
        ],
        documents: [],
        notifications: [],
        history: [],
    });

    const normalizeStatus = (status) => {
        const value = String(status || "").toLowerCase();
        if (value.includes("livr") || value.includes("pay")) return "Livrée";
        if (value.includes("termin") || value.includes("prêt")) return "Terminée";
        if (value.includes("cours") || value.includes("fabric") || value.includes("production")) return "En cours";
        return "En attente";
    };

    const orderClient = (data, order) => {
        if (order.client) return order.client;
        return data.clients?.find((item) => item.id === order.clientId)?.name || "Client inconnu";
    };

    const orderProduct = (data, order) => {
        if (order.produit) return order.produit;
        const product = data.products?.find((item) => item.id === order.productId);
        return `${product?.name || "Produit inconnu"}${order.quantity ? ` x${order.quantity}` : ""}`;
    };

    const normalizeState = (raw) => {
        const base = defaultState();
        const data = raw && typeof raw === "object" ? { ...base, ...raw } : base;
        data.orders = Array.isArray(data.orders) ? data.orders.map((order, index) => ({
            id: order.id || `MP-${241 + index}`,
            client: orderClient(data, order),
            produit: orderProduct(data, order),
            total: Number(order.total || parseMoney(order.prix)),
            status: normalizeStatus(order.status || order.statut),
            dueDate: String(order.dueDate || order.deliveryDate || order.date || todayIso()).slice(0, 10),
            deliveryDate: String(order.deliveryDate || order.dueDate || order.date || todayIso()).slice(0, 10),
            createdAt: order.createdAt || new Date().toISOString(),
        })) : base.orders;
        data.stock = Array.isArray(data.stock) ? data.stock : base.stock;
        data.payments = Array.isArray(data.payments) ? data.payments : base.payments;
        data.expenses = Array.isArray(data.expenses) ? data.expenses : base.expenses;
        data.documents = Array.isArray(data.documents) ? data.documents : [];
        data.notifications = Array.isArray(data.notifications) ? data.notifications : [];
        data.history = Array.isArray(data.history) ? data.history : [];
        return data;
    };

    const load = () => {
        try {
            return normalizeState(JSON.parse(localStorage.getItem(storageKey)));
        } catch {
            return normalizeState();
        }
    };

    const save = (data) => localStorage.setItem(storageKey, JSON.stringify(normalizeState(data)));

    const getNotifications = (data) => {
        const today = new Date(`${todayIso()}T00:00:00`);
        const lateOrders = data.orders.filter((order) => normalizeStatus(order.status) !== "Livrée" && new Date(`${order.dueDate}T00:00:00`) < today);
        const lowStock = data.stock.filter((item) => Number(item.quantity) <= Number(item.threshold || 0));
        return [
            ...lateOrders.map((order) => ({ level: "danger", text: `${order.id} en retard pour ${order.client}` })),
            ...lowStock.map((item) => ({ level: Number(item.quantity) <= 0 ? "danger" : "warning", text: `Stock faible : ${item.name} (${item.quantity} ${item.unit})` })),
            { level: "info", text: `${data.orders.filter((order) => order.status === "En cours").length} commandes en fabrication` },
        ];
    };

    window.AppData = {
        statusCycle,
        storageKey,
        todayIso,
        makeId,
        parseMoney,
        money,
        formatDate,
        normalizeStatus,
        load,
        save,
        getNotifications,
    };
})();
