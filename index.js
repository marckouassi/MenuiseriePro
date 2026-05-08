const pageNames = {
    dashboard: "Tableau de bord",
    stocks: "Stocks",
    commandes: "Commandes",
    clients: "Clients",
    produits: "Produits",
    fournisseurs: "Fournisseurs",
    finances: "Finances",
    employes: "Employés",
    notifications: "Notifications",
    parametres: "Paramètres",
};

const navItems = [
    { id: "dashboard", label: "Tableau de bord", href: "index.html", icon: "layout-dashboard" },
    { id: "stocks", label: "Stocks", href: "stocks.html", icon: "boxes" },
    { id: "commandes", label: "Commandes", href: "commandes.html", icon: "clipboard-list" },
    { id: "clients", label: "Clients", href: "clients.html", icon: "users" },
    { id: "produits", label: "Produits", href: "produits.html", icon: "package-check" },
    { id: "fournisseurs", label: "Fournisseurs", href: "fournisseurs.html", icon: "truck" },
    { id: "finances", label: "Finances", href: "finances.html", icon: "wallet-cards" },
    { id: "employes", label: "Employés", href: "employes.html", icon: "id-card" },
    { id: "notifications", label: "Notifications", href: "notifications.html", icon: "bell-ring" },
    { id: "parametres", label: "Paramètres", href: "parametres.html", icon: "settings", image: "assets/icons/param%C3%A8tre.png" },
];

const currentPage = document.body.dataset.page || "";
const currentFile = window.location.pathname.split("/").pop() || "index.html";
const publicPages = ["login.html", "register.html", "forgot-password.html"];
const protectedPages = ["index.html", "stocks.html", "commandes.html", "clients.html", "produits.html", "fournisseurs.html", "finances.html", "employes.html", "notifications.html", "parametres.html"];
const authStorageKey = "menuiseriepro-users";
const sessionStorageKey = "menuiseriepro-session";
const hashIterations = 150000;

const isPublicPage = publicPages.includes(currentFile);
const getSession = () => {
    try {
        return JSON.parse(localStorage.getItem(sessionStorageKey));
    } catch {
        return null;
    }
};

const setSession = (user) => {
    localStorage.setItem(sessionStorageKey, JSON.stringify({
        name: user.name,
        email: user.email,
        connectedAt: new Date().toISOString(),
    }));
};

const clearSession = () => localStorage.removeItem(sessionStorageKey);

const getUsers = () => {
    try {
        const users = JSON.parse(localStorage.getItem(authStorageKey));
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
};

const saveUsers = (users) => {
    localStorage.setItem(authStorageKey, JSON.stringify(users));
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const bytesToBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));

const base64ToBytes = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

const hashPassword = async (password, salt = crypto.getRandomValues(new Uint8Array(16))) => {
    if (!window.crypto?.subtle) {
        throw new Error("Le chiffrement sécurisé n'est pas disponible dans ce navigateur.");
    }

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations: hashIterations, hash: "SHA-256" },
        keyMaterial,
        256
    );

    return {
        salt: bytesToBase64(salt),
        hash: bytesToBase64(bits),
        iterations: hashIterations,
        algorithm: "PBKDF2-SHA-256",
    };
};

const verifyPassword = async (password, user) => {
    const result = await hashPassword(password, base64ToBytes(user.salt));
    return result.hash === user.hash;
};

const requireAuth = () => {
    const session = getSession();
    if (!isPublicPage && !session) {
        window.location.replace(`login.html?next=${encodeURIComponent(currentFile)}`);
        return false;
    }
    if ((currentFile === "login.html" || currentFile === "register.html") && session) {
        window.location.replace("index.html");
        return false;
    }
    return true;
};

