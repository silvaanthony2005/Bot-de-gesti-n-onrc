CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora VARCHAR(20) NOT NULL,
    solicitante_email VARCHAR(255) NOT NULL,
    solicitante_nombre VARCHAR(255) NOT NULL,
    tipo_tramite VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    google_event_id VARCHAR(255),
    confirmada BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_citas_fecha ON citas(fecha);
