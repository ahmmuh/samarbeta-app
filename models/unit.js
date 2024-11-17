import mongoose from "mongoose";
const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Gör fältet obligatoriskt
  },
  // image: String,
  // active: Boolean,
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
  specialister: [{ type: mongoose.Schema.Types.ObjectId, ref: "Specialist" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  workPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkPlace" }],
});
export const Unit = mongoose.model("Unit", unitSchema);