// Affiche un petit message de confirmation après une action.
const showToast = (message) => {
    const oldToast = document.querySelector(".toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(() => toast.remove(), 2200);
};

// Remplace les balises data-lucide par de vraies icônes SVG.
const refreshIcons = () => {
    if (window.lucide) {
        window.lucide.createIcons({ attrs: { "stroke-width": 2 } });
    }
};

// Charge Lucide seulement une fois, puis initialise les icônes.
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

// Construit le menu latéral commun à toutes les pages.
const renderSidebar = () => {
    const sidebar = document.querySelector("[data-sidebar]");
    if (!sidebar) return;

    sidebar.innerHTML = `
        <a class="brand" href="index.html" aria-label="Tableau de bord MenuiseriePro">
            <span class="brand-mark">MP</span>
            <span>MenuiseriePro</span>
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

// Construit la barre du haut avec date, recherche, thème et profil.
const renderTopbar = () => {
    const topbar = document.querySelector("[data-topbar]");
    if (!topbar) return;
    const session = getSession();
    const profileLabel = session ? `Profil de ${session.name}` : "Profil utilisateur";

    topbar.innerHTML = `
        <button class="icon-btn mobile-menu" type="button" data-mobile-menu aria-label="Ouvrir le menu"><i data-lucide="menu"></i></button>
        <div class="topbar-title">
            <strong>${pageNames[currentPage] || "MenuiseriePro"}</strong>
            <span>${new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
        <label class="search-box">
            <span><i data-lucide="search"></i></span>
            <input type="search" placeholder="Chercher dans MenuiseriePro...">
        </label>
        <div class="topbar-actions">
            <button class="icon-btn" type="button" data-back title="Retour" aria-label="Retour"><i data-lucide="arrow-left"></i></button>
            <a class="icon-btn" href="notifications.html" title="Notifications" aria-label="Notifications"><i data-lucide="bell"></i></a>
            <button class="icon-btn" type="button" data-theme-toggle title="Thème" aria-label="Changer le thème"><i data-lucide="sun-moon"></i></button>
            <a class="avatar" href="parametres.html" title="${profileLabel}" aria-label="${profileLabel}"><img src="assets/icons/profil.png" alt=""></a>
            <button class="icon-btn" type="button" data-logout title="Déconnexion" aria-label="Déconnexion"><i data-lucide="log-out"></i></button>
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
    const savedTheme = localStorage.getItem("menuiseriepro-theme");
    if (savedTheme === "dark") document.body.classList.add("dark");

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            localStorage.setItem("menuiseriepro-theme", document.body.classList.contains("dark") ? "dark" : "light");
            showToast(document.body.classList.contains("dark") ? "Mode sombre" : "Mode clair");
        });
    });
};

// Gère la recherche, les filtres et la suppression dans les tableaux.
const initTables = () => {
    const table = document.querySelector("[data-table]");
    if (!table) return;

    let rows = Array.from(table.querySelectorAll("tbody tr"));
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
        const cancelEditButton = event.target.closest("[data-cancel-edit-row]");
        if (cancelEditButton) {
            const row = cancelEditButton.closest("tr");
            const oldValues = JSON.parse(row.dataset.originalValues || "[]");
            Array.from(row.cells).slice(0, -1).forEach((cell, index) => {
                cell.innerHTML = oldValues[index] || "";
                cell.contentEditable = "false";
            });
            row.dataset.editing = "false";
            delete row.dataset.originalValues;
            const saveButton = Array.from(row.querySelectorAll(".mini-btn"))
                .find((item) => item.textContent.trim().toLowerCase() === "enregistrer");
            if (saveButton) saveButton.textContent = "Modifier";
            cancelEditButton.remove();
            showToast("Modification annulée");
            return;
        }

        const deleteButton = event.target.closest("[data-delete-row]");
        if (deleteButton) {
            deleteButton.closest("tr").remove();
            rows = Array.from(table.querySelectorAll("tbody tr"));
            showToast("Ligne supprimée");
            return;
        }

        const actionButton = event.target.closest(".mini-btn");
        if (!actionButton) return;

        const row = actionButton.closest("tr");
        const action = actionButton.textContent.trim().toLowerCase();
        const rowTitle = row?.cells[0]?.textContent.trim() || "ligne";

        if (action === "modifier" || action === "enregistrer") {
            const editableCells = Array.from(row.cells).slice(0, -1);
            const isEditing = row.dataset.editing === "true";
            editableCells.forEach((cell) => {
                cell.contentEditable = isEditing ? "false" : "true";
            });
            row.dataset.editing = isEditing ? "false" : "true";
            actionButton.textContent = isEditing ? "Modifier" : "Enregistrer";
            showToast(isEditing ? "Modification enregistrée" : `Modification de ${rowTitle}`);
            return;
        }

        if (action === "voir") {
            showToast(`Détails de ${rowTitle}`);
            return;
        }

        if (action === "suivre") {
            showToast(`Suivi de la commande ${rowTitle}`);
        }
    });

    table.addEventListener("row-added", () => {
        rows = Array.from(table.querySelectorAll("tbody tr"));
    });
};

