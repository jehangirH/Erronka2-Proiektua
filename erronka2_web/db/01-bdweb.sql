-- BDweb datu-basea: taulak eta hasierako datuak
-- Probako erabiltzaileak: admin@bdweb / Admin1234 (admin) eta bezeroa@bdweb.eus / Bezeroa1234 (bezeroa)

CREATE DATABASE IF NOT EXISTS BDweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE BDweb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rola ENUM('admin', 'bezeroa') NOT NULL DEFAULT 'bezeroa',
    izena VARCHAR(50) NOT NULL DEFAULT '',
    abizena VARCHAR(100) NOT NULL DEFAULT '',
    hiria VARCHAR(50) NOT NULL DEFAULT '',
    lurraldea VARCHAR(50) NOT NULL DEFAULT '',
    herrialdea VARCHAR(50) NOT NULL DEFAULT '',
    postakodea VARCHAR(10) NOT NULL DEFAULT '',
    telefonoa VARCHAR(20) NOT NULL DEFAULT '',
    irudia VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE produktuak (
    id INT AUTO_INCREMENT PRIMARY KEY,
    izena VARCHAR(100) NOT NULL,
    deskripzioa TEXT NOT NULL,
    salneurria DECIMAL(10,2) NOT NULL DEFAULT 0,
    pic VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (username, password, rola, izena, abizena, irudia) VALUES
('admin@bdweb', '$2y$10$83v27jg4ENf1WQ9HuXj5feiCalilg9KlFAH7g/JBr0ZPdarGH3V7O', 'admin', 'Admin', 'Proiektua', 'Soy_Admin.jpg'),
('bezeroa@bdweb.eus', '$2y$10$UWojLcI8Suv4YFDrHJAVEugAye7Q8Av9WpE/vFRKeRQNznqRcdS6u', 'bezeroa', 'Bezeroa', 'Proba', 'usuario.jpg');

INSERT INTO produktuak (izena, deskripzioa, salneurria, pic, stock) VALUES
('Produktu generikoa', 'Produktu generikoaren deskripzioa.', 19.95, 'generikoa.jpg', 10),
('3. produktua', '3. produktuaren deskripzioa.', 12.50, 'producto3.jpg', 5);
