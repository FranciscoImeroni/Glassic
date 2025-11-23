# Guía de Configuración de Base de Datos para Testing

## 📋 Resumen

Este documento explica qué datos necesitas en la base de datos para testear el sistema completo de órdenes de fabricación, y cómo cargarlos.

## 🗄️ Datos Necesarios

Para que el flujo completo funcione, necesitas los siguientes datos en la base de datos:

### 1. **Variables de Entrada** (tabla `variables`)
Variables que el usuario debe ingresar al seleccionar un producto.

**Ejemplo:**
- `ALT1` - Altura
- `VAN0` - Vano
- `BAS2` - Base

### 2. **Productos** (tabla `productos`)
Los productos disponibles organizados por línea, serie y modelo.

**Ejemplo:**
- Linea 1000 → Serie A → Modelo 1000-d
- Linea 4000 → Serie A → Modelo 4000-A1i

**Campos importantes:**
- `linea`: Línea del producto
- `serie`: Serie del producto
- `modelo`: Código del modelo
- `varVi`: Códigos de variables de entrada separados por coma (ej: "ALT1,VAN0")
- Relación con `variables` para definir qué medidas se piden

### 3. **Modelos de Fórmulas** (tabla `modelos`)
Modelos que tienen fórmulas asociadas. El código debe coincidir con el modelo del producto.

**Ejemplo:**
- `1000-d` - Modelo 1000 derecho
- `4000-A1i` - Modelo 4000 A1 izquierdo

### 4. **Variables Calculadas** (tabla `variables_calculadas`)
Variables que resultan de aplicar fórmulas.

**Ejemplo:**
- `HPF1` - Altura Paño Fijo 1
- `BPF1` - Base Paño Fijo 1
- `HPF2` - Altura Paño Fijo 2
- `BPF2` - Base Paño Fijo 2

### 5. **Fórmulas Calculadas** (tabla `formulas_calculadas`)
Las fórmulas que se aplican para cada modelo.

**Ejemplo para modelo 1000-d:**
- `HPF1 = ALT1-7`
- `BPF1 = SI(VAN0>1600;900;700)`

**Formato de fórmulas:**
- Sintaxis Excel en español
- `SI(condicion;verdadero;falso)` → IF
- `Y(a;b)` → AND
- `O(a;b)` → OR
- Separador de argumentos: punto y coma (;)
- Pueden referenciar variables de entrada (ALT1, VAN0, etc.)

### 6. **Comprobantes** (tabla `comprobantes`)
Tipos de comprobantes disponibles.

**Ejemplo:**
- `NP` - Nota de Pedido
- `OC` - Orden de Compra
- `FC` - Factura
- `PR` - Presupuesto

### 7. **Vidrios** (tabla `vidrios`)
Tipos, colores y espesores de vidrio disponibles.

**Ejemplo:**
- Float, Incoloro, 6mm
- Float, Bronce, 6mm
- Laminado, Incoloro, 8mm
- Templado, Incoloro, 10mm

### 8. **Herrajes** (tabla `herrajes`)
Colores de herraje disponibles.

**Ejemplo:**
- Natural
- Negro
- Blanco
- Bronce

### 9. **Servicios** (tabla `servicios`)
Tipos de servicio ofrecidos.

**Ejemplo:**
- Fabricación e Instalación
- Solo Fabricación
- Solo Instalación

### 10. **Accesorios** (tabla `accesorios`)
Accesorios disponibles para agregar a la orden.

**Ejemplo:**
- Bisagra hidráulica
- Cerradura embutir
- Manija recta
- Tirador redondo
- Burlete
- Silicona

### 11. **Coordenadas de Plantilla** (tabla `coordenadas_plantilla`) - OPCIONAL
Posiciones de elementos en la plantilla de orden de fabricación.

**Se configuran visualmente desde:** `/config/plantilla`

### 12. **Coordenadas de Plano** (tabla `coordenadas_plano`) - OPCIONAL
Posiciones de variables calculadas en cada plano de modelo.

**Se configuran visualmente desde:** `/config/plano`

---

## 🚀 Pasos para Configurar la Base de Datos

### Paso 1: Ejecutar Migraciones

Las migraciones crean las tablas necesarias en la base de datos.

```bash
cd backend
npm run typeorm migration:run
```

Esto creará las tablas:
- `coordenadas_plantilla`
- `coordenadas_plano`

(Las demás tablas ya deberían existir del schema inicial)

### Paso 2: Ejecutar Script Seed

El script seed carga datos de ejemplo para testing.

```bash
cd backend
npm run seed
```

Esto creará:
- 3 Variables de entrada (ALT1, VAN0, BAS2)
- 2 Productos (1000-d, 4000-A1i)
- 2 Modelos de fórmulas
- 4 Variables calculadas
- 4 Fórmulas
- 4 Comprobantes
- 5 Vidrios
- 4 Herrajes
- 3 Servicios
- 6 Accesorios

### Paso 3: Configurar Imágenes en Cloudinary

Para que las imágenes se muestren correctamente, necesitas subir imágenes a Cloudinary con estos nombres:

