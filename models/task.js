import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    completed: {
      type: String,
      enum: ["Ej påbörjat", "Påbörjat", "Färdigt"],
      default: "Ej påbörjat",
    },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
  },
  {
    // timestamps: { createdAt: "skapad", updatedAt: "senast ändrad" },
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
