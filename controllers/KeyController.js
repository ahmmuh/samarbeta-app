import KeyModel from "../models/key.js";
import KeyLog from "../models/keyLog.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";
import mongoose from "mongoose";

//Hämta alla nycklar

export const getAllKeys = async (req, res) => {
  try {
    const keys = await KeyModel.find()
      .populate("unit", "name")
      .populate("borrowedBy");
    // console.log("Alla nycklar med borrowedBy:", keys);
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
//show user who borrows a key
export const displayBorrowedByUser = async (req, res) => {
  const { userId, keyId } = req.params;

  if (!userId) return res.status(400).json({ message: "User ID saknas" });
  if (!keyId) return res.status(400).json({ message: "Key ID saknas" });

  try {
    const key = await KeyModel.findById(keyId).populate("borrowedBy");
    if (!key) {
      return res.status(404).json({ message: "Nyckeln finns inte" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Användaren finns inte" });
    }

    if (!key.borrowedBy) {
      return res.status(400).json({ message: "Nyckeln är inte utlånad" });
    }

    if (key.borrowedBy._id.toString() !== userId) {
      return res.status(400).json({
        message: "Den här användaren har inte lånat denna nyckel",
      });
    }

    return res.status(200).json({
      borrowedByUser: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error vid hämtning av borrowedUser", error.message);
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av borrowedUser" });
  }
};

//Låna ut nycklar

export const checkOutKeyAndAssignToUser = async (req, res) => {
  const { keyId, userId } = req.params;
  console.log("User ID före anropet i checkOutKeyAndAssignToUser()", userId);

  if (!keyId || !userId) {
    return res.status(400).json({ message: "keyId  krävs eller userId" });
  }

  try {
    // Hämta nyckeln
    const key = await KeyModel.findById(keyId);
    console.log("Hittade key:", key);

    if (!key) return res.status(404).json({ message: "Nyckeln finns inte" });

    if (key.status !== "available" && key.status !== "returned") {
      console.log("Nyckel inte tillgänglig");

      return res.status(400).json({ message: "Nyckeln är inte tillgänglig" });
    }

    const user = await User.findById(userId).select("-password");
    console.log("Hittade user:", user);

    if (!user) return res.status(404).json({ message: "Användaren finns ej" });

    // Uppdatera nyckelns status
    if (key.borrowedBy) {
      console.log("Nyckeln är redan utlånad till:", key.borrowedBy);
      return res.status(400).json({ message: "Nyckeln är redan utlånad." });
    }
    key.status = "checked-out";
    key.borrowedAt = new Date();
    key.borrowedBy = user._id;

    key.returnedAt = null;
    console.log("Sparar key...");
    await key.save();
    console.log("Key sparad.");

    if (!user.unit || !user.role) {
      return res.status(500).json({
        message:
          "Användaren saknar obligatoriska fält: unit eller role. Kan inte spara.",
      });
    }

    // Lägg till nyckeln i användarens lista om den inte redan finns

    if (!user.keys.includes(key._id)) {
      console.log("Lägger till key till user.keys...");

      user.keys.push(key._id);

      await user.save();
      console.log("User sparad.");
    }

    // Logga händelsen
    await KeyLog.create({
      key: key._id,
      user: user._id,
      action: "checkout",
    });

    return res.status(200).json({
      message: `Nyckeln har lånats ut till ${user.name}`,
      borrowedByUser: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      key: {
        _id: key._id,
        keyLabel: key.keyLabel,
        unit: key.unit,
        status: key.status,
      },
    });
  } catch (error) {
    console.error("Fel vid utlåning och tilldelning av nyckel:", error);
    return res.status(500).json({ message: "Serverfel vid nyckelutlåning" });
  }
};

// Återlämna nycklar

export const checkInKey = async (req, res) => {
  const { keyId, userId } = req.params;
  if (!userId || userId === "null" || userId === "undefined") {
    return res.status(400).json({ message: "Ingen lånetagare vald" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(keyId)
  ) {
    return res
      .status(400)
      .json({ message: "Ogiltigt användar-ID ELLER Key-ID" });
  }
  // console.log(`Vi hittade användare-ID ${userId}`);
  // console.log(`Vi hittade KEY-ID ${keyId}`);

  if (!keyId) {
    return res.status(400).json({ message: "Key-ID saknas" });
  }

  if (!userId) {
    return res.status(400).json({ message: "Användar-ID saknas" });
  }
  try {
    const foundKey = await KeyModel.findById(keyId);
    if (!foundKey) return res.status(404).json({ message: "Nyckeln finns ej" });

    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }
    if (foundKey.status !== "checked-out") {
      return res
        .status(400)
        .json({ message: "Nyckeln är inte utlånad och kan inte återlämnas" });
    }

    if (!foundKey.borrowedBy || foundKey.borrowedBy.toString() !== userId) {
      return res.status(400).json({
        message: "Denna användare har inte lånat denna nyckel.",
        lånadAv: foundKey.borrowedBy ? foundKey.borrowedBy.toString() : null,
        duSkickade: userId,
      });
    }

    console.log("Användare som ska lämna in nyckel", foundUser);
    console.log("Nyckeln som ska lämnas in", foundKey);

    // Uppdatera nyckelns status
    foundKey.status = "returned";
    foundKey.lastBorrowedBy = foundKey.borrowedBy;
    foundKey.borrowedBy = null;
    foundKey.borrowedAt = null;
    foundKey.returnedAt = new Date();
    await foundKey.save();

    // // Logga händelsen
    await KeyLog.create({
      key: foundKey._id,
      user: foundUser._id,
      action: "checkin",
    });

    return res.status(200).json({
      message: `Nyckeln har återlämnats av ${foundUser.name}`,
      returnedByUser: {
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role,
      },
      key: {
        _id: foundKey._id,
        keyLabel: foundKey.keyLabel,
        unit: foundKey.unit,
        status: foundKey.status,
      },
    });
  } catch (error) {
    console.error("Error vid inlämning av nyckel:", error.message);
    return res
      .status(500)
      .json({ message: "Serverfel vid inlämning av nyckel" });
  }
};

export const getKey = async (req, res) => {
  const { keyId, userId } = req.params;
  if (!keyId) return res.status(400).json({ message: "Nyckel ID krävs" });
  if (!userId) return res.status(400).json({ message: "Användare ID krävs" });

  try {
    const foundedKey = await KeyModel.findById(keyId)
      .populate("unit", "name")
      .populate("borrowedBy");
    console.log("Founded Key details:", JSON.stringify(foundedKey, null, 2));

    if (!foundedKey) {
      return res.status(400).json({ message: "Nyckeln finns ej" });
    }

    // Kontrollera om borrowedBy är samma som userId
    if (!foundedKey.borrowedBy) {
      return res.status(400).json({ message: "Nyckeln är inte utlånad" });
    }

    if (foundedKey.borrowedBy._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "Den här användaren har inte lånat denna nyckel" });
    }
    console.log("Founded key i getKey() function", foundedKey);

    return res.status(200).json(foundedKey);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, vid hämtning av nyckel" });
  }
};

export const getKeyById = async (req, res) => {
  const { keyId } = req.params;

  if (!keyId) {
    return res.status(400).json({ message: "Nyckel ID krävs" });
  }

  try {
    const foundedKey = await KeyModel.findById(keyId)
      .populate("unit", "name")
      .populate("borrowedBy")
      .populate("lastBorrowedBy"); // Lägg till om du också vill visa tidigare användare

    if (!foundedKey) {
      return res.status(404).json({ message: "Nyckeln finns ej" });
    }

    return res.status(200).json(foundedKey);
  } catch (error) {
    console.error("Fel vid hämtning av nyckel:", error);
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av nyckel" });
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
    const deletedKey = await KeyModel.findByIdAndDelete(keyId);
    return res.status(200).json({
      message: "Nyckel med ID " + deletedKey._id + " has been deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const searchKey = async (req, res) => {
  const { keyLabel } = req.query;

  if (!keyLabel) {
    return res.status(400).json({ message: "keyLabel saknas i förfrågan" });
  }

  try {
    const keys = await KeyModel.find({
      keyLabel: { $regex: keyLabel, $options: "i" },
    })
      .populate("unit", "name")
      .populate("borrowedBy");

    if (keys.length === 0) {
      return res
        .status(404)
        .json({ message: "Ingen nyckel matchar sökningen." });
    }

    return res.status(200).json({ message: "Nycklar hittades", data: keys });
  } catch (error) {
    console.error("Fel vid sökning:", error.message);
    return res.status(500).json({ message: "Serverfel" });
  }
};
