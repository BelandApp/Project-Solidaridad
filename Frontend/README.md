# Solidaridad Frontend

Aplicación Next.js (App Router) con TypeScript y Tailwind para control de asistencia y entregas mediante QR.

## Requisitos

- Node.js 18+
- npm

## Configuración

1. Copiar `.env.example` a `.env.local` y ajustar `NEXT_PUBLIC_API_BASE_URL` al backend.

## Scripts

- `npm install` — instala dependencias.
- `npm run dev` — arranca el entorno de desarrollo en `http://localhost:3000`.
- `npm run build` — compila para producción.
- `npm start` — sirve la build.
- `npm run lint` — corre ESLint.
- `npm run format` — aplica Prettier.

## Páginas

- `/` — Principal con botones de eventos y escaneo.
- `/admin/children` — Ingreso individual de niños.
- `/admin/events` — Alta de eventos adicionales.

## Notas

- El escáner usa la cámara del dispositivo (permisos requeridos).
- El QR debe resolver al texto asignado al niño (campo `qr`).
