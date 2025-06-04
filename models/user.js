import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
    },

    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
    // userType: {
    //   type: String,
    //   enum: ["chefer", "specialister"],
    //   required: true,
    // },
  },

  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
