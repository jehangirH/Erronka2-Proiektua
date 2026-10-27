-- Lehendik dagoen BDweb datu-base bat bertsio berrira egokitzeko (XAMPP).
-- MD5 pasahitz zaharrek funtzionatzen jarraitzen dute, eta saioa hastean password_hash()-era eguneratzen dira.
USE BDweb;

ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL;
ALTER TABLE users ADD COLUMN rola ENUM('admin', 'bezeroa') NOT NULL DEFAULT 'bezeroa';
ALTER TABLE users ADD UNIQUE (username);
UPDATE users SET rola = 'admin' WHERE username = 'admin@bdweb';

-- Aplikazioaren erabiltzailea (aldatu pasahitza eta jarri bera conf.php-n)
CREATE USER IF NOT EXISTS 'bdweb_app'@'localhost' IDENTIFIED BY 'aldatu_pasahitz_hau';
GRANT SELECT, INSERT, UPDATE, DELETE ON BDweb.* TO 'bdweb_app'@'localhost';
FLUSH PRIVILEGES;