**Imágenes de modelos** (prefijo `IM-`):
- `IM-1000-d` - Imagen del modelo 1000-d
- `IM-4000-A1i` - Imagen del modelo 4000-A1i

**Planos** (prefijo `PL-`):
- `PL-1000-d` - Plano del modelo 1000-d
- `PL-4000-A1i` - Plano del modelo 4000-A1i

**Esquemas** (prefijo `ES-`):
- `ES-1000-d` - Esquema del modelo 1000-d
- `ES-4000-A1i` - Esquema del modelo 4000-A1i

**Plantilla de orden de fabricación:**
- `ORDEN_DE_FABRICACION` - Plantilla base para las órdenes

### Paso 4: (Opcional) Configurar Coordenadas Visualmente

Si quieres posicionar los elementos en las órdenes de fabricación:

1. **Configurar plantilla:** Accede a `/config/plantilla`
   - Carga automáticamente la imagen `ORDEN_DE_FABRICACION`
   - Agrega y posiciona elementos (cliente, fecha, plano, etc.)
   - Guarda las coordenadas

2. **Configurar planos:** Accede a `/config/plano`
   - Selecciona un modelo (ej: 1000-d)
   - Carga automáticamente el plano `PL-1000-d`
   - Agrega y posiciona las variables calculadas (HPF1, BPF1, etc.)
   - Guarda las coordenadas

---

## 🧪 Flujo de Testing

Una vez configurados los datos, puedes testear el flujo completo:

### 1. Ingresar Producto (`/ingresar-producto`)
- Selecciona Línea: **Linea 1000**
- Selecciona Serie: **Serie A**
- Selecciona Modelo: **1000-d**
- Ingresa medidas:
  - ALT1 (Altura): **2000** mm
  - VAN0 (Vano): **1800** mm
- Selecciona Espesor: **6** mm
- Click en **APLICAR**

Esto calculará automáticamente:
- `HPF1 = 2000 - 7 = 1993`
- `BPF1 = SI(1800>1600;900;700) = 900`

### 2. Ingresar Datos (`/ingresar-datos`)
- Completa datos del cliente:
  - Cliente: **Juan Pérez**
  - Referencia: **OF-001**
  - Obra: **Casa Ejemplo**
- Comprobante:
  - Tipo: **NP - Nota de Pedido**
  - Número: **00123**
- Vidrio:
  - Tipo: **Float**
  - Color: **Incoloro**
  - Cantidad: **2**
- Servicio: **Fabricación e Instalación**
- Herraje: **Natural**
- Accesorios: (opcional)
  - 2x Bisagra hidráulica
  - 1x Cerradura embutir
- Nota: **Entregar antes del 30/11**
- Click en **GUARDAR**

### 3. Ver Plano y Descargar PDF (`/ver-plano`)
- Verás la orden de fabricación completa compuesta
- Si configuraste coordenadas, verás todo posicionado correctamente
- Click en **Descargar PDF** para obtener el archivo A4 horizontal

---

## 🔧 Comandos Útiles

### Ver estado de migraciones
```bash
cd backend
npm run typeorm migration:show
```

### Revertir última migración
```bash
cd backend
npm run typeorm migration:revert
```

### Limpiar datos
Desde la aplicación: `/limpiar-datos`

O manualmente en la base de datos:
```sql
-- Esto limpia todos los datos pero mantiene las tablas
TRUNCATE TABLE coordenadas_plano CASCADE;
TRUNCATE TABLE coordenadas_plantilla CASCADE;
TRUNCATE TABLE formulas_calculadas CASCADE;
TRUNCATE TABLE variables_calculadas CASCADE;
TRUNCATE TABLE modelos CASCADE;
-- etc...
```

---

## 📝 Notas Importantes

1. **Coherencia de Códigos**: El `codigo` en la tabla `modelos` debe coincidir exactamente con el `modelo` en la tabla `productos`. Ej: si el producto tiene modelo `1000-d`, debe existir un modelo con codigo `1000-d` en la tabla modelos.

2. **Variables de Entrada**: Las variables referenciadas en las fórmulas (ej: ALT1, VAN0) deben estar asociadas al producto correspondiente.

3. **Orden de Fórmulas**: El campo `orden` en `formulas_calculadas` determina el orden de evaluación. Si una fórmula depende del resultado de otra, debe tener un orden mayor.

4. **Imágenes en Cloudinary**: Los nombres DEBEN seguir el formato exacto:
   - `IM-{modelo}` para imágenes de modelos
   - `PL-{modelo}` para planos
   - `ES-{modelo}` para esquemas
   - `ORDEN_DE_FABRICACION` para la plantilla

5. **Formato de Fórmulas**:
   - Usa punto y coma (;) como separador
   - Funciones en español: SI, Y, O
   - El backend las convierte automáticamente

---

## 🎯 Objetivo del Testing

Con estos datos podrás verificar:
- ✅ Carga dinámica de variables por producto
- ✅ Cálculo de fórmulas con sintaxis Excel
- ✅ Composición de orden de fabricación
- ✅ Generación de PDF de alta calidad
- ✅ Configuración visual de coordenadas
- ✅ Flujo completo de usuario: producto → datos → PDF
