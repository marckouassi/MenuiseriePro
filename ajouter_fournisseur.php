<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = (int) ($_POST["id_fournisseur"] ?? 0);
    $nom = $_POST["nom_fournisseur"];
    $materiaux = $_POST["materiaux"];
    $contact = $_POST["contact"];
    $nombre_achats = $_POST["nombre_achats"];
    $dernier_achat = !empty($_POST["dernier_achat"]) ? $_POST["dernier_achat"] : null;
    $total_achats = $_POST["total_achats"];

    if ($id > 0) {
        $sql = "UPDATE fournisseurs
                SET nom_fournisseur = :nom, materiaux = :materiaux, contact = :contact,
                    nombre_achats = :nombre_achats, dernier_achat = :dernier_achat,
                    total_achats = :total_achats
                WHERE id_fournisseur = :id";
    } else {
        $sql = "INSERT INTO fournisseurs
                (nom_fournisseur, materiaux, contact, nombre_achats, dernier_achat, total_achats)
                VALUES
                (:nom, :materiaux, :contact, :nombre_achats, :dernier_achat, :total_achats)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":nom" => $nom,
        ":materiaux" => $materiaux,
        ":contact" => $contact,
        ":nombre_achats" => $nombre_achats,
        ":dernier_achat" => $dernier_achat,
        ":total_achats" => $total_achats
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    }

    $stmt->execute($params);
    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "fournisseurs", "Fournisseur: " . $nom);

    header("Location: fournisseurs.php");
    exit;
}
?>
