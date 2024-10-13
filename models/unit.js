import mongoose, { Mongoose } from "mongoose";
import specialSchema from "./specialCleaner";
import taskSchema from "./task";
import workPlaceSchema from "./workPlace";
const unitSchema = mongoose.Schema({
  name: String,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
  specialCleaner: [specialSchema],
  workPlaces: [workPlaceSchema],
  tasks: [taskSchema],
});

export const Unit = mongoose.model("Unit", unitSchema);
