<?php
defined('SARRERA') or exit;

$eremuak = [
    'email'     => 'Emaila / erabiltzailea',
    'firstname' => 'Izena',
    'lastname'  => 'Abizena',
    'city'      => 'Hiria',
    'stateProv' => 'Lurraldea',
    'country'   => 'Herrialdea',
    'postcode'  => 'Postakodea',
    'telephone' => 'Telefonoa',
];
$data = array_fill_keys(array_keys($eremuak), '');
$error = array_fill_keys(array_merge(array_keys($eremuak), ['password', 'imagen']), '');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_egiaztatu();
    foreach ($eremuak as $gakoa => $etiketa) {
        $data[$gakoa] = trim($_POST['data'][$gakoa] ?? '');
    }
    $pasahitza = $_POST['data']['password'] ?? '';
    $pasahitza2 = $_POST['data']['password2'] ?? '';

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $error['email'] = 'Emailak ez du formatu zuzena.';
    } elseif (mysqli_fetch_row(kontsulta($conx, "SELECT 1 FROM users WHERE username = ?", 's', $data['email']))) {
        $error['email'] = 'Email hori erregistratuta dago.';
    }
    if ($data['firstname'] === '') {
        $error['firstname'] = 'Izena derrigorrezkoa da.';
    }
    if ($data['lastname'] === '') {
        $error['lastname'] = 'Abizena derrigorrezkoa da.';
    }
    if ($data['postcode'] !== '' && !preg_match('/^\d{5}$/', $data['postcode'])) {
        $error['postcode'] = 'Postakodeak 5 zenbaki izan behar ditu.';
    }
    if ($data['telephone'] !== '' && !preg_match('/^\+?[0-9 ]{9,15}$/', $data['telephone'])) {
        $error['telephone'] = 'Telefonoak 9-15 zenbaki izan behar ditu.';
    }
    if (strlen($pasahitza) < PASAHITZ_MIN) {
        $error['password'] = 'Pasahitzak gutxienez ' . PASAHITZ_MIN . ' karaktere izan behar ditu.';
    } elseif ($pasahitza !== $pasahitza2) {
        $error['password'] = 'Pasahitzak ez datoz bat.';
    }

    if (!array_filter($error)) {
        $irudia = irudia_igo($_FILES['imagen'] ?? null, 'perfiles', $error['imagen']);
        if (!$error['imagen']) {
            kontsulta($conx,
                "INSERT INTO users (username, password, rola, izena, abizena, hiria, lurraldea, herrialdea, postakodea, telefonoa, irudia)
                 VALUES (?, ?, 'bezeroa', ?, ?, ?, ?, ?, ?, ?, ?)",
                'ssssssssss',
                $data['email'], password_hash($pasahitza, PASSWORD_DEFAULT), $data['firstname'], $data['lastname'],
                $data['city'], $data['stateProv'], $data['country'], $data['postcode'], $data['telephone'], $irudia);
            birbideratu('index.php?action=login&erregistratuta=1');
        }
    }
}

?>
<div class="kutxa kutxa-zabala register">
    <h2>Erregistroa egin</h2>
    <p><b>Sartu zure datuak.</b> Izena, abizena, emaila eta pasahitza derrigorrezkoak dira.</p>
    <form action="index.php?action=register" method="post" enctype="multipart/form-data" class="formularioa">
        <?= csrf_eremua() ?>
        <?php foreach ($eremuak as $gakoa => $etiketa): ?>
        <p>
            <label for="<?= $gakoa ?>"><?= $etiketa ?>:</label>
            <input type="<?= $gakoa == 'email' ? 'email' : ($gakoa == 'telephone' ? 'tel' : 'text') ?>" id="<?= $gakoa ?>" name="data[<?= $gakoa ?>]" placeholder="<?= e(mb_strtolower($etiketa)) ?>" value="<?= e($data[$gakoa]) ?>">
            <?php if ($error[$gakoa]): ?><span class="errorea"><?= e($error[$gakoa]) ?></span><?php endif; ?>
        </p>
        <?php endforeach; ?>
        <p>
            <label for="password">Pasahitza:</label>
            <input type="password" id="password" name="data[password]" autocomplete="new-password" minlength="<?= PASAHITZ_MIN ?>">
            <?php if ($error['password']): ?><span class="errorea"><?= e($error['password']) ?></span><?php endif; ?>
        </p>
        <p>
            <label for="password2">Pasahitza errepikatu:</label>
            <input type="password" id="password2" name="data[password2]" autocomplete="new-password">
        </p>
        <p>
            <label for="imagen">Irudia aukeratu:</label>
            <input type="file" id="imagen" name="imagen" accept="image/jpeg,image/png,image/gif,image/webp">
            <?php if ($error['imagen']): ?><span class="errorea"><?= e($error['imagen']) ?></span><?php endif; ?>
        </p>
        <p>
            <button type="reset">Garbitu</button>
            <button type="submit">Bidali</button>
        </p>
    </form>
</div>
