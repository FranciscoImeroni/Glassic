# 🔄 Guía de Migraciones de Base de Datos

## ¿Qué son las migraciones?

Las migraciones son **scripts de control de versiones para tu base de datos**. Permiten:
- ✅ Cambiar el schema de la BD sin perder datos
- ✅ Hacer cambios reversibles (rollback)
- ✅ Mantener un historial de cambios
- ✅ Aplicar los mismos cambios en desarrollo y producción

---

## 🚫 ¿Por qué NO usar `synchronize: true`?

Con `synchronize: true`, TypeORM automáticamente modifica la BD cuando cambias entidades, lo cual puede:
- ❌ **Borrar datos** al cambiar tipos de columnas
- ❌ **Eliminar columnas** al renombrar campos
- ❌ **No ser reversible** si algo sale mal

**Ahora en este proyecto:**
- ✅ Desarrollo local: `synchronize: true` (solo si NODE_ENV !== 'production')
- ✅ Producción: `synchronize: false` + migraciones automáticas

---

## 📋 Comandos Disponibles

### **1. Generar migración automática**
Detecta cambios en tus entidades y genera una migración:
```bash
cd backend
npm run migration:generate -- src/migrations/NombreDeLaMigracion
```

**Ejemplo:**
```bash
npm run migration:generate -- src/migrations/AddEmailToUser
```

Esto crea un archivo como: `src/migrations/1234567890-AddEmailToUser.ts`

---

### **2. Crear migración manual**
Para cambios personalizados que TypeORM no detecta:
```bash
npm run migration:create -- src/migrations/NombreDeLaMigracion
```

**Ejemplo:**
```bash
npm run migration:create -- src/migrations/AddIndexToProductos
```

Luego edita el archivo y agrega el código SQL manualmente.

---

### **3. Ejecutar migraciones pendientes**
Aplica todas las migraciones que no se han ejecutado:
```bash
npm run migration:run
```

**En producción (Railway):** Se ejecutan automáticamente al hacer deploy.

---

### **4. Revertir última migración**
Deshace la última migración aplicada:
```bash
npm run migration:revert
```

**⚠️ Cuidado:** Solo usa esto si algo salió mal.

---

### **5. Ver estado de migraciones**
Muestra qué migraciones están aplicadas:
```bash
npm run migration:show
```

---

## 🛠️ Flujo de Trabajo Recomendado

### **Escenario 1: Agregar una nueva columna**

1. **Modifica la entidad** (ejemplo: agregar email a User):
```typescript
// src/modules/users/entities/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() // 👈 Nueva columna
  email: string;
}
```

2. **Genera la migración:**
```bash
npm run migration:generate -- src/migrations/AddEmailToUser
```

3. **Revisa el archivo generado:**
```typescript
// src/migrations/1234567890-AddEmailToUser.ts
export class AddEmailToUser1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD "email" character varying NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "email"
    `);
  }
}
```

4. **Aplica la migración:**
```bash
npm run migration:run
```

5. **Commit y push:**
```bash
git add .
git commit -m "Add email column to users"
git push
```

6. **Railway aplicará automáticamente** la migración al hacer deploy.

---

### **Escenario 2: Renombrar una columna**

**⚠️ IMPORTANTE:** Renombrar NO es detectado automáticamente. Debes crear migración manual.

1. **Crea migración manual:**
```bash
npm run migration:create -- src/migrations/RenameUserNameToFullName
```

2. **Edita el archivo:**
```typescript
export class RenameUserNameToFullName1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" RENAME COLUMN "name" TO "full_name"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" RENAME COLUMN "full_name" TO "name"
    `);
  }
}
```

3. **Actualiza la entidad:**
```typescript
@Entity('users')
export class User {
  @Column({ name: 'full_name' })
  fullName: string;
}
```

4. **Aplica la migración:**
```bash
npm run migration:run
```

---

### **Escenario 3: Eliminar una columna**

1. **Genera migración ANTES de eliminar la columna de la entidad:**
```bash
npm run migration:generate -- src/migrations/RemoveEmailFromUser
```

2. **Aplica la migración:**
```bash
npm run migration:run
```

3. **Ahora puedes eliminar la columna de la entidad.**

---

## 🚀 Configuración en Railway

### **Variables de Entorno Necesarias:**

En Railway, asegúrate de tener:
```
DATABASE_URL=postgresql://...
NODE_ENV=production
```

### **¿Qué pasa en cada deploy?**

1. Railway ejecuta: `npm run build`
2. TypeORM compila migraciones a `dist/migrations/*.js`
3. Railway ejecuta: `npm run start:prod`
4. En `start:prod`, TypeORM ejecuta automáticamente: `migrationsRun: true`
5. **Se aplican todas las migraciones pendientes**
6. La app inicia con el schema actualizado

---

## ⚠️ Buenas Prácticas

### **DO's (Hacer):**
- ✅ Genera migraciones ANTES de hacer push
- ✅ Revisa el código SQL generado
- ✅ Prueba las migraciones localmente primero
- ✅ Haz commits separados para migraciones
- ✅ Usa nombres descriptivos: `AddEmailToUser`, `CreateProductsTable`

### **DON'Ts (No Hacer):**
- ❌ NO edites migraciones ya aplicadas en producción
- ❌ NO elimines archivos de migraciones del repo
- ❌ NO uses `synchronize: true` en producción
- ❌ NO cambies entidades sin generar migración
- ❌ NO hagas deploy sin probar migraciones localmente

---

## 🐛 Troubleshooting

### **Error: "Migration already exists"**
Alguien ya creó una migración con ese nombre.
```bash
npm run migration:show  # Ver migraciones existentes
```

### **Error: "QueryFailedError: relation does not exist"**
La tabla no existe. Ejecuta las migraciones:
```bash
npm run migration:run
```

### **Error: "Migration failed, rolling back"**
Hubo un error en el SQL. Revisa el archivo de migración.

### **¿Cómo resetear la BD completamente?**
⚠️ **Solo en desarrollo:**
1. Borra todas las tablas en la BD
2. Ejecuta: `npm run migration:run`
3. Todas las migraciones se aplicarán desde cero

---

## 📚 Recursos

- [TypeORM Migrations Docs](https://typeorm.io/migrations)
- [NestJS + TypeORM Guide](https://docs.nestjs.com/recipes/sql-typeorm)

---

## 🎯 Resumen

- **Desarrollo local:** Cambios automáticos con `synchronize: true` (NODE_ENV != production)
- **Producción:** Migraciones automáticas al hacer deploy
- **Siempre genera migraciones** antes de hacer push a producción
- **Las migraciones protegen tus datos** de cambios destructivos
