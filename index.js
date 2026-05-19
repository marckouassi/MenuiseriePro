const pageNames = {
    dashboard: "Tableau de bord",
    stocks: "Stocks",
    commandes: "Commandes",
    clients: "Clients",
    produits: "Produits",
    fournisseurs: "Fournisseurs",
    paiements: "Paiements",
    factures: "Factures / Devis",
    finances: "Finances",
    employes: "Employés",
    notifications: "Notifications",
    parametres: "Paramètres",
};

const navItems = [
    { id: "dashboard", label: "Tableau de bord", href: "index.php", icon: "layout-dashboard" },
    { id: "stocks", label: "Stocks", href: "stocks.php", icon: "boxes" },
    { id: "commandes", label: "Commandes", href: "commandes.php", icon: "clipboard-list" },
    { id: "clients", label: "Clients", href: "clients.php", icon: "users" },
    { id: "produits", label: "Produits", href: "produits.php", icon: "package-check" },
    { id: "paiements", label: "Paiements", href: "paiements.php", icon: "credit-card" },
    { id: "factures", label: "Factures / Devis", href: "factures.php", icon: "file-text" },
    { id: "fournisseurs", label: "Fournisseurs", href: "fournisseurs.php", icon: "truck" },
    { id: "finances", label: "Finances", href: "finances.php", icon: "wallet-cards" },
    { id: "employes", label: "Employés", href: "employes.php", icon: "id-card" },
    { id: "notifications", label: "Notifications", href: "notifications.php", icon: "bell-ring" },
    { id: "parametres", label: "Paramètres", href: "parametres.php", icon: "settings" },
];

const currentPage = document.body.dataset.page || "";

const showToast = (message) => {
    const oldToast = document.querySelector(".toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2200);
};

const refreshIcons = () => {
    if (window.lucide) {
        window.lucide.createIcons({ attrs: { "stroke-width": 2 } });
    }
};

const loadIcons = () => {
    if (window.lucide) {
        refreshIcons();
        return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/lucide@latest/dist/umd/lucide.min.js";
    script.defer = true;
    script.addEventListener("load", refreshIcons);
    document.head.appendChild(script);
};

const renderSidebar = () => {
    const sidebar = document.querySelector("[data-sidebar]");
    if (!sidebar) return;

    sidebar.innerHTML = `
        <a class="brand" href="index.php">
            <span class="brand-mark">MP</span>
            <span>MenuiseriePro</span>
        </a>

        <nav class="sidebar-nav">
            ${navItems.map((item) => `
                <a class="nav-link ${item.id === currentPage ? "active" : ""}" href="${item.href}">
                    <span class="nav-icon"><i data-lucide="${item.icon}"></i></span>
                    <span>${item.label}</span>
                </a>
            `).join("")}
        </nav>

        <div class="sidebar-footer">
            <span>Atelier d'Abidjan</span>
            <strong>Gestion simple</strong>
        </div>
    `;
};

const renderTopbar = () => {
    const topbar = document.querySelector("[data-topbar]");
    if (!topbar) return;

    topbar.innerHTML = `
        <button class="icon-btn mobile-menu" type="button" data-mobile-menu>
            <i data-lucide="menu"></i>
        </button>

        <div class="topbar-title">
            <strong>${pageNames[currentPage] || "MenuiseriePro"}</strong>
            <span>${new Date().toLocaleDateString("fr-FR")}</span>
        </div>

        <label class="search-box">
            <span><i data-lucide="search"></i></span>
            <input type="search" placeholder="Chercher dans MenuiseriePro...">
        </label>

        <div class="topbar-actions">
            <a class="icon-btn" href="notifications.php"><i data-lucide="bell"></i></a>
            <button class="icon-btn" type="button" data-theme-toggle><i data-lucide="sun-moon"></i></button>
            <a class="avatar" href="parametres.php"><img src="assets/icons/profil.png" alt=""></a>
            <a class="icon-btn" href="logout.php"><i data-lucide="log-out"></i></a>
        </div>
    `;
};

const initMobileMenu = () => {
    document.addEventListener("click", (event) => {
        if (event.target.closest("[data-mobile-menu]")) {
            document.body.classList.toggle("sidebar-open");
        }

        if (event.target.closest("[data-sidebar-overlay]")) {
            document.body.classList.remove("sidebar-open");
        }
    });
};

const initTheme = () => {
    const savedTheme = localStorage.getItem("menuiseriepro-theme");
    if (savedTheme === "dark") document.body.classList.add("dark");

    document.addEventListener("click", (event) => {
        if (event.target.closest("[data-theme-toggle]")) {
            document.body.classList.toggle("dark");
            localStorage.setItem(
                "menuiseriepro-theme",
                document.body.classList.contains("dark") ? "dark" : "light"
            );
        }
    });
};

const initTables = () => {
    const table = document.querySelector("[data-table]");
    if (!table) return;

    const search = document.querySelector("[data-table-search]");
    const filter = document.querySelector("[data-table-filter]");

    const applyFilters = () => {
        const rows = table.querySelectorAll("tbody tr");
        const query = search ? search.value.toLowerCase() : "";
        const filterValue = filter ? filter.value.toLowerCase() : "";

        rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            row.style.display =
                text.includes(query) && text.includes(filterValue) ? "" : "none";
        });
    };

    if (search) search.addEventListener("input", applyFilters);
    if (filter) filter.addEventListener("change", applyFilters);
};

<<<<<<< HEAD
=======
const statusClass = (status) => {
    const normalized = status.toLowerCase();
    if (normalized.includes("non payé") || normalized.includes("absent")) return "danger";
    if (normalized.includes("partiellement")) return "progress";
    if (normalized.includes("congé")) return "pending";
    if (normalized.includes("payé") || normalized.includes("livré") || normalized.includes("disponible") || normalized.includes("terminé") || normalized.includes("présent") || normalized.includes("validé")) return "done";
    if (normalized.includes("cours") || normalized.includes("fabrication") || normalized.includes("production")) return "progress";
    if (normalized.includes("manquant")) return "danger";
    return "pending";
};

const productImageForCategory = (category) => {
    const normalized = String(category || "").toLowerCase();
    if (normalized.includes("armoire")) return "assets/images/amoires.png";
    if (normalized.includes("table")) return "assets/images/table.png";
    if (normalized.includes("lit")) return "assets/images/lits.png";
    if (normalized.includes("cuisine")) return "assets/images/cuisines.png";
    if (normalized.includes("porte")) return "assets/images/porte.png";
    return "assets/images/meuble.png";
};

// Gère l'ouverture des modales et l'ajout rapide de lignes.
>>>>>>> f84d6b7402684e5695432cf7033c646a2ad514f8
const initModals = () => {
    document.querySelectorAll("[data-open-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(button.dataset.openModal);
            if (modal && typeof modal.showModal === "function") {
                const form = modal.querySelector("form");

                if (form && button.hasAttribute("data-reset-form")) {
                    form.reset();
                    form.querySelectorAll("input[type='hidden']").forEach((input) => {
                        input.value = "";
                    });
                }

                if (form) {
                    Object.entries(button.dataset).forEach(([key, value]) => {
                        if (!key.startsWith("field")) return;
                        const name = key
                            .slice(5)
                            .replace(/^[A-Z]/, (letter) => letter.toLowerCase())
                            .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                        const input = form.querySelector(`[name="${name}"]`);
                        if (input) input.value = value;
                    });
                }

                modal.showModal();
            }
        });
    });

    document.querySelectorAll(".modal .btn-secondary, .modal .icon-btn").forEach((button) => {
        button.addEventListener("click", () => {
            button.closest("dialog")?.close();
        });
    });
};

const initConfirmations = () => {
    document.querySelectorAll("[data-confirm]").forEach((link) => {
        link.addEventListener("click", (event) => {
            if (!window.confirm(link.dataset.confirm || "Confirmer cette action ?")) {
                event.preventDefault();
            }
        });
    });
};

