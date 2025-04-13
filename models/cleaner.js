import mongoose from "mongoose";
import { userSchema } from "./user";

const cleanerSchema = new mongoose.Schema(
  {
    // name: String,
    // phone: String,
    // email: String,
    // photo: String,
    ...userSchema,
  },
  {
    timestamps: true,
  }
);

const Cleaner = mongoose.model("Cleaner", cleanerSchema);

export default Cleaner;
