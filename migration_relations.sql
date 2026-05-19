USE menuiseriepro;

ALTER TABLE commandes
    ADD COLUMN id_client INT NULL AFTER id_commande,
    ADD INDEX idx_commandes_id_client (id_client),
    ADD CONSTRAINT fk_commandes_client
        FOREIGN KEY (id_client) REFERENCES clients(id_client)
        ON UPDATE CASCADE
        ON DELETE SET NULL;

ALTER TABLE stocks
    ADD COLUMN id_fournisseur INT NULL AFTER id_stock,
    ADD INDEX idx_stocks_id_fournisseur (id_fournisseur),
    ADD CONSTRAINT fk_stocks_fournisseur
        FOREIGN KEY (id_fournisseur) REFERENCES fournisseurs(id_fournisseur)
        ON UPDATE CASCADE
        ON DELETE SET NULL;

ALTER TABLE paiements
    ADD COLUMN id_commande INT NULL AFTER id_paiement,
    ADD INDEX idx_paiements_id_commande (id_commande),
    ADD CONSTRAINT fk_paiements_commande
        FOREIGN KEY (id_commande) REFERENCES commandes(id_commande)
        ON UPDATE CASCADE
        ON DELETE SET NULL;

ALTER TABLE factures
    ADD COLUMN id_commande INT NULL AFTER id_facture,
    ADD COLUMN id_paiement INT NULL AFTER id_commande,
    ADD INDEX idx_factures_id_commande (id_commande),
    ADD INDEX idx_factures_id_paiement (id_paiement),
    ADD CONSTRAINT fk_factures_commande
        FOREIGN KEY (id_commande) REFERENCES commandes(id_commande)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    ADD CONSTRAINT fk_factures_paiement
        FOREIGN KEY (id_paiement) REFERENCES paiements(id_paiement)
        ON UPDATE CASCADE
        ON DELETE SET NULL;
