import express from "express";
import getConnection from "./db/connection.js";

const app = express();
const port = (process.port = 5000);

app.get("/", (req, res) => {
  res.status(200).json({ Response: "Successfully connected to MongoDB" });
});

app.listen(() => {
  console.log(`The Server listening on port ${port}`);
  getConnection();
});
