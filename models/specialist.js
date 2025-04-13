import mongoose from "mongoose";
import { userSchema } from "./user";

const specialSchema = new mongoose.Schema(
  {
    // name: String,
    // phone: String,
    // email: String,
    // photo?: String,
    ...userSchema,
  },
  {
    timestamps: true,
  }
);

const Specialist = mongoose.model("Specialist", specialSchema);

export default Specialist;
