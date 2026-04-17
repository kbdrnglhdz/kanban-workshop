## ADDED Requirements

### Requirement: Feedback de error al crear tarea
El sistema MUST mostrar un mensaje de error al usuario cuando la creación de una tarea falla debido a validación del servidor.

#### Scenario: Error de título vacío
- **WHEN** el usuario intenta crear una tarea con título vacío y el backend devuelve error 400
- **THEN** el sistema MUST mostrar el mensaje "Title is required" debajo del formulario de agregar tarea

#### Scenario: Error de status inválido
- **WHEN** el usuario envía un status inválido y el backend devuelve error 400
- **THEN** el sistema DEBE mostrar el mensaje "Invalid status" debajo del formulario de agregar tarea

### Requirement: Propagación de errores del servidor
El sistema MUST capturar y propagar los mensajes de error devueltos por el backend para mostrarlos al usuario.

#### Scenario: Error con mensaje personalizado
- **WHEN** el backend devuelve un error con mensaje personalizado en el body de la respuesta
- **THEN** el sistema DEBE mostrar ese mensaje exacto al usuario

### Requirement: Limpiar error al reintentar
El sistema MUST limpiar el mensaje de error cuando el usuario intenta crear una tarea nuevamente.

#### Scenario: Usuario corrige el error
- **WHEN** el usuario ve un mensaje de error y luego ingresa datos válidos
- **THEN** el sistema DEBE limpiar el mensaje de error y proceder con la creación exitosa