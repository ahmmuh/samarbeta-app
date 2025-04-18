import Chef from "../models/chef.js";
import KeyModel from "../models/key.js";
import KeyLog from "../models/keyLog.js";
import User from "../models/user.js";
import Specialist from "../models/specialist.js";
import mongoose from "mongoose";

//Hämta alla nycklar

export const getAllKeys = async (req, res) => {
  try {
    // console.log("Alla modells", mongoose.models);
    const keys = await KeyModel.find().populate("borrowedBy");
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

    // if (
    //   typeof borrower === "string" ||
    //   borrower instanceof mongoose.Types.ObjectId
    // ) {
    //   borrower = await User.findById(borrower);
    //   console.log("Hämtad borrower från User.findById:", borrower);
    // }

    if (key.borrowedByModel === "Chef") {
      borrower = await Chef.findById(key.borrowedBy);
    } else if (key.borrowedByModel === "Specialist") {
      borrower = await Specialist.findById(key.borrowedBy);
    } else {
      return res.status(400).json({ message: "Ogiltig modell för låntagare" });
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
export const checkOutKeyAndAssignToUser = async (req, res) => {
  const { keyId, userId, userType } = req.params;

  if (!keyId || !userId || !userType) {
    return res
      .status(400)
      .json({ message: "keyId, userId och userType krävs" });
  }

  try {
    // Hämta nyckeln
    const key = await KeyModel.findById(keyId);
    if (!key) return res.status(404).json({ message: "Nyckeln finns ej" });

    if (key.status !== "available") {
      return res.status(400).json({ message: "Nyckeln är inte tillgänglig" });
    }

    // Dynamisk användare beroende på typ
    let user;
    switch (userType) {
      case "chefer":
        user = await Chef.findById(userId);
        break;
      case "specialister":
        user = await Specialist.findById(userId);
        break;
      default:
        return res.status(400).json({ message: "Ogiltig användartyp" });
    }

    if (!user) {
      return res.status(404).json({ message: "Användare finns ej" });
    }

    // Uppdatera nyckelns status
    key.status = "checked-out";
    const modelType =
      userType.toLowerCase() === "chefer" ? "Chef" : "Specialist";
    key.borrowedByModel = modelType;
    key.borrowedAt = new Date();
    key.borrowedBy = user._id;
    await key.save();
    console.log("Key som ska lånas ut, innan den sparas i databasen", key);

    // Lägg till nyckeln i användarens lista om den inte redan finns
    if (!user.keys.includes(key._id)) {
      user.keys.push(key._id);
      await user.save();
    }
    console.log("Användare som ska låna nyckeln", user);

    // Logga händelsen
    await KeyLog.create({
      key: key._id,
      user: user._id,
      action: "checkout",
    });

    return res.status(200).json({
      message: `Nyckeln har lånats ut till ${userType.slice(0, -1)}`,
      user,
      key,
    });
  } catch (error) {
    console.error("Fel vid utlåning och tilldelning av nyckel:", error);
    return res.status(500).json({ message: "Serverfel vid nyckelutlåning" });
  }
};

// Återlämna nycklar

export const checkInKey = async (req, res) => {
  const { keyId, userId, userType } = req.params;

  if (!keyId || !userId || !userType) {
    return res
      .status(400)
      .json({ message: "Det krävs keyId, userId och userType" });
  }

  try {
    const foundKey = await KeyModel.findById(keyId);
    if (!foundKey) {
      return res.status(404).json({ message: "Nyckeln finns ej" });
    }

    let foundUser;
    const type = userType.toLowerCase();

    switch (type) {
      case "chefer":
        foundUser = await Chef.findById(userId);
        break;
      case "specialister":
        foundUser = await Specialist.findById(userId);
        break;
      default:
        return res
          .status(400)
          .json({ message: `Ogiltig användartyp: ${userType}` });
    }

    if (!foundUser) {
      return res.status(404).json({ message: "Användare finns ej" });
    }

    if (foundKey.status !== "checked-out") {
      return res
        .status(400)
        .json({ message: "Nyckeln är inte utlånad och kan inte återlämnas" });
    }

    // Kontrollera att det faktiskt är rätt användare som lämnar tillbaka
    if (!foundKey.borrowedBy || foundKey.borrowedBy.toString() !== userId) {
      return res
        .status(400)
        .json({ message: "Denna användare har inte lånat denna nyckel" });
    }

    // Uppdatera nyckelns status
    foundKey.status = "returned";
    foundKey.borrowedBy = null;
    foundKey.borrowedByModel = null;
    foundKey.borrowedAt = null;
    foundKey.returnedAt = new Date();
    await foundKey.save();

    // Logga händelsen
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
  const { keyId, userId, userType } = req.params;
  if (!keyId) return res.status(400).json({ message: "Nyckel ID krävs" });
  // if (!userId) return res.status(400).json({ message: "Användare ID krävs" });
  console.log(`Key ID: ${keyId}`);

  try {
    const foundedKey = await KeyModel.findById(keyId);
    if (!foundedKey) {
      return res.status(400).json({ message: "Nyckeln finns ej" });
    }

    // let foundUser;
    // const type = userType.toLowerCase();

    // switch (type) {
    //   case "chefer":
    //     foundUser = await Chef.findById(userId);
    //     break;
    //   case "specialister":
    //     foundUser = await Specialist.findById(userId);
    //     break;
    //   default:
    //     return res
    //       .status(400)
    //       .json({ message: `Ogiltig användartyp: ${userType}` });
    // }

    // console.log(
    //   "Founded User i getKey() function innan if statement and after swtich ",
    //   foundUser
    // );

    // if (!foundUser) {
    //   return res.status(404).json({ message: "Användare finns ej" });
    // }

    // if (!foundUser.keys.includes(foundedKey._id)) {
    //   return res
    //     .status(400)
    //     .json({ message: "Användaren har inte denna nyckel" });
    // }

    // console.log("Founded User i getKey() function ", foundUser);
    console.log("Founded key i getKey() function", foundedKey);
    return res.status(200).json(foundedKey);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error, vid hämtning av nyckel" });
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
    const newKey = new KeyModel();
    if (newKey.borrowedByModel === "Chef") {
      // newKey = await
    }

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
    const deletedKey = await KeyModel.findByIdAndDelete(keyId, { new: true });
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
