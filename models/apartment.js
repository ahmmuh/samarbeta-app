import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema(
  {
    apartmentLocation: String,
    description: String,
    keyLocation: String, // Där man hämtar nyckel till lägenheten
    status: {
      type: String,
      enum: ["Ej påbörjat", "Påbörjat", "Färdigt"],
      default: "Ej påbörjat",
    },

    priority: {
      type: String,
      enum: ["Låg", "Normal", "Hög"],
      default: "Normal",
    },
    startDate: { type: Date, default: null }, // Planerad start
    endDate: { type: Date, default: null }, // Planerat slut
    completedAt: { type: Date, default: null }, // Verkligt slut

    assignedUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },
    assignedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

export default Apartment;