<<<<<<< HEAD
renderSidebar();
renderTopbar();
loadIcons();
initMobileMenu();
initTheme();
initTables();
initModals();
initConfirmations();
=======
const initPageButtons = () => {
    document.querySelectorAll("[aria-label='Actualiser']").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".bar-chart span").forEach((bar) => {
                bar.style.height = `${Math.floor(42 + Math.random() * 52)}%`;
            });
            showToast("Graphique actualisé");
        });
    });

    document.querySelectorAll(".calendar-mini button").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".calendar-mini button").forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            showToast(`Date sélectionnée : ${button.textContent.trim()}`);
        });
    });

    document.querySelectorAll(".swatch").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".swatch").forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            const color = button.style.getPropertyValue("--swatch");
            if (color) document.documentElement.style.setProperty("--wood", color);
            showToast("Couleur appliquée");
        });
    });

    document.querySelectorAll(".catalog-card").forEach((card) => {
        card.addEventListener("click", () => {
            const title = card.querySelector("h3")?.textContent.trim() || "catégorie";
            const search = document.querySelector("[data-table-search]");
            if (search) {
                search.value = title;
                search.dispatchEvent(new Event("input"));
            }
            showToast(`Catégorie ${title}`);
        });
    });
};

// Donne un retour visuel aux boutons de la page Paramètres.
const initSettingsActions = () => {
    document.querySelectorAll("[data-settings-action]").forEach((button) => {
        button.addEventListener("click", () => showToast(button.dataset.settingsAction || "Paramètre mis à jour"));
    });
};

const businessStorageKey = "menuiseriepro-business-v2";

const orderStatuses = [
    "Devis créé",
    "Devis validé",
    "Production lancée",
    "En fabrication",
    "Prêt à livrer",
    "Livré",
    "Payé",
];

const rolePermissions = {
    administrateur: ["dashboard", "stocks", "commandes", "clients", "produits", "paiements", "factures", "historique", "fournisseurs", "finances", "employes", "notifications", "parametres"],
    gerant: ["dashboard", "stocks", "commandes", "clients", "produits", "paiements", "factures", "historique", "fournisseurs", "finances", "employes", "notifications", "parametres"],
    magasinier: ["dashboard", "stocks", "commandes", "produits", "fournisseurs", "notifications", "historique", "parametres"],
    ouvrier: ["dashboard", "commandes", "produits", "notifications", "parametres"],
};

const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;
const parseMoney = (value) => Number(String(value || "0").replace(/[^\d-]/g, "")) || 0;
const todayIso = () => new Date().toISOString().slice(0, 10);
const formatDate = (value) => value ? new Date(value).toLocaleDateString("fr-FR") : "-";
const makeId = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
const currentUserName = () => getSession()?.name || "Utilisateur";
const currentUserRole = () => getSession()?.role || "administrateur";

const businessDefaults = () => ({
    stock: [
        { id: "mat-bois", name: "Bois", unit: "m3", quantity: 42, threshold: 10, supplier: "Bois Ivoire", entries: 54, outputs: 12 },
        { id: "mat-vis", name: "Vis", unit: "boîtes", quantity: 18, threshold: 6, supplier: "ColorBois", entries: 28, outputs: 10 },
        { id: "mat-vernis", name: "Vernis", unit: "pots", quantity: 5, threshold: 6, supplier: "Atlas Matériaux", entries: 12, outputs: 7 },
        { id: "mat-colle", name: "Colle", unit: "pots", quantity: 9, threshold: 4, supplier: "Atelier Plus", entries: 15, outputs: 6 },
        { id: "mat-contreplaque", name: "Contreplaqué", unit: "m3", quantity: 7, threshold: 5, supplier: "Atlas Matériaux", entries: 16, outputs: 9 },
    ],
    products: [
        { id: "prd-porte", name: "Porte intérieure", category: "Portes", price: 75000, quantity: 14, image: "assets/images/porte.png", materials: [{ stockId: "mat-bois", quantity: 1.2 }, { stockId: "mat-vis", quantity: 0.2 }, { stockId: "mat-vernis", quantity: 0.5 }, { stockId: "mat-colle", quantity: 0.3 }] },
        { id: "prd-armoire", name: "Armoire 4 portes", category: "Armoires", price: 420000, quantity: 6, image: "assets/images/amoires.png", materials: [{ stockId: "mat-bois", quantity: 4 }, { stockId: "mat-vis", quantity: 0.8 }, { stockId: "mat-vernis", quantity: 1 }, { stockId: "mat-colle", quantity: 0.7 }] },
        { id: "prd-cuisine", name: "Cuisine complète", category: "Cuisines", price: 1850000, quantity: 3, image: "assets/images/cuisines.png", materials: [{ stockId: "mat-bois", quantity: 8 }, { stockId: "mat-contreplaque", quantity: 3 }, { stockId: "mat-vis", quantity: 1.5 }, { stockId: "mat-vernis", quantity: 2 }, { stockId: "mat-colle", quantity: 1.5 }] },
        { id: "prd-table", name: "Table repas", category: "Tables", price: 160000, quantity: 8, image: "assets/images/table.png", materials: [{ stockId: "mat-bois", quantity: 2 }, { stockId: "mat-vis", quantity: 0.4 }, { stockId: "mat-vernis", quantity: 0.6 }, { stockId: "mat-colle", quantity: 0.4 }] },
    ],
    clients: [
        { id: "cli-aminata", name: "Aminata Koné", phone: "+225 07 45 22 18", email: "aminata@mail.com", address: "Cocody", type: "Particulier" },
        { id: "cli-nova", name: "Studio Nova", phone: "+225 01 88 20 11", email: "contact@nova.ci", address: "Plateau", type: "Entreprise" },
        { id: "cli-kouadio", name: "Kouadio Marc", phone: "+225 05 13 87 30", email: "marc@mail.com", address: "Marcory", type: "Particulier" },
    ],
    orders: [
        { id: "MP-238", clientId: "cli-kouadio", productId: "prd-cuisine", quantity: 1, total: 1850000, deposit: 1850000, status: "Payé", paymentStatus: "payé", dueDate: "2026-05-08", deliveryDate: "2026-05-08", createdAt: "2026-05-07T09:30:00.000Z", stockReserved: true },
        { id: "MP-239", clientId: "cli-aminata", productId: "prd-armoire", quantity: 1, total: 420000, deposit: 150000, status: "En fabrication", paymentStatus: "partiellement payé", dueDate: "2026-05-12", deliveryDate: "2026-05-12", createdAt: "2026-05-08T08:00:00.000Z", stockReserved: true },
        { id: "MP-240", clientId: "cli-nova", productId: "prd-porte", quantity: 2, total: 150000, deposit: 0, status: "Devis créé", paymentStatus: "non payé", dueDate: "2026-05-15", deliveryDate: "2026-05-15", createdAt: "2026-05-08T11:10:00.000Z", stockReserved: false },
    ],
    payments: [
        { id: "pay-1", orderId: "MP-238", amount: 1850000, date: "2026-05-08", method: "Virement", note: "Solde cuisine complète" },
        { id: "pay-2", orderId: "MP-239", amount: 150000, date: "2026-05-08", method: "Espèces", note: "Acompte armoire" },
    ],
    suppliers: [
        { id: "sup-bois-ivoire", name: "Bois Ivoire", materials: "Chêne massif, teck, iroko", contact: "+225 07 20 48 10", address: "Yopougon zone industrielle", email: "contact@boisivoire.ci", purchases: 24, lastPurchase: "2026-05-08", total: 980000, notes: "Fournisseur principal pour les bois nobles et les plateaux massifs." },
        { id: "sup-atlas", name: "Atlas Matériaux", materials: "Contreplaqué, MDF, colle", contact: "+225 01 11 42 60", address: "Koumassi", email: "achats@atlas-materiaux.ci", purchases: 18, lastPurchase: "2026-05-06", total: 340000, notes: "Approvisionnement régulier en panneaux et consommables." },
        { id: "sup-colorbois", name: "ColorBois", materials: "Vernis mat, teintes, finitions", contact: "+225 05 70 30 42", address: "Marcory", email: "vente@colorbois.ci", purchases: 31, lastPurchase: "2026-05-04", total: 210000, notes: "Spécialiste finitions, vernis et produits de protection." },
    ],
    employees: [
        { id: "emp-awa", name: "Awa Diarra", role: "Chef d'atelier", salary: 420000, currentStatus: "Présent", tasks: "Contrôle qualité", phone: "+225 07 14 32 90", hiredAt: "2024-01-15", leaveUntil: "", attendance: [{ date: "2026-05-08", status: "Présent", note: "Contrôle qualité" }, { date: "2026-05-07", status: "Présent", note: "Validation cuisine" }, { date: "2026-05-06", status: "Absent", note: "Rendez-vous personnel" }, { date: "2026-05-05", status: "Présent", note: "Supervision atelier" }] },
        { id: "emp-yao", name: "Yao Serge", role: "Menuisier", salary: 280000, currentStatus: "Présent", tasks: "Cuisine Kouadio", phone: "+225 05 44 19 80", hiredAt: "2023-09-04", leaveUntil: "", attendance: [{ date: "2026-05-08", status: "Présent", note: "Cuisine Kouadio" }, { date: "2026-05-07", status: "Présent", note: "Découpe panneaux" }, { date: "2026-05-06", status: "Présent", note: "Assemblage" }, { date: "2026-05-05", status: "Congé", note: "Congé validé" }] },
        { id: "emp-nadia", name: "Nadia B.", role: "Commerciale", salary: 310000, currentStatus: "Absent", tasks: "Relances devis", phone: "+225 01 72 66 12", hiredAt: "2024-06-10", leaveUntil: "2026-05-10", attendance: [{ date: "2026-05-08", status: "Absent", note: "Absence signalée" }, { date: "2026-05-07", status: "Congé", note: "Congé administratif" }, { date: "2026-05-06", status: "Présent", note: "Relances devis" }, { date: "2026-05-05", status: "Présent", note: "Prospection" }] },
    ],
    expenses: [
        { id: "exp-1", date: "2026-05-08", type: "Dépense", description: "Achat chêne", amount: 980000, status: "Comptabilisé", supplierId: "sup-bois-ivoire", materials: "Chêne massif" },
        { id: "exp-2", date: "2026-05-06", type: "Dépense", description: "MDF et colle", amount: 340000, status: "Comptabilisé", supplierId: "sup-atlas", materials: "MDF, colle" },
        { id: "exp-3", date: "2026-05-04", type: "Dépense", description: "Vernis mat", amount: 210000, status: "Comptabilisé", supplierId: "sup-colorbois", materials: "Vernis mat" },
    ],
    documents: [
        { id: "doc-1", orderId: "MP-240", type: "Devis", number: "DEV-240", date: "2026-05-08", total: 150000 },
        { id: "doc-2", orderId: "MP-238", type: "Facture", number: "FAC-238", date: "2026-05-08", total: 1850000 },
    ],
    history: [
        { id: "his-1", user: "Admin MenuiseriePro", action: "Commande créée", target: "MP-240", date: "2026-05-08T11:10:00.000Z" },
        { id: "his-2", user: "Awa", action: "Stock mis à jour", target: "Bois", date: "2026-05-08T10:25:00.000Z" },
    ],
    notifications: [],
});

