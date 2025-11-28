# Migración: Categorías por Usuario

Se ha actualizado el sistema para que las categorías sean propias de cada usuario en lugar de ser globales.

## ⚠️ Cambios Realizados

1. **Schema de Prisma actualizado:**
   - Agregada relación `User` ↔ `Category`
   - Cambiado el constraint único de `name` a `name + userId` (cada usuario puede tener sus propias categorías)
   - Agregado `onDelete: Cascade` para eliminar categorías cuando se elimina un usuario

2. **Servicios actualizados:**
   - `getAllCategories()` ahora filtra por `userId`
   - `createCategory()` ahora asocia la categoría al usuario
   - `getCategoryById()` ahora verifica que la categoría pertenezca al usuario

3. **Controladores actualizados:**
   - Ambos endpoints ahora usan `req.user.id` para filtrar/crear categorías

## 🔧 Pasos para Aplicar la Migración

### Opción 1: Si NO tienes datos importantes en la tabla Category

```bash
# 1. Eliminar la tabla Category existente (si existe)
# Puedes hacerlo manualmente en PostgreSQL o usar Prisma Studio

# 2. Generar y aplicar la migración
npm run prisma:migrate dev --name add_user_to_categories

# 3. Regenerar el cliente de Prisma
npm run prisma:generate
```

### Opción 2: Si tienes datos en Category que quieres migrar

**⚠️ IMPORTANTE:** Si ya tienes categorías creadas, necesitarás asignarlas manualmente a los usuarios o eliminarlas.

```bash
# 1. Hacer backup de la base de datos (recomendado)
pg_dump -U usuario -d nombre_db > backup.sql

# 2. Eliminar las categorías existentes (o asignarlas manualmente)
# Opción A: Eliminar todas las categorías
# En PostgreSQL:
# DELETE FROM "Category";

# Opción B: Asignar categorías existentes a usuarios específicos
# (Requiere script personalizado)

# 3. Generar y aplicar la migración
npm run prisma:migrate dev --name add_user_to_categories

# 4. Regenerar el cliente de Prisma
npm run prisma:generate
```

### Opción 3: Resetear la base de datos (solo desarrollo)

```bash
# ⚠️ Esto eliminará TODOS los datos
npm run prisma:migrate reset
```

## ✅ Verificación

Después de aplicar la migración:

1. Reinicia el servidor: `npm run dev`
2. Inicia sesión con un usuario
3. Crea una categoría: `POST /categories` con `{"name": "Test"}`
4. Verifica que solo ese usuario vea su categoría: `GET /categories`
5. Inicia sesión con otro usuario y verifica que no vea las categorías del primer usuario

## 📝 Notas

- Cada usuario ahora tiene sus propias categorías
- El mismo nombre de categoría puede existir para diferentes usuarios
- Las categorías se eliminan automáticamente cuando se elimina un usuario
- Los gastos siguen funcionando igual, solo que ahora las categorías son por usuario


