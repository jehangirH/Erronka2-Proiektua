-- Aplikazioaren MySQL erabiltzaileak behar dituen baimenak bakarrik (Docker-ek sortzen du erabiltzailea)
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'bdweb_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON BDweb.* TO 'bdweb_app'@'%';
FLUSH PRIVILEGES;
