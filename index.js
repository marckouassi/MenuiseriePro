const pageNames = {
    dashboard: "Tableau de bord",
    stocks: "Stocks",
    commandes: "Commandes",
    clients: "Clients",
    produits: "Produits",
    fournisseurs: "Fournisseurs",
    finances: "Finances",
    employes: "Employes",
    notifications: "Notifications",
    parametres: "Parametres",
};

const navItems = [
    { id: "dashboard", label: "Tableau de bord", href: "index.html", icon: "layout-dashboard" },
    { id: "stocks", label: "Stocks", href: "stocks.html", icon: "boxes" },
    { id: "commandes", label: "Commandes", href: "commandes.html", icon: "clipboard-list" },
    { id: "clients", label: "Clients", href: "clients.html", icon: "users" },
    { id: "produits", label: "Produits", href: "produits.html", icon: "package-check" },
    { id: "fournisseurs", label: "Fournisseurs", href: "fournisseurs.html", icon: "truck" },
    { id: "finances", label: "Finances", href: "finances.html", icon: "wallet-cards" },
    { id: "employes", label: "Employes", href: "employes.html", icon: "id-card" },
    { id: "notifications", label: "Notifications", href: "notifications.html", icon: "bell-ring" },
    { id: "parametres", label: "Parametres", href: "parametres.html", icon: "settings", image: "assets/icons/param%C3%A8tre.png" },
];

const currentPage = document.body.dataset.page || "";

// Affiche un petit message de confirmation apres une action.
const showToast = (message) => {
    const oldToast = document.querySelector(".toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(() => toast.remove(), 2200);
};

// Remplace les balises data-lucide par de vraies icones SVG.
const refreshIcons = () => {
    if (window.lucide) {
        window.lucide.createIcons({ attrs: { "stroke-width": 2 } });
    }
};

// Charge Lucide seulement une fois, puis initialise les icones.
const loadIcons = () => {
    if (window.lucide) {
        refreshIcons();
        return;
    }

    const existingScript = document.querySelector("[data-lucide-loader]");
    if (existingScript) {
        existingScript.addEventListener("load", refreshIcons, { once: true });
        return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/lucide@latest/dist/umd/lucide.min.js";
    script.defer = true;
    script.dataset.lucideLoader = "true";
    script.addEventListener("load", refreshIcons);
    document.head.appendChild(script);
};

// Construit le menu lateral commun a toutes les pages.
const renderSidebar = () => {
    const sidebar = document.querySelector("[data-sidebar]");
    if (!sidebar) return;

    sidebar.innerHTML = `
        <a class="brand" href="index.html" aria-label="MenuseriePro tableau de bord">
            <span class="brand-mark">MP</span>
            <span>MenuseriePro</span>
        </a>
        <nav class="sidebar-nav" aria-label="Navigation principale">
            ${navItems.map((item) => `
                <a class="nav-link ${item.id === currentPage ? "active" : ""}" href="${item.href}">
                    <span class="nav-icon">${item.image ? `<img src="${item.image}" alt="">` : `<i data-lucide="${item.icon}"></i>`}</span>
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

// Construit la barre du haut avec date, recherche, theme et profil.
const renderTopbar = () => {
    const topbar = document.querySelector("[data-topbar]");
    if (!topbar) return;

    topbar.innerHTML = `
        <button class="icon-btn mobile-menu" type="button" data-mobile-menu aria-label="Ouvrir le menu"><i data-lucide="menu"></i></button>
        <div class="topbar-title">
            <strong>${pageNames[currentPage] || "MenuseriePro"}</strong>
            <span>${new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
        <label class="search-box">
            <span><i data-lucide="search"></i></span>
            <input type="search" placeholder="Chercher dans MenuseriePro...">
        </label>
        <div class="topbar-actions">
            <a class="icon-btn" href="notifications.html" title="Notifications" aria-label="Notifications"><i data-lucide="bell"></i></a>
            <button class="icon-btn" type="button" data-theme-toggle title="Theme" aria-label="Changer le theme"><i data-lucide="sun-moon"></i></button>
            <a class="avatar" href="parametres.html" title="Profil administrateur" aria-label="Profil administrateur"><img src="assets/icons/profil.png" alt=""></a>
            <a class="icon-btn" href="login.html" title="Deconnexion" aria-label="Deconnexion"><i data-lucide="log-out"></i></a>
        </div>
    `;
};

// Ouvre et ferme le menu sur mobile.
const initMobileMenu = () => {
    document.querySelectorAll("[data-mobile-menu]").forEach((button) => {
        button.addEventListener("click", () => {
            document.body.classList.toggle("sidebar-open");
        });
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => document.body.classList.remove("sidebar-open"));
    });
};

// Sauvegarde le choix clair/sombre dans le navigateur.
const initTheme = () => {
    const savedTheme = localStorage.getItem("menuseriepro-theme");
    if (savedTheme === "dark") document.body.classList.add("dark");

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            localStorage.setItem("menuseriepro-theme", document.body.classList.contains("dark") ? "dark" : "light");
            showToast(document.body.classList.contains("dark") ? "Mode sombre" : "Mode clair");
        });
    });
};

