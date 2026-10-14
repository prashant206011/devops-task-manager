const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});

const Task = mongoose.model("Task", taskSchema);

app.get("/", (req, res) => {
  res.send("DevOps Task Manager Backend is running!");
});

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();

  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const task = new Task({
    title: req.body.title,
    completed: false
  });

  await task.save();

  res.json(task);
});
app.patch("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    {
      completed: req.body.completed
    },
    {
      new: true
    }
  );

  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  res.json(task);
});

app.listen(80, () => {
  console.log("Backend listening on port 80");
});