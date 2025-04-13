import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
