import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  // completed: { type: Boolean, default: "Pending" },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
