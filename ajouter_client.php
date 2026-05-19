<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = (int) ($_POST["id_client"] ?? 0);
    $nom = $_POST["nom_client"];
    $telephone = $_POST["telephone"];
    $email = $_POST["email"];
    $adresse = $_POST["adresse"];
    $type = $_POST["type_client"];

    if ($id > 0) {
        $sql = "UPDATE clients
                SET nom_client = :nom, telephone = :telephone, email = :email,
                    adresse = :adresse, type_client = :type
                WHERE id_client = :id";
    } else {
        $sql = "INSERT INTO clients
                (nom_client, telephone, email, adresse, type_client)
                VALUES
                (:nom, :telephone, :email, :adresse, :type)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":nom" => $nom,
        ":telephone" => $telephone,
        ":email" => $email,
        ":adresse" => $adresse,
        ":type" => $type
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    }

    $stmt->execute($params);

    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "clients", "Client: " . $nom);
}

header("Location: clients.php");
exit;
?>
