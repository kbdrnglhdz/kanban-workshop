## Context

El bug #5 de drag & drop causa que las tareas se dupliquen o desaparezcan al moverlas. El problema radica en:

1. **Sin seguimiento de posición**: `handleDrop` solo pasa `status`, no la posición `order`
2. **Sin reordenamiento real**: Las tareas se mueven entre columnas pero el `order` no se calcula correctamente
3. **Sin feedback visual**: No hay indicador de carga durante la operación
4. **Race conditions**: No hay control de concurrencia al actualizar

**Stack actual**: React + TypeScript (frontend), Express + SQLite (backend)

## Goals / Non-Goals

**Goals:**
- Corregir duplicación de tareas al mover
- Corregir pérdida de tareas al mover
- Implementar reordenamiento dentro de columnas
- Agregar indicador visual de carga
- Sincronización consistente con backend

**Non-Goals:**
- Cambiar la estructura de la base de datos
- Implementar drag & drop anidado o multi-select
- Persistir estado de drag en localStorage

## Decisiones

### Decisión 1: Usar índice de posición en drop

**Opción elegida**: Pasar `dropIndex` al handler de drop y recalcular `order` basándose en posiciones relativas.

**Alternativas consideradas**:
- Usar coordenadas de pixel: Requiere cálculo complejo y no es necesario
- Enviar solo order nuevo: No permite reordenamiento dentro de columna

**Implementación**:
- `handleDrop(status, dropIndex)` en Board.tsx
- Recalcular orders: `newOrder = dropIndex * 1000` (espacio inicial) o interpolar entre tasks adyacentes

### Decisión 2: Reordenamiento con gap strategy

**Estrategia**: Usar valores de `order` con gaps (ej: 1000, 2000, 3000) para permitir inserción sin reorden masivo.

**Cálculo de nuevo order**:
- Primera posición: `minOrder - 1000` (o 1000 si es la primera)
- Entre dos tasks: `(prevOrder + nextOrder) / 2`
- Última posición: `maxOrder + 1000`

**Reordenamiento periódico**: Cuando los gaps son muy pequeños (< 1), renumerar toda la columna.

### Decisión 3: Sincronización con refetch

**Estrategia**: Mantener el refetch del backend pero agregar:
- Estado de loading visible
- Bloqueo de operaciones durante el fetch

**Alternativa**: Optimistic updates - Rechazada por complejidad y riesgo de inconsistencias.

### Decisión 4: Feedback visual con estado local

**Implementación**: 
- Agregar `isMoving` state en useTasks
- Mostrar indicador visual en Column durante movimiento
- Deshabilitar drop mientras hay operación en curso

## Riesgos / Trade-offs

- **[Riesgo] Reordenamiento frecuente**: Si muchas inserciones, los gaps se agotan → **Mitigación**: Renumerar columna periódicamente
- **[Riesgo] Latencia de red**: Sin optimistic updates, hay delay visible → **Mitigación**: Mostrar feedback de carga, operación es rápida (< 200ms típicamente)
- **[Trade-off] Simplicidad vs Robustez**: Solución simple con refetch es menos elegante pero más robusta que optimistic updates

## Plan de Implementación

1. Modificar `Board.tsx` para pasar `dropIndex`
2. Modificar `Column.tsx` para detectar posición de drop y pasar índice
3. Modificar `useTasks.ts` para:
   - Agregar `isMoving` state
   - Calcular `order` basado en `dropIndex`
   - Exponer `isMoving` para UI
4. Agregar estilos de feedback visual (opacity/disabled)
5. Verificar que PUT /tasks/:id maneje el nuevo `order`

## Open Questions

- ¿El backend PUT /tasks/:id actualiza correctamente el `order`? (Bug #3 menciona que no reordena)
- ¿Necesitamos agregar un campo `position` o el `order` actual es suficiente?
