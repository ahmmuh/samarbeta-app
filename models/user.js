import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
