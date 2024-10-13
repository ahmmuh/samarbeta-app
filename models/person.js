import mongoose from "mongoose";

const personSchema = mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  image: String,
});

export default personSchema
