import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    status: {
      type: String,
      enum: ["Ej påbörjat", "Påbörjat", "Färdigt"],

      default: "Ej påbörjat",
    },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },

  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
