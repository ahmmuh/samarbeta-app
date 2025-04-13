import mongoose from "mongoose";
import { userSchema } from "./user.js";

const chefSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    // name: String,
    // phone: String,
    // email: String,
    // isAtWork: Boolean,
    // photo: String,
  },
  {
    timestamps: true,
  }
);

const Chef = mongoose.model("Chef", chefSchema);

export default Chef;
