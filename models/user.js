import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
    userType: {
      type: String,
      enum: ["chefer", "specialister"],
      required: true,
    },
  },

  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
