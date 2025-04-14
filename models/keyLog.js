import mongoose from "mongoose";

const KeyLogSchema = new mongoose.Schema(
  {
    key: { type: mongoose.Schema.Types.ObjectId, ref: "Key" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, enum: ["checkout", "checkin"], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const KeyLog = mongoose.model("KeyLog", KeyLogSchema);
export default KeyLog;
