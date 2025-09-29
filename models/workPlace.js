import mongoose from "mongoose";

const workplaceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // tex "ICA Maxi", "Kontor A"
  address: { type: String, required: true },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },

  cleaners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

workplaceSchema.index({ location: "2dsphere" });

const WorkPlace =
  mongoose.models.WorkPlace || mongoose.model("WorkPlace", workplaceSchema);

export default WorkPlace;
