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
      refPath: "borrowedByModel",
      default: null,
    },
    lastBorrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "borrowedByModel",
    },
    lastBorrowedByModel: { type: String, enum: ["Chef", "Specialist"] },
    
    borrowedByModel: {
      type: String,
      required: function () {
        return this.borrowedBy != null; // borrowedByModel krävs om borrowedBy finns
      },
      enum: ["Chef", "Specialist"],
    },

    borrowedAt: { type: Date, default: null },
    returnedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const KeyModel =
  mongoose.models.KeyModel || mongoose.model("KeyModel", keySchema);
export default KeyModel;
