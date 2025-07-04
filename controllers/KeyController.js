import KeyModel from "../models/key.js";
import KeyLog from "../models/keyLog.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";
import mongoose from "mongoose";

//Hämta alla nycklar

export const getAllKeys = async (req, res) => {
  try {
    const keys = await KeyModel.find().populate("unit", "name");
    console.log("Alla nycklar med borrowedBy:", keys);
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

  if (!userId)
    return res.status(400).json({ message: "ID for User finns inte" });
  console.log("Borrowed USER ID: ", userId);
  if (!keyId) return res.status(400).json({ message: "ID for KEY finns inte" });
  console.log("KEY ID: ", keyId);

  try {
    const key = await KeyModel.findById(keyId);
    if (!key) {
      return res.status(400).json({ message: "Denna key finns ej" });
    }

    console.log("Hämtad key INFO", key);

    let borrower;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Denna USER finns ej" });
    }

    switch (user.userType) {
      case "chefer":
        borrower = await Chef.findById(key.borrowedBy);
        break;
      case "specialister":
        borrower = await Specialist.findById(key.borrowedBy);
        break;

      default:
        return res
          .status(400)
          .json({ message: "Ogiltig modell för låntagare" });
    }

    if (!borrower) {
      return res
        .status(400)
        .json({ message: "Kan inte hitta låntagaren i databasen" });
    }

    console.log("Hämtad borrower efter findById() metod:", borrower);
    if (borrower._id.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "Den här användare har inte lånat denna nyckel" });
    }

    console.log("Lånetagre info", borrower);
    res.status(200).json({ borrowedByUser: borrower });
  } catch (error) {
    console.error("Error vid hämtning av borrowedUser", error.message);
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av borrowedUser" });
  }
};

//Låna ut nycklar

export const checkOutKeyAndAssignToUser = async (req, res) => {
  const { userType, keyId, userId } = req.params;
  console.log("User ID före anropet i checkOutKeyAndAssignToUser()", userId);

  if (!keyId || !userId) {
    return res.status(400).json({ message: "keyId och userId krävs" });
  }

  try {
    // Hämta nyckeln
    const key = await KeyModel.findById(keyId);
    if (!key) return res.status(404).json({ message: "Nyckeln finns ej" });

    if (key.status !== "available" && key.status !== "returned") {
      return res.status(400).json({ message: "Nyckeln är inte tillgänglig" });
    }

    // Dynamisk användare beroende på userType
    let foundUser;
    switch (userType.toLowerCase()) {
      case "chefer":
        foundUser = await Chef.findById(userId);
        break;
      case "specialister":
        foundUser = await Specialist.findById(userId);
        break;
      default:
        return res.status(400).json({ message: "Ogiltig användartyp" });
    }

    // Uppdatera nyckelns status
    if (key.borrowedBy) {
      return res.status(400).json({ message: "Nyckeln är redan utlånad." });
    }
    key.status = "checked-out";
    key.borrowedAt = new Date();
    key.borrowedBy = foundUser._id;
    key.borrowedByModel =
      userType.toLowerCase() === "chefer" ? "Chef" : "Specialist";

    key.returnedAt = null;
    await key.save();

    // Lägg till nyckeln i användarens lista om den inte redan finns
    if (!foundUser.keys.includes(key._id)) {
      foundUser.keys.push(key._id);
      await foundUser.save();
    }

    // Logga händelsen
    await KeyLog.create({
      key: key._id,
      user: foundUser._id,
      action: "checkout",
    });

    return res.status(200).json({
      message: `Nyckeln har lånats ut till ${userType}`,
      foundUser,
      key,
    });
  } catch (error) {
    console.error("Fel vid utlåning och tilldelning av nyckel:", error);
    return res.status(500).json({ message: "Serverfel vid nyckelutlåning" });
  }
};

// Återlämna nycklar

export const checkInKey = async (req, res) => {
  const { userType, keyId, userId } = req.params;
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
  console.log(`Vi hittade användare-ID ${userId}`);
  console.log(`Vi hittade KEY-ID ${keyId}`);

  try {
    const foundKey = await KeyModel.findById(keyId);
    if (!foundKey) return res.status(404).json({ message: "Nyckeln finns ej" });

    let foundUser;
    switch (userType.toLowerCase()) {
      case "chefer":
        foundUser = await Chef.findById(userId);
        console.log("FoundUser inuti switch (chef)", foundUser);
        break;
      case "specialister":
        foundUser = await Specialist.findById(userId);
        console.log("FoundUser inuti switch (specialist)", foundUser);
        break;
      default:
        return res
          .status(400)
          .json({ message: `Ogiltig användartyp: ${userType}` });
    }
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

    // Uppdatera nyckelns status
    foundKey.status = "returned";
    foundKey.lastBorrowedBy = foundKey.borrowedBy;
    foundKey.borrowedBy = null;
    foundKey.borrowedAt = null;
    foundKey.returnedAt = new Date();
    await foundKey.save();

    // Logga händelsen
    await KeyLog.create({
      key: foundKey._id,
      user: foundUser._id,
      action: "checkin",
    });

    // await KeyLog.deleteMany({});

    return res.status(200).json({
      message: "Nyckeln har återlämnats",
      användare: foundUser,
      key: foundKey,
    });
  } catch (error) {
    console.error("Error vid inlämning av nyckel:", error.message);
    return res
      .status(500)
      .json({ message: "Serverfel vid inlämning av nyckel" });
  }
};

