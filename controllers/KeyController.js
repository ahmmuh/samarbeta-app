import Chef from "../models/chef.js";
import KeyModel from "../models/key.js";
import KeyLog from "../models/keyLog.js";
import User from "../models/user.js";

//Hämta alla nycklar

export const getAllKeys = async (req, res) => {
  try {
    const keys = await KeyModel.find();
    if (keys.length === 0) {
      return res
        .status(400)
        .json({ message: "Det finns inga nycklar att hämta" });
    }

    return res.status(200).json(keys);
  } catch (error) {
    console.error("Error vid hämtning alla nycklar utan användare");
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av alla nycklar" });
  }
};

//låna nycklar

export const checkOutKey = async (req, res) => {
  const { keyId, userId, location, label } = req.body;
  if (!keyId) return res.status(400).json({ message: "Nyckel-ID krävs" });
  if (!userId) return res.status(400).json({ message: "Användare-ID krävs" });
  try {
    const foundKey = await KeyModel.findOne({ _id: keyId });
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
    const foundKey = await KeyModel.findOne({ _id: keyId });
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

    return res.status(200).json({
      message: "Nyckeln har återlämnats",
      användare: foundUser,
      key: foundKey,
    });
  } catch (error) {
    console.error("Error vi inlämning av nyckel");
    return res.status(500).json({ message: "Error vi inlämning av nyckel" });
  }
};

export const getKeyFromUser = async (req, res) => {
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

// inte färdig kodat - hämta nycklar hos användare

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

//Lägga till bara nycklar, ingen användare

export const addNewKey = async (req, res) => {
  const { keyLabel, location } = req.body;
  // console.log("Inkommande data:", req.body);

  try {
    // Om nyckel finns redan i systemet
    const existKey = await KeyModel.findOne({ keyLabel });

    if (existKey) {
      return res
        .status(400)
        .json({ message: "Nyckel med denna label finns redan" });
    }

    //skapa en ny nyckel

    if (!keyLabel || !location) {
      return res
        .status(400)
        .json({ message: "keyLabel eller location saknas" });
    }
    const newKey = new KeyModel({ keyLabel, location });

    await newKey.save();
    console.log("NEW Key", newKey);
    return res.status(201).json({ message: "En ny nyckel har lagts", newKey });
  } catch (error) {
    console.error("Error vid skapande av ny nyckel", error);
    return res.status(500).json({
      message: "Server fel när användare försökt lägga till en ny nyckeö",
    });
  }
};

// add key to user who has borrowed

export const addKeyToUser = async (req, res) => {
  // const { keyLabel, location } = req.body;
  const { chefId, keyId } = req.params;
  console.log("ChefID", chefId);
  console.log("keyId", keyId);

  try {
    if (!chefId) {
      return res.status(404).json({ message: "chefId ID krävs" });
    }

    if (!keyId) {
      return res.status(404).json({ message: "Nyckel ID krävs" });
    }
    const chef = await Chef.findById(chefId);
    console.log("chef ID", chef);
    const key = await KeyModel.findById(keyId);
    console.log("KEY ID", key);

    chef.keys.push(key._id);
    console.log("chef MED ALLA KEYS", chef.keys);
    // await newKey.save();
    // await chef.save();

    console.log("Key was added to chef", chef);
    return res.status(200).json("");
  } catch (error) {
    return res.status(500).json({
      message: "Server error, när man lägga en nyckel till användare",
    });
  }
};

//Update key
export const updateKey = async (req, res) => {
  const { keyId } = req.params;
  console.log("keyId ", keyId);
  try {
    const foundedKy = await KeyModel.findById(keyId);
    if (!foundedKy)
      return res.status(400).json({ message: "Nyckeln hittades inte!" });

    const updatedKey = await KeyModel.findByIdAndUpdate(keyId, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "updatedKey uppdaterades", updatedKey: updatedKey });
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).json({ message: "Internal Error", error });
  }
};
export const deleteKey = async (req, res) => {
  const { keyId } = req.params;
  try {
    const deletedKey = await Unit.findByIdAndDelete(keyId, { new: true });
    res
      .status(200)
      .json({ message: "Nyckel med ID " + keyId + " has been deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

//get logs

export const getKeyLogs = async (req, res) => {
  const { keyId, userId } = req.body;
};
