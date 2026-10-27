<?php
defined('SARRERA') or exit;

$pic_id = (int)($_GET['pic_id'] ?? 0);
$data = mysqli_fetch_assoc(kontsulta($conx, "SELECT * FROM produktuak WHERE id = ?", 'i', $pic_id));
if (!$data) {
    birbideratu();
}

$errorea = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_egiaztatu();
    $deskripzioa = trim($_POST['deskripzioa'] ?? '');
    $salneurria = $data['salneurria'];

    $berria = trim($_POST['salneurria'] ?? '');
    if ($berria !== '') {
        $salneurria = filter_var(str_replace(',', '.', $berria), FILTER_VALIDATE_FLOAT);
        if ($salneurria === false || $salneurria < 0) {
            $errorea = 'Salneurriak zenbaki positiboa izan behar du (adibidez, 12,50).';
        }
    }

    if (!$errorea) {
        kontsulta($conx, "UPDATE produktuak SET deskripzioa = ?, salneurria = ? WHERE id = ?", 'sdi', $deskripzioa, $salneurria, $pic_id);
        birbideratu();
    }
}

?>
<fieldset class="kutxa">
    <legend>Deskripzioa</legend>
    <h4><?= e($data['izena']) ?> - <?= prezioa($data['salneurria']) ?></h4>
    <img src="images/<?= e($data['pic']) ?>" alt="<?= e($data['izena']) ?>" class="produktu-argazkia">
    <?php if ($errorea): ?>
    <p class="errorea"><?= e($errorea) ?></p>
    <?php endif; ?>
    <form action="index.php?action=description&amp;pic_id=<?= $pic_id ?>" method="post" class="formularioa">
        <?= csrf_eremua() ?>
        <label for="deskripzioa">Deskripzioa:</label>
        <textarea id="deskripzioa" name="deskripzioa" rows="10"><?= e($_POST['deskripzioa'] ?? $data['deskripzioa']) ?></textarea>
        <label for="salneurria">Salneurri berria (€):</label>
        <input type="text" id="salneurria" name="salneurria" inputmode="decimal" placeholder="<?= e(number_format((float)$data['salneurria'], 2, ',', '')) ?>">
        <button type="submit">Aldatu</button>
    </form>
</fieldset>