//hämta nyckel från användare (ej färdig kodat)
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
  const { keyId, userId } = req.params;
  if (!keyId) return res.status(400).json({ message: "Nyckel ID krävs" });
  if (!userId) return res.status(400).json({ message: "Användare ID krävs" });

  try {
    const foundedKey = await KeyModel.findById(keyId).populate("borrowedBy");
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

//Lägga till bara nycklar, ingen användare

export const addNewKey = async (req, res) => {
  const { keyLabel, location, unit: unitId } = req.body;
  // console.log("Inkommande data:", req.body);

  try {
    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(404).json({ messsage: "Enheten hittades inte" });
    // Om nyckel finns redan i systemet
    const existKey = await KeyModel.findOne({ keyLabel });

    if (existKey) {
      return res
        .status(400)
        .json({ message: "Nyckel med denna label finns redan" });
    }

    //skapa en ny nyckel

    if (!keyLabel || !location || !unitId) {
      return res
        .status(400)
        .json({ message: "keyLabel eller location eller unitID saknas" });
    }
    const newKey = new KeyModel({
      keyLabel,
      location,
      unit: unitId,
    });

    await newKey.save();

    unit.keys.push(newKey._id);
    await unit.save();

    const populatedKey = await KeyModel.findById(newKey._id).populate(
      "unit",
      "name"
    );
    console.log("NEW skapad Key", populatedKey);
    return res
      .status(201)
      .json({ message: "En ny nyckel har lagts", newKey: populatedKey });
  } catch (error) {
    console.error("Error vid skapande av ny nyckel", error);
    return res.status(500).json({
      message: "Server fel när användare försökt lägga till en ny nyckel",
    });
  }
};

// add key to user who has borrowed

// export const addKeyToUser = async (req, res) => {
//   // const { keyLabel, location } = req.body;
//   const { chefId, keyId } = req.params;
//   console.log("ChefID", chefId);
//   console.log("keyId", keyId);

//   try {
//     if (!chefId) {
//       return res.status(404).json({ message: "chefId ID krävs" });
//     }

//     if (!keyId) {
//       return res.status(404).json({ message: "Nyckel ID krävs" });
//     }
//     const chef = await Chef.findById(chefId);
//     console.log("chef ID", chef);
//     const key = await KeyModel.findById(keyId);
//     console.log("KEY ID", key);

//     chef.keys.push(key._id);
//     console.log("chef MED ALLA KEYS", chef.keys);
//     // await newKey.save();
//     // await chef.save();

//     console.log("Key was added to chef", chef);
//     return res.status(200).json("");
//   } catch (error) {
//     return res.status(500).json({
//       message: "Server error, när man lägga en nyckel till användare",
//     });
//   }
// };

//test kod för att lägga key till users (chef,specialist) dynamiskt

// Återanvändbar metod för att lägga till nyckel till olika användartyper
export const addKeyToUser = async (req, res) => {
  const { unitId, userId, keyId, userType } = req.params; // Lägg till userType för att identifiera användartypen
  console.log("Req.params", req.params);
  console.log("userType", userType);
  // Kontrollera om alla parametrar finns
  if (!unitId || !userId || !keyId || !userType) {
    return res
      .status(404)
      .json({ message: "Användar-ID, Nyckel-ID eller användartyp krävs" });
  }

  try {
    // Dynamiskt hitta användaren baserat på userType
    let user;
    switch (userType) {
      case "chefer":
        user = await Chef.findById(userId);
        break;
      case "specialister":
        user = await Specialist.findById(userId);
        break;

      default:
        return res.status(404).json({ message: "Ogiltig användartyp" });
    }

    if (!user) {
      return res.status(404).json({ message: "Användare inte funnen" });
    }

    const key = await KeyModel.findById(keyId);
    if (!key) {
      return res.status(404).json({ message: "Nyckel inte funnen" });
    }

    // Lägg till nyckeln i användarens lista
    user.keys.push(key._id);
    await user.save();

    return res.status(200).json({
      message: `Nyckeln har lagts till ${userType.slice(0, -1)}n`,
      user,
    });
  } catch (error) {
    console.error("Fel vid tilldelning av nyckel till användare", error);
    return res
      .status(500)
      .json({ message: "Serverfel vid tilldelning av nyckel" });
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

//get logs

export const getKeyLogs = async (req, res) => {
  const { keyId, userId } = req.body;
};
