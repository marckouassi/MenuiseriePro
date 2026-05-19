<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = (int) ($_POST["id_commande"] ?? 0);
    $id_client = (int) ($_POST["id_client"] ?? 0);
    $clientStmt = $pdo->prepare("SELECT nom_client FROM clients WHERE id_client = :id");
    $clientStmt->execute([":id" => $id_client]);
    $client = $clientStmt->fetchColumn();

    if (!$client) {
        header("Location: commandes.php?error=client");
        exit;
    }

    $produit = $_POST["produit"];
    $prix = $_POST["prix"];
    $date_commande = $_POST["date_commande"];
    $statut = $_POST["statut"];

    if ($id > 0) {
        $sql = "UPDATE commandes
                SET id_client = :id_client, client = :client, produit = :produit, prix = :prix,
                    date_commande = :date_commande, statut = :statut
                WHERE id_commande = :id";
    } else {
        $numero_commande = generate_numero($pdo, "commandes", "numero_commande", "CMD");
        $fichier_document = upload_document_file($_FILES["fichier_document"] ?? []);
        $sql = "INSERT INTO commandes
                (numero_commande, id_client, client, produit, prix, date_commande, statut, fichier_document)
                VALUES
                (:numero_commande, :id_client, :client, :produit, :prix, :date_commande, :statut, :fichier_document)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":id_client" => $id_client,
        ":client" => $client,
        ":produit" => $produit,
        ":prix" => $prix,
        ":date_commande" => $date_commande,
        ":statut" => $statut
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    } else {
        $params[":numero_commande"] = $numero_commande;
        $params[":fichier_document"] = $fichier_document;
    }

    $stmt->execute($params);
    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "commandes", "Commande client: " . $client);
    create_notification($pdo, null, "info", "Nouvelle commande", "Commande ajoutee pour " . $client . ".", $id > 0 ? "" : "commande-" . $numero_commande);

    header("Location: commandes.php");
    exit;
}
?>
