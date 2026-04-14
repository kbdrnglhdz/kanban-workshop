# Manual del Participante – Taller OpenCode + OpenSpec

## Índice de contenidos por día

- **Día 1:** Fundamentos de OpenCode, instalación, `/init`, `/models`, `/share`
- **Día 2:** Herramientas (grep, edit, bash), permisos, resolución de problemas 1 y 4 (GET status corrupto, DELETE soft filter)
- **Día 3:** Comandos personalizados, argumentos, inyección bash, MCP, resolución de problemas 2 y 3 (POST título vacío, PUT order)
- **Día 4:** Introducción a OpenSpec, creación de cambios y artefactos para problemas 5 y 7 (drag & drop y error feedback) – solo especificación
- **Día 5:** Implementación con `/opsx:apply`, verificación, archivado, y resolución de problemas 6 y 8 (confirmación, loading)

> **Para Windows:** Los comandos `ls`, `cat`, `grep`, `curl` pueden sustituirse por `dir`, `type`, `findstr`, `Invoke-WebRequest`. Se recomienda usar **WSL** para una experiencia idéntica.

---

## Día 1 – OpenCode: Fundamentos y primeros pasos

### Teoría del día (resumen para el participante)

- **OpenCode** es un agente de IA para desarrollo que funciona en terminal (TUI), escritorio o IDE.
- Modos: **Build** (puede modificar archivos) y **Plan** (solo análisis, no cambios).
- Comandos básicos: `/connect`, `/init`, `/models`, `/share`, `/undo`, `/redo`.
- Usa `@` para referenciar archivos (búsqueda difusa).
- El archivo `AGENTS.md` guarda instrucciones personalizadas para el agente.

### Práctica guiada (copia y pega los comandos)

```bash
# 1. Instalar OpenCode (Linux/macOS/WSL)
curl -fsSL https://opencode.ai/install | bash
Windows 

# Verificar instalación
opencode --version

# 2. Crear y entrar al proyecto Kanban (el instructor te dará los archivos)
mkdir ~/kanban-board
cd ~/kanban-board

# 3. Iniciar OpenCode
opencode

# Dentro de OpenCode, ejecuta:
/connect
# Selecciona "OpenCode Zen", sigue el navegador para obtener la API key

# 4. Inicializar AGENTS.md
/init
# Responde: tech stack = React, TypeScript, Vite, Node, Express, SQLite

# 5. Cambiar modelo (opcional)
/models
# Elige anthropic/claude-sonnet-4-5 si está disponible

# 6. Preguntar sobre la arquitectura (usa @ para archivos)
@backend/src/server.js ¿cómo funciona el endpoint GET /tasks?

# 7. Compartir sesión
/share
# Copia el enlace generado

# 8. Probar undo/redo (pide un cambio pequeño, luego /undo y /redo)
Cambia el título del index.html a "Mi Kanban"
/undo
/redo
```

### Ejercicios a resolver (individual)

1. **Mejora `AGENTS.md`** – Añade una sección "Problemas conocidos" con la lista de 8 problemas intencionales (los que el instructor mencionó). Añade también "Estructura del proyecto".
2. **Explora con `@`** – Pregunta: `@frontend/src/hooks/useTasks.ts ¿qué hace este hook?`
3. **Cambia de modelo** – Prueba otro modelo (ej. `claude-haiku`) y compara la respuesta.
4. **Comparte de nuevo** – Ejecuta `/share` y guarda el segundo enlace.

### Troubleshooting (problemas comunes)

| Problema | Solución |
|----------|----------|
| `opencode: command not found` | Reinstala o añade `~/.local/bin` al PATH |
| El comando `/connect` no muestra OpenCode Zen | Verifica conexión a internet; prueba con otra red |
| `AGENTS.md` no se crea | Asegúrate de estar en la raíz del proyecto y de que exista `package.json` |
| No se ve el cambio de modelo | Espera unos segundos y vuelve a escribir `/models` |

---

## Día 2 – OpenCode: Herramientas y corrección de problemas de backend

