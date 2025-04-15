import mongoose from "mongoose";

const getConnection = () => {
  const url =
    "mongodb+srv://ahmmuh:Quuquule1234,,@cluster0.do469pc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const db = mongoose
    .connect(url)
    .then(() => {
      console.log("Successfully connected to MongoDb Atlas");
    })
    .catch((err) => {
      console.log(`Connection Error ${err}`);
    });

  return db;
};

export default getConnection;
