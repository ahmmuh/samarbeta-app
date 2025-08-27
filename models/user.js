import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: Number, required: true, unique: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  role: {
    type: [String],
    enum: [
      "Avdelningschef ",
      "Områdeschef",
      "Enhetschef",
      "Flyttstädansvarig",
      "Specialare",
      "Lokalvårdare",
    ],
    default: [],
  },

  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
  },

  keys: [{ type: mongoose.Schema.Types.ObjectId, ref: "KeyModel" }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
