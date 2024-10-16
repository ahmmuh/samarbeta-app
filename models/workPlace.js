import mongoose from "mongoose";
import cleanerSchema from "./Cleaner";

const workplaceSchema = mongoose.Schema({
  name: String,
  location: String,
  cleaners: [cleanerSchema],
});

export default mongoose.model("WorkPlace", workplaceSchema);
