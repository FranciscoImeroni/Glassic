# 🚀 Guía de Setup Local - Glassic

Esta guía te ayudará a configurar y ejecutar el proyecto Glassic en tu entorno local desde cero.

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior ([Descargar aquí](https://nodejs.org/))
- **PostgreSQL** v14 o superior ([Descargar aquí](https://www.postgresql.org/download/))
- **npm** o **yarn** (viene con Node.js)
- **Git** (para clonar el repositorio)

Verifica las instalaciones:
```bash
node --version   # Debe mostrar v18.x.x o superior
npm --version    # Debe mostrar 9.x.x o superior
psql --version   # Debe mostrar PostgreSQL 14.x o superior
```

---

## 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/FranciscoImeroni/Glassic.git
cd Glassic
```

---

## 2️⃣ Configurar PostgreSQL

### Opción A: Crear Base de Datos Nueva (Recomendado para desarrollo local)

1. Abre PostgreSQL (psql o pgAdmin)
2. Crea una base de datos nueva:

```sql
CREATE DATABASE glassic_db;
```

3. Crea un usuario (opcional, o usa el usuario postgres por defecto):

```sql
CREATE USER glassic_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE glassic_db TO glassic_user;
```

### Opción B: Usar PostgreSQL con Docker (Alternativa)

Si prefieres usar Docker:

```bash
docker run --name glassic-postgres \
  -e POSTGRES_DB=glassic_db \
  -e POSTGRES_USER=glassic_user \
  -e POSTGRES_PASSWORD=tu_password_seguro \
  -p 5432:5432 \
  -d postgres:14
```

---

## 3️⃣ Configurar Backend

### 3.1 Instalar Dependencias

```bash
cd backend
npm install
```

### 3.2 Configurar Variables de Entorno

Crea el archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
NODE_ENV=development
PORT=3000

# Conexión a PostgreSQL local
DATABASE_URL=postgresql://glassic_user:tu_password_seguro@localhost:5432/glassic_db

# Si usas postgres usuario por defecto:
# DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/glassic_db

# Cloudinary (obligatorio para imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**Importante sobre Cloudinary:**
- Crea una cuenta gratuita en [Cloudinary](https://cloudinary.com/)
- Obtén tus credenciales desde el dashboard
- Es necesario para que funcionen las imágenes de productos, planos y esquemas

### 3.3 Ejecutar Migraciones

Las migraciones crean las tablas necesarias en la base de datos:

```bash
npm run migration:run
```

Deberías ver algo como:
```
✅ Migration AddCoordenadasTables1731877200000 has been executed successfully.
```

### 3.4 Cargar Datos de Ejemplo

El script seed carga datos de prueba para empezar a trabajar:

```bash
npm run seed
```

Esto creará:
- 3 Variables de entrada (ALT1, VAN0, BAS2)
- 2 Productos de ejemplo (1000-d, 4000-A1i)
- 2 Modelos de fórmulas
- 4 Variables calculadas
- 4 Fórmulas
- Comprobantes, Vidrios, Herrajes, Servicios, Accesorios

### 3.5 Iniciar Backend en Modo Desarrollo

```bash
npm run start:dev
```

Deberías ver:
```
[Nest] INFO [NestApplication] Nest application successfully started
[Nest] INFO Listening on http://localhost:3000
```

El backend estará corriendo en **http://localhost:3000**

---

## 4️⃣ Configurar Frontend

Abre una **nueva terminal** (deja el backend corriendo).

### 4.1 Instalar Dependencias

```bash
cd frontend
npm install
```

### 4.2 Configurar Variables de Entorno

Crea el archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
# URL del backend local
VITE_API_URL=http://localhost:3000/api

# Cloudinary (mismo cloud name que en backend)
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
```

**Importante:**
- El `VITE_API_URL` debe apuntar a tu backend local
- El `VITE_CLOUDINARY_CLOUD_NAME` debe ser el mismo que configuraste en el backend

### 4.3 Iniciar Frontend en Modo Desarrollo

```bash
npm run dev
```

Deberías ver:
```
VITE v7.1.7  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

El frontend estará corriendo en **http://localhost:5173**

---

## 5️⃣ Verificar que Todo Funciona

### ✅ Checklist de Verificación

1. **Backend funcionando:**
   - Abre http://localhost:3000/api
   - Deberías ver un mensaje o documentación de la API

2. **Frontend funcionando:**
   - Abre http://localhost:5173
   - Deberías ver la página principal de Glassic

3. **Conexión a Base de Datos:**
   - En la consola del backend deberías ver "Database connection established"
   - No deberías ver errores de conexión

4. **Prueba básica:**
   - En el frontend, ve a "Bases de Datos"
   - Deberías ver los datos del seed (vidrios, herrajes, etc.)

---

## 6️⃣ Subir Imágenes a Cloudinary (Importante)

Para que el sistema funcione completamente, necesitas subir imágenes a Cloudinary con nombres específicos:

### Imágenes Necesarias:

**Modelos** (prefijo `IM-`):
- `IM-1000-d` - Imagen del modelo 1000-d
- `IM-4000-A1i` - Imagen del modelo 4000-A1i

**Planos** (prefijo `PL-`):
- `PL-1000-d` - Plano técnico del modelo 1000-d
- `PL-4000-A1i` - Plano técnico del modelo 4000-A1i

**Esquemas** (prefijo `ES-`):
- `ES-1000-d` - Esquema del modelo 1000-d
- `ES-4000-A1i` - Esquema del modelo 4000-A1i

**Plantilla**:
- `ORDEN_DE_FABRICACION` - Plantilla base para órdenes

### Cómo Subir las Imágenes:

1. Ve a tu dashboard de Cloudinary
2. Upload image
3. **Importante:** En "Public ID" coloca exactamente el nombre (ej: `IM-1000-d`)
4. Verifica que la imagen aparezca con ese Public ID en Cloudinary

---

## 7️⃣ Testear el Flujo Completo

Una vez configurado todo, prueba el flujo completo:

### 1. Ingresar Producto
- Ve a "Ingresar Producto" (http://localhost:5173/ingresar-producto)
- Selecciona Línea: **Linea 1000**
- Serie: **Serie A**
- Modelo: **1000-d**
- Ingresa medidas:
  - ALT1: **2000**
  - VAN0: **1800**
- Espesor: **6**
- Click **APLICAR**

Esto calculará:
- HPF1 = 2000 - 7 = 1993
- BPF1 = SI(1800>1600;900;700) = 900

### 2. Ingresar Datos del Cliente
- Completa el formulario de cliente
- Selecciona vidrio, herraje, servicio
- Click **GUARDAR**

### 3. Ver Orden y Descargar PDF
- Ve a "Ver Plano"
- Deberías ver la orden de fabricación compuesta
- Click **Descargar PDF**

---

## 📝 Comandos Útiles

### Backend

```bash
# Iniciar en modo desarrollo (auto-reload)
npm run start:dev

# Iniciar en modo debug
npm run start:debug

# Ver migraciones ejecutadas
npm run migration:show

# Revertir última migración
npm run migration:revert

# Ejecutar seed de nuevo (agrega datos, no duplica)
npm run seed

# Compilar para producción
npm run build

# Iniciar en producción
npm run start:prod
```

### Frontend

```bash
# Iniciar desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de build de producción
npm run preview

# Linting
npm run lint
```

### Base de Datos (PostgreSQL)

```bash
# Conectarse a la BD
psql -U glassic_user -d glassic_db

# Ver todas las tablas
\dt

# Descripción de una tabla
\d nombre_tabla

# Ver datos de una tabla
SELECT * FROM productos;

# Salir de psql
\q
```

---

## 🔧 Solución de Problemas Comunes

### Error: "Cannot connect to database"

**Problema:** El backend no puede conectarse a PostgreSQL.

**Solución:**
1. Verifica que PostgreSQL esté corriendo: `sudo service postgresql status`
2. Verifica las credenciales en el `.env`
3. Verifica que la base de datos existe: `psql -l`
4. Intenta conectarte manualmente: `psql -U glassic_user -d glassic_db`

### Error: "Port 3000 already in use"

**Problema:** El puerto 3000 ya está siendo usado por otro proceso.

**Solución:**
1. Encuentra el proceso: `lsof -i :3000`
2. Mata el proceso: `kill -9 PID`
3. O cambia el puerto en `backend/.env`: `PORT=3001`

### Error: "Port 5173 already in use"

**Problema:** El puerto 5173 ya está siendo usado.

**Solución:**
1. Cierra la otra instancia de Vite
2. O el frontend usará automáticamente el siguiente puerto disponible (5174)

### Error: "CORS blocked"

**Problema:** El frontend no puede conectarse al backend por CORS.

**Solución:**
1. Verifica que `VITE_API_URL` en `frontend/.env` sea correcta
2. Verifica que el backend esté corriendo
3. Asegúrate de no tener un proxy o firewall bloqueando

### Error: "Images not loading"

**Problema:** Las imágenes de Cloudinary no se cargan.

**Solución:**
1. Verifica las credenciales de Cloudinary en ambos `.env`
2. Verifica que las imágenes existan en Cloudinary con los nombres exactos
3. Verifica que los Public IDs sean correctos (case-sensitive)

### Error: "Migration already exists"

**Problema:** Al ejecutar `migration:run` dice que ya se ejecutó.

**Solución:**
- Es normal, significa que las migraciones ya están aplicadas
- Verifica con: `npm run migration:show`

### Las fórmulas no se calculan

**Problema:** Al ingresar producto, las fórmulas no se calculan.

**Solución:**
1. Verifica que existan fórmulas para ese modelo en la BD:
   ```sql
   SELECT * FROM formulas_calculadas WHERE modelo_id = 1;
   ```
2. Ejecuta el seed de nuevo: `npm run seed`
3. Revisa la consola del navegador por errores

---

## 📂 Estructura del Proyecto

```
Glassic/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── productos/      # Productos y variables
│   │   │   ├── formulas/       # Modelos y fórmulas
│   │   │   ├── datos/          # Catálogos (vidrios, herrajes, etc)
│   │   │   ├── coordenadas/    # Coordenadas de plantillas y planos
│   │   │   └── ...
│   │   ├── migrations/         # Migraciones de BD
│   │   ├── seeds/             # Scripts de datos de prueba
│   │   └── main.ts            # Punto de entrada
│   ├── .env                   # Variables de entorno (no committed)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Páginas de la app
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/           # React Context (ProductoContext)
│   │   ├── api/              # Funciones de API
│   │   ├── utils/            # Utilidades (cloudinary, etc)
│   │   └── App.tsx           # Componente principal
│   ├── .env                  # Variables de entorno (no committed)
│   └── package.json
│
├── SETUP_LOCAL.md            # Esta guía
├── DATOS_TESTING.md          # Guía de datos para testing
└── README.md                 # Documentación general
```

---

## 🎯 Siguientes Pasos

Una vez que tengas todo funcionando:

1. **Configura las Coordenadas Visuales**
   - Ve a `/config/plantilla` para configurar la plantilla de órdenes
   - Ve a `/config/plano` para configurar posiciones de variables en planos

2. **Agrega Más Datos**
   - Usa `/admin/bases-de-datos` para agregar más productos, vidrios, etc.

3. **Explora la Documentación**
   - Lee `DATOS_TESTING.md` para entender el modelo de datos
   - Revisa el código para entender la arquitectura

---

## 💡 Tips de Desarrollo

- **Hot Reload:** Tanto el backend (NestJS) como el frontend (Vite) tienen hot reload. Tus cambios se reflejarán automáticamente.
- **DevTools:** Usa React DevTools para debuggear el frontend
- **PostgreSQL GUI:** Instala pgAdmin o DBeaver para visualizar la base de datos
- **API Testing:** Usa Postman o Thunder Client para probar endpoints
- **Git Branches:** Trabaja en branches separados para cada feature

---

## 📚 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de React](https://react.dev/)
- [Documentación de TypeORM](https://typeorm.io/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de Cloudinary](https://cloudinary.com/documentation)

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas no cubiertos aquí:

1. Revisa la consola del navegador (F12)
2. Revisa la consola del backend
3. Revisa los logs de PostgreSQL
4. Crea un issue en GitHub con el error completo

---

¡Listo! Ahora deberías tener Glassic funcionando en tu máquina local. 🎉
