-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-10-2024 a las 21:32:28
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Crear la base de datos si no existe y usarla
CREATE DATABASE IF NOT EXISTS cheque;
USE cheque;

-- --------------------------------------------------------

-- Estructura de tabla para la tabla cheques
CREATE TABLE cheques (
  numero_cheque int(11) NOT NULL,
  fecha date NOT NULL,
  proveedor_id int(11) NOT NULL,
  monto decimal(10,2) NOT NULL,
  monto_en_letras text DEFAULT NULL,
  observaciones varchar(750) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla cheques
INSERT INTO cheques (numero_cheque, fecha, proveedor_id, monto, monto_en_letras, observaciones) VALUES
(2, '2024-10-09', 1, 0.00, '', 'adfsfaafs'),
(3, '2024-10-09', 1, 0.00, '', 'adfsfaafs'),
(4, '2024-10-09', 10, 0.00, '', 'adfsfaafs'),
(5, '2024-10-09', 10, 0.00, '', 'adfsfaafs'),
(6, NULL, 1, 0.00, '', ''), -- Cambiado '0000-00-00' a NULL
(7, NULL, 1, 0.00, '', ''), -- Cambiado '0000-00-00' a NULL
(8, '2024-10-31', 9, 0.00, '', 'safasfasf'),
(9, '2024-10-23', 6, 12442.42, '', 'asfafasfasfas'),
(10, '2024-10-16', 2, 13.55, 'TRECE 55/100 Balboas.', 'Manzanas y Agua.'),
(11, '2024-10-10', 1, 11124.00, 'ONCE MIL CIENTO VEINTE Y CUATRO 00/100 Balboas.', 'jaslkfjlkasfjlkasklfajlfkas'),
(12, '2024-10-10', 2, 23.00, 'VEINTE Y TRES 00/100 Balboas.', 'asjljfsajflñalsfñkafjkqwr'),
(13, '2024-10-10', 10, 101.00, 'CIENTO UNO 00/100 Balboas.', 'aslfklaksjfkafl'),
(14, '2024-10-11', 4, 30.40, 'TREINTA 40/100 Balboas.', 'as.fskfkasjflkasf'),
(18, NULL, 1, 0.00, '', ''), -- Cambiado '0000-00-00' a NULL
(19, '2024-10-19', 1, 1001.00, 'MIL UNO 00/100 Balboas.', 'Hola'),
(20, '2024-10-18', 11, 14.05, 'CATORCE 05/100 Balboas.', 'safasfasasfasf');

-- --------------------------------------------------------

-- Estructura de tabla para la tabla proveedores
CREATE TABLE proveedores (
  id int(11) NOT NULL,
  nombre varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- Volcado de datos para la tabla proveedores
INSERT INTO proveedores (id, nombre) VALUES
(1, 'Supermercados Rey'),
(2, 'Copa Airlines'),
(3, 'Farmacias Arrocha'),
(4, 'Cable & Wireless Panamá'),
(5, 'Banesco Panamá'),
(6, 'Ricardo Pérez, S.A.'),
(7, 'Felipe Motta e Hijo, S.A.'),
(8, 'Cervecería Nacional'),
(9, 'Grupo Melo'),
(10, 'Global Bank'),
(11, 'Carlos Reina'),
(12, 'asfasfas'),
(13, 'Joel Abrego'),
(14, 'Carlos Vicente'),
(15, 'Mery Abrego'),
(28, 'dasfasf'),
(29, 'afsfasfasf'),
(31, 'ASAFASFA');

-- --------------------------------------------------------

-- Índices para tablas volcadas

-- Índices de l a tabla cheques
ALTER TABLE cheques
  ADD PRIMARY KEY (numero_cheque),
  ADD KEY proveedor_id (proveedor_id);

-- Índices de la tabla proveedores
ALTER TABLE proveedores
  ADD PRIMARY KEY (id);

-- AUTO_INCREMENT de las tablas volcadas

-- AUTO_INCREMENT de la tabla cheques
ALTER TABLE cheques
  MODIFY numero_cheque int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

-- AUTO_INCREMENT de la tabla proveedores
ALTER TABLE proveedores
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

-- Restricciones para tablas volcadas

-- Filtros para la tabla cheques
ALTER TABLE cheques
  ADD CONSTRAINT cheques_ibfk_1 FOREIGN KEY (proveedor_id) REFERENCES proveedores (id);
COMMIT;

-- Agregar la columna 'estado' a la tabla 'cheques'
ALTER TABLE cheques
ADD COLUMN estado ENUM('vigente', 'anulado') NOT NULL DEFAULT ' ';

ALTER TABLE cheques
ADD COLUMN fecha_anulacion date DEFAULT NULL;



-- Actualizar el estado de los cheques 5 y 10 a 'anulado'
UPDATE cheques 
SET estado = 'anulado' 
WHERE numero_cheque IN (5, 10);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;