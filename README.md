# 🤖 Bot CNE - Asistente Educativo con IA

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-green)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-teal)

Bienvenido al repositorio oficial del **Bot CNE**. Este proyecto es una solución completa de Chatbot Educativo Inteligente, diseñado para proporcionar planes de aprendizaje guiados y respuestas instantáneas mediante la integración de **Agentes de IA (n8n)**.

El sistema se compone de una arquitectura moderna, separando una interfaz de usuario reactiva y veloz de un backend robusto y escalable.

---

## 🚀 Características Principales

*   **Interfaz Moderna (UI/UX):** Diseño "Dark Neon" atractivo, totalmente responsivo (Móvil/Escritorio) y con animaciones fluidas.
*   **Arquitectura Modular:** Frontend organizado con Atomic Design y Backend siguiendo patrones MVC/Service Layer.
*   **Integración de IA Real:** Conexión vía Webhook a flujos de trabajo en **n8n** (modelos LLM).
*   **Feedback Visual:** Indicadores de cargo, manejo de errores y renderizado de texto enriquecido.

---

## 🛠️ Stack Tecnológico

### Frontend (`/frontend`)
*   **Framework:** React 18
*   **Build Tool:** Vite (Ultra rápido)
*   **Estilos:** Tailwind CSS
*   **HTTP Client:** Axios
*   **Iconos:** Lucide React

### Backend (`/backend`)
*   **Framework:** FastAPI (Python 3.10+)
*   **Validación:** Pydantic
*   **Servidor:** Uvicorn (ASGI)
*   **Integración:** HTTPX (Cliente asíncrono para n8n)

---

## 📂 Estructura del Proyecto

```bash
Bot_CNE/
├── backend/            # API REST (FastAPI)
│   ├── app/
│   │   ├── controllers/ # Endpoints de la API
│   │   ├── services/    # Conexión con n8n
│   │   ├── models/      # Esquemas de datos
│   │   └── main.py      # Punto de entrada
│   ├── requirements.txt
│   └── .env
├── frontend/           # SPA (React + Vite)
│   ├── src/
│   │   ├── components/  # UI Kit (Atomic Design)
│   │   ├── features/    # Módulos (Chat, Dashboard)
│   │   ├── services/    # Llamadas a la API
│   │   └── pages/       # Vistas principales
│   └── package.json
└── docs/               # Documentación Técnica Detallada
```

---

## ⚡ Guía de Inicio Rápido

Para ejecutar este proyecto, necesitas tener instalado **Node.js** (v18+) y **Python** (v3.10+).

### Opción A: Ejecución Manual

1.  **Backend (Terminal 1):**
    ```powershell
    cd backend
    python -m venv venv           # Crear entorno virtual (solo la primera vez)
    .\venv\Scripts\activate       # Activar entorno
    pip install -r requirements.txt # Instalar dependencias
    uvicorn app.main:app --reload # Iniciar servidor
    ```
    > El servidor correrá en: `http://localhost:8000`

2.  **Frontend (Terminal 2):**
    ```powershell
    cd frontend
    npm install                   # Instalar dependencias (solo la primera vez)
    npm run dev                   # Iniciar servidor de desarrollo
    ```
    > La web estará disponible en: `http://localhost:5173`

### Opción B: Ejecución Automática (Recomendada) ⭐

Hemos configurado herramientas para que no tengas que escribir estos comandos cada vez.

1.  **Desde VS Code:**
    Presiona `Ctrl + Shift + B` (o `Command + Shift + B` en Mac) y selecciona **"Start All Utils"**. Esto levantará ambos servidores automáticamente en terminales separadas.

2.  **Script de Windows:**
    Haz doble clic en el archivo `start_dev.bat` ubicado en la raíz del proyecto.

---

## 📚 Documentación

Para entender a fondo cómo está construido el sistema, consulta nuestros manuales técnicos en la carpeta `docs/`:

*   [📘 Arquitectura Frontend](docs/ARQUITECTURA_FRONTEND.md): Explicación de componentes, estilos y responsividad.
*   [📗 Arquitectura Backend](docs/ARQUITECTURA_BACKEND.md): Explicación del patrón MVC, servicios y flujo de datos.
*   [📙 Documentación Técnica General](docs/DOCUMENTACION_TECNICA.md): Visión global y detalles de implementación.

---

## 🤝 Contribución

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3.  Commit a tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

