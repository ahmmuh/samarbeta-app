import Specialist from "../models/specialist.js";
import Task from "../models/task.js";
import { Unit } from "../models/unit.js";

// async function clearAllData() {
//   try {
//     // Delete all documents in the collections (but not the collections themselves)
//     await Unit.deleteMany({});
//     await Specialist.deleteMany({});
//     await Task.deleteMany({});
//     await WorkPlace.deleteMany({});

//     console.log("All documents have been deleted, but collections are intact.");
//   } catch (error) {
//     console.error("Error clearing data:", error);
//   }
// }

// // Call the function to clear all data in collections
// clearAllData();

export const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find()
      .populate("tasks")
      .populate("specialister")
      .populate("chef")
      .populate("workPlaces")
      .populate("apartments");

    res.json(units);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

export const getUnitByID = async (req, res) => {
  try {
    const { unitId } = req.params;
    const unit = await Unit.findById(unitId)
      .populate("tasks")
      .populate("specialister")
      .populate("chef")
      .populate("workPlaces");

    if (!unit) {
      return res.status(404).json({ message: "Enheten hittades inte" });
    }
    res.status(200).json(unit);
  } catch (error) {
    console.error("Fel vid hämtning av enhet ", error.message);
    res.status(500).json({ message: "Serverfel" });
  }
};

export const createUnit = async (req, res) => {
  console.log("Hela Begäran: ", req.body);
  const { name } = req.body;
  try {
    const newUnit = new Unit({ name });
    await newUnit.save();
    console.log("New Unit:", newUnit);
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server Error" });
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
    res.status(500).json({ message: "Internal Error", error });
  }
};
export const deleteUnit = async (req, res) => {
  const { unitId } = req.params;
  try {
    const deletedUnit = await Unit.findByIdAndDelete(unitId, { new: true });
    res
      .status(200)
      .json({ message: "Enhet med ID " + unitId + " has been deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

//get Alla workplaces via unit
//get Alla cleaner via workplaces
//get Alla tasks via unit

// change status (task to completed: true)