const loadBusiness = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(businessStorageKey));
        return saved && Array.isArray(saved.orders) ? { ...businessDefaults(), ...saved } : businessDefaults();
    } catch {
        return businessDefaults();
    }
};
const saveBusiness = (data) => localStorage.setItem(businessStorageKey, JSON.stringify(data));
const getClient = (data, id) => data.clients.find((item) => item.id === id) || { name: "Client inconnu" };
const getProduct = (data, id) => data.products.find((item) => item.id === id) || { name: "Produit inconnu", materials: [], price: 0 };
const getSupplier = (data, id) => data.suppliers?.find((item) => item.id === id) || { name: "Fournisseur inconnu", materials: "-", contact: "-" };
const getEmployee = (data, id) => data.employees?.find((item) => item.id === id) || { name: "Employé inconnu", role: "-", attendance: [] };
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[char]));
const paidForOrder = (data, orderId) => data.payments.filter((item) => item.orderId === orderId).reduce((sum, item) => sum + Number(item.amount || 0), 0);
const stockStatus = (item) => Number(item.quantity) <= 0 ? "Manquant" : Number(item.quantity) <= Number(item.threshold || 0) ? "Stock faible" : "Disponible";
const paymentStatusFor = (total, paid) => paid <= 0 ? "non payé" : paid >= total ? "payé" : "partiellement payé";
const logAction = (data, action, target) => data.history.unshift({ id: makeId("his"), user: currentUserName(), action, target, date: new Date().toISOString() });

const addNotification = (data, title, message, level = "info", target = "") => {
    if (!data.notifications.some((item) => item.title === title && item.message === message && !item.read)) {
        data.notifications.unshift({ id: makeId("not"), title, message, level, target, read: false, date: new Date().toISOString() });
    }
};

const refreshDerivedData = (data) => {
    data.orders.forEach((order) => {
        const paid = paidForOrder(data, order.id);
        order.deposit = paid;
        order.paymentStatus = paymentStatusFor(order.total, paid);
        if (order.paymentStatus === "payé" && order.status !== "Payé") order.status = "Payé";
    });
    data.stock.forEach((item) => {
        if (stockStatus(item) === "Stock faible") addNotification(data, "Stock faible", `${item.name} est sous le seuil minimum.`, "warning", item.name);
        if (stockStatus(item) === "Manquant") addNotification(data, "Stock manquant", `${item.name} est épuisé.`, "danger", item.name);
    });
    data.orders.forEach((order) => {
        const client = getClient(data, order.clientId);
        if (!["Livré", "Payé"].includes(order.status) && new Date(order.dueDate) < new Date(todayIso())) {
            addNotification(data, "Commande en retard", `${order.id} pour ${client.name} devait être livrée le ${formatDate(order.dueDate)}.`, "danger", order.id);
        }
        const daysBeforeDelivery = Math.ceil((new Date(order.deliveryDate) - new Date(todayIso())) / 86400000);
        if (!["Livré", "Payé"].includes(order.status) && daysBeforeDelivery >= 0 && daysBeforeDelivery <= 3) {
            addNotification(data, "Livraison prévue", `${order.id} pour ${client.name} est prévue le ${formatDate(order.deliveryDate)}.`, "info", order.id);
        }
        if (order.paymentStatus !== "payé" && order.deposit > 0) {
            addNotification(data, "Paiement à compléter", `${client.name} doit encore ${money(order.total - order.deposit)} sur ${order.id}.`, "warning", order.id);
        }
    });
};

const reserveMaterials = (data, productId, quantity, orderId) => {
    const product = getProduct(data, productId);
    const missing = product.materials.map((need) => {
        const stock = data.stock.find((item) => item.id === need.stockId);
        const required = Number(need.quantity) * Number(quantity);
        return stock && Number(stock.quantity) >= required ? null : `${stock?.name || "Matière"} : besoin ${required}, disponible ${stock?.quantity || 0}`;
    }).filter(Boolean);
    if (missing.length) return { ok: false, message: `Stock insuffisant. ${missing.join(" | ")}` };
    product.materials.forEach((need) => {
        const stock = data.stock.find((item) => item.id === need.stockId);
        const required = Number(need.quantity) * Number(quantity);
        stock.quantity = Number((Number(stock.quantity) - required).toFixed(2));
        stock.outputs = Number((Number(stock.outputs || 0) + required).toFixed(2));
        logAction(data, "Stock consommé", `${stock.name} pour ${orderId}`);
    });
    return { ok: true };
};

