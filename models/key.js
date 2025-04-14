import mongoose from "mongoose";

const keySchema = new mongoose.Schema(
  {
    keyId: { type: String, unique: true, required: true },

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

    label: String, // valfri visuell etikett
    location: String, // var den normalt förvaras
  },
  { timestamps: true }
);

const KeyModel = mongoose.model("KeyModel", keySchema);
export default KeyModel;
