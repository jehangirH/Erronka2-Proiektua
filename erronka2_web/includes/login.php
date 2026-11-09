<?php
defined('SARRERA') or exit;

if (saioa_du()) {
    echo '<p class="mezua">Saioa hasita duzu dagoeneko.</p>';
    return;
}

$errorea = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_egiaztatu();
    $username = trim($_POST['username'] ?? '');
    $pasahitza = $_POST['password'] ?? '';
    $user = mysqli_fetch_assoc(kontsulta($conx, "SELECT username, password, rola FROM users WHERE username = ?", 's', $username));

    $hash = $user ? pasahitza_egiaztatu($conx, $user['username'], $pasahitza, $user['password']) : null;
    if ($hash) {
        saioa_ireki($user['username'], $user['rola'], $hash);
        birbideratu();
    }
    $errorea = 'Erabiltzailea edo pasahitza ez da zuzena.';
}

?>
<fieldset class="kutxa">
    <legend>Saioa hasi</legend>
    <?php if (isset($_GET['erregistratuta'])): ?>
    <p class="mezua">Erregistroa eginda. Orain saioa has dezakezu.</p>
    <?php endif; ?>
    <?php if (isset($_GET['iraungita'])): ?>
    <p class="errorea">Saioa amaitu da. Hasi saioa berriro.</p>
    <?php endif; ?>
    <?php if ($errorea): ?>
    <p class="errorea"><?= e($errorea) ?></p>
    <?php endif; ?>
    <form action="index.php?action=login" method="post" class="formularioa">
        <?= csrf_eremua() ?>
        <label for="username">Erabiltzailea / emaila</label>
        <input type="text" id="username" name="username" autocomplete="username" required value="<?= e($_POST['username'] ?? '') ?>">
        <label for="password">Pasahitza</label>
        <input type="password" id="password" name="password" autocomplete="current-password" required>
        <button type="submit">Sartu</button>
    </form>
</fieldset>
