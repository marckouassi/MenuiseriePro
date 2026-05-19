<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function require_login(): void
{
    if (empty($_SESSION["user_id"])) {
        $prefix = str_contains(str_replace("\\", "/", $_SERVER["SCRIPT_NAME"] ?? ""), "/api/") ? "../" : "";
        header("Location: " . $prefix . "login.php");
        exit;
    }
}

function current_role(): string
{
    return strtolower((string) ($_SESSION["user_role"] ?? ""));
}

function require_role(array $roles): void
{
    require_login();

    $allowed = array_map("strtolower", $roles);

    if (!in_array(current_role(), $allowed, true)) {
        http_response_code(403);
        die("Acces refuse.");
    }
}

function csrf_token(): string
{
    if (empty($_SESSION["csrf_token"])) {
        $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
    }

    return $_SESSION["csrf_token"];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(csrf_token(), ENT_QUOTES, "UTF-8") . '">';
}

function verify_csrf(): void
{
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        return;
    }

    $token = $_POST["csrf_token"] ?? "";

    if (!$token || !hash_equals($_SESSION["csrf_token"] ?? "", $token)) {
        http_response_code(419);
        die("Session expiree. Rechargez la page puis recommencez.");
    }
}

require_login();
?>
