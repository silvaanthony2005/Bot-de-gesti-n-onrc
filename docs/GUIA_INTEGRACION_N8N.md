# 🔗 Guía de Integración: n8n + Base de Datos Central (chat_history)

Para que el agente de n8n y el Dashboard del bot estén perfectamente sincronizados, ambos deben conectarse a la misma base de datos de PostgreSQL: `chat_history`.

---

## 1. Configuración de Credenciales en n8n

En tu panel de n8n, crea o edita la credencial de **PostgreSQL** con estos datos (basados en tu archivo `.env`):

-   **Host:** `localhost` (o la IP donde corra tu DB)
-   **Database:** `chat_history`
-   **User:** `postgres`
-   **Password:** `usuario`
-   **Port:** `5432`
-   **SSL:** `Disable` (si es local)

---

## 2. Queries para el Agente de n8n (Herramientas SQL)

Cuando configures las herramientas (tools) del Agente de IA en n8n, utiliza estos esquemas de tablas que ya están creados y funcionando en el Backend de FastAPI:

### A. Consultar Citas Pendientes
Para que el bot sepa qué citas hay, el query de lectura debe ser:
```sql
SELECT id, fecha, hora, solicitante_nombre, tipo_tramite, confirmada 
FROM citas 
WHERE fecha >= CURRENT_DATE 
ORDER BY fecha ASC, hora ASC;
```

### B. Listar Registros UEH (Unión Estable)
Para mostrar trámites realizados:
```sql
SELECT idactaueh, nacta, fechaacta, tipoacta 
FROM actaueh 
ORDER BY fechaacta DESC 
LIMIT 10;
```

---

## 3. Flujo de Inserción desde n8n (Opcional)

Si quieres que una acción en el chat de n8n **inserte** datos directamente (aunque el bot ya lo hace vía API), usa el nodo **Postgres** con la operación **Insert**:

-   **Tabla:** `citas`
-   **Columnas:** `fecha`, `hora`, `solicitante_email`, `solicitante_nombre`, `tipo_tramite`

---

## 4. Beneficios de esta Unificación

1.  **Sincronización Total:** Lo que el usuario vea en el gráfico del Dashboard (Frontend) será lo mismo que el Agente de n8n responda por chat.
2.  **Límites Reales:** El límite de **50 citas** que implementamos en FastAPI operará sobre la tabla `citas`, por lo que n8n nunca podrá agendar una cita "fantasma" que no esté registrada.
3.  **Auditoría Única:** Todas las uniones estables se guardarán en `actaueh`, facilitando la generación de reportes mensuales.

---

### 🚀 Próximo Paso Sugerido:
Actualiza las credenciales de tu nodo Postgres en n8n ahora. Una vez hecho, prueba preguntándole al bot: *"¿Cuántas citas hay registradas para hoy?"* si la respuesta coincide con lo que ves en el Dashboard, la integración es exitosa.