**Problemas a resolver hoy:**  
✅ **Problema 1:** GET /tasks devuelve status incorrecto aleatoriamente  
✅ **Problema 4:** DELETE /tasks (soft delete) pero GET sigue mostrando tareas eliminadas  

### Teoría del día

- **Herramientas de OpenCode:** `read`, `write`, `edit`, `bash`, `grep`, `glob`, `list`.
- **Permisos:** `allow` (automático), `ask` (pregunta), `deny` (bloquea). Se configuran en `opencode.json`.
- **Modo Plan** (solo lectura, para analizar) vs **Modo Build** (ejecuta cambios). Se cambia con `Tab`.
- Comando `/compact` para resumir conversaciones largas.
- Comando `/details` para ver ejecución de herramientas.

### Práctica guiada (copia y pega)

```bash
# 1. Asegurar que el backend está corriendo (en otra terminal)
cd ~/kanban-board/backend
npm start

# 2. Abrir OpenCode en el proyecto
cd ~/kanban-board
opencode

# 3. Configurar permisos básicos (crea opencode.json)
# (Puedes pedir al agente que lo cree)
Crea un archivo opencode.json con:
{
  "permission": {
    "edit": "ask",
    "bash": "ask",
    "read": "allow",
    "grep": "allow"
  }
}

# 4. Usar grep para encontrar el problema 1
Busca en backend/src/server.js líneas con "Math.random"

# 5. Plan mode: analizar solución
# Presiona Tab para cambiar a Plan mode
Analiza el problema del GET /tasks que corrompe el status. Propón una solución.

# 6. Build mode: corregir problema 1
# Presiona Tab para volver a Build mode
Elimina el bloque if (Math.random() < 0.2) que modifica el status.

# 7. Verificar corrección (en otra terminal)
for i in {1..10}; do curl -s http://localhost:3000/tasks | jq '.[0].status'; done

# 8. Detectar problema 4 (DELETE)
Analiza el endpoint DELETE /tasks/:id. ¿Qué problema tiene con la eliminación?

# 9. Corregir problema 4
Modifica GET /tasks para que solo devuelva tareas con deleted_at IS NULL.

# 10. Probar
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"ToDelete"}'
# Toma el ID de la respuesta
curl -X DELETE http://localhost:3000/tasks/ID
curl -s http://localhost:3000/tasks | grep ToDelete  # No debe aparecer
```

### Ejercicios a resolver

1. **Configura permisos granulares** – Modifica `opencode.json` para que `git status` sea `allow` y el resto de comandos bash sean `ask`.
2. **Usa `/compact`** – Una vez que tengas una conversación larga, ejecuta `/compact` y observa cómo se resume.
3. **Actualiza `AGENTS.md`** – Añade una tabla con los problemas corregidos hoy (1 y 4).
4. **Prueba `@explore`** (opcional) – Escribe `@explore ¿Hay otros posibles bugs en server.js?`

### Troubleshooting

| Problema | Solución |
|----------|----------|
| El agente no pide permiso aunque está `ask` | Reinicia OpenCode y verifica que `opencode.json` esté en la raíz |
| `jq: command not found` | Instala jq (`sudo apt install jq` en Linux, `brew install jq` en macOS) o usa `grep` |
| Los cambios no persisten | Abre el archivo manualmente para confirmar; usa `/undo` si algo salió mal |
| Error "port already in use" | Mata el proceso anterior: `npx kill-port 3000` |

---

## Día 3 – OpenCode: Comandos personalizados y problemas complejos

**Problemas a resolver hoy:**  
✅ **Problema 2:** POST /tasks permite título vacío  
✅ **Problema 3:** PUT /tasks/:id no reordena otras tareas al cambiar `order`

### Teoría del día

- **Comandos personalizados:** Archivos `.opencode/commands/*.md` con frontmatter y prompt.
- **Argumentos:** `$ARGUMENTS` (todo), `$1`, `$2` (individuales).
- **Inyección de bash:** `` `!comando` `` dentro del prompt.
- **MCP servers:** Integración de herramientas externas (ej. Context7 para documentación).
- **Subagentes:** `@general` (multipropósito), `@explore` (solo lectura).

