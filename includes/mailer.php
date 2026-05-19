<?php
function mailer_available(): bool
{
    return file_exists(__DIR__ . "/../vendor/autoload.php");
}

function send_app_email(string $to, string $subject, string $body): bool
{
    if (!mailer_available()) {
        return false;
    }

    require_once __DIR__ . "/../vendor/autoload.php";

    if (!class_exists("\\PHPMailer\\PHPMailer\\PHPMailer")) {
        return false;
    }

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isMail();
    $mail->setFrom("no-reply@menuiseriepro.local", "MenuiseriePro");
    $mail->addAddress($to);
    $mail->Subject = $subject;
    $mail->Body = $body;

    return $mail->send();
}
?>
