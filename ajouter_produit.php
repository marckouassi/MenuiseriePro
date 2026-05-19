<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "magasinier"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $id = (int) ($_POST["id_produit"] ?? 0);
    $nom = $_POST["nom_produit"];
    $categorie = $_POST["categorie"];
    $prix = $_POST["prix"];
    $quantite = $_POST["quantite"];
    $uploadedImage = upload_product_image($_FILES["image_file"] ?? []);
    $image = $uploadedImage ?: ($_POST["image_actuelle"] ?? "assets/images/meuble.png");

    if ($id > 0) {
        $sql = "UPDATE produits
                SET nom_produit = :nom, categorie = :categorie, prix = :prix,
                    quantite = :quantite, image = :image
                WHERE id_produit = :id";
    } else {
        $sql = "INSERT INTO produits
                (nom_produit, categorie, prix, quantite, image)
                VALUES
                (:nom, :categorie, :prix, :quantite, :image)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":nom" => $nom,
        ":categorie" => $categorie,
        ":prix" => $prix,
        ":quantite" => $quantite,
        ":image" => $image
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    }

    $stmt->execute($params);
    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "produits", "Produit: " . $nom);

    header("Location: produits.php");
    exit;
}
?>
