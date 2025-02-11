import mongoose from "mongoose";

const chefSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    isAtWork: Boolean,
    photo: String,
  },
  {
    timestamps: { createdAt: "skapats", updatedAt: "Uppdaterats" },
  }
);

const Chef = mongoose.model("Chef", chefSchema);

export default Chef;
