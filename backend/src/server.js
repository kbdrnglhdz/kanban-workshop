const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());
app.use(express.static('../frontend/dist'));

app.get('/api/hola', (req, res) => {
  res.json({ message: "Hola Opencode" });
});

app.get('/tasks', (req, res) => {
  db.all("SELECT id, title, status, [order] FROM tasks WHERE deleted_at IS NULL ORDER BY [order]", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title, status = 'pending' } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }
  
  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  
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

  if (title === undefined && status === undefined && order === undefined) {
    return res.status(400).json({ error: "No fields to update" });
  }

  if (order !== undefined) {
    if (typeof order !== 'number') {
      return res.status(400).json({ error: "Order must be a number" });
    }

    db.serialize(() => {
      db.run("BEGIN TRANSACTION", (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.get("SELECT [order] as currentOrder FROM tasks WHERE id = ? AND deleted_at IS NULL", id, (err, row) => {
          if (err || !row) {
            db.run("ROLLBACK");
            return res.status(404).json({ error: "Task not found" });
          }

          const currentOrder = row.currentOrder;
          let newOrder = order;

          db.get("SELECT COALESCE(MAX([order]), 0) as maxOrder FROM tasks WHERE deleted_at IS NULL", (err, maxRow) => {
            if (err) { db.run("ROLLBACK"); return res.status(500).json({ error: err.message }); }
            const maxOrder = maxRow.maxOrder;

            if (newOrder > maxOrder) {
              newOrder = maxOrder;
            }
            if (newOrder < 1) {
              newOrder = 1;
            }

            if (newOrder === currentOrder) {
              db.run("COMMIT");
              return res.json({ message: "Order unchanged" });
            }

            const shiftAndUpdate = (callback) => {
              if (newOrder > currentOrder) {
                db.run(`UPDATE tasks SET [order] = [order] - 1 WHERE [order] > ? AND [order] <= ? AND deleted_at IS NULL AND id != ?`,
                  [currentOrder, newOrder, id], (err) => {
                    if (err) { db.run("ROLLBACK"); return callback(err); }
                    db.run("UPDATE tasks SET [order] = ? WHERE id = ?", [newOrder, id], (err) => {
                      if (err) { db.run("ROLLBACK"); return callback(err); }
                      callback();
                    });
                  });
              } else {
                db.run(`UPDATE tasks SET [order] = [order] + 1 WHERE [order] >= ? AND [order] < ? AND deleted_at IS NULL AND id != ?`,
                  [newOrder, currentOrder, id], (err) => {
                    if (err) { db.run("ROLLBACK"); return callback(err); }
                    db.run("UPDATE tasks SET [order] = ? WHERE id = ?", [newOrder, id], (err) => {
                      if (err) { db.run("ROLLBACK"); return callback(err); }
                      callback();
                    });
                  });
              }
            };

          shiftAndUpdate((err) => {
            if (err) return res.status(500).json({ error: err.message });

            const otherUpdates = [];
            const values = [];
            if (title !== undefined) { otherUpdates.push("title = ?"); values.push(title); }
            if (status !== undefined) { otherUpdates.push("status = ?"); values.push(status); }

            if (otherUpdates.length > 0) {
              values.push(id);
              db.run(`UPDATE tasks SET ${otherUpdates.join(", ")} WHERE id = ?`, values, (err) => {
                if (err) { db.run("ROLLBACK"); return res.status(500).json({ error: err.message }); }
                db.run("COMMIT", (err) => {
                  if (err) return res.status(500).json({ error: err.message });
                  res.json({ message: "Task updated and reordered", id, order: newOrder });
                });
              });
            } else {
              db.run("COMMIT", (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Task reordered", id, order: newOrder });
              });
            }
          });
          });
        });
      });
    });
  } else {
    let updateFields = [];
    let values = [];
    if (title !== undefined) { updateFields.push("title = ?"); values.push(title); }
    if (status !== undefined) { updateFields.push("status = ?"); values.push(status); }
    values.push(id);
    db.run(`UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`, values, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
      res.json({ message: "updated" });
    });
  }
});

app.post('/tasks/:id/reorder', (req, res) => {
  const taskId = req.params.id;
  const { order: newOrder } = req.body;

  if (newOrder === undefined || typeof newOrder !== 'number') {
    return res.status(400).json({ error: "Valid order position is required" });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION", (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.get("SELECT [order] as currentOrder FROM tasks WHERE id = ? AND deleted_at IS NULL", taskId, (err, row) => {
        if (err || !row) {
          db.run("ROLLBACK");
          return res.status(404).json({ error: "Task not found" });
        }

        const currentOrder = row.currentOrder;

        if (newOrder === currentOrder) {
          db.run("COMMIT");
          return res.json({ message: "Order unchanged" });
        }

        let shiftQuery;
        if (newOrder > currentOrder) {
          shiftQuery = `UPDATE tasks SET [order] = [order] - 1 
                        WHERE [order] > ? AND [order] <= ? AND deleted_at IS NULL AND id != ?`;
          db.run(shiftQuery, [currentOrder, newOrder, taskId], (err) => {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }
            db.run("UPDATE tasks SET [order] = ? WHERE id = ?", [newOrder, taskId], function(err) {
              if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
              }
              db.run("COMMIT", (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Task reordered successfully", id: taskId, order: newOrder });
              });
            });
          });
        } else {
          shiftQuery = `UPDATE tasks SET [order] = [order] + 1 
                        WHERE [order] >= ? AND [order] < ? AND deleted_at IS NULL AND id != ?`;
          db.run(shiftQuery, [newOrder, currentOrder, taskId], (err) => {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }
            db.run("UPDATE tasks SET [order] = ? WHERE id = ?", [newOrder, taskId], function(err) {
              if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
              }
              db.run("COMMIT", (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Task reordered successfully", id: taskId, order: newOrder });
              });
            });
          });
        }
      });
    });
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