### Práctica guiada

```bash
# 1. Crear directorio de comandos
mkdir -p .opencode/commands

# 2. Crear comando /test-api
cat > .opencode/commands/test-api.md << 'EOF'
---
description: Prueba los endpoints críticos
---
Ejecuta estos CURLs y reporta fallos:

1. POST con título vacío (debe devolver 400):
`!curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":""}'`

2. PUT con order extremo (debe reordenar):
`!curl -s -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"order":99}'`

3. Ver orden después:
`!curl -s http://localhost:3000/tasks | jq '.[] | {id, order}'`
EOF

# 3. Probar el comando (dentro de OpenCode)
/test-api

# 4. Corregir problema 2 (POST título vacío) – Plan + Build
# Plan mode: 
Analiza POST /tasks y sugiere validación para título vacío.
# Build mode:
Implementa la validación: si title está vacío o solo espacios, responde 400 con { error: "Title required" }.

# 5. Crear comando /fix-order con argumentos
cat > .opencode/commands/fix-order.md << 'EOF'
---
description: Corrige el orden de la tarea $1 a la posición $2
---
Implementa en @backend/src/server.js la lógica de reordenamiento para la tarea ID $1 a la nueva posición $2.
Usa transacción SQL. Asegura que los órdenes queden secuenciales 1..N.
EOF

# 6. Ejecutar /fix-order (cambia los IDs según tus datos)
/fix-order 1 3

# 7. Configurar MCP Context7 (añade a opencode.json)
# Edita opencode.json y agrega:
"mcp": {
  "context7": {
    "type": "remote",
    "url": "https://mcp.context7.com/mcp"
  }
}
# Reinicia OpenCode

# 8. Usar MCP
Usa Context7 para obtener documentación sobre transacciones en SQLite.

# 9. Usar subagente @explore para verificar el orden
@explore Verifica que después de la corrección, los orders sean 1,2,3... sin saltos.
```

### Ejercicios a resolver

1. **Crea comando `/move-task`** – Debe mover una tarea de una columna a otra usando `$1` (ID) y `$2` (nuevo status). Pista: usa `curl -X PUT`.
2. **Crea comando `/status`** – Que muestre el número de tareas por columna usando inyección bash.
3. **Mejora `/fix-order`** – Añade validación para que el nuevo order no sea menor que 1 ni mayor que el total de tareas.
4. **Usa `@general`** – Pídele que investigue "mejores prácticas para drag & drop en React".

### Troubleshooting

| Problema | Solución |
|----------|----------|
| El comando no aparece al escribir `/` | Verifica que el archivo `.md` esté en `.opencode/commands/` y reinicia OpenCode |
| `$1` no se reemplaza | Usa `$ARGUMENTS` o separa con espacios; a veces el agente interpreta el argumento directamente |
| MCP no responde | Comprueba tu conexión a internet; reinicia OpenCode después de modificar la configuración |
| Error "SQLITE_BUSY" | Asegura que no haya otra transacción abierta; reinicia el backend |

---

## Día 4 – OpenSpec: Especificaciones para problemas de frontend (solo artefactos)

**Problemas a especificar hoy (NO implementar):**  
✅ **Problema 5:** Drag & drop duplica/desaparece tareas  
✅ **Problema 7:** Error silencioso al crear tarea (sin feedback)

### Teoría del día

- **OpenSpec:** Sistema de especificaciones con `specs/` (fuente de verdad) y `changes/` (propuestas).
- **Artefactos:** `proposal.md`, `specs/` (deltas), `design.md` (opcional), `tasks.md`.
- **Deltas:** `## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements`.
- **Comandos OPSX en OpenCode:** `/opsx:propose`, `/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:apply`, `/opsx:verify`, `/opsx:archive`.
- **CLI de OpenSpec:** `openspec init`, `openspec validate`, `openspec list`, `openspec show`.

### Práctica guiada

