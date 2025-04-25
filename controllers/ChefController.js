//get Alla Chefer via unit

import Chef from "../models/chef.js";
import { Unit } from "../models/unit.js";

export const addChefToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit ID", unitId);

    const { name, phone, email } = req.body;
    console.log("New Chef from body", req.body);
    const unit = await Unit.findById(unitId);
    console.log("Unit founded", unit);

    if (!unit)
      return res.status(404).json({ message: "Enheten hittades inte" });

    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Alla fält måste fyllas i" });
    }
    const chef = new Chef({
      ...req.body,
      userType: "chefer",
    });

    await chef.save();
    unit.chef = chef._id;
    console.log("Chef ID ", chef._id);
    console.log("Unit med Chef", unit);
    await unit.save();

    res.status(201).json({ message: "En Chef lagts till enhet" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      message: "Ett internt fel uppstod. Försök igen senare.",
      error: error.message,
    });
  }
};

//hämta alla chefer utan enhet

export const getAllCheferWithoutUnit = async (req, res) => {
  try {
    const chefer = await Chef.find();
    if (chefer.length === 0) {
      return res.status(404).json({ message: "Det finns ingen chef i listan" });
    }

    return res.status(200).json(chefer);
  } catch (error) {
    console.error("Serverfel vid hämtning alla chefer utan enhet");
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning alla chefer utan enhet" });
  }
};

export const getAllChefer = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit id i getAllChefer ", unitId);
    const foundedUnit = await Unit.findById(unitId).populate("chef");

    if (!foundedUnit)
      return res
        .status(400)
        .json({ message: "Denna enhet finns inte i systemet" });

    if (!foundedUnit) {
      return res.status(400).json({ message: "Denna enheten har ingen chef" });
    }

    console.log("Hämtade chef", foundedUnit);
    return res.status(200).json(foundedUnit);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateChef = async (req, res) => {
  try {
    const { unitId, chefId } = req.params;

    if (!unitId || !chefId) {
      return res.status(400).json({ message: "Unit ID eller Chef ID saknas" });
    }

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: "Enheten finns inte" });

    const updatedChef = await Chef.findByIdAndUpdate(chefId, req.body, {
      new: true,
    });

    if (!updatedChef) {
      return res.status(400).json({
        message:
          "Ingen uppdatering gjord. Chef kan redan ha den senaste informationen",
      });
    }

    return res.status(200).json({
      message: `Chef ${updatedChef.name} har uppdaterats.`,
      updatedChef,
    });
  } catch (error) {
    console.error("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// export const getChefByID = async (req, res) => {
//   try {
//     const { chefId, unitId } = req.params;

//     const unit = await Unit.findById(unitId).populate("chef");
//     if (!unit) return res.status(400).json({ message: "chef not found" });

//     const chef = unit.chef.find((t) => t._id.toString() === chefId);
//     if (!chef) return res.status(400).json({ message: "Chef not found" });
//     res.status(200).json(chef);
//   } catch (error) {
//     console.log("Error", error.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getChefByID = async (req, res) => {
  try {
    const { chefId, unitId } = req.params;

    // Hämta enheten baserat på unitId och populate chef
    const unit = await Unit.findById(unitId).populate("chef");
    if (!unit) {
      console.error("Unit not found:", unitId); // Logga om enheten inte hittas
      return res.status(400).json({ message: "Unit not found" });
    }

    const chef = unit.chef; // En chef är direkt ett objekt, inte en array
    if (!chef || chef._id.toString() !== chefId) {
      console.error("Chef not found for ID:", chefId); // Logga om chefen inte finns
      return res.status(400).json({ message: "Chef not found" });
    }

    res.status(200).json(chef); // Skicka tillbaka chefens data
  } catch (error) {
    console.error("Error in getChefByID:", error.message); // Logga serverfel
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteChef = async (req, res) => {
  const { chefId, unitId } = req.params;
  try {
    const unit = await Unit.findById(unitId).populate("chef");
    if (!unit)
      return res.status(400).json({ message: "Enheten hittades inte" });

    if (!unit.chef || unit.chef._id.toString() !== chefId) {
      return res
        .status(400)
        .json({ message: "Chef finns inte på denna enhet" });
    }

    unit.chef = null;
    await unit.save();
    await Chef.findByIdAndDelete(chefId);

    return res.status(200).json({ message: "Chefen bortagen från ", unit });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
