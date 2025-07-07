import KeyLog from "../models/keyLog.js";

export const getAllKeyLogs = async (req, res) => {
  try {
    const logs = await KeyLog.find()
      .sort({ createdAt: -1 }) // Sortera nyaste först
      .populate("user", "name") // Endast användarnamn
      .populate({
        path: "key",
        populate: [
          { path: "borrowedBy", select: "name" },
          { path: "lastBorrowedBy", select: "name" },
          { path: "unit", select: "name" },
        ],
      });

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "Inga loggar hittades" });
    }

    console.log("Hämtade loggar:", logs.length);

    return res.status(200).json(logs);
  } catch (error) {
    console.error("Fel vid hämtning av loggar:", error);
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av nyckelloggar" });
  }
};
