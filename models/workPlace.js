import mongoose from "mongoose";

const workplaceSchema = mongoose.Schema({
  name: String,
  location: String,
  cleaners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cleaner" }],
});

const WorkPlace = mongoose.model("WorkPlace", workplaceSchema);

export default WorkPlace;
