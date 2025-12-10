# Beland Kids Backend

Backend NestJS para el sistema de registro de niños y participaciones en eventos con códigos QR.

## Tecnologías
- NestJS (v10)
- TypeORM & PostgreSQL
- Swagger (OpenAPI)
- QRCode generation

## Configuración

1.  Clonar el repositorio.
2.  Copiar `.env.example` a `.env` y configurar la base de datos PostgreSQL.
    ```bash
    cp .env.example .env
    ```
3.  Instalar dependencias:
    ```bash
    npm install
    # Si hay conflictos de versiones:
    npm install --legacy-peer-deps
    ```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Documentación API

La documentación interactiva (Swagger) está disponible en:
http://localhost:3000/api

## Módulos Principales

### Children
- Registro de niños con generación automática de QR.
- `POST /children`: Crea niño + QR.
- `GET /children/:id`: Obtiene datos.

### Events
- Gestión de eventos.
- `POST /events`: Crear evento.

### Participations
- Registro de participación.
- `POST /participations`: Registro manual (childId + eventId).
- `POST /participations/register-by-qr`: Escaneo de QR (qrContent + eventId).
- Control de duplicados (409 Conflict si ya participó).

## Estructura
- `src/children`: Módulo de niños.
- `src/events`: Módulo de eventos.
- `src/participations`: Módulo de participaciones.
- `src/database`: Configuración de DB.
