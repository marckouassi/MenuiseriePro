<?php
require_once "pdf_document.php";

render_document_pdf($pdo, (int) ($_GET["id"] ?? 0), "Facture");
?>
