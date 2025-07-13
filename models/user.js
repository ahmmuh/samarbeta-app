import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, unique: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["Chef", "Specialist"],
    required: true,
  },

  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
  },

  keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
