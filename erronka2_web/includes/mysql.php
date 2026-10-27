<?php
defined('SARRERA') or exit;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conx = mysqli_connect($mysql_host, $mysql_user, $mysql_pass, $mysql_db);
    mysqli_set_charset($conx, 'utf8mb4');
} catch (mysqli_sql_exception $ex) {
    error_log($ex->getMessage());
    http_response_code(500);
    exit('Ezin da datu-basera konektatu.');
}
