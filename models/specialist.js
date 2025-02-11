import mongoose from "mongoose";

const specialSchema = new mongoose.Schema(
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

const Specialist = mongoose.model("Specialist", specialSchema);

export default Specialist;
