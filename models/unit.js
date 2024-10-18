import mongoose from "mongoose";
import specialSchema from "./special.js";
const unitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // Gör fältet obligatoriskt
  },
  // image: String,
  // active: Boolean,
  specialister: [specialSchema],
});
export const Unit = mongoose.model("Unit", unitSchema);
