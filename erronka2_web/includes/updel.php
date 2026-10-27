<?php
defined('SARRERA') or exit;

$mezua = '';
$errorea = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_egiaztatu();

    if (isset($_POST['ezabatu'])) {
        $id = (int)$_POST['ezabatu'];
        $delfile = mysqli_fetch_assoc(kontsulta($conx, "SELECT pic FROM produktuak WHERE id = ?", 'i', $id));
        if ($delfile) {
            kontsulta($conx, "DELETE FROM produktuak WHERE id = ?", 'i', $id);
            // Irudia beste produkturen batek erabiltzen ez badu bakarrik ezabatu
            $erabilia = mysqli_fetch_row(kontsulta($conx, "SELECT COUNT(*) FROM produktuak WHERE pic = ?", 's', $delfile['pic']))[0];
            $bidea = 'images/' . basename($delfile['pic']);
            if ($erabilia == 0 && $delfile['pic'] !== 'pngegg.png' && is_file($bidea)) {
                unlink($bidea);
            }
            $mezua = 'Produktua ezabatuta.';
        }
    } else {
        $izena = trim($_POST['izena'] ?? '');
        $deskripzioa = trim($_POST['deskripzioa'] ?? '');
        $salneurria = filter_var(str_replace(',', '.', $_POST['salneurria'] ?? ''), FILTER_VALIDATE_FLOAT);
        $stock = filter_var($_POST['stock'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]);

        if ($izena === '') {
            $errorea = 'Izena derrigorrezkoa da.';
        } elseif ($salneurria === false || $salneurria < 0) {
            $errorea = 'Salneurriak zenbaki positiboa izan behar du (adibidez, 12,50).';
        } elseif ($stock === false) {
            $errorea = 'Stockak zenbaki oso positiboa izan behar du.';
        } else {
            $pic = irudia_igo($_FILES['upfile'] ?? null, 'images', $errorea);
            if ($pic === null && !$errorea) {
                $errorea = 'Produktuaren irudia aukeratu behar da.';
            }
            if ($pic !== null) {
                kontsulta($conx, "INSERT INTO produktuak (izena, deskripzioa, salneurria, pic, stock) VALUES (?, ?, ?, ?, ?)",
                    'ssdsi', $izena, $deskripzioa, $salneurria, $pic, $stock);
                $mezua = 'Produktua "' . $izena . '" txertatuta.';
            }
        }
    }
}

$produktuak = mysqli_fetch_all(kontsulta($conx, "SELECT * FROM produktuak ORDER BY id"), MYSQLI_ASSOC);

?>
<?php if ($mezua): ?><p class="mezua"><?= e($mezua) ?></p><?php endif; ?>
<?php if ($errorea): ?><p class="errorea"><?= e($errorea) ?></p><?php endif; ?>

<div class="zutabeak">
    <fieldset class="kutxa">
        <legend>Produktu berria</legend>
        <form enctype="multipart/form-data" action="index.php?action=updel" method="post" class="formularioa">
            <?= csrf_eremua() ?>
            <label for="izena">Izena</label>
            <input type="text" id="izena" name="izena" required>
            <label for="deskripzioa">Deskripzioa</label>
            <textarea id="deskripzioa" name="deskripzioa" rows="4"></textarea>
            <label for="salneurria">Salneurria (€)</label>
            <input type="text" id="salneurria" name="salneurria" inputmode="decimal" required>
            <label for="stock">Stock</label>
            <input type="number" id="stock" name="stock" min="0" step="1" required>
            <label for="upfile">Irudia aukeratu</label>
            <input type="file" id="upfile" name="upfile" accept="image/jpeg,image/png,image/gif,image/webp" required>
            <button type="submit">Igo</button>
        </form>
    </fieldset>

    <fieldset class="kutxa">
        <legend>Ezabatu</legend>
        <?php foreach ($produktuak as $produktua): ?>
        <div class="ezabatu-elementua">
            <p><?= e($produktua['izena']) ?></p>
            <a href="images/<?= e($produktua['pic']) ?>"><img src="images/<?= e($produktua['pic']) ?>" alt="<?= e($produktua['izena']) ?>" class="miniatura"></a>
            <form method="post" action="index.php?action=updel" onsubmit="return confirm('Ziur zaude?');">
                <?= csrf_eremua() ?>
                <input type="hidden" name="ezabatu" value="<?= (int)$produktua['id'] ?>">
                <button type="submit" class="esteka"><b>Produktua ezabatu</b></button>
            </form>
        </div>
        <?php endforeach; ?>
    </fieldset>
</div>
