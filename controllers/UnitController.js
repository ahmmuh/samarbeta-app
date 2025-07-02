import { geocodeAddress } from "../helperFunction/helper.js";
import Apartment from "../models/apartment.js";
import KeyModel from "../models/key.js";
import KeyLog from "../models/keyLog.js";
import Task from "../models/task.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";

//Lägg till ny ENHET
export const createUnit = async (req, res) => {
  console.log("Hela Begäran: ", req.body);
  const { name, address } = req.body;
  if (!name || !address) {
    return res.status(400).json({ message: "Namn och adress krävs." });
  }

  try {
    const [lng, lat] = await geocodeAddress(address);
    const newUnit = new Unit({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
    await newUnit.save();
    console.log("New Unit:", newUnit);
    res.status(201).json(newUnit);
  } catch (error) {
    console.error("Fel vid skapande ny enhet:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllUnits = async (req, res) => {
  console.log("Called getToken när jag använder api/units");
  console.log("Token i cookies: api/units", req.cookies.token);
  try {
    // Hämta alla enheter först
    const units = await Unit.find()
      .populate("apartments")
      .populate("keys")
      .populate("tasks")
      .populate({
        path: "users",
        select: "-password",
      });

    // Hämta alla tasks och gruppera dem efter unit

    return res.status(200).json(units);
  } catch (error) {
    console.error("Fel vid hämtning av enheter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//Lägg befintlig användare till befintlig ENHET

export const addUserToUnit = async (req, res) => {
  const { userId, unitId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Användare hittades inte" });
  }

  if (!unitId) {
    return res.status(400).json({ message: "Enheten hittades inte" });
  }

  try {
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(400).json({ message: "Enheten hittades inte" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User hittades inte" });
    }

    user.unit = unit._id;
    await user.save();
    if (unit.users.includes(user._id)) {
      return res.status(400).json({ message: "Användaren finns redan" });
    }
    unit.users.push(user._id);
    await unit.save();

    return res.status(201).json({
      message: `Användare med ID ${user._id} har lagts till enhet med ID ${unit._id}`,
    });
  } catch (error) {
    console.log("SERVER ERROR");
    return res.status(500).json({ message: "Serverfel i addUserToUnit " });
  }
};

export const getUnitByID = async (req, res) => {
  try {
    const { unitId } = req.params;
    const unit = await Unit.findById(unitId)
      .populate("tasks")
      .populate("apartments")
      .populate({
        path: "users",
        select: "-password",
      });

    if (!unit) {
      return res.status(404).json({ message: "Enheten hittades inte" });
    }

    return res.status(200).json(unit);
  } catch (error) {
    console.error("Fel vid hämtning av enhet:", error);
    res.status(500).json({ message: "Serverfel" });
  }
};

export const updateUnit = async (req, res) => {
  const { unitId } = req.params;
  console.log("Unit ID ", unitId);
  try {
    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(400).json({ message: "Enheten hittades inte!" });

    const updatedUnit = await Unit.findByIdAndUpdate(unitId, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Enhet uppdaterades", enhet: updatedUnit });
  } catch (error) {
    console.log("Error", error.message);
    res
      .status(500)
      .json({ message: "Internal Error vid uppdatering av enhet", error });
  }
};

export const deleteUnit = async (req, res) => {
  const { unitId } = req.params;
  try {
    const deletedUnit = await Unit.findByIdAndDelete(unitId);
    if (!deletedUnit) {
      return res.status(404).json({ message: "Enheten kunde inte hittas" });
    }

    res.status(200).json({ message: `Enhet med ID ${unitId} har tagits bort` });
  } catch (error) {
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};
