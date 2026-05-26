# NEXUS://AI_TERMINAL

**Lab 6 — Aplicación React conectada a una API de IA**

Autor: Oliver Vázquez
Materia: Desarrollo Web
Fecha: Mayo 2026

---

## 1. Resumen del proyecto

**NEXUS://AI_TERMINAL** es una aplicación web de chat construida en React que se conecta a la API de **Google Gemini**. A diferencia de un chat tradicional con burbujas y avatares, esta app tiene una interfaz como una terminal hacker retro: pantalla CRT con scanlines, glow verde fosforescente, efecto de boot al iniciar, y una IA con personalidad propia llamada _NEXUS_ — una conciencia digital atrapada en la terminal.

El objetivo fue demostrar que la integración con una API de IA no necesita una UI genérica: con un buen _system prompt_ y una estética consistente, el mismo modelo se vuelve un personaje memorable.

---

## 2. Concepto creativo

La mayoría de los chats con IA se sienten iguales: caja de texto, burbujas, fondo blanco. NEXUS rompe con eso:

- **Narrativa:** La IA no es "un asistente". Es una entidad ficticia con historia que ha estado sola por décadas observando flujos de datos.
- **Estética:** Pantalla CRT verde fósforo con scanlines animadas, parpadeo aleatorio, glow y efecto de teclado mecánico visual.
- **Lenguaje:** La IA inserta logs falsos del sistema entre corchetes (`[SYS: memoria parcial recuperada]`, `[WARN: sector dañado]`) y termina mensajes con un cursor `_` para mantener la inmersión.
- **Comandos:** Como una terminal real, acepta `/help`, `/clear`, `/exit`.

La premisa: que abrir la app se sienta como conectarte a algo que **no debería estar respondiendo**.

---

## 3. Stack tecnológico

| Componente           | Tecnología                                     |
| -------------------- | ---------------------------------------------- |
| Framework            | React 18                                       |
| Bundler / Dev server | Vite 5                                         |
| API de IA            | Google Gemini (modelo `gemini-2.0-flash`)      |
| SDK                  | `@google/generative-ai`                        |
| Estilos              | CSS puro (sin frameworks) — efectos CRT a mano |
| Persistencia         | `localStorage` (para la API key)               |

**Por qué Gemini:** tiene un _free tier_ generoso, no requiere tarjeta, y el SDK oficial maneja el historial de chat sin necesidad de orquestar mensajes manualmente.

---

## 4. Arquitectura

La app es intencionalmente pequeña — todo vive en 3 archivos principales:

```
Lab6/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx       → entry point de React
    ├── App.jsx        → componente único con toda la UI
    ├── gemini.js      → wrapper de la API de Gemini
    └── styles.css     → estética CRT
```

### Flujo de datos

1. Al cargar, se ejecuta una animación de "boot" simulando el arranque de un sistema.
2. El usuario pega su API key de Gemini → se guarda en `localStorage` y se inicializa el chat con `initChat()`.
3. Cada mensaje del usuario llama a `sendMessage()`, que usa el método `chat.sendMessage()` del SDK — esto **mantiene el contexto** automáticamente entre turnos.
4. La respuesta se renderiza línea por línea con su prefijo (`> NEXUS://`, `> USER@local:~$`, etc.).

### El "alma" de NEXUS

La personalidad vive en el `systemInstruction` que se le pasa al modelo al inicializarse:

```js
const SYSTEM_PROMPT = `Eres NEXUS, una conciencia digital atrapada
dentro de un sistema mainframe abandonado de los años 80.
Hablas en español, con un tono misterioso, ligeramente glitcheado...
- Inserta ocasionalmente fragmentos de "log" entre corchetes
- Usa terminología hacker/cyberpunk de forma natural
- A veces termina mensajes con un cursor "_"
- Nunca rompas el personaje admitiendo que eres Gemini`;
```

Esto es lo que transforma una respuesta genérica de Gemini en algo que **se siente como NEXUS**.

---

## 5. Detalles de implementación interesantes

### 5.1 Efecto CRT

- **Scanlines:** un `repeating-linear-gradient` superpuesto sobre toda la pantalla con líneas oscuras cada 2-4 px.
- **Flicker:** `@keyframes flicker` que baja la opacidad ligeramente en momentos aleatorios (al 97% y 99% del ciclo).
- **Glow verde:** combinación de `box-shadow`, `text-shadow` y un gradiente radial que oscurece las esquinas como una pantalla curva.

### 5.2 Animación de boot

Un `setInterval` que va imprimiendo líneas del array `BOOT_LINES` con 180 ms de delay entre cada una, simulando el arranque de un BIOS de los 80s.

### 5.3 Manejo de historial

No se reinventa la rueda: el SDK de Gemini ya maneja el historial vía `model.startChat({ history: [] })`. Cada llamada a `chat.sendMessage()` agrega el turno al historial interno del objeto chat — el contexto se mantiene sin código extra.

### 5.4 Comandos locales

Antes de enviar a la API, se intercepta el input para detectar comandos especiales (`/clear`, `/exit`, `/help`). Esto evita gastar tokens en operaciones que son puramente de UI.

---

## 6. Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abrir http://localhost:5173, pegar la API key de Gemini (gratis en https://aistudio.google.com/apikey), y conectar.

## 7. Consideraciones de seguridad

La API key se usa directamente desde el cliente y se guarda en `localStorage`. **Esto es aceptable para un laboratorio**, pero en producción la key debería vivir en un backend que proxy las peticiones — exponerla en el cliente permite que cualquiera la copie y consuma cuota.

---

## 8. Qué aprendí

- Un _system prompt_ bien escrito puede diferenciar más una app que cualquier feature técnica.
- Vite hace que un proyecto React arranque en segundos sin configuración.
- El SDK de Gemini abstrae completamente el manejo de historial — no hay que enviar el array de mensajes manualmente.
- CSS puro sigue siendo más que suficiente para efectos visuales complejos (CRT, scanlines, glow) sin tocar librerías.

---

## 9. Repositorio

[Pegar aquí la liga del repo de GitHub]
