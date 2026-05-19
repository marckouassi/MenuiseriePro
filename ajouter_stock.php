<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = (int) ($_POST["id_stock"] ?? 0);
    $id_fournisseur = (int) ($_POST["id_fournisseur"] ?? 0);
    $materiau = $_POST["materiau"];
    $quantite = $_POST["quantite"];
    $fournisseurStmt = $pdo->prepare("SELECT nom_fournisseur FROM fournisseurs WHERE id_fournisseur = :id");
    $fournisseurStmt->execute([":id" => $id_fournisseur]);
    $fournisseur = $fournisseurStmt->fetchColumn();

    if (!$fournisseur) {
        header("Location: stocks.php?error=fournisseur");
        exit;
    }

    $entrees = $_POST["entrees"];
    $sorties = !empty($_POST["sorties"]) ? $_POST["sorties"] : "0";
    $statut = $_POST["statut"];

    if ($id > 0) {
        $sql = "UPDATE stocks
                SET id_fournisseur = :id_fournisseur, materiau = :materiau, quantite = :quantite,
                    fournisseur = :fournisseur, entrees = :entrees, sorties = :sorties, statut = :statut
                WHERE id_stock = :id";
    } else {
        $sql = "INSERT INTO stocks
                (id_fournisseur, materiau, quantite, fournisseur, entrees, sorties, statut)
                VALUES
                (:id_fournisseur, :materiau, :quantite, :fournisseur, :entrees, :sorties, :statut)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":id_fournisseur" => $id_fournisseur,
        ":materiau" => $materiau,
        ":quantite" => $quantite,
        ":fournisseur" => $fournisseur,
        ":entrees" => $entrees,
        ":sorties" => $sorties,
        ":statut" => $statut
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    }

    $stmt->execute($params);

    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "stocks", "Stock: " . $materiau);
    if (in_array($statut, ["Stock faible", "Manquant"], true)) {
        create_notification($pdo, null, $statut === "Manquant" ? "danger" : "warning", "Stock " . strtolower($statut), $materiau . " est marque " . $statut . ".", "stock-" . ($id ?: $pdo->lastInsertId()) . "-" . $statut);
    }

    header("Location: stocks.php");
    exit;
}
?>
