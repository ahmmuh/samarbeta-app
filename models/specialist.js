import mongoose from "mongoose";
import Person from "./person.js";

const specialSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
});

const Specialist = mongoose.model("Specialist", specialSchema);

export default Specialist;
