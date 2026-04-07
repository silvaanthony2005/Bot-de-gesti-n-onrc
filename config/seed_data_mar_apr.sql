-- Script EXTENSIVO con INSERTs explícitos para Marzo y Abril 2026
-- No utiliza funciones complejas, son inserciones directas listas para ejecutar.

-- ==========================================
-- 1. POBLAR TABLA: CITAS
-- ==========================================
INSERT INTO citas (fecha, hora, solicitante_email, solicitante_nombre, tipo_tramite, creado_en, confirmada) VALUES
-- Multiples citas en Marzo
('2026-03-02', '08:30', 'carlos.r@gmail.com', 'Carlos Ruiz', 'Unión Estable de Hecho', '2026-02-25 10:00:00', true),
('2026-03-02', '09:15', 'm.perez@yahoo.com', 'Maria Perez', 'Matrimonio', '2026-02-26 11:30:00', true),
('2026-03-02', '10:00', 'j.lopez@hotmail.com', 'Jose Lopez', 'Nacimiento', '2026-02-27 08:45:00', false),
('2026-03-04', '09:00', 'ana.m@gmail.com', 'Ana Martinez', 'Defunción', '2026-03-01 14:20:00', true),
('2026-03-04', '11:30', 'luis.h@outlook.com', 'Luis Hernandez', 'Unión Estable de Hecho', '2026-03-02 09:10:00', true),
('2026-03-06', '13:00', 'pedro.g@gmail.com', 'Pedro Garcia', 'Nacimiento', '2026-03-03 16:00:00', true),
('2026-03-10', '08:30', 'sofi.t@yahoo.com', 'Sofia Torres', 'Copia Certificada', '2026-03-06 10:15:00', false),
('2026-03-10', '10:00', 'laura.v@gmail.com', 'Laura Vargas', 'Matrimonio', '2026-03-07 11:50:00', true),
('2026-03-15', '09:45', 'c.diaz@hotmail.com', 'Carlos Diaz', 'Unión Estable de Hecho', '2026-03-10 08:00:00', true),
('2026-03-15', '11:00', 'j.castillo@gmail.com', 'Julia Castillo', 'Defunción', '2026-03-11 12:30:00', true),
('2026-03-15', '14:30', 'r.romero@yahoo.com', 'Rafael Romero', 'Nacimiento', '2026-03-12 09:45:00', false),
('2026-03-20', '10:30', 'm.ramirez@gmail.com', 'Monica Ramirez', 'Nacimiento', '2026-03-18 13:25:00', true),
('2026-03-24', '08:15', 'd.herrera@hotmail.com', 'Daniel Herrera', 'Unión Estable de Hecho', '2026-03-20 15:10:00', true),
('2026-03-28', '11:45', 'p.rojas@gmail.com', 'Patricia Rojas', 'Matrimonio', '2026-03-23 10:00:00', true),

-- Multiples citas en Abril
('2026-04-02', '08:15', 'r.castro@outlook.com', 'Roberto Castro', 'Defunción', '2026-03-30 09:00:00', true),
('2026-04-02', '13:00', 'e.flores@gmail.com', 'Elena Flores', 'Matrimonio', '2026-03-31 10:45:00', false),
('2026-04-06', '09:00', 'j.morales@yahoo.com', 'Jorge Morales', 'Unión Estable de Hecho', '2026-04-01 15:30:00', true),
('2026-04-06', '10:15', 'm.ortiz@gmail.com', 'Marta Ortiz', 'Nacimiento', '2026-04-02 08:20:00', true),
('2026-04-06', '14:00', 'f.cruz@hotmail.com', 'Fernando Cruz', 'Copia Certificada', '2026-04-03 16:45:00', true),
('2026-04-10', '08:45', 'a.silva@hotmail.com', 'Andres Silva', 'Copia Certificada', '2026-04-05 11:10:00', true),
('2026-04-10', '11:00', 'l.mendez@outlook.com', 'Lucia Mendez', 'Matrimonio', '2026-04-06 14:00:00', false),
('2026-04-15', '09:30', 'h.guzman@gmail.com', 'Hugo Guzman', 'Unión Estable de Hecho', '2026-04-10 09:30:00', true),
('2026-04-15', '10:45', 'b.paredes@yahoo.com', 'Beatriz Paredes', 'Defunción', '2026-04-11 11:20:00', true),
('2026-04-20', '10:00', 'v.rios@yahoo.com', 'Victoria Rios', 'Nacimiento', '2026-04-18 08:00:00', true),
('2026-04-22', '13:15', 'd.navarro@gmail.com', 'Diego Navarro', 'Defunción', '2026-04-20 15:45:00', true),
('2026-04-22', '14:30', 'g.acosta@hotmail.com', 'Gloria Acosta', 'Unión Estable de Hecho', '2026-04-20 10:10:00', true),
('2026-04-28', '08:30', 'c.mendoza@hotmail.com', 'Carmen Mendoza', 'Copia Certificada', '2026-04-25 10:20:00', false),
('2026-04-30', '09:00', 'e.gil@gmail.com', 'Eduardo Gil', 'Matrimonio', '2026-04-25 14:00:00', true);

-- ==========================================
-- 2. POBLAR TABLA: REGISTRADORES
-- ==========================================
INSERT INTO registradores (
	nombre1,
	nombre2,
	apellido1,
	apellido2,
	cedula,
	oficina,
	resolucion_nro,
	resolucion_fecha,
	gaceta_nro,
	gaceta_tipo,
	gaceta_fecha
) VALUES
('Registrador', '', 'Principal', '', 'V-999999', 'Registro Civil San Cristóbal', '000', '01/01/2024', '123', 'Extraordinaria', '01/01/2024'),
('Registrador', '', 'Principal', '', 'V-0000000', 'Oficina Registro Civil', '000', '01/01/2024', '123', 'Extraordinaria', '01/01/2024')
ON CONFLICT (cedula) DO NOTHING;

