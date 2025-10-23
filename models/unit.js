import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: { type: String, required: true },

    // GeoJSON location för enheten
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

    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    apartments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }],
    keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
    workPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkPlace" }],
  },
  {
    timestamps: true,
  }
);

// 📍 Skapa 2dsphere-index för geospatial sökning
unitSchema.index({ location: "2dsphere" });

const Unit = mongoose.model("Unit", unitSchema);
export default Unit;
