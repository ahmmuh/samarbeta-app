import mongoose from "mongoose";

const keySchema = new mongoose.Schema(
  {
    keyLabel: { type: String, unique: true, required: true },
    location: String, // var den normalt förvaras

    status: {
      type: String,
      enum: ["available", "checked-out", "returned"],
      default: "available",
    },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    borrowedAt: { type: Date, default: null },
    returnedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const KeyModel = mongoose.model("KeyModel", keySchema);
export default KeyModel;
