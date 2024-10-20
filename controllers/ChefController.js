//get Alla Chefer via unit

import Chef from "../models/chef.js";
import { Unit } from "../models/unit.js";

export const addChefToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit ID", unitId);
    const { name, phone, email } = req.body;
    console.log("Chef from body", req.body);
    const units = await Unit.findById(unitId);
    if (!units)
      return res.status(400).json({ message: "Enheten hittades inte" });

    const existingChef = await Chef.findOne({ name });
    if (existingChef) {
      return res.status(400).json({
        Message: "Denna chef finns redan i systemet",
        chef: existingChef,
      });
    }

    const chef = new Chef({ name, phone, email });
    await chef.save();
    units.chefer = chef._id;
    console.log("CHef ID ", chef._id);
    console.log("Unit med Chef", units);
    await units.save();

    res.status(201).json({ message: "En Chef lagts till enhet" });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "External Error uppstod", error: error.message });
  }
};

export const getAllChefer = async (req, res) => {
  try {
    const chefer = await Chef.find();
    return res.status(200).json(chefer);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateChef = async (req, res) => {
  try {
    const { unitId, chefId } = req.params;
    if (!chefId) return res.status(400).json({ message: "chef finns inte" });

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(400).json({ message: "Enheten finns inte" });

    const updatedChef = await Chef.findByIdAndUpdate(chefId, req.body, {
      new: true,
    });
    if (!updatedChef)
      return res.status(400).json({ message: "Chef finns inte" });
    return res.status(204).json(updatedChef);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getChefByID = async (req, res) => {
  try {
    const { chefId, unitId } = req.params;

    const unit = await Unit.findById(unitId).populate("chefer");
    if (!unit) return res.status(400).json({ message: "chef not found" });

    const chef = unit.chefer.find((t) => t._id.toString() === chefId);
    if (!chef) return res.status(400).json({ message: "Chef not found" });
    res.status(200).json(chef);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteChef = async (req, res) => {
  const { chefId, unitId } = req.params;
  try {
    const unit = await Unit.findById(unitId).populate("chefer");
    if (!unit) return res.status(400).json({ message: "Chef hittades inte" });

    const updatedChefer = unit.chefer.filter(
      (t) => t._id.toString() !== chefId
    );
    unit.chefer = updatedChefer;
    await unit.save();
    return res
      .status(200)
      .json({ message: "Deleted chef", Chef: updatedChefer });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
