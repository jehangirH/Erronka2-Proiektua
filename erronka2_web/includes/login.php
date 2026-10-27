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
    $user = mysqli_fetch_assoc(kontsulta($conx, "SELECT username, password, rola FROM users WHERE username = ?", 's', $username));

    if ($user && pasahitza_egiaztatu($conx, $user['username'], $_POST['password'] ?? '', $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['username'] = $user['username'];
        $_SESSION['rola'] = $user['rola'];
        unset($_SESSION['csrf']);
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
