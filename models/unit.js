import mongoose from "mongoose";
const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: { type: String, required: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 👈 N
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    workplaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkPlace" }],
    apartments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }],
  },
  {
    timestamps: true,
  }
);
const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
