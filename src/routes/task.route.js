import express from "express";
import { Task } from "../models/task.js";
import { User } from "../models/user.js";
import pkg from "rest-api-errors";
import { authMiddleware } from "../middleware/checkAuth.js";
const { APIError } = pkg;
import { TaskDaily } from "../models/tastDailyUpdate.js";
const router = express();

// Get all tasks
router.get("/getAllTasks", async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate({
        path: "assignedTo",
        select: "_id name",
      })
      .populate({
        path: "createdBy",
        select: "_id name",
      })
      .populate({
        path: "collaborators",
        select: "_id name",
      })

      .populate({
        path: "comments.createdBy",
        select: "_id name",
      })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// Create a new task
router.post("/create", authMiddleware, async (req, res, next) => {
  try {
    const {
      title,
      description,
      collaborators,
      assignedTo,
      dueDate,
      priority,
      status,
    } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      status,
      collaborators,
      // comments,
      createdBy: req?.user?._id,
      // createdBy: req?.body?.createdBy,
    });

    for (const element of collaborators) {
      /**
       * Optionally, add the task to each collaborator's task list
       * */
      if (collaborators && collaborators.length > 0) {
        await User.updateMany(
          { _id: { $in: element?._id } },
          { $push: { tasks: task._id } }
        );
      }
    }

    await task.save();

    // Add task to the assigned user's task array
    const user = await User.findById(assignedTo);
    user.tasks.push(task);
    await user.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/updateTask/:id", authMiddleware, async (req, res, next) => {
  try {
    const {
      status,
      comments,
      title,
      dueDate,
      priority,
      description,
      assignedTo,
      collaborators,
    } = req.body;

    const task = await Task.findById(req?.params?.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title) task.title = title;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;

    if (collaborators) {
      const collaboratorIds = [
        ...new Set(collaborators.map((collab) => collab?._id)),
      ];

      /**
       * Filter out collaborators that are not in the provided `collaborators` array
       * */
      task.collaborators = task.collaborators.filter((existingCollaborator) =>
        collaboratorIds.includes(existingCollaborator.toString())
      );

      /**
       * Add new collaborators (those not already in the task)
       * */
      const newCollaborators = collaboratorIds.filter(
        (collabId) => !task?.collaborators.includes(collabId)
      );

      task.collaborators.push(...newCollaborators);
    }

    if (comments)
      task.comments.push({
        text: comments,
        createdBy: req.user.id,
      });

    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Update a task (e.g., change status, description)
router.put("/updateTaskStatus_old/:id", async (req, res, next) => {
  try {
    // passs a task id
    const updatedTask = await Task.findByIdAndUpdate(
      req?.params?.id,
      req?.body,
      {
        new: true,
      }
    );
    console.log("updatedTask: ", updatedTask);

    res.json({ success: true, message: "Update task successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/createTaskDailyUpdate", async (req, res, next) => {
  try {
    const { ticketNo, about, date, description, tags } = req.body;

    const newTicket = new TaskDaily({
      ticketNo,
      about,
      date: date || new Date(),
      description,
      tags,
    });

    await newTicket.save();
    res.json({ success: true, message: "Created report successfully" });
  } catch (err) {
    next(err);
  }
});

router.get("/getAllDailyTaskUpdate", async (req, res, next) => {
  try {
    res.json({
      success: true,
    tasks: await TaskDaily.find()
        .populate({
          path: "tags",
          select: "_id name",
        })
        .sort({ createdAt: -1 }),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
