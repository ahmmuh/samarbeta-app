import mongoose from "mongoose";
const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Gör fältet obligatoriskt
  },
  // image: String,
  // active: Boolean,
  specialister: [{ type: mongoose.Schema.Types.ObjectId, ref: "Specialist" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});
export const Unit = mongoose.model("Unit", unitSchema);
