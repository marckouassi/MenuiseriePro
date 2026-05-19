<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "comptable"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = (int) ($_POST["id_facture"] ?? 0);
    $id_commande = (int) ($_POST["id_commande"] ?? 0);
    $id_paiement = !empty($_POST["id_paiement"]) ? (int) $_POST["id_paiement"] : null;
    $commandeStmt = $pdo->prepare("SELECT id_commande, client, produit, prix FROM commandes WHERE id_commande = :id");
    $commandeStmt->execute([":id" => $id_commande]);
    $commandeData = $commandeStmt->fetch(PDO::FETCH_ASSOC);

    if (!$commandeData) {
        header("Location: factures.php?error=commande");
        exit;
    }

    $numero = $_POST["numero"];
    $type_document = $_POST["type_document"];
    $commande = "CMD-" . str_pad((string) $commandeData["id_commande"], 3, "0", STR_PAD_LEFT);
    $client = $commandeData["client"];
    $date_document = $_POST["date_document"];
    $total = $_POST["total"] !== "" ? $_POST["total"] : $commandeData["prix"];

    if ($id > 0) {
        $sql = "UPDATE factures
                SET id_commande = :id_commande, id_paiement = :id_paiement, numero = :numero,
                    type_document = :type_document, commande = :commande, client = :client,
                    date_document = :date_document, total = :total
                WHERE id_facture = :id";
    } else {
        $sql = "INSERT INTO factures
                (id_commande, id_paiement, numero, type_document, commande, client, date_document, total)
                VALUES
                (:id_commande, :id_paiement, :numero, :type_document, :commande, :client, :date_document, :total)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":id_commande" => $id_commande,
        ":id_paiement" => $id_paiement,
        ":numero" => $numero,
        ":type_document" => $type_document,
        ":commande" => $commande,
        ":client" => $client,
        ":date_document" => $date_document,
        ":total" => $total
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    }

    $stmt->execute($params);
    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "factures", $type_document . ": " . $numero);

    header("Location: factures.php");
    exit;
}
?>
