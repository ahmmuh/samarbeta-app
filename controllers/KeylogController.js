import { populate } from "dotenv";
import KeyLog from "../models/keyLog.js";
import { model } from "mongoose";

export const getAllKeyLogs = async (req, res) => {
  try {
    const logs = await KeyLog.find()
      .populate({
        path: "key",
        populate: {
          path: "borrowedBy",
        },
      })
      .populate("user");
    if (logs.length === 0) {
      return res.status(400).json({ message: "Det finns inga loggar" });
    }
    console.log("Alla logs", logs);
    return res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av loggar" });
  }
};
