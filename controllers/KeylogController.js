import KeyLog from "../models/keyLog.js";

export const getAllKeyLogs = async (req, res) => {
  try {
    const logs = await KeyLog.find();
    if (logs.length === 0) {
      return res.status(400).json({ message: "Det finns inga loggar" });
    }
    console.log("Alla logs", logs);
    return res.status(200).json(logs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av loggar" });
  }
};
