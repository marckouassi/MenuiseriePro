<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);

if (isset($_GET["id"])) {
    $id = $_GET["id"];

    $sql = "SELECT statut FROM commandes WHERE id_commande = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":id" => $id]);

    $commande = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($commande) {
        $statutActuel = $commande["statut"];

        if ($statutActuel === "En attente") {
            $nouveauStatut = "En cours";
        } elseif ($statutActuel === "En cours") {
            $nouveauStatut = "Terminée";
        } elseif ($statutActuel === "Terminée") {
            $nouveauStatut = "Livrée";
        } else {
            $nouveauStatut = "En attente";
        }

        $sqlUpdate = "UPDATE commandes SET statut = :statut WHERE id_commande = :id";
        $stmtUpdate = $pdo->prepare($sqlUpdate);

        $stmtUpdate->execute([
            ":statut" => $nouveauStatut,
            ":id" => $id
        ]);

        log_action($pdo, (int) $_SESSION["user_id"], "changement_statut", "commandes", "Commande ID " . $id . " -> " . $nouveauStatut);
    }
}

header("Location: commandes.php");
exit;
?>
