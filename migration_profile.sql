USE menuiseriepro;

SET @add_telephone = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN telephone VARCHAR(60) NULL AFTER email',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'telephone'
);
PREPARE stmt FROM @add_telephone;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_fonction = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN fonction VARCHAR(120) NULL AFTER telephone',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'fonction'
);
PREPARE stmt FROM @add_fonction;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_photo_profil = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN photo_profil VARCHAR(255) NULL AFTER role',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'photo_profil'
);
PREPARE stmt FROM @add_photo_profil;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
