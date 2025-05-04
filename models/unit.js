import mongoose from "mongoose";
const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Gör fältet obligatoriskt
    },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" },
    specialister: [{ type: mongoose.Schema.Types.ObjectId, ref: "Specialist" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    workPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkPlace" }],
    apartments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }],
  },
  {
    timestamps: { createdAt: "skapats", updatedAt: "Uppdaterats" },
  }
);
const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
