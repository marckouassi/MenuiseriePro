<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "comptable"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = (int) ($_POST["id_paiement"] ?? 0);
    $id_commande = (int) ($_POST["id_commande"] ?? 0);
    $commandeStmt = $pdo->prepare("SELECT id_commande, client, produit, prix FROM commandes WHERE id_commande = :id");
    $commandeStmt->execute([":id" => $id_commande]);
    $commandeData = $commandeStmt->fetch(PDO::FETCH_ASSOC);

    if (!$commandeData) {
        header("Location: paiements.php?error=commande");
        exit;
    }

    $commande = "CMD-" . str_pad((string) $commandeData["id_commande"], 3, "0", STR_PAD_LEFT);
    $client = $commandeData["client"];
    $total = $_POST["total"] !== "" ? $_POST["total"] : $commandeData["prix"];
    $montant_paye = $_POST["montant_paye"];
    $statut = $_POST["statut"];

    if ($id > 0) {
        $sql = "UPDATE paiements
                SET id_commande = :id_commande, commande = :commande, client = :client,
                    total = :total, montant_paye = :montant_paye, statut = :statut
                WHERE id_paiement = :id";
    } else {
        $numero_paiement = generate_numero($pdo, "paiements", "numero_paiement", "PAY");
        $sql = "INSERT INTO paiements
                (numero_paiement, id_commande, commande, client, total, montant_paye, statut)
                VALUES
                (:numero_paiement, :id_commande, :commande, :client, :total, :montant_paye, :statut)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":id_commande" => $id_commande,
        ":commande" => $commande,
        ":client" => $client,
        ":total" => $total,
        ":montant_paye" => $montant_paye,
        ":statut" => $statut
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    } else {
        $params[":numero_paiement"] = $numero_paiement;
    }

    $stmt->execute($params);
    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "paiements", "Paiement: " . $commande);

    header("Location: paiements.php");
    exit;
}
?>
