## Context

El problema identificado es que al crear una tarea desde el frontend, si el backend devuelve un error (ej: título vacío o status inválido), el error es silenciado y el usuario no recibe feedback.

**Estado actual:**
- `useTasks.ts:addTask()` recibe errores 400 del backend pero los ignora completamente
- `AddTaskForm.tsx` no tiene mecanismo para mostrar errores
- El backend ya devuelve mensajes de error útiles en el body de la respuesta

**Restricciones:**
- No usar librerías externas de toast (mantener simple)
- El feedback debe ser claro y accesible

## Goals / Non-Goals

**Goals:**
- Mostrar mensajes de error del servidor cuando la creación de tarea falla
- Propagar errores desde `useTasks` hacia los componentes que lo usan

**Non-Goals:**
- No se implementará toast notifications complejas
- No se modificará el backend (ya tiene la lógica de errores)
- No se implementará loading state (bug separado #8)

## Decisiones

### Decisión 1: Mecanismo de feedback
**Opción elegida:** Mensaje de error inline simple

**Alternativas consideradas:**
- Toast notifications (requiere librería externa, overkill para este caso)
- Alert de navegador (muy invasivo, mala UX)
- Modal de error (demasiado complejo)

**Rationale:** Un mensaje de error inline debajo del input es simple, no requiere dependencias adicionales, y mantiene al usuario en contexto.

### Decisión 2: Propagación de errores
**Opción elegida:** Lanzar error desde `addTask` para que el componente lo capture

**Alternativas:**
- Retornar resultado con propiedad `error` (más flexible pero más cambios)
- Callback de error separado (más complejo de usar)

**Rationale:** Usar try/catch con async/await es idiomático en React y permite manejo declarativo de errores en el componente.

## Risks / Trade-offs

- **Riesgo:** El usuario podría no ver el error si está en una pantalla pequeña
  - **Mitigación:** Usar color de texto prominentro (rojo) y posicionar cerca del input

- **Riesgo:** Error largo del backend podría romper el layout
  - **Mitigación:** Limitar longitud del mensaje o truncar con ellipsis