const statusClass = (status) => {
    const normalized = status.toLowerCase();
    if (normalized.includes("livré") || normalized.includes("disponible") || normalized.includes("terminé") || normalized.includes("présent") || normalized.includes("validé")) return "done";
    if (normalized.includes("cours")) return "progress";
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
const initModals = () => {
    document.querySelectorAll("[data-open-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = document.getElementById(button.dataset.openModal);
            if (modal) modal.showModal();
        });
    });

    document.querySelectorAll("[data-add-row]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (event.submitter && event.submitter.value === "cancel") {
                event.preventDefault();
                form.reset();
                form.closest("dialog")?.close();
                showToast("Action annulée");
                return;
            }

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
                    <td>0</td>
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

            if (type === "product") {
                const imageFile = data.get("image");
                const imageSrc = imageFile && imageFile.size
                    ? URL.createObjectURL(imageFile)
                    : productImageForCategory(data.get("categorie"));

                row.innerHTML = `
                    <td>${data.get("nom")}</td>
                    <td>${data.get("categorie")}</td>
                    <td>${data.get("prix")}</td>
                    <td>${data.get("quantite")}</td>
                    <td><img class="product-thumb" src="${imageSrc}" alt="${data.get("nom")}"></td>
                    <td><button class="mini-btn">Modifier</button><button class="mini-btn danger" data-delete-row>Supprimer</button></td>
                `;
            }

            tableBody.prepend(row);
            const table = document.querySelector("[data-table]");
            if (table) table.dispatchEvent(new CustomEvent("row-added"));
            form.closest("dialog").close();
            form.reset();
            showToast("Élément enregistré");
        });
    });

    document.querySelectorAll("[data-simple-toast]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (event.submitter && event.submitter.value === "cancel") {
                event.preventDefault();
                form.reset();
                form.closest("dialog")?.close();
                showToast("Action annulée");
                return;
            }

            event.preventDefault();
            const tableBody = document.querySelector("[data-table] tbody");
            const values = Array.from(form.querySelectorAll("input:not([type='file']), select, textarea"))
                .map((field) => field.value.trim());

            if (tableBody && values.some(Boolean)) {
                const row = document.createElement("tr");

                if (currentPage === "clients") {
                    row.innerHTML = `
                        <td>${values[0]}</td>
                        <td>${values[1]}</td>
                        <td>${values[2]}</td>
                        <td>${values[3]}</td>
                        <td>0 commande</td>
                        <td>Particulier</td>
                        <td><button class="mini-btn">Voir</button><button class="mini-btn danger" data-delete-row>Supprimer</button></td>
                    `;
                }

                if (currentPage === "employes") {
                    row.innerHTML = `
                        <td>${values[0]}</td>
                        <td>${values[1]}</td>
                        <td>${values[2]}</td>
                        <td><span class="status done">Présent</span></td>
                        <td>${values[3] || "À assigner"}</td>
                        <td><button class="mini-btn">Voir</button></td>
                    `;
                }

                if (currentPage === "fournisseurs") {
                    row.innerHTML = `
                        <td>${values[0]}</td>
                        <td>${values[1]}</td>
                        <td>${values[2]}</td>
                        <td>${new Date().toLocaleDateString("fr-FR")}</td>
                        <td>0 FCFA</td>
                        <td><button class="mini-btn">Voir</button></td>
                    `;
                }

                if (currentPage === "finances") {
                    row.innerHTML = `
                        <td>${new Date().toLocaleDateString("fr-FR")}</td>
                        <td>${values[0]}</td>
                        <td>${values[1]}</td>
                        <td>${values[2]}</td>
                        <td><span class="status done">Validé</span></td>
                    `;
                }

                if (row.innerHTML) {
                    tableBody.prepend(row);
                    const table = document.querySelector("[data-table]");
                    if (table) table.dispatchEvent(new CustomEvent("row-added"));
                }
            }

            const dialog = form.closest("dialog");
            if (dialog) dialog.close();
            if (form.tagName === "FORM") form.reset();
            showToast("Informations enregistrées");
        });
    });
};

// Marque les notifications comme lues.
const initNotifications = () => {
    const markRead = document.querySelector("[data-mark-read]");
    if (!markRead) return;

    markRead.addEventListener("click", () => {
        document.querySelectorAll(".notification-item.unread").forEach((item) => item.classList.remove("unread"));
        showToast("Notifications marquées comme lues");
    });
};

