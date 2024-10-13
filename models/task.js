import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  title: String,
  description: String,
  completed: { type: Boolean, default: "Pending" },
});

export default mongoose.model("Task", taskSchema);
