import mongoose from "mongoose";

const cleanerSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    photo: String,
  },
  {
    timestamps: { createdAt: "skapats", updatedAt: "Uppdaterats" },
  }
);

const Cleaner = mongoose.model("Cleaner", cleanerSchema);

export default Cleaner;
