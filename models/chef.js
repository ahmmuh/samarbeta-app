import mongoose from "mongoose";
import personSchema from "./person";

const chefSchema = mongoose.Schema({
  ...personSchema.obj,
  role: { type: String, default: "Chef" },
});

export const Chef = mongoose.model("Chef", chefSchema);