-- ==========================================
-- 3. POBLAR TABLA: ACTAS
-- ==========================================
INSERT INTO actas (numero_acta, folio, fecha_acta, fecha_manifestacion, estado, municipio, parroquia, registrador_id, tipo_acta) VALUES
-- Multiples actas de Marzo
('8001', '1', '2026-03-02 09:00:00', '2026-03-01', 'DISTRITO CAPITAL', 'LIBERTADOR', 'EL RECREO', 1, 'UEH'),
('8002', '2', '2026-03-02 10:30:00', '2026-02-28', 'MIRANDA', 'SUCRE', 'PETARE', 1, 'MATRIMONIO'),
('8003', '3', '2026-03-02 11:45:00', '2026-02-25', 'ARAGUA', 'GIRARDOT', 'MADRE MARIA', 1, 'NACIMIENTO'),
('8004', '4', '2026-03-04 09:30:00', '2026-03-03', 'DISTRITO CAPITAL', 'LIBERTADOR', 'CANDELARIA', 1, 'DEFUNCION'),
('8005', '5', '2026-03-04 12:00:00', '2026-03-02', 'CARABOBO', 'VALENCIA', 'SAN JOSE', 1, 'UEH'),
('8006', '6', '2026-03-06 14:15:00', '2026-03-04', 'ZULIA', 'MARACAIBO', 'CHIQUINQUIRA', 1, 'NACIMIENTO'),
('8007', '7', '2026-03-10 09:45:00', '2026-03-08', 'DISTRITO CAPITAL', 'LIBERTADOR', 'SAN JUAN', 1, 'NACIMIENTO'),
('8008', '8', '2026-03-10 11:15:00', '2026-03-05', 'MIRANDA', 'CHACAO', 'CHACAO', 1, 'MATRIMONIO'),
('8009', '9', '2026-03-15 10:00:00', '2026-03-14', 'DISTRITO CAPITAL', 'LIBERTADOR', 'SANTA ROSALIA', 1, 'UEH'),
('8010', '10', '2026-03-15 12:30:00', '2026-03-13', 'CARABOBO', 'VALENCIA', 'EL SOCORRO', 1, 'DEFUNCION'),
('8011', '11', '2026-03-20 11:30:00', '2026-03-18', 'ARAGUA', 'GIRARDOT', 'CHORONI', 1, 'NACIMIENTO'),
('8012', '12', '2026-03-24 09:00:00', '2026-03-22', 'MIRANDA', 'BARUTA', 'LAS MINAS', 1, 'UEH'),
('8013', '13', '2026-03-28 13:00:00', '2026-03-27', 'ZULIA', 'MARACAIBO', 'COQUIVACOA', 1, 'MATRIMONIO'),

-- Multiples actas de Abril
('8014', '14', '2026-04-02 09:00:00', '2026-04-01', 'CARABOBO', 'VALENCIA', 'EL SOCORRO', 1, 'DEFUNCION'),
('8015', '15', '2026-04-02 14:00:00', '2026-03-28', 'DISTRITO CAPITAL', 'LIBERTADOR', 'SUCRE', 1, 'MATRIMONIO'),
('8016', '16', '2026-04-06 09:45:00', '2026-04-04', 'MIRANDA', 'BARUTA', 'EL CAFETAL', 1, 'UEH'),
('8017', '17', '2026-04-06 11:00:00', '2026-04-05', 'ZULIA', 'MARACAIBO', 'OLEGARIO VILLALOBOS', 1, 'NACIMIENTO'),
('8018', '18', '2026-04-10 09:30:00', '2026-04-08', 'DISTRITO CAPITAL', 'LIBERTADOR', 'EL RECREO', 1, 'MATRIMONIO'),
('8019', '19', '2026-04-10 11:45:00', '2026-04-09', 'MIRANDA', 'SUCRE', 'LEONCIO MARTINEZ', 1, 'NACIMIENTO'),
('8020', '20', '2026-04-15 10:15:00', '2026-04-12', 'ARAGUA', 'GIRARDOT', 'LAS DELICIAS', 1, 'UEH'),
('8021', '21', '2026-04-15 12:00:00', '2026-04-14', 'CARABOBO', 'VALENCIA', 'SAN BLAS', 1, 'DEFUNCION'),
('8022', '22', '2026-04-20 11:00:00', '2026-04-19', 'MIRANDA', 'SUCRE', 'LEONCIO MARTINEZ', 1, 'NACIMIENTO'),
('8023', '23', '2026-04-22 14:30:00', '2026-04-21', 'CARABOBO', 'VALENCIA', 'SAN BLAS', 1, 'DEFUNCION'),
('8024', '24', '2026-04-22 15:45:00', '2026-04-20', 'DISTRITO CAPITAL', 'LIBERTADOR', 'MACARAO', 1, 'UEH'),
('8025', '25', '2026-04-28 09:00:00', '2026-04-26', 'DISTRITO CAPITAL', 'LIBERTADOR', 'SAN PEDRO', 1, 'UEH'),
('8026', '26', '2026-04-30 10:30:00', '2026-04-29', 'ARAGUA', 'GIRARDOT', 'PEDRO JOSE OVALLES', 1, 'MATRIMONIO');
