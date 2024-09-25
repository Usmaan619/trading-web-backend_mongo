import express from "express";
import { Task } from "../models/task.js";
const router = express();

// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find().populate("assignedTo createdBy");
  res.json(tasks);
});

// Create a new task
router.post("/", async (req, res) => {
  const { title, description, assignedTo, dueDate, priority } = req.body;
  const newTask = new Task({
    title,
    description,
    assignedTo,
    dueDate,
    priority,
    createdBy: req.user._id,
  });
  await newTask.save();
  res.json(newTask);
});

// Update a task (e.g., change status, description)
router.put("/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedTask);
});

// Add comment to a task
router.post("/:id/comment", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.comments.push({
    text: req.body.text,
    createdBy: req.user._id,
  });
  await task.save();
  res.json(task);
});

// Delete a task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;
