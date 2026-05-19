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

renderSidebar();
renderTopbar();
loadIcons();
initMobileMenu();
initTheme();
initTables();
initModals();
initConfirmations();