```bash
# 1. Instalar OpenSpec (si no lo hiciste)
npm install -g @fission-ai/openspec@latest
openspec --version

# 2. Inicializar OpenSpec en el proyecto (responde: opencode, core, skills)
cd ~/kanban-board
openspec init

# 3. Reiniciar OpenCode para detectar los nuevos skills
# Sal de OpenCode (/exit) y vuelve a entrar

# 4. Crear cambio para problema 5 (drag & drop)
/opsx:propose fix-drag-drop

# 5. Editar proposal.md (puedes usar /editor o tu editor favorito)
# Asegúrate de incluir:
# - Why: el problema de duplicación/desaparición
# - What Changes: modificar Board.tsx y Column.tsx
# - Impact: solo frontend

# 6. Crear el delta spec en openspec/changes/fix-drag-drop/specs/frontend/spec.md
# (El comando /opsx:propose ya genera un esqueleto. Módelo así:)
cat > openspec/changes/fix-drag-drop/specs/frontend/spec.md << 'EOF'
# Delta for Frontend

## ADDED Requirements

### Requirement: Movimiento atómico por drag & drop
Al arrastrar una tarea entre columnas, DEBE moverse sin duplicarse ni desaparecer.

#### Scenario: Movimiento exitoso
- GIVEN una tarea en columna "Pendiente"
- WHEN el usuario la arrastra a columna "En Progreso"
- THEN la tarea aparece en "En Progreso"
- AND desaparece de "Pendiente"
- AND no hay tareas duplicadas

#### Scenario: Cancelación del drag
- GIVEN una tarea siendo arrastrada
- WHEN el usuario suelta fuera de cualquier columna
- THEN la tarea permanece en su columna original
EOF

# 7. Editar tasks.md (añade tareas concretas)
# Ejemplo:
# - [ ] 1.1 Modificar handleDrop para eliminar el nodo original
# - [ ] 1.2 Usar estado de React en lugar de manipulación directa del DOM

# 8. Crear cambio para problema 7 (error feedback)
/opsx:propose add-task-error-feedback

# 9. Editar su delta spec (similar al anterior, pero para el feedback)
# Añade requisito ADDED: "Feedback de errores al crear tarea"

# 10. Validar ambos cambios
openspec validate fix-drag-drop
openspec validate add-task-error-feedback
```

### Ejercicios a resolver

1. **Crea un cambio para el problema 6** (botón eliminar sin confirmación). Escribe `proposal.md`, delta spec (ADDED) y `tasks.md`. Valídalo.
2. **Usa `openspec list`** para ver los cambios activos.
3. **Comparte la sesión de OpenCode** con `/share` y guarda el enlace.
4. **Opcional:** Añade un `design.md` para el cambio de drag & drop explicando la solución técnica.

### Troubleshooting

| Problema | Solución |
|----------|----------|
| `/opsx:propose` no se reconoce | Reinicia OpenCode; verifica que `.opencode/skills/openspec-propose/SKILL.md` existe |
| Validación falla por formato | Los requisitos deben empezar con `### Requirement:` y los escenarios con `#### Scenario:` |
| Error "Change already exists" | Usa otro nombre o elimina el cambio anterior con `rm -rf openspec/changes/fix-xxx` |
| No aparece la carpeta `specs/frontend` | Créala manualmente: `mkdir -p openspec/changes/fix-drag-drop/specs/frontend` |

---

## Día 5 – OpenSpec + OpenCode: Implementación, verificación y archivo

**Problemas a implementar hoy:**  
✅ **Problema 5** (drag & drop) – implementación  
✅ **Problema 7** (error feedback) – implementación  
✅ **Problema 6** (eliminar sin confirmación) – se añade directamente  
✅ **Problema 8** (indicador de carga) – opcional

### Teoría del día

- **Flujo completo:** `propose` → `apply` → `verify` → `archive`.
- `/opsx:apply` lee `tasks.md` y va ejecutando las tareas una por una.
- `/opsx:verify` comprueba completitud, corrección y coherencia (no bloquea).
- `/opsx:archive` fusiona deltas en `specs/` y mueve el cambio a `archive/`.
- `openspec/config.yaml` permite inyectar contexto y reglas en todos los artefactos.

