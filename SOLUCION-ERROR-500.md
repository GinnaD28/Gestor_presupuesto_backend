# Solución al Error 500 al Crear Categorías

## 🔍 Problema

El error 500 ocurre porque la tabla `Category` en la base de datos no tiene el campo `userId` que el código ahora requiere.

## ✅ Solución Rápida

### Opción 1: Aplicar Migración (Recomendado)

```bash
# 1. Asegúrate de estar en el directorio del backend
cd "C:\Users\Janus\Documents\Ginna Universidad\gestor_presupuesto\Backend"

# 2. Si tienes categorías existentes, elimínalas primero (opcional)
# Puedes hacerlo desde Prisma Studio o directamente en PostgreSQL

# 3. Crear y aplicar la migración
npm run prisma:migrate dev --name add_user_to_categories

# 4. Regenerar el cliente de Prisma
npm run prisma:generate

# 5. Reiniciar el servidor
npm run dev
```

### Opción 2: Migración Manual SQL

Si la migración automática falla, ejecuta este SQL directamente en PostgreSQL:

```sql
-- 1. Eliminar el índice único antiguo
DROP INDEX IF EXISTS "Category_name_key";

-- 2. Agregar la columna userId (si no existe)
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "userId" INTEGER;

-- 3. Eliminar categorías existentes (si las hay) o asignarlas a un usuario
-- OPCIONAL: DELETE FROM "Category"; (solo si no necesitas las categorías)

-- 4. Hacer userId NOT NULL (después de eliminar o asignar categorías)
-- Primero asegúrate de que no haya categorías sin userId
ALTER TABLE "Category" ALTER COLUMN "userId" SET NOT NULL;

-- 5. Crear el índice único compuesto
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");

-- 6. Agregar la foreign key
ALTER TABLE "Category" 
ADD CONSTRAINT "Category_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
```

Luego ejecuta:
```bash
npm run prisma:generate
```

### Opción 3: Resetear Base de Datos (Solo Desarrollo)

⚠️ **Esto eliminará TODOS los datos**

```bash
npm run prisma:migrate reset
```

## 🔍 Verificar que Funciona

1. Reinicia el servidor backend
2. Intenta crear una categoría desde el frontend
3. Verifica en los logs del servidor si hay errores más específicos

## 📝 Notas

- El error 500 ahora mostrará más detalles en modo desarrollo
- Si ves "Unknown arg" o "Unknown field" en el error, significa que la migración no se aplicó
- Asegúrate de que el cliente de Prisma esté actualizado: `npm run prisma:generate`


