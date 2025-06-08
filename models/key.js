import mongoose from "mongoose";

const keySchema = new mongoose.Schema(
  {
    keyLabel: { type: String, unique: true, required: true },
    location: String,
    qrCode: String, // base64 QR-kod
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
    status: {
      type: String,
      enum: ["available", "checked-out", "returned"],
      default: "available",
    },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "borrowedByModel", // 🔥 Dynamisk ref här
      default: null,
    },
    borrowedByModel: {
      type: String,
      enum: ["Chef", "Specialist"], // 🔥 Vilken modell borrowedBy ska hämta från
      required: false,
    },
    lastBorrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Om du vill spara sista användaren som lånade
      default: null,
    },

    borrowedAt: { type: Date, default: null },
    returnedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const KeyModel =
  mongoose.models.KeyModel || mongoose.model("KeyModel", keySchema);
export default KeyModel;