### Práctica guiada

```bash
# 1. Mejorar openspec/config.yaml (añade contexto)
cat > openspec/config.yaml << 'EOF'
schema: spec-driven
context: |
  React + TypeScript, Vite. Componentes funcionales.
  Usar confirm() para acciones destructivas.
  Mostrar errores con alert o un div de error.
  Estado de carga: variable loading en el hook.
rules:
  proposal:
    - Incluir impacto UX
  tasks:
    - Dividir en pasos pequeños
EOF

# 2. Implementar problema 5 (drag & drop)
/opsx:apply fix-drag-drop
# Sigue las indicaciones del agente; acepta cambios cuando pida permiso

# 3. Verificar manualmente en navegador (abre http://localhost:5173)
# Arrastra tareas entre columnas varias veces; no deben duplicarse

# 4. Implementar problema 7 (error feedback)
/opsx:apply add-task-error-feedback
# El agente modificará useTasks.ts y AddTaskForm.tsx

# 5. Probar el feedback de error: detén el backend (Ctrl+C en su terminal) e intenta crear una tarea.
# Debe aparecer un mensaje de error.

# 6. Implementar problema 6 (eliminar sin confirmación) – cambio rápido
# En OpenCode, pide directamente:
Agrega un confirm('¿Eliminar esta tarea?') antes de llamar a onDelete en TaskCard.tsx.

# 7. Verificar los cambios con OpenSpec
/opsx:verify fix-drag-drop
/opsx:verify add-task-error-feedback

# 8. Archivar los cambios
/opsx:archive fix-drag-drop
# Responde "yes" cuando pregunte por sincronizar specs
/opsx:archive add-task-error-feedback

# 9. Comprobar que las specs principales se actualizaron
cat openspec/specs/frontend/spec.md

# 10. Listar cambios activos (debería estar vacío o solo los que no archivaste)
openspec list
```

### Ejercicios a resolver (entregables finales)

1. **Implementa problema 8 (indicador de carga)** – Crea un cambio nuevo con `/opsx:propose add-loading-indicator`, impleméntalo y archívalo.
2. **Ejecuta validación completa:** `openspec validate --all --json` y corrige cualquier advertencia.
3. **Actualiza `AGENTS.md`** – Documenta los comandos personalizados que creaste y los problemas resueltos.
4. **Comparte la sesión final** con `/share` y guarda el enlace para la entrega.
5. **Sube tu repositorio** a GitHub (opcional) e incluye:
   - Todo el código fuente
   - La carpeta `openspec/`
   - La carpeta `.opencode/commands/`
   - El archivo `opencode.json`

### Troubleshooting

| Problema | Solución |
|----------|----------|
| `/opsx:apply` no avanza | Asegúrate de que `tasks.md` tiene tareas con checkboxes `- [ ]` |
| El agente no puede modificar el frontend | Verifica que `edit` esté en `ask` o `allow` en `opencode.json` |
| Archivar falla porque hay deltas sin sincronizar | Responde "yes" cuando archive pregunte por sync |
| El navegador no refleja cambios | Refresca la página (F5); a veces el frontend necesita reconstruirse: `npm run build` |
| Error "Spec file not found" | Asegura que el delta spec esté en la ruta correcta: `changes/nombre/specs/dominio/spec.md` |

---

## Entregables finales del taller

Para completar el taller, cada participante debe presentar:

- [ ] Repositorio con el código del Kanban funcionando (todos los problemas solucionados).
- [ ] Archivo `AGENTS.md` actualizado.
- [ ] Carpeta `openspec/` con especificaciones finales y cambios archivados.
- [ ] Carpeta `.opencode/commands/` con al menos 3 comandos personalizados.
- [ ] Captura de pantalla de `openspec list` (sin cambios activos o con los esperados).
- [ ] Enlaces de sesiones compartidas de OpenCode (al menos uno del día 1 y otro del día 5).

¡Felicidades por completar el taller! 🎉