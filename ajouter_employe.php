<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = (int) ($_POST["id_employe"] ?? 0);
    $nom = $_POST["nom_employe"];
    $role = $_POST["role_employe"];
    $salaire = $_POST["salaire"];
    $presence = $_POST["presence"];
    $taches = $_POST["taches_assignees"];

    if ($id > 0) {
        $sql = "UPDATE employes
                SET nom_employe = :nom, role_employe = :role, salaire = :salaire,
                    presence = :presence, taches_assignees = :taches
                WHERE id_employe = :id";
    } else {
        $sql = "INSERT INTO employes
                (nom_employe, role_employe, salaire, presence, taches_assignees)
                VALUES
                (:nom, :role, :salaire, :presence, :taches)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":nom" => $nom,
        ":role" => $role,
        ":salaire" => $salaire,
        ":presence" => $presence,
        ":taches" => $taches
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    }

    $stmt->execute($params);
    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "employes", "Employe: " . $nom);

    header("Location: employes.php");
    exit;
}
?>