const canSeePage = () => (rolePermissions[currentUserRole()] || rolePermissions.administrateur).includes(currentPage);
const applyRoleSecurity = () => {
    const allowed = rolePermissions[currentUserRole()] || rolePermissions.administrateur;
    document.querySelectorAll(".nav-link").forEach((link) => {
        const item = navItems.find((nav) => link.getAttribute("href") === nav.href);
        if (item && !allowed.includes(item.id)) link.remove();
    });
    if (currentPage && !canSeePage()) {
        document.querySelector(".page-content")?.replaceChildren(Object.assign(document.createElement("section"), {
            className: "panel empty-state",
            innerHTML: "<h1>Accès limité</h1><p>Votre rôle ne permet pas d'ouvrir cette page.</p>",
        }));
    }
};

const statusBadge = (status) => `<span class="status ${statusClass(status)}">${status}</span>`;
const materialLabel = (data, material) => {
    const stock = data.stock.find((item) => item.id === material.stockId);
    return `${stock?.name || "Matière"} (${material.quantity} ${stock?.unit || ""})`;
};
const setLoading = (form, loading) => {
    form?.classList.toggle("is-loading", loading);
    form?.querySelectorAll("button, input, select, textarea").forEach((field) => field.disabled = loading);
};

const addDynamicFilters = (fields = []) => {
    const toolbar = document.querySelector(".toolbar");
    if (!toolbar || toolbar.dataset.enhanced) return;
    toolbar.dataset.enhanced = "true";
    fields.forEach((field) => toolbar.insertAdjacentHTML("beforeend", field));
};

const applyDynamicTableFilters = () => {
    const table = document.querySelector("[data-table]");
    if (!table) return;
    const search = document.querySelector("[data-table-search]");
    const filters = Array.from(document.querySelectorAll("[data-dynamic-filter]"));
    const dateFilter = document.querySelector("[data-date-filter]");
    const sort = document.querySelector("[data-table-sort]");
    const rows = Array.from(table.querySelectorAll("tbody tr")).filter((row) => !row.classList.contains("detail-row"));
    rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const dateValue = dateFilter?.value ? formatDate(dateFilter.value) : "";
        row.hidden = !((!search?.value || text.includes(search.value.trim().toLowerCase())) && filters.every((filter) => !filter.value || text.includes(filter.value.toLowerCase())) && (!dateValue || text.includes(dateValue)));
    });
    if (sort?.value) {
        const [index, type] = sort.value.split(":");
        const tbody = table.querySelector("tbody");
        rows.sort((a, b) => {
            const av = a.cells[Number(index)]?.textContent.trim() || "";
            const bv = b.cells[Number(index)]?.textContent.trim() || "";
            if (type === "money") return parseMoney(av) - parseMoney(bv);
            if (type === "date") return new Date(av.split("/").reverse().join("-")) - new Date(bv.split("/").reverse().join("-"));
            return av.localeCompare(bv, "fr");
        }).forEach((row) => tbody.appendChild(row));
    }
};
const bindDynamicFilters = () => document.querySelectorAll("[data-table-search], [data-dynamic-filter], [data-date-filter], [data-table-sort]").forEach((field) => {
    field.addEventListener("input", applyDynamicTableFilters);
    field.addEventListener("change", applyDynamicTableFilters);
});


const ensureDetailModal = () => {
    let modal = document.getElementById("detailModal");
    if (modal) return modal;
    modal = document.createElement("dialog");
    modal.id = "detailModal";
    modal.className = "modal detail-modal";
    modal.innerHTML = `<div class="modal-card detail-card"><div class="panel-header"><h2 data-detail-title>Détails</h2><button class="icon-btn" type="button" data-close-detail aria-label="Fermer"><i data-lucide="x"></i></button></div><div data-detail-content></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector("[data-close-detail]").addEventListener("click", () => modal.close());
    refreshIcons();
    return modal;
};

const openDetailModal = (title, content) => {
    const modal = ensureDetailModal();
    modal.querySelector("[data-detail-title]").textContent = title;
    modal.querySelector("[data-detail-content]").innerHTML = content;
    modal.showModal();
};

const clientDetailHtml = (data, client) => {
    const orders = data.orders.filter((order) => order.clientId === client.id);
    const payments = orders.flatMap((order) => data.payments.filter((pay) => pay.orderId === order.id).map((pay) => ({ ...pay, order })));
    const total = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const paid = payments.reduce((sum, pay) => sum + Number(pay.amount || 0), 0);
    return `<div class="detail-summary-grid"><article><span>Client</span><strong>${escapeHtml(client.name)}</strong><small>${escapeHtml(client.type)}</small></article><article><span>Total commandes</span><strong>${money(total)}</strong><small>${orders.length} commande${orders.length > 1 ? "s" : ""}</small></article><article><span>Payé</span><strong>${money(paid)}</strong><small>Reste ${money(total - paid)}</small></article></div><div class="detail-info-grid"><p><b>Téléphone :</b> ${escapeHtml(client.phone)}</p><p><b>Email :</b> ${escapeHtml(client.email)}</p><p><b>Adresse :</b> ${escapeHtml(client.address)}</p></div><h3>Commandes du client</h3><div class="table-wrap"><table class="detail-table"><thead><tr><th>Commande</th><th>Produit</th><th>Livraison</th><th>Total</th><th>Statut</th></tr></thead><tbody>${orders.map((order) => `<tr><td>${escapeHtml(order.id)}</td><td>${escapeHtml(getProduct(data, order.productId).name)} x${order.quantity}</td><td>${formatDate(order.deliveryDate)}</td><td>${money(order.total)}</td><td>${statusBadge(order.status)}</td></tr>`).join("") || `<tr><td colspan="5">Aucune commande enregistrée.</td></tr>`}</tbody></table></div><h3>Paiements liés</h3><div class="detail-list">${payments.map((pay) => `<div><span>${formatDate(pay.date)} · ${escapeHtml(pay.method)}</span><strong>${money(pay.amount)}</strong><small>${escapeHtml(pay.note)} (${escapeHtml(pay.order.id)})</small></div>`).join("") || `<p>Aucun paiement enregistré pour ce client.</p>`}</div>`;
};

const supplierDetailHtml = (data, supplier) => {
    const purchases = data.expenses.filter((expense) => expense.supplierId === supplier.id || expense.description?.toLowerCase().includes(String(supplier.materials).split(",")[0].trim().toLowerCase()));
    const total = purchases.reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0) || Number(supplier.total || 0);
    return `<div class="detail-summary-grid"><article><span>Fournisseur</span><strong>${escapeHtml(supplier.name)}</strong><small>${escapeHtml(supplier.contact)}</small></article><article><span>Achats</span><strong>${supplier.purchases || purchases.length}</strong><small>Dernier achat : ${formatDate(supplier.lastPurchase)}</small></article><article><span>Total fourni</span><strong>${money(total)}</strong><small>${escapeHtml(supplier.materials)}</small></article></div><div class="detail-info-grid"><p><b>Contact :</b> ${escapeHtml(supplier.contact)}</p><p><b>Email :</b> ${escapeHtml(supplier.email || "-")}</p><p><b>Adresse :</b> ${escapeHtml(supplier.address || "-")}</p><p><b>Note :</b> ${escapeHtml(supplier.notes || "-")}</p></div><h3>Ce qu'il a fourni</h3><div class="table-wrap"><table class="detail-table"><thead><tr><th>Date</th><th>Matériaux</th><th>Description</th><th>Montant</th><th>Statut</th></tr></thead><tbody>${purchases.map((purchase) => `<tr><td>${formatDate(purchase.date)}</td><td>${escapeHtml(purchase.materials || supplier.materials)}</td><td>${escapeHtml(purchase.description)}</td><td>${money(purchase.amount)}</td><td>${statusBadge(purchase.status)}</td></tr>`).join("") || `<tr><td>${formatDate(supplier.lastPurchase)}</td><td>${escapeHtml(supplier.materials)}</td><td>Approvisionnement fournisseur</td><td>${money(supplier.total)}</td><td>${statusBadge("Comptabilisé")}</td></tr>`}</tbody></table></div>`;
};


