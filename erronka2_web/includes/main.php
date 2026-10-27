<?php
defined('SARRERA') or exit;

$testua = trim($_GET['keyword'] ?? '');
$bilaketa = '%' . $testua . '%';

$emaitza = kontsulta($conx, "SELECT * FROM produktuak WHERE izena LIKE ? OR deskripzioa LIKE ? ORDER BY id", 'ss', $bilaketa, $bilaketa);
$produktuak = mysqli_fetch_all($emaitza, MYSQLI_ASSOC);

if (count($produktuak) == 0) {
?>
    <fieldset class="kutxa kutxa-zabala">
        <legend>Ez dago produkturik katalogoan<?= $testua !== '' ? ' "' . e($testua) . '" deitzen denik' : '' ?></legend>
        <?php if (admin_da()): ?>
        <h3><a href="index.php?action=updel">Eguneratu</a> katalogoa.</h3>
        <?php else: ?>
        <h3>Enpresaren hasierako orria</h3>
        <?php endif; ?>
    </fieldset>
<?php
} else {
    foreach ($produktuak as $data) {
?>
    <article class="produktua">
        <div class="produktua-irudia">
            <a href="images/<?= e($data['pic']) ?>"><img src="images/<?= e($data['pic']) ?>" alt="<?= e($data['izena']) ?>"></a>
        </div>
        <div class="produktua-datuak">
            <fieldset>
                <legend>Izena</legend>
                <p><?= e($data['izena']) ?> - <?= prezioa($data['salneurria']) ?></p>
            </fieldset>
            <fieldset>
                <legend>Deskripzioa</legend>
                <p><?= nl2br(e($data['deskripzioa'])) ?></p>
            </fieldset>
            <?php if (admin_da()): ?>
            <a href="index.php?action=description&amp;pic_id=<?= (int)$data['id'] ?>"><b>Deskripzioa/Salneurria aldatu</b></a>
            <?php elseif (saioa_du()): ?>
            <a href="#" class="saskia"><img src="images/pngegg.png" alt="Saskira gehitu"></a>
            <?php endif; ?>
        </div>
    </article>
<?php
    }
}
