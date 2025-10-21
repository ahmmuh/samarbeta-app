import mongoose from "mongoose";
import { nanoid } from "nanoid";

const machineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    serialNumber: {
      type: String,
      unique: true,
      required: true,
      default: () => nanoid(10),
    },

    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true, 
    },

    isAvailable: { type: Boolean, default: true }, // true = ledig, false = utlånad
    borrowedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkPlace",
      default: null,
    },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    borrowedDate: { type: Date, default: null },
    returnedDate: { type: Date, default: null },
    qrCode: { type: String },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Machine =
  mongoose.models.Machine || mongoose.model("Machine", machineSchema);

export default Machine;
