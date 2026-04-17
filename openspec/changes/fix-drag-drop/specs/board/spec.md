# Spec: Bug #5 - Drag & Drop (Delta)

---

## MODIFIED Requirements

### Requirement: Actualizar posición al mover tareas

Users SHALL poder mover tareas entre columnas con el orden correcto.

#### Scenario: Mover tarea dentro de la misma columna
- **WHEN** el usuario arrastra una tarea y la suelta en otra posición dentro de la misma columna
- **THEN** la tarea se reposiciona correctamente y mantiene su order actualizado

#### Scenario: Mover tarea entre columnas diferentes
- **WHEN** el usuario arrastra una tarea de una columna a otra
- **THEN** la tarea cambia de columna y su order se recalcula para la columna destino

### Requirement: Sincronización consistente con backend

Users SHALL ver reflejados los cambios de posición sin inconsistencias.

#### Scenario: Actualización después de drop
- **WHEN** se completa un drop de tarea
- **THEN** el estado local se actualiza con los datos del servidor sin race conditions

### Requirement: Feedback visual durante operaciones

Users SHALL recibir feedback visual durante operaciones de drag & drop.

#### Scenario: Indicador de carga
- **WHEN** se está moviendo una tarea
- **THEN** se muestra indicador de que la operación está en proceso
