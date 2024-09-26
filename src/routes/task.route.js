import express from "express";
import { Task } from "../models/task.js";
import { User } from "../models/user.js";
const router = express();

// Get all tasks
router.get("/getAllTasks", async (req, res, next) => {
  try {
    const tasks = await Task.find().populate("assignedTo createdBy");
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// Create a new task
router.post("/create", async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate, priority, status } =
      req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      status,
      // createdBy: req?.user?._id,
      createdBy: req?.body?.createdBy,
    });

    await task.save();

    // Add task to the assigned user's task array
    const user = await User.findById(assignedTo);
    user.tasks.push(task);
    await user.save();

    res.json(newTask);
  } catch (error) {
    next(error);
  }
});

// Update a task (e.g., change status, description)
router.put("updateTaskStatus/:id", async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req?.params?.id,
      req?.body,
      {
        new: true,
      }
    );
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// Add comment to a task
router.post("addComment/:id/comment", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    task.comments.push({
      text: req.body.text,
      createdBy: req.user._id,
    });
    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Delete a task
router.delete("/:id", async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
