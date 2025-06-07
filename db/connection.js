import mongoose from "mongoose";
import KeyModel from "../models/key.js";
const getConnection = async () => {
  const url =
    "mongodb+srv://ahmmuh:Quuquule1234,,@cluster0.do469pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  try {
    await mongoose.connect(url);
    console.log("Successfully connected to MongoDb Atlas");
  } catch (err) {
    console.log(`Connection Error ${err}`);
  }
};

export default getConnection;
