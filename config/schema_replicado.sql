-- Replica de esquema para PostgreSQL
-- Proyecto: Bot_CNE
-- Fecha: 2026-04-02
--
-- Uso sugerido:
--   psql -U <usuario> -d <base> -f config/schema_replicado.sql

BEGIN;

CREATE EXTENSION IF NOT EXISTS plpgsql;

-- =========================
-- 1) Autenticacion
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email);

-- =========================
-- 2) Registro Civil
-- =========================
CREATE TABLE IF NOT EXISTS registradores (
    id SERIAL PRIMARY KEY,
    nombre1 VARCHAR NOT NULL,
    nombre2 VARCHAR,
    apellido1 VARCHAR NOT NULL,
    apellido2 VARCHAR,
    cedula VARCHAR NOT NULL UNIQUE,
    oficina VARCHAR,
    resolucion_nro VARCHAR,
    resolucion_fecha VARCHAR,
    gaceta_nro VARCHAR,
    gaceta_tipo VARCHAR,
    gaceta_fecha VARCHAR
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_registradores_cedula ON registradores (cedula);

CREATE TABLE IF NOT EXISTS actas (
    id SERIAL PRIMARY KEY,
    numero_acta VARCHAR,
    tipo_acta VARCHAR,
    folio VARCHAR,
    fecha_acta TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    fecha_manifestacion VARCHAR,
    estado VARCHAR,
    municipio VARCHAR,
    parroquia VARCHAR,
    registrador_id INTEGER REFERENCES registradores(id)
);

CREATE INDEX IF NOT EXISTS ix_actas_numero_acta ON actas (numero_acta);

CREATE TABLE IF NOT EXISTS unidos (
    id SERIAL PRIMARY KEY,
    acta_id INTEGER REFERENCES actas(id) ON DELETE CASCADE,
    rol VARCHAR,
    nombre1 VARCHAR,
    nombre2 VARCHAR,
    apellido1 VARCHAR,
    apellido2 VARCHAR,
    cedula VARCHAR,
    tipo_documento VARCHAR DEFAULT 'V',
    fecha_nacimiento VARCHAR,
    edad VARCHAR,
    nacionalidad VARCHAR,
    estado_civil VARCHAR,
    profesion VARCHAR,
    direccion VARCHAR,
    pais_nac VARCHAR,
    estado_nac VARCHAR,
    municipio_nac VARCHAR
);

CREATE TABLE IF NOT EXISTS testigos (
    id SERIAL PRIMARY KEY,
    acta_id INTEGER REFERENCES actas(id) ON DELETE CASCADE,
    numero_testigo INTEGER,
    nombres VARCHAR,
    apellidos VARCHAR,
    cedula VARCHAR,
    tipo_documento VARCHAR DEFAULT 'V',
    edad VARCHAR,
    nacionalidad VARCHAR,
    profesion VARCHAR,
    direccion VARCHAR
);

CREATE TABLE IF NOT EXISTS actaueh (
    idactaueh SERIAL PRIMARY KEY,
    nacta INTEGER,
    tomo INTEGER,
    ano INTEGER,
    fechaacta TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    tipoacta VARCHAR DEFAULT 'UEH',
    solicitante_json VARCHAR
);

CREATE TABLE IF NOT EXISTS solicitudes_ueh_web (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR DEFAULT 'UEH',
    datos JSON,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- =========================
-- 3) Citas
-- =========================
CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora VARCHAR(20) NOT NULL,
    solicitante_email VARCHAR(255) NOT NULL,
    solicitante_nombre VARCHAR(255) NOT NULL,
    tipo_tramite VARCHAR(100),
    creado_en TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    google_event_id VARCHAR(255),
    confirmada BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS ix_citas_fecha ON citas (fecha);

-- =========================
-- 4) Historial chat
-- =========================
CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
