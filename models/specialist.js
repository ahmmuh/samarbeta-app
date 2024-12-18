import mongoose from "mongoose";

const specialSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  photo: String,
});

const Specialist = mongoose.model("Specialist", specialSchema);

export default Specialist;