const showAuthMessage = (form, message, type = "error") => {
    let messageBox = form.querySelector("[data-auth-message]");
    if (!messageBox) {
        messageBox = document.createElement("p");
        messageBox.dataset.authMessage = "true";
        form.insertBefore(messageBox, form.querySelector("button[type='submit']"));
    }
    messageBox.className = `auth-message ${type}`;
    messageBox.textContent = message;
};

const getRedirectTarget = () => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("next") || "index.html";
    return protectedPages.includes(target) ? target : "index.html";
};

const handleRegister = async (form) => {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = normalizeEmail(String(data.get("email") || ""));
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    if (!name || !email || !password || !confirmPassword) {
        showAuthMessage(form, "Veuillez remplir tous les champs.");
        return;
    }
    if (!isValidEmail(email)) {
        showAuthMessage(form, "Veuillez saisir une adresse email valide.");
        return;
    }
    if (password.length < 8) {
        showAuthMessage(form, "Le mot de passe doit contenir au moins 8 caractères.");
        return;
    }
    if (password !== confirmPassword) {
        showAuthMessage(form, "Les mots de passe ne correspondent pas.");
        return;
    }

    const users = getUsers();
    if (users.some((user) => user.email === email)) {
        showAuthMessage(form, "Cette adresse email est déjà utilisée.");
        return;
    }

    const passwordData = await hashPassword(password);
    const user = { name, email, ...passwordData, createdAt: new Date().toISOString() };
    users.push(user);
    saveUsers(users);
    setSession(user);
    showToast("Compte créé avec succès");
    window.setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
};

const handleLogin = async (form) => {
    const data = new FormData(form);
    const email = normalizeEmail(String(data.get("email") || ""));
    const password = String(data.get("password") || "");

    if (!email || !password) {
        showAuthMessage(form, "Veuillez remplir tous les champs.");
        return;
    }
    if (!isValidEmail(email)) {
        showAuthMessage(form, "Veuillez saisir une adresse email valide.");
        return;
    }

    const user = getUsers().find((item) => item.email === email);
    if (!user || !(await verifyPassword(password, user))) {
        showAuthMessage(form, "Email ou mot de passe incorrect.");
        return;
    }

    setSession(user);
    showToast("Connexion réussie");
    window.setTimeout(() => {
        window.location.href = getRedirectTarget();
    }, 500);
};

const handleForgotPassword = (form) => {
    const email = normalizeEmail(String(new FormData(form).get("email") || ""));
    if (!email || !isValidEmail(email)) {
        showAuthMessage(form, "Veuillez saisir une adresse email valide.");
        return;
    }
    showAuthMessage(form, "Si ce compte existe, des instructions de récupération seront envoyées.", "success");
};

// Valide les pages de connexion, d'inscription et de récupération.
const initAuthForms = () => {
    document.querySelectorAll("[data-auth-form]").forEach((form) => {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            try {
                if (currentFile === "register.html") await handleRegister(form);
                if (currentFile === "login.html") await handleLogin(form);
                if (currentFile === "forgot-password.html") handleForgotPassword(form);
            } catch (error) {
                showAuthMessage(form, error.message || "Une erreur est survenue.");
            }
        });
    });
};

const initLogout = () => {
    document.querySelectorAll("[data-logout]").forEach((button) => {
        button.addEventListener("click", () => {
            clearSession();
            window.location.href = "login.html";
        });
    });
};

const renderCurrentUser = () => {
    const session = getSession();
    if (!session) return;

    document.querySelectorAll("[data-user-name]").forEach((item) => {
        item.textContent = session.name;
    });
    document.querySelectorAll("[data-user-email]").forEach((item) => {
        item.textContent = session.email;
    });
};

const initNavigationControls = () => {
    document.querySelectorAll("[data-back]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            if (window.history.length > 1) {
                window.history.back();
                return;
            }
            window.location.href = link.getAttribute("href") || "index.html";
        });
    });

    document.querySelectorAll("[data-cancel-edit]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll("tr[data-editing='true']").forEach((row) => {
                Array.from(row.cells).slice(0, -1).forEach((cell) => {
                    cell.contentEditable = "false";
                });
                row.dataset.editing = "false";
                const saveButton = Array.from(row.querySelectorAll(".mini-btn"))
                    .find((item) => item.textContent.trim().toLowerCase() === "enregistrer");
                if (saveButton) saveButton.textContent = "Modifier";
            });
            showToast("Modification annulée");
        });
    });
};

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
}
