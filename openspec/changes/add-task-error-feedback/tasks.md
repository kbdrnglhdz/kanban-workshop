## 1. Modificar useTasks para propagar errores

- [ ] 1.1 Modificar la función `addTask` en `frontend/src/hooks/useTasks.ts` para lanzar un error cuando la respuesta no es exitosa
- [ ] 1.2 Incluir el mensaje de error del servidor en el error lanzado

## 2. Modificar AddTaskForm para mostrar errores

- [ ] 2.1 Añadir estado local `error` para almacenar el mensaje de error
- [ ] 2.2 Envolver la llamada a `onAdd` en un bloque try/catch
- [ ] 2.3 Mostrar el mensaje de error debajo del formulario cuando exista
- [ ] 2.4 Limpiar el error cuando el usuario начинает a escribir (onChange)