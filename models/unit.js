import mongoose from "mongoose";
const unitSchema = mongoose.Schema({
  name: String,
  image: String,
});
export const Unit = mongoose.model("Unit", unitSchema);
