# Documentación Técnica del Frontend - Bot CNE

## 1. Visión General del Proyecto
Este proyecto es una interfaz de Chatbot Educativo construida con tecnologías modernas para web, enfocada en la velocidad, la modularidad y una experiencia de usuario (UX) fluida tanto en escritorio como en dispositivos móviles.

**Stack Tecnológico:**
- **Framework:** React 18
- **Build Tool:** Vite (para un entorno de desarrollo ultrarrápido)
- **Estilos:** Tailwind CSS (diseño "Utility-First")
- **Iconos:** Lucide React
- **Enrutamiento:** React Router Dom v6

---

## 2. Arquitectura de Software
El proyecto sigue una adaptación de la metodología **Atomic Design**, estructurando los componentes desde lo más pequeño a lo más complejo. Esto facilita el mantenimiento la escalabilidad.

### Estructura de Directorios Clave (`src/`)

```
src/
├── components/          # Componentes visuales puros (Presentational Components)
│   ├── ui/              # ÁTOMOS: Elementos indivisibles (Botones, Inputs, Cards)
│   └── layout/          # ORGANISMOS: Estructuras complejas (Sidebar, Header)
├── features/            # MÓDULOS DE NEGOCIO: Lógica específica por funcionalidad
│   ├── chat/            # Todo lo relacionado al Chat
│   └── dashboard/       # Lógica específica del Dashboard (ActionCard)
├── layouts/             # PLANTILLAS: Estructuras de página (MainLayout)
├── pages/               # PÁGINAS: Vistas principales que componen la ruta
├── lib/                 # Configuración de librerías y utilidades
└── App.jsx              # Configuración de Rutas (Router)
```

---

## 3. Detalle de Componentes e Implementación

### A. Componentes Base (UI)
Son componentes agnósticos a la lógica del negocio. Se pueden reusar en cualquier parte.
- **`Input.jsx`**: Un campo de texto estilado con soporte para variantes y estilos de Tailwind.
- **`Card.jsx`**: Contenedor base con efectos de bordes, sombras y soporte para "hover effects".

### B. Funcionalidades (Features)
Aquí reside la lógica visual específica.
- **Dashboard - `ActionCard.jsx`**:
  - Es el componente tarjeta del Dashboard.
  - Recibe `props` dinámicos: color, icono, progreso y título.
  - Implementa lógica visual para mapear nombres de colores ("purple", "orange") a clases específicas de Tailwind (`bg-purple-500`, `border-orange-500`).
  - Es **Responsive**: Cambia automáticamente de tamaño (`h-32` en móvil a `h-48` en escritorio).

### C. Layout Principal (`MainLayout.jsx`)
Es el esqueleto de la aplicación. Maneja la estructura "App Shell".

**Características Responsivas:**
1.  **Sistema de Altura Real (`h-[100dvh]`)**: Soluciona el problema de la barra de navegación en navegadores móviles (Safari/Chrome Mobile), asegurando que la app ocupe siempre el 100% visible de la pantalla.
2.  **Sidebar Híbrido**:
    - **Escritorio**: Barra lateral fija a la izquierda (`w-64`).
    - **Móvil**: Menú "Off-canvas" oculto que desliza desde la izquierda. Incluye un overlay oscuro para cerrar al hacer clic fuera.
3.  **Contenedor Flexbox Inteligente**:
    - Usa `flex flex-col` para estructurar el contenido verticalmente.
    - Asegura que el contenido principal no se colapse detrás del sidebar.

### D. Páginas (Pages)

#### 1. Dashboard (`DashboardPage.jsx`)
Actúa como el menú principal.
- **Estrategia "Sticky Footer"**:
  Dividimos la pantalla en 3 bloques flex para garantizar que el Input siempre esté visible al fondo en móviles pequeños (<= 420px):
  - **Header (`flex-none`)**: Título fijo.
  - **Grid de Tarjetas (`flex-1 overflow-y-auto`)**: Área scrollable que ocupa el espacio restante. Si hay muchas tarjetas, solo esta parte hace scroll.
  - **Footer Input (`flex-none`)**: Bloque pegado al final.

#### 2. Chat (`ChatPage.jsx`)
La interfaz conversacional.
- **Integración Backend:** 
  - Utiliza `chatService` para comunicarse con la API.
  - Implementa manejo de estados de carga (`isLoading`) con indicadores visuales (animación de puntos saltando).
  - Incluye reconexión automática de scroll (`scrollToBottom`) cada vez que llegan mensajes nuevos.
- **Alineación de Mensajes**:
  - Lógica condicional: `msg.role === 'user' ? 'flex-row-reverse'`.
  - Alineación `items-start` para que el avatar se mantenga arriba incluso en mensajes largos.
- **Renderizado:** Soporta texto multilínea (`whitespace-pre-wrap`) para respuestas largas de la IA.

---

## 4. Estrategia de Estilos (Tailwind CSS)

### Paleta de Colores Personalizada (`tailwind.config.js`)
Hemos extendido el tema por defecto para crear una identidad "Dark Mode Neon":
- **`dark-900`**: Fondo principal (#0f0c29).
- **`primary-500`**: Color de acento principal (Morado).
- **`accent-blue` / `accent-pink`**: Colores secundarios para degradados.

### Media Queries "Mobile-First"
Todo el diseño se escribe pensando en móvil primero (clases base) y luego se ajusta para pantallas grandes con prefijos:
- `text-3xl`: Tamaño base (Móvil).
- `md:text-5xl`: Tamaño a partir de tablets/escritorio.
- `hidden lg:block`: Elementos que solo aparecen en pantallas grandes.

---

## 5. Integración Frontend-Backend

La comunicación se realiza mediante una API RESTful siguiendo estos principios:

1.  **Cliente HTTP (`lib/api.js`)**: 
    - Se utiliza **Axios** para crear una instancia preconfigurada.
    - Base URL: `http://localhost:8000/api`.
    - Headers: `Content-Type: application/json`.

2.  **Capa de Servicios (`services/`)**:
    - **`chatService.js`**: Desacopla la vista de la lógica de red.
    - Método `sendMessage(message, sessionId)`: Maneja el POST al endpoint `/chat` y procesa errores.

3.  **Flujo de Datos**:
    - **Request**: `{ "message": "Texto usuario", "session_id": null }`
    - **Response**: `{ "response": "Texto IA", "source_documents": [] }`

