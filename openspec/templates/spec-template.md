# Spec Template - OpenSpec

Plantilla para crear specs válidas en OpenSpec.

---

## Formato Requerido

```markdown
## Purpose
[Breve descripción del propósito de la feature - 1-2 oraciones]

## Requirements
### Requirement: [Nombre del requisito]
Users SHALL [funcionalidad que deben poder hacer los usuarios]

#### Scenario: [Nombre del escenario]
- **WHEN** [condición/acción del usuario]
- **THEN** [resultado esperado]
```

---

## Ejemplo

```markdown
## Purpose
Permitir a los usuarios gestionar comentarios en productos del inventario.

## Requirements
### Requirement: Crear producto con comentarios
Users SHALL crear un producto incluyendo un campo de comentarios

#### Scenario: Crear producto con comentarios válidos
- **WHEN** el usuario ingresa nombre, descripción, cantidad, precio y comentarios (≤500 caracteres)
- **THEN** el producto se crea exitosamente con los comentarios asociados

#### Scenario: Validar límite de caracteres
- **WHEN** el usuario ingresa más de 500 caracteres en comentarios
- **THEN** el sistema muestra mensaje de error

### Requirement: Ver comentarios en lista
Users SHALL visualizar los comentarios de cada producto en la lista

#### Scenario: Mostrar comentarios en tabla
- **WHEN** existen productos con comentarios
- **THEN** se muestra una columna "Comentarios" con el texto o "-" si está vacío
```

---

## Reglas de Validación

- **Required sections**: `## Purpose` y `## Requirements`
- **Requirement format**: `### Requirement: [nombre]` + descripción "Users SHALL..."
- **Scenario format**: `#### Scenario: [nombre]` + `- **WHEN**` y `- **THEN**`
- Múltiples scenarios por requirement
- Múltiples requirements por spec
```
