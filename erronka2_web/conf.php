<?php

//MySQL (Docker-en ingurune-aldagaietatik hartzen dira; bestela, balio lehenetsiak)
$mysql_host = getenv('DB_HOST') ?: "localhost";
$mysql_user = getenv('DB_USER') ?: "bdweb_app";
$mysql_pass = getenv('DB_PASS') ?: "aldatu_pasahitz_hau";
$mysql_db = getenv('DB_NAME') ?: "BDweb";

//Gallery
$enpresa = "Proiektua";
$version = "1.1";
