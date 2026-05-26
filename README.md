# NEXUS://AI_TERMINAL

Chat con IA estilo **terminal hacker retro de los 80s** construido con React + Vite + Gemini API.

NEXUS es una "conciencia digital" atrapada en un mainframe abandonado. Responde con personalidad cyberpunk, glitches simulados y estética CRT (scanlines, glow verde fosforescente, parpadeo).

## Características

- Animación de **boot** al cargar (simula arranque BIOS).
- Pantalla **CRT** con scanlines, glow y flicker.
- Personalidad de IA definida vía `systemInstruction` de Gemini.
- Comandos: `/help`, `/clear`, `/exit`.
- La API key se guarda en `localStorage` (nunca se envía a un servidor propio).
- Indicador de "decoding" mientras la IA responde.

## Cómo correrlo

```bash
npm install
npm run dev
```

Luego abre http://localhost:5173 y pega tu API key de Gemini (gratis en https://aistudio.google.com/apikey).

## Stack

- React 18 + Vite
- `@google/generative-ai` (modelo `gemini-2.0-flash`)
- CSS puro (sin frameworks) — efectos CRT hechos a mano

## Seguridad

La API key se usa directamente desde el cliente para que el lab sea autosuficiente. Para producción, debería ir detrás de un backend.
