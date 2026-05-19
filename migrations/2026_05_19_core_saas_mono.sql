USE menuiseriepro;

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

SET @add_notifications_user = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE notifications ADD COLUMN id_user INT NULL AFTER id_notification',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'notifications'
      AND COLUMN_NAME = 'id_user'
);
PREPARE stmt FROM @add_notifications_user;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_notifications_dedupe = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE notifications ADD COLUMN dedupe_key VARCHAR(190) NULL AFTER type_notification, ADD UNIQUE KEY uniq_notifications_dedupe (dedupe_key)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'notifications'
      AND COLUMN_NAME = 'dedupe_key'
);
PREPARE stmt FROM @add_notifications_dedupe;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_commandes_numero = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE commandes ADD COLUMN numero_commande VARCHAR(40) NULL AFTER id_commande, ADD UNIQUE KEY uniq_commandes_numero (numero_commande)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'commandes'
      AND COLUMN_NAME = 'numero_commande'
);
PREPARE stmt FROM @add_commandes_numero;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_paiements_numero = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE paiements ADD COLUMN numero_paiement VARCHAR(40) NULL AFTER id_paiement, ADD UNIQUE KEY uniq_paiements_numero (numero_paiement)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'paiements'
      AND COLUMN_NAME = 'numero_paiement'
);
PREPARE stmt FROM @add_paiements_numero;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_commandes_document = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE commandes ADD COLUMN fichier_document VARCHAR(255) NULL AFTER statut',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'commandes'
      AND COLUMN_NAME = 'fichier_document'
);
PREPARE stmt FROM @add_commandes_document;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