// Gere la recherche, les filtres et la suppression dans les tableaux.
const initTables = () => {
    const table = document.querySelector("[data-table]");
    if (!table) return;

    const rows = Array.from(table.querySelectorAll("tbody tr"));
    const search = document.querySelector("[data-table-search]");
    const filter = document.querySelector("[data-table-filter]");
    const statusButtons = document.querySelectorAll("[data-status-filter]");

    const applyFilters = (statusValue = "") => {
        const query = search ? search.value.trim().toLowerCase() : "";
        const selectValue = filter ? filter.value.trim().toLowerCase() : "";
        const activeStatus = statusValue.trim().toLowerCase();

        rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            const matchesSearch = !query || text.includes(query);
            const matchesSelect = !selectValue || text.includes(selectValue);
            const matchesStatus = !activeStatus || text.includes(activeStatus);
            row.style.display = matchesSearch && matchesSelect && matchesStatus ? "" : "none";
        });
    };

    if (search) search.addEventListener("input", () => applyFilters());
    if (filter) filter.addEventListener("change", () => applyFilters());

    statusButtons.forEach((button) => {
        button.addEventListener("click", () => {
            statusButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            applyFilters(button.dataset.statusFilter || "");
        });
    });

    table.addEventListener("click", (event) => {
        const deleteButton = event.target.closest("[data-delete-row]");
        if (!deleteButton) return;
        deleteButton.closest("tr").remove();
        showToast("Ligne supprimee");
    });
};

const statusClass = (status) => {
    const normalized = status.toLowerCase();
    if (normalized.includes("livre") || normalized.includes("disponible") || normalized.includes("termine")) return "done";
    if (normalized.includes("cours")) return "progress";
    if (normalized.includes("manquant")) return "danger";
    return "pending";
};

// Gere l'ouverture des modales et l'ajout rapide de lignes.
const initModals = () => {
    document.querySelectorAll("[data-open-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(button.dataset.openModal);
            if (modal) modal.showModal();
        });
    });

    document.querySelectorAll("[data-add-row]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (event.submitter && event.submitter.value === "cancel") return;

            event.preventDefault();
            const type = form.dataset.addRow;
            const tableBody = document.querySelector("[data-table] tbody");
            if (!tableBody) return;

            const data = new FormData(form);
            const row = document.createElement("tr");

            if (type === "stock") {
                const statut = data.get("statut");
                row.innerHTML = `
                    <td>${data.get("materiau")}</td>
                    <td>${data.get("quantite")}</td>
                    <td>${data.get("fournisseur")}</td>
                    <td>${data.get("entrees")}</td>
                    <td>${data.get("sorties")}</td>
                    <td><span class="status ${statusClass(statut)}">${statut}</span></td>
                    <td><button class="mini-btn">Modifier</button><button class="mini-btn danger" data-delete-row>Supprimer</button></td>
                `;
            }

            if (type === "order") {
                const statut = data.get("statut");
                row.innerHTML = `
                    <td>${data.get("client")}</td>
                    <td>${data.get("produit")}</td>
                    <td>${data.get("prix")}</td>
                    <td>${data.get("date")}</td>
                    <td><span class="status ${statusClass(statut)}">${statut}</span></td>
                    <td><button class="mini-btn">Suivre</button><button class="mini-btn danger" data-delete-row>Supprimer</button></td>
                `;
            }

            tableBody.prepend(row);
            form.closest("dialog").close();
            form.reset();
            showToast("Element enregistre");
        });
    });

    document.querySelectorAll("[data-simple-toast]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (event.submitter && event.submitter.value === "cancel") return;

            event.preventDefault();
            const dialog = form.closest("dialog");
            if (dialog) dialog.close();
            if (form.tagName === "FORM") form.reset();
            showToast("Informations enregistrees");
        });
    });
};

// Marque les notifications comme lues.
const initNotifications = () => {
    const markRead = document.querySelector("[data-mark-read]");
    if (!markRead) return;

    markRead.addEventListener("click", () => {
        document.querySelectorAll(".notification-item.unread").forEach((item) => item.classList.remove("unread"));
        showToast("Notifications marquees comme lues");
    });
};

// Simule la validation des pages de connexion et inscription.
const initAuthForms = () => {
    document.querySelectorAll("[data-auth-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            showToast("Validation reussie");
            window.setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        });
    });
};

// Donne un retour visuel aux boutons de la page Parametres.
const initSettingsActions = () => {
    document.querySelectorAll("[data-settings-action]").forEach((button) => {
        button.addEventListener("click", () => showToast(button.dataset.settingsAction || "Parametre mis a jour"));
    });
};

renderSidebar();
renderTopbar();
loadIcons();
initMobileMenu();
initTheme();
initTables();
initModals();
initNotifications();
initAuthForms();
initSettingsActions();