const employeeDetailHtml = (employee) => {
    const attendance = Array.isArray(employee.attendance) ? employee.attendance : [];
    const presentCount = attendance.filter((item) => item.status === "Présent").length;
    const absentCount = attendance.filter((item) => item.status === "Absent").length;
    const leaveCount = attendance.filter((item) => item.status === "Congé").length;
    const leaveText = employee.currentStatus === "Congé" || employee.leaveUntil
        ? `Oui${employee.leaveUntil ? `, jusqu'au ${formatDate(employee.leaveUntil)}` : ""}`
        : "Non";
    return `<div class="detail-summary-grid"><article><span>Employé</span><strong>${escapeHtml(employee.name)}</strong><small>${escapeHtml(employee.role)}</small></article><article><span>Statut actuel</span><strong>${statusBadge(employee.currentStatus || "Présent")}</strong><small>En congé : ${escapeHtml(leaveText)}</small></article><article><span>Salaire</span><strong>${money(employee.salary)}</strong><small>Depuis le ${formatDate(employee.hiredAt)}</small></article></div><div class="detail-info-grid"><p><b>Téléphone :</b> ${escapeHtml(employee.phone || "-")}</p><p><b>Tâches assignées :</b> ${escapeHtml(employee.tasks || "-")}</p><p><b>Présences :</b> ${presentCount}</p><p><b>Absences :</b> ${absentCount} · <b>Congés :</b> ${leaveCount}</p></div><h3>Liste de présence, absence et congé</h3><div class="table-wrap"><table class="detail-table"><thead><tr><th>Date</th><th>Statut</th><th>Observation / tâche</th></tr></thead><tbody>${attendance.map((item) => `<tr><td>${formatDate(item.date)}</td><td>${statusBadge(item.status)}</td><td>${escapeHtml(item.note || "-")}</td></tr>`).join("") || `<tr><td colspan="3">Aucun historique de présence enregistré.</td></tr>`}</tbody></table></div>`;
};

