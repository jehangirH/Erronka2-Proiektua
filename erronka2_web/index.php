<?php

define('SARRERA', true);

// Erroreak logean gorde, inoiz ez erabiltzaileari erakutsi
ini_set('display_errors', '0');
ini_set('log_errors', '1');

ob_start();

set_exception_handler(function ($ex) {
    error_log((string)$ex);
    while (ob_get_level()) {
        ob_end_clean();
    }
    http_response_code(500);
    exit('Errore bat gertatu da. Saiatu berriro geroago.');
});

include("conf.php");
include("includes/funtzioak.php");

segurtasun_goiburuak();
sarrerak_garbitu();
saioa_abiarazi();

include("includes/mysql.php");

saioa_egiaztatu($conx);

// Onartutako orriak (zerrenda zuria). Beste edozein balio hasierako orrira doa.
$orriak = ['main', 'search', 'register', 'login', 'logout', 'account', 'updel', 'description', 'about'];
$saioa_behar = ['account'];
$admin_behar = ['updel', 'description'];

$action = $_GET['action'] ?? 'main';
if (!in_array($action, $orriak, true) || $action == 'search') {
    $action = 'main';
}

if ($action == 'logout') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        csrf_egiaztatu();
        saioa_itxi();
    }
    birbideratu();
}
if (in_array($action, $saioa_behar, true) && !saioa_du()) {
    birbideratu('index.php?action=login');
}
if (in_array($action, $admin_behar, true) && !admin_da()) {
    birbideratu();
}

?>
<!DOCTYPE html>
<html lang="eu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="<?= e($enpresa) ?>: gaileten katalogoa eta denda">
<title><?= e($enpresa) ?></title>
<link rel="icon" href="logo.svg" type="image/svg+xml">
<link rel="stylesheet" href="style.css">
<script src="baieztatu.js" defer></script>
</head>
<body>
<header class="goiburua">
    <a href="index.php"><img src="logo.svg" alt="<?= e($enpresa) ?> logotipoa" width="100" height="100"></a>
    <h1><?= e($enpresa) ?></h1>
</header>

<nav class="menua">
<?php if (saioa_du()): ?>
    <span>Ongi etorri, <?= e($_SESSION['username']) ?></span>
    <a href="index.php?action=account">Kontua</a>
    <?php if (admin_da()): ?>
    <a href="index.php?action=updel">Igo/Ezabatu</a>
    <?php endif; ?>
    <form method="post" action="index.php?action=logout" class="lerroan">
        <?= csrf_eremua() ?>
        <button type="submit" class="esteka">Saioa itxi</button>
    </form>
<?php else: ?>
    <a href="index.php?action=register">Erregistratu</a>
    <a href="index.php?action=login">Saioa hasi</a>
<?php endif; ?>
    <a href="index.php">Hasiera</a>
    <a href="index.php?action=about">Enpresari buruz</a>
</nav>

<form class="bilaketa" method="get" action="index.php" role="search">
    <input type="hidden" name="action" value="search">
    <label for="keyword" class="ezkutua">Bilatu produktuak</label>
    <input type="search" id="keyword" name="keyword" placeholder="Bilatu produktuak..." value="<?= e($_GET['keyword'] ?? '') ?>">
    <button type="submit">Bilatu</button>
</form>

<main>
<?php include("includes/" . $action . ".php"); ?>
</main>

<footer class="oina">
    <b><?= e($enpresa) ?> <?= e($version) ?></b>
</footer>
</body>
</html>
