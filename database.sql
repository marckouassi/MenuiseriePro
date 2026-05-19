CREATE DATABASE IF NOT EXISTS menuiseriepro
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE menuiseriepro;

CREATE TABLE IF NOT EXISTS users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    telephone VARCHAR(60) NULL,
    fonction VARCHAR(120) NULL,
    role VARCHAR(60) NOT NULL,
    photo_profil VARCHAR(255) NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id_client INT AUTO_INCREMENT PRIMARY KEY,
    nom_client VARCHAR(150) NOT NULL,
    telephone VARCHAR(60) NOT NULL,
    email VARCHAR(190) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    type_client VARCHAR(60) NOT NULL DEFAULT 'Particulier',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commandes (
    id_commande INT AUTO_INCREMENT PRIMARY KEY,
    numero_commande VARCHAR(40) NULL UNIQUE,
    id_client INT NULL,
    client VARCHAR(150) NOT NULL,
    produit VARCHAR(150) NOT NULL,
    prix DECIMAL(12, 2) NOT NULL DEFAULT 0,
    date_commande DATE NOT NULL,
    statut VARCHAR(60) NOT NULL DEFAULT 'En attente',
    fichier_document VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commandes_client
        FOREIGN KEY (id_client) REFERENCES clients(id_client)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS produits (
    id_produit INT AUTO_INCREMENT PRIMARY KEY,
    nom_produit VARCHAR(150) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    prix DECIMAL(12, 2) NOT NULL DEFAULT 0,
    quantite INT NOT NULL DEFAULT 0,
    image VARCHAR(255) DEFAULT 'assets/images/meuble.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fournisseurs (
    id_fournisseur INT AUTO_INCREMENT PRIMARY KEY,
    nom_fournisseur VARCHAR(150) NOT NULL,
    materiaux VARCHAR(255) NOT NULL,
    contact VARCHAR(150) NOT NULL,
    nombre_achats INT NOT NULL DEFAULT 0,
    dernier_achat DATE NULL,
    total_achats DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stocks (
    id_stock INT AUTO_INCREMENT PRIMARY KEY,
    id_fournisseur INT NULL,
    materiau VARCHAR(150) NOT NULL,
    quantite VARCHAR(80) NOT NULL,
    fournisseur VARCHAR(150) NOT NULL,
    entrees VARCHAR(80) NOT NULL,
    sorties VARCHAR(80) NOT NULL DEFAULT '0',
    statut VARCHAR(60) NOT NULL DEFAULT 'Disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stocks_fournisseur
        FOREIGN KEY (id_fournisseur) REFERENCES fournisseurs(id_fournisseur)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS paiements (
    id_paiement INT AUTO_INCREMENT PRIMARY KEY,
    numero_paiement VARCHAR(40) NULL UNIQUE,
    id_commande INT NULL,
    commande VARCHAR(120) NOT NULL,
    client VARCHAR(150) NOT NULL,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    montant_paye DECIMAL(12, 2) NOT NULL DEFAULT 0,
    statut VARCHAR(80) NOT NULL DEFAULT 'non paye',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paiements_commande
        FOREIGN KEY (id_commande) REFERENCES commandes(id_commande)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS factures (
    id_facture INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT NULL,
    id_paiement INT NULL,
    numero VARCHAR(80) NOT NULL,
    type_document VARCHAR(40) NOT NULL,
    commande VARCHAR(120) NOT NULL,
    client VARCHAR(150) NOT NULL,
    date_document DATE NOT NULL,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_factures_commande
        FOREIGN KEY (id_commande) REFERENCES commandes(id_commande)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_factures_paiement
        FOREIGN KEY (id_paiement) REFERENCES paiements(id_paiement)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS finances (
    id_transaction INT AUTO_INCREMENT PRIMARY KEY,
    type_transaction VARCHAR(40) NOT NULL,
    description_transaction VARCHAR(255) NOT NULL,
    montant DECIMAL(12, 2) NOT NULL DEFAULT 0,
    statut VARCHAR(80) NOT NULL DEFAULT 'En attente',
    date_transaction DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employes (
    id_employe INT AUTO_INCREMENT PRIMARY KEY,
    nom_employe VARCHAR(150) NOT NULL,
    role_employe VARCHAR(120) NOT NULL,
    salaire DECIMAL(12, 2) NOT NULL DEFAULT 0,
    presence VARCHAR(80) NOT NULL DEFAULT 'Present',
    taches_assignees TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id_notification INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NULL,
    titre VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type_notification VARCHAR(40) NOT NULL DEFAULT 'info',
    dedupe_key VARCHAR(190) NULL UNIQUE,
    est_lue TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS historique_actions (
    id_action INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NULL,
    action VARCHAR(80) NOT NULL,
    cible VARCHAR(120) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historique_user
        FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

INSERT INTO users (nom, email, role, password)
VALUES ('Administrateur', 'admin@menuiseriepro.ci', 'administrateur', '$2y$10$egM0DLz.DVSR.HF0qkTcVuMyZ2klRMFAa9x8xuBqxncsGWvznRxvq')
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO notifications (titre, message, type_notification)
VALUES
    ('Bienvenue', 'MenuiseriePro est pret a gerer votre atelier.', 'info'),
    ('Stock a verifier', 'Ajoutez vos premiers materiaux dans la page Stocks.', 'danger');