const paymentDocumentHtml = (data, order) => {
    const client = getClient(data, order.clientId);
    const product = getProduct(data, order.productId);
    const payments = data.payments.filter((pay) => pay.orderId === order.id);
    const paid = paidForOrder(data, order.id);
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Détails paiement ${escapeHtml(order.id)}</title><style>body{margin:0;background:#e7e2d8;font-family:Arial,sans-serif;color:#1d1a16}.toolbar{position:sticky;top:0;padding:14px 24px;background:#27211b;color:#fff;display:flex;gap:10px;justify-content:flex-end}.toolbar button{border:0;border-radius:6px;padding:10px 14px;font-weight:700;cursor:pointer}.page{width:210mm;min-height:297mm;margin:24px auto;padding:24mm;background:#fff;box-shadow:0 12px 35px rgba(0,0,0,.18)}.head{display:flex;justify-content:space-between;border-bottom:3px solid #a7663f;padding-bottom:18px}.brand{font-size:28px;font-weight:800;color:#5a3523}.meta{text-align:right;color:#666}.stamp{display:inline-block;margin-top:8px;padding:7px 12px;border:2px solid #486b57;color:#486b57;border-radius:999px;font-weight:800;text-transform:uppercase}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}.box{border:1px solid #ded6c8;border-radius:10px;padding:14px}.box span{display:block;color:#756f67;font-size:12px;text-transform:uppercase;font-weight:800}.box strong{display:block;margin-top:6px;font-size:18px}table{width:100%;border-collapse:collapse;margin-top:14px}th,td{border-bottom:1px solid #ded6c8;padding:12px;text-align:left}th{background:#fbf7ef;color:#756f67;text-transform:uppercase;font-size:12px}.total{margin-left:auto;width:45%;margin-top:20px}.total div{display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #ded6c8}.total .rest{font-size:20px;font-weight:800;color:#b64a3d}.foot{margin-top:42px;display:grid;grid-template-columns:1fr 1fr;gap:38px}.sign{border-top:1px solid #1d1a16;padding-top:10px;text-align:center;color:#756f67}@media print{body{background:#fff}.toolbar{display:none}.page{margin:0;box-shadow:none;width:auto;min-height:auto}}</style></head><body><div class="toolbar"><button onclick="downloadWord()">Télécharger Word</button><button onclick="print()">Imprimer</button></div><main class="page" id="wordPage"><section class="head"><div><div class="brand">MenuiseriePro</div><p>Atelier d'Abidjan · Gestion des paiements clients</p></div><div class="meta"><b>FICHE PAIEMENT</b><br>Commande ${escapeHtml(order.id)}<br>${formatDate(todayIso())}<br><span class="stamp">${escapeHtml(order.paymentStatus)}</span></div></section><section class="grid"><div class="box"><span>Client</span><strong>${escapeHtml(client.name)}</strong><p>${escapeHtml(client.phone)}<br>${escapeHtml(client.email)}<br>${escapeHtml(client.address)}</p></div><div class="box"><span>Commande</span><strong>${escapeHtml(product.name)} x${order.quantity}</strong><p>Livraison : ${formatDate(order.deliveryDate)}<br>Statut : ${escapeHtml(order.status)}</p></div><div class="box"><span>Total commande</span><strong>${money(order.total)}</strong></div><div class="box"><span>Montant encaissé</span><strong>${money(paid)}</strong></div></section><h2>Historique des paiements</h2><table><thead><tr><th>Date</th><th>Méthode</th><th>Note</th><th>Montant</th></tr></thead><tbody>${payments.map((pay) => `<tr><td>${formatDate(pay.date)}</td><td>${escapeHtml(pay.method)}</td><td>${escapeHtml(pay.note)}</td><td>${money(pay.amount)}</td></tr>`).join("") || `<tr><td colspan="4">Aucun paiement encaissé.</td></tr>`}</tbody></table><section class="total"><div><span>Total</span><b>${money(order.total)}</b></div><div><span>Payé</span><b>${money(paid)}</b></div><div class="rest"><span>Reste</span><b>${money(order.total - paid)}</b></div></section><section class="foot"><div class="sign">Signature client</div><div class="sign">Signature MenuiseriePro</div></section></main><script>function downloadWord(){const html='<!DOCTYPE html>'+document.documentElement.outerHTML;const blob=new Blob(['\\ufeff',html],{type:'application/msword'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='detail-paiement-${escapeHtml(order.id)}.doc';a.click();URL.revokeObjectURL(a.href)}<\/script></body></html>`;
};

const openPaymentDocument = (data, order) => {
    const win = window.open("", "_blank");
    if (!win) {
        showToast("Autorisez les pop-ups pour ouvrir la page Word du paiement.");
        return;
    }
    win.document.write(paymentDocumentHtml(data, order));
    win.document.close();
};

const renderDashboard = (data) => {
    if (currentPage !== "dashboard") return;
    const revenue = data.payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expenses = data.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const delivered = data.orders.filter((item) => ["Livré", "Payé"].includes(item.status)).length;
    const active = data.orders.filter((item) => !["Livré", "Payé"].includes(item.status)).length;
    const lowStock = data.stock.filter((item) => stockStatus(item) !== "Disponible").length;
    document.querySelector(".stat-grid")?.replaceChildren();
    const stats = document.querySelector(".stat-grid");
    if (stats) stats.innerHTML = `<article class="stat-card"><span>Chiffre d'affaires</span><strong>${money(revenue)}</strong><small class="positive">Paiements encaissés</small></article><article class="stat-card"><span>Bénéfice estimé</span><strong>${money(revenue - expenses)}</strong><small class="${revenue >= expenses ? "positive" : "warning"}">Après dépenses</small></article><article class="stat-card"><span>Dépenses</span><strong>${money(expenses)}</strong><small class="warning">Achats et charges</small></article><article class="stat-card"><span>Commandes en cours</span><strong>${active}</strong><small>${delivered} livrées/payées</small></article><article class="stat-card"><span>Stock restant</span><strong>${data.stock.reduce((sum, item) => sum + Number(item.quantity || 0), 0).toFixed(1)}</strong><small>${lowStock} alertes stock</small></article><article class="stat-card"><span>Factures / devis</span><strong>${data.documents.length}</strong><small>Documents générés</small></article>`;
    const stockList = document.querySelector(".stock-list");
    if (stockList) stockList.innerHTML = data.stock.slice(0, 5).map((item) => `<div class="${stockStatus(item) === "Disponible" ? "" : "low"}"><span>${item.name}</span><b>${item.quantity} ${item.unit}</b></div>`).join("");
    const activity = document.querySelector(".activity-list");
    if (activity) activity.innerHTML = data.history.slice(0, 5).map((item) => `<li><span></span>${item.action} : ${item.target}</li>`).join("");
    const stack = document.querySelector(".notification-stack");
    if (stack) stack.innerHTML = data.notifications.slice(0, 4).map((item) => `<div class="notice ${item.level === "danger" ? "urgent" : ""}">${item.title} : ${item.message}</div>`).join("");
    const tbody = document.querySelector(".panel-large table tbody");
    if (tbody) tbody.innerHTML = data.orders.slice(0, 5).map((order) => `<tr><td>${getClient(data, order.clientId).name}</td><td>${getProduct(data, order.productId).name}</td><td>${money(order.total)}</td><td>${formatDate(order.deliveryDate)}</td><td>${statusBadge(order.status)}</td></tr>`).join("");
};

const renderStocks = (data) => {
    if (currentPage !== "stocks") return;
    addDynamicFilters([`<select data-table-sort><option value="">Trier</option><option value="0:text">Matériau</option><option value="1:money">Quantité</option><option value="5:text">Statut</option></select>`]);
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.stock.map((item) => `<tr><td>${item.name}</td><td>${item.quantity} ${item.unit}</td><td>${item.supplier}</td><td>${item.entries} ${item.unit}</td><td>${item.outputs} ${item.unit}</td><td>${statusBadge(stockStatus(item))}</td><td><button class="mini-btn" data-stock-adjust="${item.id}">Entrée</button></td></tr>`).join("");
};

const renderProducts = (data) => {
    if (currentPage !== "produits") return;
    addDynamicFilters([`<select data-dynamic-filter><option value="">Toutes les catégories</option>${[...new Set(data.products.map((item) => item.category))].map((item) => `<option>${item}</option>`).join("")}</select>`, `<select data-table-sort><option value="">Trier</option><option value="0:text">Nom</option><option value="2:money">Prix</option><option value="3:money">Quantité</option></select>`]);
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.products.map((item) => `<tr><td>${item.name}</td><td>${item.category}</td><td>${money(item.price)}</td><td>${item.quantity}</td><td><img class="product-thumb" src="${item.image}" alt="${item.name}"></td><td><button class="mini-btn">Modifier</button></td></tr><tr class="detail-row"><td colspan="6"><strong>Matières premières :</strong> ${item.materials.map((mat) => materialLabel(data, mat)).join(", ")}</td></tr>`).join("");
};

const renderClients = (data) => {
    if (currentPage !== "clients") return;
    addDynamicFilters([`<select data-table-sort><option value="">Trier</option><option value="0:text">Client</option><option value="4:money">Commandes</option></select>`]);
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.clients.map((client) => {
        const count = data.orders.filter((order) => order.clientId === client.id).length;
        return `<tr><td>${client.name}</td><td>${client.phone}</td><td>${client.email}</td><td>${client.address}</td><td>${count} commande${count > 1 ? "s" : ""}</td><td>${client.type}</td><td><button class="mini-btn" data-view-client="${client.id}">Voir</button></td></tr>`;
    }).join("");
};

const renderOrders = (data) => {
    if (currentPage !== "commandes") return;
    const tabs = document.querySelector(".status-tabs");
    if (tabs) tabs.innerHTML = `<button class="active" data-status-filter="">Toutes</button>${orderStatuses.map((item) => `<button data-status-filter="${item}">${item}</button>`).join("")}`;
    addDynamicFilters([`<select data-dynamic-filter><option value="">Tous les clients</option>${data.clients.map((item) => `<option>${item.name}</option>`).join("")}</select>`, `<input type="date" data-date-filter aria-label="Filtrer par date">`, `<select data-table-sort><option value="">Trier</option><option value="0:text">Client</option><option value="2:money">Prix</option><option value="3:date">Date</option><option value="4:text">Statut</option></select>`]);
    const head = document.querySelector("[data-table] thead tr");
    if (head) head.innerHTML = "<th>Client</th><th>Produit</th><th>Prix</th><th>Livraison</th><th>Statut</th><th>Paiement</th><th>Actions</th>";
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.orders.map((order) => {
        const paid = paidForOrder(data, order.id);
        const next = orderStatuses[orderStatuses.indexOf(order.status) + 1];
        return `<tr><td>${getClient(data, order.clientId).name}</td><td>${getProduct(data, order.productId).name} x${order.quantity}</td><td>${money(order.total)}</td><td>${formatDate(order.deliveryDate)}</td><td>${statusBadge(order.status)}</td><td>${money(paid)} / ${money(order.total)}<br>${order.paymentStatus}</td><td><button class="mini-btn" data-next-status="${order.id}" ${!next ? "disabled" : ""}>${next || "Terminé"}</button><button class="mini-btn" data-doc="${order.id}">Document</button></td></tr>`;
    }).join("");
};



const renderEmployees = (data) => {
    if (currentPage !== "employes") return;
    if (!Array.isArray(data.employees)) data.employees = businessDefaults().employees;
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.employees.map((employee) => `<tr><td>${escapeHtml(employee.name)}</td><td>${escapeHtml(employee.role)}</td><td>${money(employee.salary)}</td><td>${statusBadge(employee.currentStatus || "Présent")}</td><td>${escapeHtml(employee.tasks || "-")}</td><td><button class="mini-btn" data-view-employee="${employee.id}">Voir détails</button></td></tr>`).join("");
};

const renderSuppliers = (data) => {
    if (currentPage !== "fournisseurs") return;
    if (!Array.isArray(data.suppliers)) data.suppliers = businessDefaults().suppliers;
    const grid = document.querySelector(".supplier-grid");
    if (grid) grid.innerHTML = data.suppliers.map((supplier) => `<article class="panel supplier-card"><h2>${escapeHtml(supplier.name)}</h2><p>${escapeHtml(supplier.materials)}</p><strong>${supplier.purchases || 0} achats</strong><span>${escapeHtml(supplier.contact)}</span><button class="mini-btn" data-view-supplier="${supplier.id}">Voir détails</button></article>`).join("");
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.suppliers.map((supplier) => `<tr><td>${escapeHtml(supplier.name)}</td><td>${escapeHtml(supplier.materials)}</td><td>${escapeHtml(supplier.contact)}</td><td>${formatDate(supplier.lastPurchase)}</td><td>${money(supplier.total)}</td><td><button class="mini-btn" data-view-supplier="${supplier.id}">Voir</button></td></tr>`).join("");
};

const renderPayments = (data) => {
    if (currentPage !== "paiements") return;
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.orders.map((order) => {
        const paid = paidForOrder(data, order.id);
        return `<tr><td>${order.id}</td><td>${getClient(data, order.clientId).name}</td><td>${money(order.total)}</td><td>${money(paid)}</td><td>${money(order.total - paid)}</td><td>${statusBadge(order.paymentStatus)}</td><td><button class="mini-btn" data-view-payment="${order.id}">Voir détails</button></td></tr>`;
    }).join("");
};

const renderDocuments = (data) => {
    if (currentPage !== "factures") return;
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.documents.map((doc) => {
        const order = data.orders.find((item) => item.id === doc.orderId);
        return `<tr><td>${doc.number}</td><td>${doc.type}</td><td>${order?.id || "-"}</td><td>${getClient(data, order?.clientId).name}</td><td>${formatDate(doc.date)}</td><td>${money(doc.total)}</td><td><button class="mini-btn" data-print-doc="${doc.id}">Imprimer</button></td></tr>`;
    }).join("");
};

const renderHistory = (data) => {
    if (currentPage !== "historique") return;
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) tbody.innerHTML = data.history.map((item) => `<tr><td>${item.user}</td><td>${item.action}</td><td>${formatDate(item.date)}</td><td>${item.target}</td></tr>`).join("");
};

