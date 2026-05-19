<?php
function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, "UTF-8");
}

function current_page(): int
{
    return max(1, (int) ($_GET["page"] ?? 1));
}

function paginate(PDO $pdo, string $table, string $orderColumn, int $perPage = 10): array
{
    $page = current_page();
    $offset = ($page - 1) * $perPage;
    $total = (int) $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
    $stmt = $pdo->prepare("SELECT * FROM $table ORDER BY $orderColumn DESC LIMIT :limit OFFSET :offset");
    $stmt->bindValue(":limit", $perPage, PDO::PARAM_INT);
    $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
    $stmt->execute();

    return [
        "rows" => $stmt->fetchAll(PDO::FETCH_ASSOC),
        "page" => $page,
        "pages" => max(1, (int) ceil($total / $perPage)),
        "total" => $total,
    ];
}

function pagination_links(int $page, int $pages): string
{
    if ($pages <= 1) {
        return "";
    }

    $prev = max(1, $page - 1);
    $next = min($pages, $page + 1);
    $disabledPrev = $page <= 1 ? " disabled" : "";
    $disabledNext = $page >= $pages ? " disabled" : "";

    return '
        <div class="pagination">
            <a class="mini-btn' . $disabledPrev . '" href="?page=' . $prev . '">Precedent</a>
            <span>Page ' . $page . ' / ' . $pages . '</span>
            <a class="mini-btn' . $disabledNext . '" href="?page=' . $next . '">Suivant</a>
        </div>
    ';
}

function upload_product_image(array $file): ?string
{
    if (($file["error"] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($file["error"] !== UPLOAD_ERR_OK) {
        return null;
    }

    $allowed = ["jpg", "jpeg", "png", "webp"];
    $maxSize = 2 * 1024 * 1024;
    $extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

    if (!in_array($extension, $allowed, true) || $file["size"] > $maxSize) {
        return null;
    }

    $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "produits";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }

    $filename = "produit_" . date("YmdHis") . "_" . bin2hex(random_bytes(4)) . "." . $extension;
    $target = $uploadDir . DIRECTORY_SEPARATOR . $filename;

    if (!move_uploaded_file($file["tmp_name"], $target)) {
        return null;
    }

    return "uploads/produits/" . $filename;
}

function upload_profile_image(array $file): ?string
{
    if (($file["error"] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($file["error"] !== UPLOAD_ERR_OK) {
        return null;
    }

    $allowed = ["jpg", "jpeg", "png", "webp"];
    $maxSize = 2 * 1024 * 1024;
    $extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

    if (!in_array($extension, $allowed, true) || $file["size"] > $maxSize) {
        return null;
    }

    $imageInfo = getimagesize($file["tmp_name"]);
    $allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!$imageInfo || !in_array($imageInfo["mime"], $allowedMimeTypes, true)) {
        return null;
    }

    $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "profils";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }

    $filename = "profil_" . date("YmdHis") . "_" . bin2hex(random_bytes(4)) . "." . $extension;
    $target = $uploadDir . DIRECTORY_SEPARATOR . $filename;

    if (!move_uploaded_file($file["tmp_name"], $target)) {
        return null;
    }

    return "uploads/profils/" . $filename;
}

function upload_document_file(array $file): ?string
{
    if (($file["error"] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($file["error"] !== UPLOAD_ERR_OK) {
        return null;
    }

    $allowed = ["jpg", "jpeg", "png", "webp", "pdf"];
    $maxSize = 5 * 1024 * 1024;
    $extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

    if (!in_array($extension, $allowed, true) || $file["size"] > $maxSize) {
        return null;
    }

    $allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    $mimeType = mime_content_type($file["tmp_name"]);

    if (!in_array($mimeType, $allowedMimeTypes, true)) {
        return null;
    }

    $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "documents";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }

    $filename = "document_" . date("YmdHis") . "_" . bin2hex(random_bytes(4)) . "." . $extension;
    $target = $uploadDir . DIRECTORY_SEPARATOR . $filename;

    if (!move_uploaded_file($file["tmp_name"], $target)) {
        return null;
    }

    return "uploads/documents/" . $filename;
}

function log_action(PDO $pdo, ?int $idUser, string $action, string $cible, string $description): void
{
    try {
        $stmt = $pdo->prepare("
            INSERT INTO historique_actions (id_user, action, cible, description)
            VALUES (:id_user, :action, :cible, :description)
        ");
        $stmt->execute([
            ":id_user" => $idUser,
            ":action" => $action,
            ":cible" => $cible,
            ":description" => $description,
        ]);
    } catch (PDOException $e) {
        return;
    }
}

function create_notification(PDO $pdo, ?int $idUser, string $type, string $titre, string $message, string $dedupeKey = ""): void
{
    try {
        if ($dedupeKey !== "") {
            $check = $pdo->prepare("SELECT COUNT(*) FROM notifications WHERE dedupe_key = :dedupe_key AND est_lue = 0");
            $check->execute([":dedupe_key" => $dedupeKey]);

            if ((int) $check->fetchColumn() > 0) {
                return;
            }
        }

        $stmt = $pdo->prepare("
            INSERT INTO notifications (id_user, titre, message, type_notification, dedupe_key)
            VALUES (:id_user, :titre, :message, :type_notification, :dedupe_key)
        ");
        $stmt->execute([
            ":id_user" => $idUser,
            ":titre" => $titre,
            ":message" => $message,
            ":type_notification" => $type,
            ":dedupe_key" => $dedupeKey !== "" ? $dedupeKey : null,
        ]);
    } catch (PDOException $e) {
        return;
    }
}

function generate_numero(PDO $pdo, string $table, string $column, string $prefix): string
{
    $year = date("Y");
    $like = $prefix . "-" . $year . "-%";
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM $table WHERE $column LIKE :like");
    $stmt->execute([":like" => $like]);
    $next = (int) $stmt->fetchColumn() + 1;

    return $prefix . "-" . $year . "-" . str_pad((string) $next, 3, "0", STR_PAD_LEFT);
}

function generate_automatic_notifications(PDO $pdo): void
{
    try {
        foreach ($pdo->query("SELECT id_stock, materiau, statut FROM stocks WHERE statut IN ('Stock faible', 'Manquant')") as $stock) {
            create_notification(
                $pdo,
                null,
                $stock["statut"] === "Manquant" ? "danger" : "warning",
                "Stock " . strtolower($stock["statut"]),
                $stock["materiau"] . " est marque " . $stock["statut"] . ".",
                "stock-" . $stock["id_stock"] . "-" . $stock["statut"]
            );
        }

        foreach ($pdo->query("SELECT id_paiement, commande, client, total, montant_paye FROM paiements WHERE total > montant_paye") as $paiement) {
            create_notification(
                $pdo,
                null,
                "warning",
                "Paiement restant",
                $paiement["client"] . " a un reste a payer sur " . $paiement["commande"] . ".",
                "paiement-restant-" . $paiement["id_paiement"]
            );
        }
    } catch (PDOException $e) {
        return;
    }
}
?>
