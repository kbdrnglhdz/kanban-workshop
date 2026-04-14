# Kanban Workshop

## Estructura del proyecto
```
architecture/
kanban-workshop/
├── backend/
│   ├── src/
│   │   ├── db.js          # Configuración SQLite
│   │   ├── server.js      # API Express
│   │   └── init-db.js     # Poblar DB con datos iniciales
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Board, Column, TaskCard, AddTaskForm
│   │   ├── hooks/         # useTasks.ts
│   │   ├── types/         # index.ts (Task, TaskStatus)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts     # Proxy /api → localhost:3000
│   └── package.json
└── workshop/
    └── proyecto.md        # Documentación de bugs
```

## Setup
```bash
cd backend && npm install && npm run init-db
cd frontend && npm install
```

## Comandos
| Package   | Command        | Description            |
|-----------|----------------|------------------------|
| backend   | `npm start`    | Iniciar API (port 3000) |
| backend   | `npm run init-db` | Reinicializar DB     |
| frontend  | `npm run dev`  | Dev server (port 5173) |
| frontend  | `npm run build` | Build producción      |

## API
- Vite proxy: `/api/*` → `http://localhost:3000`
- Endpoints: `/tasks` (GET, POST, PUT, DELETE), `/api/hola`

## Problemas conocidos (8 bugs intencionales)

### Backend
1. **GET /tasks** - 20% de respuestas con `status` alterado (pending ↔ in-progress)
2. **POST /tasks** - No valida `title` vacío ni `status` inválido
3. **PUT /tasks/:id** - No reordena tareas al actualizar `[order]`
4. **DELETE /tasks/:id** - Soft delete (marca `deleted_at`) pero GET no filtra

### Frontend
5. **Drag & drop** - Duplica o pierde tareas al mover
6. **Botón Eliminar** - Sin confirmación
7. **Crear tarea** - Silencia errores sin feedback
8. **Carga** - Sin indicador de loading

Detalles completos en `workshop/proyecto.md`.
Detalles de arquitectura en `architecture/**`.

## Testing
```bash
curl http://localhost:3000/tasks
```
