import mongoose from "mongoose";

const chefSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  photo: String,
});

const Chef = mongoose.model("Chef", chefSchema);

export default Chef;