const renderNotificationsBusiness = (data) => {
    if (currentPage !== "notifications") return;
    const list = document.querySelector(".notification-page-list");
    if (list) list.innerHTML = data.notifications.map((item) => `<article class="notification-item ${item.read ? "" : "unread"}"><span class="alert-dot ${item.level === "danger" ? "danger" : ""}"></span><div><h3>${item.title}</h3><p>${item.message}</p></div><small>${formatDate(item.date)}</small></article>`).join("") || `<article class="notification-item"><span class="alert-dot"></span><div><h3>Aucune notification</h3><p>Tout est à jour.</p></div><small>Aujourd'hui</small></article>`;
};

const renderFinances = (data) => {
    if (currentPage !== "finances") return;
    const revenue = data.payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expenses = data.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const cards = document.querySelector(".stat-grid");
    if (cards) cards.innerHTML = `<article class="stat-card"><span>Chiffre d'affaires</span><strong>${money(revenue)}</strong><small class="positive">Encaissé</small></article><article class="stat-card"><span>Dépenses</span><strong>${money(expenses)}</strong><small class="warning">Sorties</small></article><article class="stat-card"><span>Bénéfice</span><strong>${money(revenue - expenses)}</strong><small class="positive">Estimé</small></article><article class="stat-card"><span>Transactions</span><strong>${data.payments.length + data.expenses.length}</strong><small>Totales</small></article>`;
    const tbody = document.querySelector("[data-table] tbody");
    if (tbody) {
        const rows = [...data.payments.map((pay) => ({ date: pay.date, type: "Recette", description: `${pay.note} (${pay.orderId})`, amount: pay.amount, status: "Validé" })), ...data.expenses.map((exp) => ({ date: exp.date, type: "Dépense", description: exp.description, amount: exp.amount, status: exp.status }))].sort((a, b) => new Date(b.date) - new Date(a.date));
        tbody.innerHTML = rows.map((row) => `<tr><td>${formatDate(row.date)}</td><td>${row.type}</td><td>${row.description}</td><td>${money(row.amount)}</td><td>${statusBadge(row.status)}</td></tr>`).join("");
    }
};

const renderBusiness = (data) => {
    refreshDerivedData(data);
    saveBusiness(data);
    renderDashboard(data);
    renderStocks(data);
    renderProducts(data);
    renderClients(data);
    renderEmployees(data);
    renderSuppliers(data);
    renderOrders(data);
    renderPayments(data);
    renderDocuments(data);
    renderHistory(data);
    renderNotificationsBusiness(data);
    renderFinances(data);
    bindDynamicFilters();
    refreshIcons();
};

const enhanceForms = (data) => {
    const orderForm = document.querySelector('[data-add-row="order"]');
    if (orderForm) {
        orderForm.innerHTML = `<div class="panel-header"><h2>Nouvelle commande</h2><button class="icon-btn" value="cancel" type="submit" aria-label="Fermer"><i data-lucide="x"></i></button></div><label>Client<select name="clientId" required>${data.clients.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")}</select></label><label>Produit<select name="productId" required>${data.products.map((item) => `<option value="${item.id}">${item.name} - ${money(item.price)}</option>`).join("")}</select></label><label>Quantité<input name="quantity" type="number" min="1" value="1" required></label><label>Acompte payé<input name="deposit" inputmode="numeric" placeholder="Ex : 100000"></label><label>Livraison prévue<input name="deliveryDate" type="date" value="${todayIso()}" required></label><div class="modal-actions"><button class="btn btn-secondary" value="cancel" type="submit">Annuler</button><button class="btn btn-primary" type="submit">Enregistrer</button></div>`;
    }
    const productForm = document.querySelector('[data-add-row="product"]');
    if (productForm && !productForm.querySelector("[name='materials']")) productForm.querySelector("label:nth-of-type(4)")?.insertAdjacentHTML("afterend", `<label>Matières premières<input name="materials" required placeholder="Bois:1.2, Vis:0.2, Vernis:0.5"></label>`);
    refreshIcons();
};

