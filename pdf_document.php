<?php
require_once "auth.php";
require_once "db.php";

function render_document_pdf(PDO $pdo, int $id, string $expectedType): void
{
    $stmt = $pdo->prepare("
        SELECT f.*, c.produit, c.prix, c.statut
        FROM factures f
        LEFT JOIN commandes c ON c.id_commande = f.id_commande
        WHERE f.id_facture = :id
        LIMIT 1
    ");
    $stmt->execute([":id" => $id]);
    $document = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$document) {
        http_response_code(404);
        echo "Document introuvable.";
        exit;
    }

    if ($expectedType && strtolower($document["type_document"]) !== strtolower($expectedType)) {
        http_response_code(400);
        echo "Ce document n'est pas un " . htmlspecialchars($expectedType) . ".";
        exit;
    }

    $title = $document["type_document"] . " " . $document["numero"];
    $html = "
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: DejaVu Sans, Arial, sans-serif; color: #1f2933; }
                .header { border-bottom: 2px solid #b87333; padding-bottom: 16px; margin-bottom: 24px; }
                h1 { color: #8a4f20; margin: 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 24px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #f7efe7; }
                .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 24px; }
                .footer { margin-top: 72px; border-top: 1px solid #ddd; padding-top: 16px; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h1>MenuiseriePro</h1>
                <p>Document: " . htmlspecialchars($title) . "</p>
            </div>
            <p><strong>Client:</strong> " . htmlspecialchars($document["client"]) . "</p>
            <p><strong>Commande:</strong> " . htmlspecialchars($document["commande"]) . "</p>
            <p><strong>Date:</strong> " . date("d/m/Y", strtotime($document["date_document"])) . "</p>
            <table>
                <thead>
                    <tr><th>Produit</th><th>Prix</th><th>Statut</th><th>Total</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td>" . htmlspecialchars($document["produit"] ?? "-") . "</td>
                        <td>" . number_format((float) ($document["prix"] ?? 0), 0, ',', ' ') . " FCFA</td>
                        <td>" . htmlspecialchars($document["statut"] ?? "-") . "</td>
                        <td>" . number_format((float) $document["total"], 0, ',', ' ') . " FCFA</td>
                    </tr>
                </tbody>
            </table>
            <div class='total'>Total: " . number_format((float) $document["total"], 0, ',', ' ') . " FCFA</div>
            <div class='footer'>Signature et cachet - MenuiseriePro</div>
        </body>
        </html>
    ";

    if (file_exists(__DIR__ . "/vendor/autoload.php")) {
        require_once __DIR__ . "/vendor/autoload.php";

        if (class_exists("\\Dompdf\\Dompdf")) {
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper("A4", "portrait");
            $dompdf->render();
            $dompdf->stream(strtolower($document["type_document"]) . "-" . $document["numero"] . ".pdf", ["Attachment" => false]);
            exit;
        }
    }

    header("Content-Type: text/html; charset=UTF-8");
    echo $html;
}
?>
