import mongoose from "mongoose";
import Chef from "../models/chef.js";
import Specialist from "../models/specialist.js";
import KeyModel from "../models/key.js";
const getConnection = async () => {
  const url =
    "mongodb+srv://ahmmuh:Quuquule1234,,@cluster0.do469pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  try {
    await mongoose.connect(url);
    console.log("Successfully connected to MongoDb Atlas");

    // const updatedKeys = await KeyModel.updateMany(
    //   { borrowedByModel: { $exists: true } },
    //   { lastBorrowedBy: { $exists: true } },
    //   { lastBorrowedBy: { $exists: true } }
    // );

    // const chefResult = await Chef.updateMany(
    //   { userType: { $exists: false } },
    //   { $set: { userType: "chefer" } }
    // );

    // const specialistResult = await Specialist.updateMany(
    //   { userType: { $exists: false } },
    //   { $set: { userType: "specialister" } }
    // );
    // console.log("Uppdaterade chefer:", chefResult.modifiedCount);
    // console.log("Uppdaterade specialister:", specialistResult.modifiedCount);
    // console.log("Antal nycklar uppdaterade:", updatedKeys.modifiedCount);
  } catch (err) {
    console.log(`Connection Error ${err}`);
  }
};

export default getConnection;
