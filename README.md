# MenuiseriePro

Application PHP/MySQL de gestion interne pour une seule menuiserie.

## Installation locale XAMPP

1. Placer le projet dans `C:\xampp\htdocs\menuiseriepro`.
2. Demarrer Apache et MySQL depuis XAMPP.
3. Ouvrir phpMyAdmin.
4. Importer `database.sql` pour une installation neuve.
5. Importer ensuite les migrations utiles :
   - `migration_relations.sql`
   - `migration_profile.sql`
   - `migrations/2026_05_19_core_saas_mono.sql`
6. Ouvrir `http://localhost/menuiseriepro/login.php`.

## Configuration base de donnees

Le fichier historique `db.php` reste compatible avec les chemins existants.
Le nouveau point d'entree reutilisable est `config/database.php`, qui inclut `db.php`.

Variables d'environnement optionnelles :

- `MENUISERIEPRO_DB_HOST`
- `MENUISERIEPRO_DB_PORT`
- `MENUISERIEPRO_DB_NAME`
- `MENUISERIEPRO_DB_USER`
- `MENUISERIEPRO_DB_PASSWORD`

## Compte admin de depart

- Email : `admin@menuiseriepro.ci`
- Mot de passe : `admin1234`

## Structure

- `config/` : configuration reutilisable.
- `includes/` : fragments communs et integrations futures.
- `controllers/`, `models/`, `views/` : structure progressive pour refactoriser sans casser les pages actuelles.
- `api/` : premieres routes JSON.
- `assets/` : CSS, images, icones.
- `uploads/` : fichiers uploades.
- `migrations/` : migrations SQL progressives.

## Roles internes

- `administrateur` : acces complet.
- `gerant` : gestion globale hors certains reglages sensibles.
- `magasinier` : stocks, produits, fournisseurs.
- `ouvrier` : lecture commandes/produits.
- `comptable` : finances, paiements, factures.

La fonction `require_role([...])` dans `auth.php` protege les pages et actions.

## Securite

- Sessions PHP avec `auth.php`.
- CSRF pour les formulaires prives via `csrf_field()` et `verify_csrf()`.
- PDO et requetes preparees.
- `htmlspecialchars` via le helper `e()`.
- Uploads controles par extension, MIME et taille.
- Suppressions protegees par confirmations et controles de relations.

## PDF et emails

Les fichiers `generer_facture_pdf.php`, `generer_devis_pdf.php` et `pdf_document.php` utilisent Dompdf si installe :

```bash
composer require dompdf/dompdf
```

Sans Dompdf, une version HTML imprimable reste disponible.

PHPMailer est prepare via `includes/mailer.php` :

```bash
composer require phpmailer/phpmailer
```

Le projet continue de fonctionner si PHPMailer n'est pas installe.

## API future

Routes JSON preparees :

- `api/clients.php`
- `api/commandes.php`
- `api/stocks.php`
- `api/dashboard.php`

Elles utilisent les sessions et permissions existantes.

## Prochaines ameliorations

- Generaliser les filtres SQL cote serveur.
- Remplacer progressivement les pages racine par controllers/models/views.
- Ajouter des tests fonctionnels.
- Ameliorer les PDF avec QR code.
- Ajouter des messages flash de succes/erreur.
