<?php
defined('SARRERA') or exit;

$mezua = '';
$errorea = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_egiaztatu();
    $ekintza = $_POST['ekintza'] ?? '';

    if ($ekintza == 'changepass') {
        $user = mysqli_fetch_assoc(kontsulta($conx, "SELECT password FROM users WHERE username = ?", 's', $_SESSION['username']));
        $berria = $_POST['newpass'] ?? '';
        if (!$user || !pasahitza_egiaztatu($conx, $_SESSION['username'], $_POST['oldpass'] ?? '', $user['password'])) {
            $errorea = 'Oraingo pasahitza ez da zuzena.';
        } elseif ($berria !== ($_POST['confnewpass'] ?? '')) {
            $errorea = 'Pasahitz berriak ez datoz bat.';
        } elseif (strlen($berria) < PASAHITZ_MIN) {
            $errorea = 'Pasahitzak gutxienez ' . PASAHITZ_MIN . ' karaktere izan behar ditu.';
        } else {
            kontsulta($conx, "UPDATE users SET password = ? WHERE username = ?", 'ss', password_hash($berria, PASSWORD_DEFAULT), $_SESSION['username']);
            $_SESSION = [];
            session_destroy();
            birbideratu('index.php?action=login');
        }
    }
    elseif ($ekintza == 'adduser' && admin_da()) {
        $newuser = trim($_POST['newuser'] ?? '');
        $newuserpass = $_POST['newuserpass'] ?? '';
        if (!filter_var($newuser, FILTER_VALIDATE_EMAIL)) {
            $errorea = 'Erabiltzaile-izenak email bat izan behar du.';
        } elseif (strlen($newuserpass) < PASAHITZ_MIN) {
            $errorea = 'Pasahitzak gutxienez ' . PASAHITZ_MIN . ' karaktere izan behar ditu.';
        } elseif (mysqli_fetch_row(kontsulta($conx, "SELECT 1 FROM users WHERE username = ?", 's', $newuser))) {
            $errorea = 'Erabiltzaile hori badago.';
        } else {
            kontsulta($conx, "INSERT INTO users (username, password, rola) VALUES (?, ?, 'bezeroa')", 'ss', $newuser, password_hash($newuserpass, PASSWORD_DEFAULT));
            $mezua = 'Erabiltzailea gehituta: ' . $newuser;
        }
    }
    elseif ($ekintza == 'deleteuser' && admin_da()) {
        $ezabatu = $_POST['username'] ?? '';
        if ($ezabatu === $_SESSION['username']) {
            $errorea = 'Ezin duzu zure burua ezabatu.';
        } else {
            $user = mysqli_fetch_assoc(kontsulta($conx, "SELECT irudia FROM users WHERE username = ?", 's', $ezabatu));
            if ($user) {
                kontsulta($conx, "DELETE FROM users WHERE username = ?", 's', $ezabatu);
                $bidea = 'perfiles/' . basename((string)$user['irudia']);
                if ($user['irudia'] && is_file($bidea)) {
                    unlink($bidea);
                }
                $mezua = 'Erabiltzailea ezabatuta: ' . $ezabatu;
            }
        }
    }
}

?>
<?php if ($mezua): ?><p class="mezua"><?= e($mezua) ?></p><?php endif; ?>
<?php if ($errorea): ?><p class="errorea"><?= e($errorea) ?></p><?php endif; ?>

<div class="zutabeak">
    <fieldset class="kutxa">
        <legend>Pasahitza aldatu</legend>
        <form action="index.php?action=account" method="post" class="formularioa">
            <?= csrf_eremua() ?>
            <input type="hidden" name="ekintza" value="changepass">
            <label for="oldpass">Oraingo pasahitza</label>
            <input type="password" id="oldpass" name="oldpass" autocomplete="current-password" required>
            <label for="newpass">Pasahitz berria</label>
            <input type="password" id="newpass" name="newpass" autocomplete="new-password" minlength="<?= PASAHITZ_MIN ?>" required>
            <label for="confnewpass">Pasahitz berria errepikatu</label>
            <input type="password" id="confnewpass" name="confnewpass" autocomplete="new-password" required>
            <button type="submit">Aldatu</button>
        </form>
    </fieldset>

    <?php if (admin_da()): ?>
    <div>
        <fieldset class="kutxa">
            <legend>Erabiltzailea gehitu</legend>
            <form action="index.php?action=account" method="post" class="formularioa">
                <?= csrf_eremua() ?>
                <input type="hidden" name="ekintza" value="adduser">
                <label for="newuser">Erabiltzaile berriaren emaila</label>
                <input type="email" id="newuser" name="newuser" required>
                <label for="newuserpass">Erabiltzaile berriaren pasahitza</label>
                <input type="password" id="newuserpass" name="newuserpass" autocomplete="new-password" minlength="<?= PASAHITZ_MIN ?>" required>
                <button type="submit">Gehitu</button>
            </form>
        </fieldset>

        <fieldset class="kutxa">
            <legend>Erabiltzailea ezabatu</legend>
            <table class="erabiltzaileak">
            <?php
            $users = kontsulta($conx, "SELECT username FROM users ORDER BY username");
            while ($user = mysqli_fetch_assoc($users)) {
                $nirea = $user['username'] === $_SESSION['username'];
            ?>
                <tr>
                    <td><?= $nirea ? '<b>' . e($user['username']) . '</b>' : e($user['username']) ?></td>
                    <td class="eskuinera">
                    <?php if ($nirea): ?>
                        <del>[ezabatu]</del>
                    <?php else: ?>
                        <form method="post" action="index.php?action=account" class="lerroan" onsubmit="return confirm('Ziur zaude?');">
                            <?= csrf_eremua() ?>
                            <input type="hidden" name="ekintza" value="deleteuser">
                            <input type="hidden" name="username" value="<?= e($user['username']) ?>">
                            <button type="submit" class="esteka">[ezabatu]</button>
                        </form>
                    <?php endif; ?>
                    </td>
                </tr>
            <?php } ?>
            </table>
        </fieldset>
    </div>
    <?php endif; ?>
</div>
