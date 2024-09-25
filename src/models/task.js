import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String },

  status: {
    type: String,
    enum: ["open", "pending", "in-progress", "completed"],
    default: "pending",
  },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  dueDate: { type: Date },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  comments: [
    {
      text: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
