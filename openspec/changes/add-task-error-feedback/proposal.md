## Why

El frontend actualmente silencia los errores al crear tareas. Cuando el backend devuelve un error (ej: título vacío o status inválido), el usuario no recibe ningún feedback y no sabe qué salió mal. Esto genera una experiencia confusa donde parece que la tarea no se creó pero no hay indicación de por qué.

## What Changes

- **Modificar useTasks.ts**: La función `addTask` debe propagar errores en lugar de simplemente retornar sin hacer nada.
- **Modificar AddTaskForm.tsx**: Capturar errores y mostrar feedback visual al usuario (mensaje de error inline).

## Capabilities

### New Capabilities
- **tasks**: Capacidad de mostrar feedback visual al usuario cuando la creación de una tarea falla, incluyendo mensajes de error del servidor.

### Modified Capabilities
- Ninguno existente requiere cambios de requisitos.

## Impact

- **Archivos afectados**:
  - `frontend/src/hooks/useTasks.ts` - Añadir propagación de errores
  - `frontend/src/components/AddTaskForm.tsx` - Mostrar errores al usuario
- **Sin cambios en API**: El backend ya devuelve errores útiles, solo el frontend debe mostrarlos.
- **Sin dependencias nuevas**: No se requieren librerías adicionales.