# Arquitectura de Backend - Bot CNE

Este documento detalla la estructura, patrones de diseño y responsabilidad de cada componente en el backend del proyecto. El sistema está construido con **Python** utilizando el framework **FastAPI**, diseñado bajo una arquitectura en capas (Layered Architecture) que separa las responsabilidades de recepción de peticiones, lógica de negocio y validación de datos.

## 1. Patrón de Arquitectura (MVC / Service Layer)

Aunque comúnmente se le llama MVC (Modelo-Vista-Controlador), en el contexto de una API REST moderna como esta, utilizamos una variante más precisa: **Controller-Service-Model**.

- **Controller (Controlador):** Es la "puerta de entrada". Solo se preocupa de recibir la petición HTTP, validar los parámetros y llamar al servicio adecuado. No tiene lógica compleja.
- **Service (Servicio):** Es el "cerebro". Aquí vive la lógica de negocio. En este caso, la lógica de cómo comunicarse con n8n, manejar errores de red y procesar respuestas.
- **Model (Modelo):** Es la "estructura". Define cómo deben lucir los datos. Asegura que si esperamos un mensaje, recibamos un texto y no un número.

---

## 2. Estructura de Directorios (`backend/app/`)

A continuación, se explica el propósito de cada carpeta y qué tipo de archivos deben ir en ellas.

```
app/
├── controllers/       # Rutas y Endpoints de la API
├── services/          # Lógica de negocio e integraciones externas
├── models/            # Validaciones y esquemas de datos (Pydantic)
├── core/              # Configuraciones globales del proyecto
└── main.py            # Punto de entrada de la aplicación
```

### 📂 `controllers/`
**¿Qué va aquí?**
Archivos que definen las rutas (`endpoints`) de tu API (ej: `/chat`, `/users`).
**Responsabilidad:**
- Recibir la petición del frontend.
- Validar que el usuario tenga permisos (si hubiera autenticación).
- Llamar a la función del `service` correspondiente.
- Devolver la respuesta HTTP correcta (200 OK, 400 Bad Request, 500 Error).

### 📂 `services/`
**¿Qué va aquí?**
Clases o funciones que ejecutan acciones. Si tu bot necesita "pensar", "guardar en base de datos" o "llamar a n8n", el código va aquí.
**Responsabilidad:**
- Aislar el controlador de los detalles técnicos. Al controlador no le importa si usas `httpx` o `requests` para llamar a n8n, eso es problema del servicio.
**Ejemplo:** `n8n_service.py` gestiona toda la complejidad de la conexión HTTP.

### 📂 `models/`
**¿Qué va aquí?**
Clases de Python (usando la librería **Pydantic**) que actúan como "contratos" de datos.
**Responsabilidad:**
- Definir qué campos son obligatorios en una petición (`message` es requerido).
- Definir tipos de datos (`session_id` debe ser texto).
- Documentar automáticamente la API (estos modelos generan la documentación en `/docs`).

### 📂 `core/`
**¿Qué va aquí?**
Archivos de configuración que no cambian a menudo o que dependen del entorno.
**Responsabilidad:**
- Leer el archivo `.env`.
- Centralizar variables como URLs de webhooks, claves secretas o versiones.

---

## 3. Detalle de Archivos Clave

### `app/main.py`
Es el corazón de la ejecución.
- Inicializa la aplicación FastAPI.
- Configura **CORS** (Cross-Origin Resource Sharing) para permitir que tu Frontend (que corre en el puerto 5173) pueda hablar con este Backend (puerto 8000).
- Registra los "routers" (controladores) para que la app sepa qué rutas existen.

### `app/core/config.py`
Utiliza `pydantic-settings` para leer las variables de entorno de forma segura.
- Si olvidas poner `N8N_WEBHOOK_URL` en tu `.env`, este archivo lanzará un error al iniciar, avisándote inmediatamente del problema.

### `app/models/chat_model.py`
Define dos estructuras clave:
1.  `ChatRequest`: Lo que el usuario nos manda (mensaje, session_id).
2.  `ChatResponse`: Lo que nosotros devolvemos (texto de respuesta, documentos fuente).

### `app/services/n8n_service.py`
El componente más importante de la integración.
- Usa `httpx` (un cliente HTTP moderno y asíncrono) para no bloquear el servidor mientras espera a n8n.
- Contiene lógica de "resiliencia": busca la respuesta en varios campos posibles (`output`, `text`, `response`) para que tu flujo de n8n no tenga que ser perfecto.

### `app/controllers/chat_controller.py`
Define la ruta `POST /api/chat`.
- Inyecta el servicio `N8nService` como una dependencia. Esto hace el código más limpio y fácil de probar en el futuro.

---

## 4. Flujo de Información (Request Lifecycle)

Cuando escribes "Hola" en el chat, ocurre este viaje instantáneo:

1.  **Frontend** envía POST a `http://localhost:8000/api/chat`.
2.  **Main** recibe la petición y la pasa al **Controller** (`chat_controller`).
3.  **Controller** valida que el JSON tenga un campo `message` usando el **Model** (`ChatRequest`).
4.  **Controller** llama a `service.send_message(request)`.
5.  **Service** (`n8n_service`) toma el mensaje, lo empaqueta y lo envía a la URL de n8n definida en **Core** (`config`).
6.  **Service** espera la respuesta de n8n, la limpia y la devuelve como un objeto **Model** (`ChatResponse`).
7.  **Controller** convierte ese objeto en JSON y lo manda de vuelta al Frontend.
