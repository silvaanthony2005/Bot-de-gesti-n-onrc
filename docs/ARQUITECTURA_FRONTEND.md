# Arquitectura Frontend Modular y Escalable - Bot CNE

Este documento detalla la estructura de carpetas y los patrones de integración para el frontend del Chatbot. El diseño está pensado para la escalabilidad, separando componentes visuales puros de la lógica de negocio.

## Estructura de Carpetas (`frontend/src/`)

### 1. `components/ui/` (Atomic Design)
Aquí residen los bloques de construcción visuales más pequeños y genéricos. No tienen lógica de negocio específica del bot.
- **Ejemplos:** `Button`, `Input`, `Card`, `Avatar`, `Icon`.
- **Integración:** Son importados por componentes más complejos en `features/` o `layout/`.

### 2. `components/layout/`
Componentes estructurales que definen el esqueleto de la aplicación.
- **Ejemplos:** `Sidebar` (Menú lateral), `Header` (Barra superior), `PageWrapper`.
- **Integración:** Se utilizan dentro de las carpetas de `layouts/`.

### 3. `layouts/`
Definen la disposición general de las páginas.
- **`MainLayout`:** Contiene el Sidebar fijo y el área de contenido dinámica. Ideal para la vista del dashboard mostrada en el diseño.
- **`ChatLayout`:** Optimizado para la vista de conversación.

### 4. `pages/`
Son las vistas principales que renderiza el router. Actúan como orquestadores.
- **`DashboardPage`:** Muestra las tarjetas de "Guided Learning", "Links", etc.
- **`ChatPage`:** La interfaz conversacional principal.
- **Integración:** Reciben datos de `hooks` o `context` y se los pasan a los componentes de `features`.

### 5. `features/` (Módulos de Negocio)
Cada carpeta aquí representa una funcionalidad clave. Mantiene unido todo lo relacionado con esa característica (UI específica, lógica, estado).
- **`chat/`**:
    - `components/`: `ChatBubble`, `ChatInput`, `MessageList`.
    - `hooks/`: `useChat` (para enviar/recibir mensajes).
    - `types/`: Definiciones de mensajes y usuarios.
- **`dashboard/`**:
    - `components/`: `ActionCard` (las tarjetas de colores del diseño), `StatsWidget`.

### 6. `lib/` o `services/`
Configuración de clientes externos (API HTTP, WebSockets para el chat).
- `apiClient.js`: Cliente axios/fetch configurado.
- `theme.js`: Variables de diseño (colores, sombras) para mantener la elegancia y consistencia.

---

## Flujo de Integración

1. **Usuario entra a la web:** El `Router` carga `DashboardPage`.
2. **DashboardPage:** Utiliza `MainLayout`.
   - `MainLayout` renderiza `Sidebar` y el contenido hijo.
3. **Contenido:** `DashboardPage` renderiza múltiples `ActionCard` (de `features/dashboard`).
   - Cada `ActionCard` usa componentes base como `Card` y `Icon` (de `components/ui`).
4. **Interacción:** Al hacer clic en el chat, el `ChatInput` (de `features/chat`) utiliza un hook `useChat` para comunicarse con la API (`services/`).

## Estilo Visual (Look & Feel)
Para lograr el tono "elegante y llamativo pero no molesto":
- **Fondo:** Tonos oscuros/neón suaves (Dark Mode por defecto como en la imagen).
- **Acentos:** Colores vibrante para las acciones principales (gradientes púrpuras/azules).
- **Espaciado:** Generoso uso de padding para evitar saturación visual.
