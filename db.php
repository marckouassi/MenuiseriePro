<?php
$dbname = getenv("MENUISERIEPRO_DB_NAME") ?: "menuiseriepro";
$username = getenv("MENUISERIEPRO_DB_USER") ?: "root";
$password = getenv("MENUISERIEPRO_DB_PASSWORD") ?: "";

$configuredHost = getenv("MENUISERIEPRO_DB_HOST") ?: null;
$configuredPort = getenv("MENUISERIEPRO_DB_PORT") ?: null;

$connections = $configuredHost || $configuredPort
    ? [[
        "host" => $configuredHost ?: "127.0.0.1",
        "port" => $configuredPort ?: "3307",
    ]]
    : [
        ["host" => "127.0.0.1", "port" => "3307"],
        ["host" => "127.0.0.1", "port" => "3306"],
    ];

$errors = [];

foreach ($connections as $connection) {
    try {
        $pdo = new PDO(
            "mysql:host={$connection['host']};port={$connection['port']};dbname=$dbname;charset=utf8mb4",
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 2,
            ]
        );

        return;
    } catch (PDOException $e) {
        $errors[] = "{$connection['host']}:{$connection['port']} - " . $e->getMessage();
    }
}

die("Erreur de connexion a la base de donnees. Verifiez que MySQL est demarre dans XAMPP et que la base '$dbname' existe.<br>" . implode("<br>", $errors));
?>
