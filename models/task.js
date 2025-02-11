import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    completed: {
      type: String,
      enum: ["Ej påbörjat", "Påbörjat", "Färdigt"],
      default: "Ej påbörjat",
    },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
  },
  {
    timestamps: { createdAt: "skapats", updatedAt: "Uppdaterats" },
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
