const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());
app.use(express.static('../frontend/dist'));

app.get('/api/hola', (req, res) => {
  res.json({ message: "Hola Opencode" });
});

app.get('/tasks', (req, res) => {
  db.all("SELECT id, title, status, [order] FROM tasks ORDER BY [order]", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (Math.random() < 0.2) {
      const corrupted = rows.map(t => ({
        ...t,
        status: t.status === 'pending' ? 'in-progress' : 'pending'
      }));
      return res.json(corrupted);
    }
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title, status = 'pending' } = req.body;
  const orderQuery = "SELECT COALESCE(MAX([order]), 0) + 1 as newOrder FROM tasks";
  db.get(orderQuery, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const newOrder = row.newOrder;
    db.run("INSERT INTO tasks (title, status, [order]) VALUES (?, ?, ?)",
      [title || '', status, newOrder],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, status, order: newOrder });
      });
  });
});

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, status, order } = req.body;
  let updateFields = [];
  let values = [];
  if (title !== undefined) {
    updateFields.push("title = ?");
    values.push(title);
  }
  if (status !== undefined) {
    updateFields.push("status = ?");
    values.push(status);
  }
  if (order !== undefined) {
    updateFields.push("[order] = ?");
    values.push(order);
  }
  if (updateFields.length === 0) return res.status(400).json({ error: "No fields to update" });
  values.push(id);
  const sql = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`;
  db.run(sql, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "updated" });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  db.run("UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));