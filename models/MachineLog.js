import mongoose from "mongoose";

const machineLogSchema = new mongoose.Schema(
  {
    machine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
    },

    action: {
      type: String,
      enum: ["CREATED", "BORROWED", "RETURNED", "UPDATED", "DELETED"],
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // t.ex. systemhändelser som skapande kan vara null
    },

    workplace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkPlace",
      default: null, // om maskinen lånades från en viss arbetsplats
    },

    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null, // enheten som äger maskinen
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const MachineLog =
  mongoose.models.MachineLog || mongoose.model("MachineLog", machineLogSchema);

export default MachineLog;
