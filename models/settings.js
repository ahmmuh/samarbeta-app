import mongoose, { Schema } from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    lastAssignedUnitIndex: {
      type: Number,
      default: -1,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
