const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let todos = [
    { id: "0774", todo: "New Task", completed: true },
    { id: "2cb7", todo: "Submit M1 Summative Part 1", completed: true },
    { id: "0279", todo: "Submit M1 Summative Part 2", completed: true }
];

// GET
app.get("/todos", (req, res) => {
    res.json(todos);
});

// POST
app.post("/todos", (req, res) => {
    const newTodo = { id: Date.now().toString(), ...req.body };
    todos.push(newTodo);
    res.json(newTodo);
});

// PATCH
app.patch("/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find(t => t.id === id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    Object.assign(todo, req.body);
    res.json(todo);
});

// DELETE 
app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    todos = todos.filter(t => t.id !== id);
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log("Backend running at http://localhost:3000");
});
