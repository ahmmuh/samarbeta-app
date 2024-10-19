import mongoose from "mongoose";

const personSchema = mongoose.Schema({
  name: String,
  phone: String,
  email: String,
});

const Person = mongoose.model("Person", personSchema);
export default Person;
