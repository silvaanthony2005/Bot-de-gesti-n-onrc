-- ==========================================================
-- SCRIPT DE CONFIGURACIÓN DE MEMORIA PARA AGENTE N8N
-- ==========================================================
-- Ejecuta este script en tu base de datos PostgreSQL
-- (La misma base de datos donde tienes las tablas actaueh y unidosueh)

-- 1. Crear la tabla para guardar el historial del chat
CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear un índice para que el bot responda rápido (búsqueda veloz por sesión)
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);

-- ==========================================================
-- EXPLICACIÓN:
-- session_id: Es el ID que enviamos desde el el Frontend (o el generado por JS)
--             para identificar la conversación del ciudadano.
-- message:    Guarda lo que dijo el usuario (HumanMessage) y lo que respondió
--             la IA (AIMessage) en formato JSON.
-- ==========================================================
