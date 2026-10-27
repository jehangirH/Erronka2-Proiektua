<?php
defined('SARRERA') or exit;

const IRUDI_MOTAK = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp'];
const IRUDI_MAX = 2 * 1024 * 1024;
const PASAHITZ_MIN = 8;

// HTMLrako ihes egin (XSS saihesteko)
function e($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function prezioa($n) {
    return number_format((float)$n, 2, ',', '.') . ' €';
}

function birbideratu($url = 'index.php') {
    while (ob_get_level()) {
        ob_end_clean();
    }
    header('Location: ' . $url);
    exit;
}

function saioa_du() {
    return isset($_SESSION['username']);
}

function admin_da() {
    return ($_SESSION['rola'] ?? '') === 'admin';
}

// Prestatutako kontsulta bat exekutatu. SELECT batean emaitza itzultzen du, bestela true.
function kontsulta($conx, $sql, $motak = '', ...$balioak) {
    $stmt = mysqli_prepare($conx, $sql);
    if ($motak !== '') {
        mysqli_stmt_bind_param($stmt, $motak, ...$balioak);
    }
    mysqli_stmt_execute($stmt);
    return mysqli_stmt_get_result($stmt) ?: true;
}

function csrf_token() {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_eremua() {
    return '<input type="hidden" name="csrf" value="' . csrf_token() . '">';
}

function csrf_egiaztatu() {
    if (!hash_equals(csrf_token(), $_POST['csrf'] ?? '')) {
        while (ob_get_level()) {
            ob_end_clean();
        }
        http_response_code(400);
        exit('Eskaera baliogabea. Itzuli aurreko orrira eta saiatu berriro.');
    }
}

// Pasahitza egiaztatu. MD5 hash zaharrak ere onartzen dira, eta password_hash()-era eguneratzen dira.
function pasahitza_egiaztatu($conx, $username, $pasahitza, $hash) {
    if (password_verify($pasahitza, $hash)) {
        return true;
    }
    if (strlen($hash) === 32 && hash_equals($hash, md5($pasahitza))) {
        kontsulta($conx, "UPDATE users SET password = ? WHERE username = ?", 'ss', password_hash($pasahitza, PASSWORD_DEFAULT), $username);
        return true;
    }
    return false;
}

// Igotako irudia egiaztatu eta $karpeta-n gorde ausazko izen batekin.
// Fitxategi-izena itzultzen du; irudirik ez badago edo errore bat badago, null ($errorea betetzen da).
function irudia_igo($fitxategia, $karpeta, &$errorea) {
    $errorea = '';
    if (!$fitxategia || $fitxategia['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($fitxategia['error'] !== UPLOAD_ERR_OK || $fitxategia['size'] > IRUDI_MAX) {
        $errorea = 'Irudiak 2 MB baino gutxiago izan behar ditu.';
        return null;
    }
    $ext = strtolower(pathinfo($fitxategia['name'], PATHINFO_EXTENSION));
    $mime = mime_content_type($fitxategia['tmp_name']);
    if (!isset(IRUDI_MOTAK[$ext]) || IRUDI_MOTAK[$ext] !== $mime || getimagesize($fitxategia['tmp_name']) === false) {
        $errorea = 'Irudiak JPG, PNG, GIF edo WEBP formatuan egon behar du.';
        return null;
    }
    $izena = bin2hex(random_bytes(16)) . '.' . $ext;
    if (!move_uploaded_file($fitxategia['tmp_name'], $karpeta . '/' . $izena)) {
        $errorea = 'Ezin izan da irudia gorde.';
        return null;
    }
    return $izena;
}
