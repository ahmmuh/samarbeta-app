import KeyModel from "../models/key.js";
import KeyLog from "../models/keyLog.js";
import User from "../models/user.js";

//låna nycklar

export const checkOutKey = async (req, res) => {
  const { keyId, userId, location, label } = req.body;
  if (!keyId) return res.status(400).json({ message: "Nyckel-ID krävs" });
  if (!userId) return res.status(400).json({ message: "Användare-ID krävs" });
  try {
    const foundKey = await KeyModel.findOne({ keyId });
    if (!foundKey) {
      return res.status(404).json({ message: "Nyckeln finns ej" });
    }
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ message: "Användare finns ej" });
    }

    if (foundKey.status !== "available") {
      return res.status(400).json({ message: "Nyckeln är inte tillgänglig" });
    }

    foundKey.status = "checked-out";
    foundKey.borrowedAt = new Date();
    foundKey.borrowedBy = userId;
    await foundKey.save();

    await KeyLog.create({
      key: foundKey._id,
      user: foundUser._id,
      action: "checkout",
    });
    return res
      .status(200)
      .json({ message: "Nyckeln har lånats ut", key: foundKey });
  } catch (error) {
    console.error("Server error vid ulämning av nyckel", error);
    return res.status(500).json({ message: "Error vi utlämning av nyckel" });
  }
};

// Återlämna nycklar

export const checkInKey = async (req, res) => {
  const { keyId, userId } = req.body;
  if (!keyId) return res.status(400).json({ message: "Nyckel-ID krävs" });
  if (!userId) return res.status(400).json({ message: "Användare-ID krävs" });
  try {
    const foundKey = await KeyModel.findOne({ keyId });
    if (!foundKey) {
      return res.status(404).json({ message: "Nyckeln finns ej" });
    }
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ message: "Användare finns ej" });
    }

    if (foundKey.status !== "checked-out") {
      return res
        .status(400)
        .json({ message: "Nyckeln är inte utlånad och kan inte återlämnas" });
    }

    foundKey.status = "returned";
    foundKey.borrowedBy = null;
    foundKey.returnedAt = new Date();
    foundKey.borrowedAt = null;
    await foundKey.save();
    await KeyLog.create({
      key: foundKey._id,
      user: foundUser._id,
      action: "checkin",
    });

    return res
      .status(200)
      .json({ message: "Nyckeln har återlämnats", key: foundKey });
  } catch (error) {
    console.error("Error vi inlämning av nyckel");
    return res.status(500).json({ message: "Error vi inlämning av nyckel" });
  }
};

export const getAllkeys = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "Användare-ID krävs" });

  try {
    //hämta user först för att sedan kunna hämta keys by User ID
    const user = await User.findById(userId).populate("keys");
    if (user.keys.length === 0) {
      return res.status(400).json({ message: "Nycklarna finns inte" });
    }

    res.status(200).json(user.keys);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, vid hämtning av nycklar" });
  }
};

// inte färdig kodat

export const getKey = async (req, res) => {
  const { keyId, userId } = req.body;
  if (!keyId) return res.status(400).json({ message: "Nyckel ID krävs" });
  if (!userId) return res.status(400).json({ message: "Användare ID krävs" });

  try {
    const foundedKey = await KeyModel.findOne({ keyId });
    if (!foundedKey) {
      return res.status(400).json({ message: "Nyckeln finns ej" });
    }
    const foundedUser = await User.findById(userId);
    if (!foundedUser) {
      return res.status(400).json({ message: "Användare finns ej" });
    }

    if (!foundedUser.keys.includes(foundedKey._od)) {
      return res
        .status(400)
        .json({ message: "Användaren har inte denna nyckel" });
    }
    return res.status(200).json(foundedKey);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, vid hämtning av nyckel", key: foundKey });
  }
};

// add ny nyckel

export const addKey = async (req, res) => {
  const { userId, keyId, label, location } = req.body;
  if (!userId) return res.status(404).json({ message: "Användare ID krävs" });

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Användare hittades inte" });
    }
    const newKey = new KeyModel({ keyId, label, location });
    user.keys.push(newKey._id);
    await newKey.save();
    await user.save();

    return res.status(200).json(newKey);
  } catch (error) {
    return res.status(500).json({
      message: "Server error, vid skapandet av nyckel",
    });
  }
};

//get logs

export const getKeyLogs = async (req, res) => {
  const { keyId, userId } = req.body;
};
