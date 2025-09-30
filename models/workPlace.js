import mongoose from "mongoose";

const workplaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // t.ex. "ICA Maxi", "Kontor A"
    address: { type: String, required: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    cleaners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true, // Lägg till createdAt och updatedAt automatiskt
  }
);

// Skapa 2dsphere index för geospatiala queries ($near, $geoWithin)
workplaceSchema.index({ location: "2dsphere" });

const WorkPlace =
  mongoose.models.WorkPlace || mongoose.model("WorkPlace", workplaceSchema);

export default WorkPlace;
