## 1. Modificar componentes de frontend para soportar índice de drop

- [ ] 1.1 Modificar `Column.tsx` para detectar posición de drop (usar `e.clientY` o similar)
- [ ] 1.2 Actualizar `handleDrop` en `Column.tsx` para pasar `dropIndex`
- [ ] 1.3 Modificar `Board.tsx` para recibir `dropIndex` en `handleDrop`

## 2. Actualizar hook useTasks para manejar reordenamiento

- [ ] 2.1 Agregar estado `isMoving` en `useTasks.ts`
- [ ] 2.2 Implementar lógica de cálculo de nuevo `order` basándose en `dropIndex`
- [ ] 2.3 Agregar lógica de gap strategy (primera posición, entre tasks, última posición)
- [ ] 2.4 Actualizar `updateTask` para usar nuevo `order`
- [ ] 2.5 Exponer `isMoving` en el return del hook

## 3. Agregar feedback visual durante operaciones

- [ ] 3.1 Mostrar indicador de carga en `Column.tsx` cuando `isMoving` es true
- [ ] 3.2 Deshabilitar drop zones durante operaciones en curso
- [ ] 3.3 Agregar estilos CSS para el estado de "moviendo"

## 4. Verificar backend PUT /tasks/:id

- [ ] 4.1 Verificar que endpoint acepta y persiste el campo `order`
- [ ] 4.2 Corregir bug #3 si PUT no actualiza `order` correctamente

## 5. Testing y verificación

- [ ] 5.1 Probar mover tarea dentro de la misma columna
- [ ] 5.2 Probar mover tarea entre columnas diferentes
- [ ] 5.3 Probar múltiples movimientos consecutivos
- [ ] 5.4 Verificar que no hay duplicación ni pérdida de tareas
