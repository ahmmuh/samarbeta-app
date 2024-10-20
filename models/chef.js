import mongoose from "mongoose";

const chefSchema = mongoose.Schema({
  name: String,
  phone: String,
  email: String,
});

const Chef = mongoose.model("Chef", chefSchema);

export default Chef;
