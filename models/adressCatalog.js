import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitud, latitud]
        required: true,
      },
    },
  },
  { timestamps: true }
);

addressSchema.index({ location: "2dsphere" });

const Adress = mongoose.model("Address", addressSchema);

export default Adress;