const bindBusinessActions = (data) => {
    document.addEventListener("submit", (event) => {
        const form = event.target;
        if (!form.dataset.addRow && form.dataset.simpleToast === undefined) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (event.submitter?.value === "cancel") {
            form.reset();
            form.closest("dialog")?.close();
            showToast("Action annulée");
            return;
        }
        setLoading(form, true);
        window.setTimeout(() => {
            const formData = new FormData(form);
            try {
                if (form.dataset.addRow === "order") {
                    const product = getProduct(data, formData.get("productId"));
                    const quantity = Number(formData.get("quantity") || 1);
                    const order = { id: `MP-${241 + data.orders.length}`, clientId: formData.get("clientId"), productId: product.id, quantity, total: product.price * quantity, deposit: 0, status: "Devis créé", paymentStatus: "non payé", dueDate: formData.get("deliveryDate"), deliveryDate: formData.get("deliveryDate"), createdAt: new Date().toISOString(), stockReserved: false };
                    const reserved = reserveMaterials(data, order.productId, order.quantity, order.id);
                    if (!reserved.ok) throw new Error(reserved.message);
                    order.stockReserved = true;
                    data.orders.unshift(order);
                    const deposit = parseMoney(formData.get("deposit"));
                    if (deposit > 0) data.payments.unshift({ id: makeId("pay"), orderId: order.id, amount: Math.min(deposit, order.total), date: todayIso(), method: "Espèces", note: "Acompte" });
                    logAction(data, "Commande créée", order.id);
                    addNotification(data, "Nouvelle commande", `${order.id} créée pour ${getClient(data, order.clientId).name}.`, "info", order.id);
                }
                if (form.dataset.addRow === "stock") {
                    const quantityText = String(formData.get("quantite") || "");
                    const quantity = parseFloat(quantityText.replace(",", ".")) || 0;
                    const unit = quantityText.replace(/[0-9.,\s]/g, "") || "unité";
                    data.stock.unshift({ id: makeId("mat"), name: formData.get("materiau"), unit, quantity, threshold: Math.max(1, quantity * 0.2), supplier: formData.get("fournisseur"), entries: quantity, outputs: 0 });
                    logAction(data, "Stock ajouté", formData.get("materiau"));
                }
                if (form.dataset.addRow === "product") {
                    const materials = String(formData.get("materials") || "").split(",").map((part) => {
                        const [name, qty] = part.split(":").map((item) => item.trim());
                        let stock = data.stock.find((item) => item.name.toLowerCase() === name.toLowerCase());
                        if (!stock && name) {
                            stock = { id: makeId("mat"), name, unit: "unité", quantity: 0, threshold: 1, supplier: "À renseigner", entries: 0, outputs: 0 };
                            data.stock.push(stock);
                        }
                        return stock ? { stockId: stock.id, quantity: Number(String(qty).replace(",", ".")) || 1 } : null;
                    }).filter(Boolean);
                    data.products.unshift({ id: makeId("prd"), name: formData.get("nom"), category: formData.get("categorie"), price: parseMoney(formData.get("prix")), quantity: Number(formData.get("quantite") || 0), image: productImageForCategory(formData.get("categorie")), materials });
                    logAction(data, "Produit créé", formData.get("nom"));
                }
                if (currentPage === "clients" && form.dataset.simpleToast !== undefined) {
                    const values = Array.from(form.querySelectorAll("input")).map((field) => field.value.trim());
                    data.clients.unshift({ id: makeId("cli"), name: values[0], phone: values[1], email: values[2], address: values[3], type: "Particulier" });
                    logAction(data, "Client créé", values[0]);
                }
                if (currentPage === "employes" && form.dataset.simpleToast !== undefined) {
                    const values = Array.from(form.querySelectorAll("input, textarea")).map((field) => field.value.trim());
                    if (!Array.isArray(data.employees)) data.employees = [];
                    data.employees.unshift({ id: makeId("emp"), name: values[0], role: values[1], salary: parseMoney(values[2]), currentStatus: "Présent", tasks: values[3] || "À assigner", phone: "À renseigner", hiredAt: todayIso(), leaveUntil: "", attendance: [{ date: todayIso(), status: "Présent", note: values[3] || "Premier jour enregistré" }] });
                    logAction(data, "Employé créé", values[0]);
                }
                if (currentPage === "fournisseurs" && form.dataset.simpleToast !== undefined) {
                    const values = Array.from(form.querySelectorAll("input")).map((field) => field.value.trim());
                    if (!Array.isArray(data.suppliers)) data.suppliers = [];
                    data.suppliers.unshift({ id: makeId("sup"), name: values[0], materials: values[1], contact: values[2], address: "À renseigner", email: "-", purchases: 0, lastPurchase: todayIso(), total: 0, notes: "Nouveau fournisseur ajouté." });
                    logAction(data, "Fournisseur créé", values[0]);
                }
                if (currentPage === "finances" && form.dataset.simpleToast !== undefined) {
                    const values = Array.from(form.querySelectorAll("select, input")).map((field) => field.value.trim());
                    data.expenses.unshift({ id: makeId("exp"), date: todayIso(), type: values[0], description: values[1], amount: parseMoney(values[2]), status: "Comptabilisé" });
                    logAction(data, "Transaction ajoutée", values[1]);
                }
                form.closest("dialog")?.close();
                form.reset();
                renderBusiness(data);
                showToast("Informations enregistrées");
            } catch (error) {
                showToast(error.message || "Action impossible");
            } finally {
                setLoading(form, false);
            }
        }, 250);
    }, true);

    document.addEventListener("click", (event) => {
        const nextButton = event.target.closest("[data-next-status]");
        const docButton = event.target.closest("[data-doc]");
        const payButton = event.target.closest("[data-add-payment]");
        const printButton = event.target.closest("[data-print-doc]");
        const stockButton = event.target.closest("[data-stock-adjust]");
        const statusFilterButton = event.target.closest("[data-status-filter]");
        const clientDetailButton = event.target.closest("[data-view-client]");
        const supplierDetailButton = event.target.closest("[data-view-supplier]");
        const employeeDetailButton = event.target.closest("[data-view-employee]");
        const paymentDetailButton = event.target.closest("[data-view-payment]");
        if (clientDetailButton) {
            const client = getClient(data, clientDetailButton.dataset.viewClient);
            openDetailModal(`Détails du client - ${client.name}`, clientDetailHtml(data, client));
            return;
        }
        if (supplierDetailButton) {
            const supplier = getSupplier(data, supplierDetailButton.dataset.viewSupplier);
            openDetailModal(`Détails du fournisseur - ${supplier.name}`, supplierDetailHtml(data, supplier));
            return;
        }
        if (employeeDetailButton) {
            const employee = getEmployee(data, employeeDetailButton.dataset.viewEmployee);
            openDetailModal(`Détails de l'employé - ${employee.name}`, employeeDetailHtml(employee));
            return;
        }
        if (paymentDetailButton) {
            const order = data.orders.find((item) => item.id === paymentDetailButton.dataset.viewPayment);
            if (order) openPaymentDocument(data, order);
            return;
        }
        if (statusFilterButton) {
            document.querySelectorAll("[data-status-filter]").forEach((item) => item.classList.remove("active"));
            statusFilterButton.classList.add("active");
            const value = statusFilterButton.dataset.statusFilter.toLowerCase();
            document.querySelectorAll("[data-table] tbody tr").forEach((row) => {
                row.hidden = value ? !row.textContent.toLowerCase().includes(value) : false;
            });
        }
        if (nextButton) {
            const order = data.orders.find((item) => item.id === nextButton.dataset.nextStatus);
            const next = orderStatuses[orderStatuses.indexOf(order.status) + 1];
            if (next === "Payé" && order.paymentStatus !== "payé") return showToast("Le solde doit être payé avant de passer la commande en Payé.");
            order.status = next;
            logAction(data, "Statut modifié", `${order.id} -> ${next}`);
            renderBusiness(data);
            showToast(`Commande ${order.id} : ${next}`);
        }
        if (docButton) {
            const order = data.orders.find((item) => item.id === docButton.dataset.doc);
            const type = order.status === "Devis créé" ? "Devis" : "Facture";
            const doc = { id: makeId("doc"), orderId: order.id, type, number: `${type === "Devis" ? "DEV" : "FAC"}-${order.id.replace("MP-", "")}`, date: todayIso(), total: order.total };
            data.documents.unshift(doc);
            logAction(data, `${type} généré`, doc.number);
            renderBusiness(data);
            showToast(`${type} généré`);
        }
        if (payButton) {
            const order = data.orders.find((item) => item.id === payButton.dataset.addPayment);
            const paid = paidForOrder(data, order.id);
            const amount = parseMoney(prompt(`Montant à encaisser pour ${order.id}. Reste : ${money(order.total - paid)}`, String(order.total - paid)));
            if (amount <= 0) return;
            data.payments.unshift({ id: makeId("pay"), orderId: order.id, amount: Math.min(amount, order.total - paid), date: todayIso(), method: "Espèces", note: "Paiement client" });
            logAction(data, "Paiement ajouté", order.id);
            renderBusiness(data);
            showToast("Paiement enregistré");
        }
        if (printButton) {
            const doc = data.documents.find((item) => item.id === printButton.dataset.printDoc);
            const order = data.orders.find((item) => item.id === doc.orderId);
            const win = window.open("", "_blank");
            win.document.write(`<title>${doc.number}</title><body style="font-family:Arial;padding:32px"><h1>${doc.type} ${doc.number}</h1><p>Client : ${getClient(data, order.clientId).name}</p><p>Commande : ${order.id}</p><p>Produit : ${getProduct(data, order.productId).name} x${order.quantity}</p><h2>Total : ${money(doc.total)}</h2><script>print()<\/script></body>`);
            win.document.close();
            logAction(data, `${doc.type} imprimé`, doc.number);
            saveBusiness(data);
        }
        if (stockButton) {
            const stock = data.stock.find((item) => item.id === stockButton.dataset.stockAdjust);
            const qty = Number(prompt(`Entrée de stock pour ${stock.name} (${stock.unit})`, "1") || 0);
            if (qty <= 0) return;
            stock.quantity = Number((Number(stock.quantity) + qty).toFixed(2));
            stock.entries = Number((Number(stock.entries || 0) + qty).toFixed(2));
            logAction(data, "Stock modifié", stock.name);
            renderBusiness(data);
            showToast("Stock mis à jour");
        }
    });

    document.querySelector("[data-mark-read]")?.addEventListener("click", () => {
        data.notifications.forEach((item) => item.read = true);
        logAction(data, "Notifications lues", "Centre de notifications");
        renderBusiness(data);
    });
};

const initBusinessApp = () => {
    if (isPublicPage || ["dashboard", "commandes"].includes(currentPage)) return;
    applyRoleSecurity();
    if (!canSeePage()) return;
    const data = loadBusiness();
    refreshDerivedData(data);
    enhanceForms(data);
    renderBusiness(data);
    bindBusinessActions(data);
};

if (requireAuth()) {
    renderSidebar();
    renderTopbar();
    renderCurrentUser();
    loadIcons();
    initMobileMenu();
    initTheme();
    initTables();
    initModals();
    initNotifications();
    initAuthForms();
    initLogout();
    initNavigationControls();
    initPageButtons();
    initSettingsActions();
    initBusinessApp();
}
>>>>>>> f84d6b7402684e5695432cf7033c646a2ad514f8
