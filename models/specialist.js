import mongoose from "mongoose";
import Person from "./person.js";

const specialSchema = new mongoose.Schema(
  {
    //andra fält
  },
  { discriminatorKey: "role" }
);

const Specialist = Person.discriminator("Specialist", specialSchema);

export default Specialist;
