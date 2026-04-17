## Why

El bug #5 de drag & drop causa que las tareas se dupliquen o desaparezcan al moverlas entre columnas del Kanban. Este problema afecta directamente la experiencia del usuario y la integridad de los datos, making it impossible to reorganize tasks reliably.

## What Changes

- Corregir la lógica de drag & drop para prevenir duplicación de tareas
- Corregir la lógica de drag & drop para prevenir pérdida de tareas
- Implementar reordenamiento correcto al mover tareas dentro de la misma columna
- Implementar reordenamiento correcto al mover tareas entre columnas diferentes
- Agregar sincronización con el backend después de cada drop
- Agregar feedback visual (indicador de carga) durante operaciones de drag & drop
- Modificar Board.tsx y Column.tsx

## Capabilities

### Modified Capabilities
- `board`: El spec existente `board` define los requisitos de drag & drop que serán implementados.

## Impact

- **Frontend**: Componentes de drag & drop en `frontend/src/components/`
- **Hook**: `frontend/src/hooks/useTasks.ts` - Manejo de estado de tareas
- **API**: Endpoint PUT `/tasks/:id` - Actualización de posición de tareas
