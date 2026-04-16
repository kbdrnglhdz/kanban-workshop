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