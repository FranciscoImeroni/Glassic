# Instrucciones para Cargar Datos del Catálogo

Este directorio contiene comandos para cargar los datos del catálogo de productos Glassic en la base de datos.

## Opción 1: Importar en Insomnia (Recomendado)

### Paso 1: Importar la Colección

1. Abre **Insomnia**
2. Ve a **Application** → **Preferences** → **Data** → **Import Data**
3. Selecciona el archivo `insomnia-catalog-data.json`
4. La colección "Glassic - Catálogo de Productos" aparecerá en tu workspace

### Paso 2: Configurar la URL Base

1. En Insomnia, ve a la colección importada
2. Haz clic en **Manage Environments**
3. Verifica que la variable `base_url` esté configurada como:
   ```
   http://localhost:3000/api
   ```
4. Si tu backend corre en otro puerto, cambia el valor

### Paso 3: Ejecutar los Requests

La colección está organizada en 3 carpetas:

1. **1. Variables** (5 requests)
   - Ejecuta cada request para crear las variables: VAN0, ALT1, VANO1, VANO2, PAF1

2. **2. Códigos de Instrucción** (9 requests)
   - Ejecuta cada request para crear los códigos: 1001-1010

3. **3. Productos** (24 requests)
   - Ejecuta cada request para crear todos los productos del catálogo

**Tip:** Puedes ejecutar múltiples requests usando la función "Run" de Insomnia en cada carpeta.

---

## Opción 2: Usar Script de Shell

### Requisitos

- `curl` instalado
- Backend corriendo en `http://localhost:3000`

### Paso 1: Dar Permisos de Ejecución

```bash
chmod +x cargar-datos-catalogo.sh
```

### Paso 2: Ejecutar el Script

```bash
./cargar-datos-catalogo.sh
```

El script creará automáticamente:
- 5 Variables
- 9 Códigos de Instrucción
- 24 Productos

### Personalizar URL del Backend

Si tu backend corre en otro puerto, edita la línea 5 del script:

```bash
API_URL="http://localhost:PUERTO/api"
```

---

## Datos que se Cargarán

### Variables (5)
- **VAN0** - Vano 0
- **ALT1** - Altura 1
- **VANO1** - Vano 1
- **VANO2** - Vano 2
- **PAF1** - Paño Fijo 1

### Códigos de Instrucción (9)
- 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1010

### Productos (24)

#### Línea 1000
- **Panel**: 1000, 1010-i, 1010-d
- **Panel Ángulo**: 1200-i, 1200-d

#### Línea 4000
- **Box Frontal**: 4000-Ai, 4000-Ad, 4000-Bi, 4000-Bd, 4000-Ci, 4000-Cd, 4000-D
- **Box Esquinero**: 4100
- **Box Angular**: 4200-A1i, 4200-A1d, 4200-A2i, 4200-A2d, 4200-Bi, 4200-Bd, 4200-C1i, 4200-C1d, 4200-C2i, 4200-C2d, 4200-D

---

## Verificar la Carga

Después de ejecutar los comandos, puedes verificar que los datos se cargaron correctamente:

### Ver todas las variables
```bash
curl http://localhost:3000/api/variables
```

### Ver todos los códigos de instrucción
```bash
curl http://localhost:3000/api/codigos-instruccion
```

### Ver todos los productos
```bash
curl http://localhost:3000/api/productos
```

---

## Solución de Problemas

### Error: Cannot connect to localhost:3000
- Verifica que el backend esté corriendo
- Ejecuta `npm run start:dev` en el directorio `backend/`

### Error: Duplicate key
- Los datos ya existen en la base de datos
- Para recargar, primero elimina los datos existentes o limpia la base de datos

### Error 400: Validation failed
- Verifica que el formato JSON esté correcto
- Asegúrate de que los campos requeridos estén presentes

---

## Notas Importantes

1. **Orden de Ejecución**: Es importante crear primero las Variables y Códigos de Instrucción antes de los Productos, ya que los productos referencian estos datos.

2. **Relaciones**: En esta carga inicial, los productos se crean con los campos `varVi` y `codIvi` como strings (ej: "VAN0,ALT1"). Las relaciones M:M con las tablas `variables` e `instrucciones` se pueden establecer posteriormente si es necesario.

3. **Duplicados**: Si intentas ejecutar los comandos dos veces, obtendrás errores de duplicados debido a las constraints UNIQUE en los códigos.

---

## Estructura de la Base de Datos

```
productos
├── linea (string)
├── serie (string)
├── modelo (string)
├── varVi (string) - Variables separadas por coma
├── codIvi (string) - Códigos separados por coma o punto
├── espVidrio (int)
├── imagen (string)
├── esquema (string)
└── plano (string)

variables
├── codigo (unique)
└── nombre

codigo_instrucciones
├── codigo (unique)
└── instruccion
```
