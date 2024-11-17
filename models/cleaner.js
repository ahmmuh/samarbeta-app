import mongoose from "mongoose";

const cleanerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  photo: String,
});

const Cleaner = mongoose.model("Cleaner", cleanerSchema);

export default Cleaner;
