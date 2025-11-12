# Configuración de Variables de Entorno en Railway

Este documento explica las variables de entorno necesarias para deployar Glassic en Railway.

## Variables de Entorno Requeridas

### Backend (NestJS)

Estas variables ya están configuradas en Railway:

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://...

# Cloudinary
CLOUDINARY_CLOUD_NAME=dmqbjlqqb
CLOUDINARY_API_KEY=567218412381236
CLOUDINARY_API_SECRET=tkRH090GyT2AyJCPFVkGc4YPqPQ

# Server
PORT=3000
```

### Frontend (Vite/React)

**IMPORTANTE**: Railway necesita estas variables de entorno **ANTES** de buildear el frontend, porque Vite las embebe en tiempo de compilación.

Agregar en Railway:

```env
VITE_API_URL=https://glassic-production.up.railway.app
VITE_CLOUDINARY_CLOUD_NAME=dmqbjlqqb
```

**Nota**: `VITE_CLOUDINARY_CLOUD_NAME` es información pública (se usa solo para construir URLs), por lo que es seguro hardcodearla.

## ¿Por qué el Frontend Usa localhost?

Si el frontend deployado sigue mandando peticiones a `localhost:3000`:

1. **Causa**: Railway no tiene configurada `VITE_API_URL` como variable de entorno
2. **Solución**: Agregar `VITE_API_URL=https://glassic-production.up.railway.app` en Railway
3. **Importante**: Después de agregar la variable, Railway debe **re-buildear** el frontend

## Estructura de URLs

- **Backend**: Todas las rutas tienen prefijo `/api/` (configurado en `main.ts`)
- **Endpoint de bulk upload**: `POST /api/cloudinary/bulk-upload`
- **Ejemplo completo**: `https://glassic-production.up.railway.app/api/cloudinary/bulk-upload`

## Verificación

Para verificar que las variables están correctas:

1. **Backend**: Visitar `/api/cloudinary/diagnostico` debería mostrar la configuración de Cloudinary
2. **Frontend**: Abrir DevTools → Console, debería mostrar los logs de `[ImageBulkUpload]` con la URL correcta

## Troubleshooting

### Error: "Cannot GET /api/cloudinary/bulk-upload"
- **Causa**: Estás usando GET en lugar de POST
- **Solución**: Usar método POST en Insomnia/Postman

### Error: "net::ERR_CONNECTION_REFUSED" con localhost:3000
- **Causa**: Frontend no tiene `VITE_API_URL` configurada
- **Solución**: Agregar variable en Railway y re-deployar

### Error: "404 Not Found" en Railway
- **Causa**: La migración de BD no se ejecutó
- **Solución**: Verificar logs de Railway para ver si la migración se ejecutó correctamente
