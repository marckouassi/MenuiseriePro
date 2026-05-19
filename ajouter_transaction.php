<?php
require_once "auth.php";
require_once "db.php";
require_once "backend.php";

require_role(["administrateur", "gerant", "comptable"]);
verify_csrf();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = (int) ($_POST["id_transaction"] ?? 0);
    $type = $_POST["type_transaction"];
    $description = $_POST["description_transaction"];
    $montant = $_POST["montant"];
    $statut = $_POST["statut"];
    $date = !empty($_POST["date_transaction"]) ? $_POST["date_transaction"] : date("Y-m-d");

    if ($id > 0) {
        $sql = "UPDATE finances
                SET type_transaction = :type_transaction,
                    description_transaction = :description_transaction,
                    montant = :montant, statut = :statut, date_transaction = :date_transaction
                WHERE id_transaction = :id";
    } else {
        $sql = "INSERT INTO finances
                (type_transaction, description_transaction, montant, statut, date_transaction)
                VALUES
                (:type_transaction, :description_transaction, :montant, :statut, :date_transaction)";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        ":type_transaction" => $type,
        ":description_transaction" => $description,
        ":montant" => $montant,
        ":statut" => $statut,
        ":date_transaction" => $date
    ];

    if ($id > 0) {
        $params[":id"] = $id;
    }

    $stmt->execute($params);
    log_action($pdo, (int) $_SESSION["user_id"], $id > 0 ? "modification" : "creation", "finances", "Transaction: " . $description);

    header("Location: finances.php");
    exit;
}
?>
