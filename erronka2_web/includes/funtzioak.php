<?php
defined('SARRERA') or exit;

const IRUDI_MOTAK = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp'];
const IRUDI_MAX = 2 * 1024 * 1024;
const PASAHITZ_MIN = 8;
const SAIO_INAKTIBITATEA = 30 * 60; // Jarduerarik gabe saioa ixteko denbora (segundotan)
const SAIO_GEHIENEZ = 8 * 60 * 60;  // Saioaren gehieneko iraupena
const SAIO_BERRITU = 15 * 60;       // Saio-IDa aldatzeko maiztasuna

// Testu-eremuak bakarrik onartu: izena[]=x bezalako parametroek errore larriak eragiten dituzte.
// $_POST['data'] da array bat izan daitekeen eremu bakarra (erregistro-formularioa).
function sarrerak_garbitu() {
    $data = $_POST['data'] ?? [];
    $_GET = array_filter($_GET, 'is_string');
    $_POST = array_filter($_POST, 'is_string');
    if (is_array($data)) {
        $_POST['data'] = array_filter($data, 'is_string');
    }
}

// Babes-goiburuak. CSP-k kanpoko eta lerroko script-ak blokeatzen ditu, ihes bat ahaztuz gero ere.
function segurtasun_goiburuak() {
    header_remove('X-Powered-By');
    header("Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: same-origin');
}

// HTMLrako ihes egin (XSS saihesteko)
function e($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function prezioa($n) {
    return number_format((float)$n, 2, ',', '.') . "\u{00A0}€"; // Zuriune zatiezina: € ez da lerro berrira pasatzen
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

function saioa_abiarazi() {
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.use_trans_sid', '0');
    ini_set('session.gc_maxlifetime', (string)SAIO_INAKTIBITATEA);
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_start();
}

// Saioa hasi: IDa aldatu (session fixation saihesteko) eta erabiltzailearen datuak gorde.
function saioa_ireki($username, $rola, $pasahitz_hash) {
    session_regenerate_id(true);
    $orain = time();
    $_SESSION['username'] = $username;
    $_SESSION['rola'] = $rola;
    $_SESSION['aztarna'] = pasahitz_aztarna($pasahitz_hash);
    $_SESSION['hasiera'] = $orain;
    $_SESSION['azken_ekintza'] = $orain;
    $_SESSION['berritua'] = $orain;
    unset($_SESSION['csrf']);
}

// Saioa guztiz itxi: zerbitzariko datuak eta nabigatzaileko cookie-a ezabatu.
function saioa_itxi() {
    $_SESSION = [];
    $cookie = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => $cookie['path'],
        'domain' => $cookie['domain'],
        'secure' => $cookie['secure'],
        'httponly' => $cookie['httponly'],
        'samesite' => $cookie['samesite'],
    ]);
    session_destroy();
}

// Eskaera bakoitzean: saioak balio du oraindik? Erabiltzailea ezabatu bada, pasahitza aldatu bada
// edo denbora-muga pasa bada, saioa itxi egiten da. Rola beti datu-basetik hartzen da.
function saioa_egiaztatu($conx) {
    if (!saioa_du()) {
        return;
    }
    $orain = time();
    $user = mysqli_fetch_assoc(kontsulta($conx, "SELECT password, rola FROM users WHERE username = ?", 's', $_SESSION['username']));
    if (!$user
        || !hash_equals($_SESSION['aztarna'] ?? '', pasahitz_aztarna($user['password']))
        || $orain - ($_SESSION['azken_ekintza'] ?? 0) > SAIO_INAKTIBITATEA
        || $orain - ($_SESSION['hasiera'] ?? 0) > SAIO_GEHIENEZ) {
        saioa_itxi();
        birbideratu('index.php?action=login&iraungita=1');
    }
    $_SESSION['rola'] = $user['rola'];
    $_SESSION['azken_ekintza'] = $orain;
    if ($orain - ($_SESSION['berritua'] ?? 0) > SAIO_BERRITU) {
        session_regenerate_id(true);
        $_SESSION['berritua'] = $orain;
    }
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

// Pasahitzak datu-basean gordetzeko hash-a (MD5).
function pasahitza_hasheatu($pasahitza) {
    return md5($pasahitza);
}

// Saioan pasahitzaren hash-a ez gordetzeko, haren aztarna bat erabiltzen da.
function pasahitz_aztarna($hash) {
    return hash('sha256', $hash);
}

// Pasahitza egiaztatu. Lehengo bcrypt hash-ak ere onartzen dira, eta saioa hastean MD5-era bihurtzen dira.
function pasahitza_egiaztatu($conx, $username, $pasahitza, $hash) {
    if (hash_equals($hash, pasahitza_hasheatu($pasahitza))) {
        return true;
    }
    if (password_verify($pasahitza, $hash)) {
        kontsulta($conx, "UPDATE users SET password = ? WHERE username = ?", 'ss', pasahitza_hasheatu($pasahitza), $username);
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
