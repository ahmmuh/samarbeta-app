import mongoose from "mongoose";
import { userSchema } from "./user.js";

const specialSchema = new mongoose.Schema(
  {
    // name: String,
    // phone: String,
    // email: String,
    // photo?: String,
    ...userSchema.obj,
  },
  {
    timestamps: true,
  }
);

const Specialist = mongoose.model("Specialist", specialSchema);

export default Specialist;
