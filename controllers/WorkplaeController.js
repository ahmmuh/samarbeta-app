//get Alla specialist via unit

import Specialist from "../models/specialist.js";
import { Unit } from "../models/unit.js";
import WorkPlace from "../models/workPlace.js";

export const addWorkPlaceToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit ID", unitId);
    const { name, location } = req.body;
    console.log("workplaces from body", req.body);
    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(400).json({ message: "Enheten hittades inte" });

    const workPlace = await WorkPlace.findOne({ name });
    if (workPlace) {
      return res.status(400).json({
        Message: "Denna WorkPlace finns redan i systemet",
        WorkPlace: workPlace,
      });
    }

    const newWorkplace = new WorkPlace({ name, location });
    await newWorkplace.save();
    unit.workPlaces.push(newWorkplace._id);
    console.log("Specialist ID ", newWorkplace._id);
    console.log("Unit med workplace", unit);
    await unit.save();

    res.status(201).json({ message: "En workplace lagts till enhet" });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "External Error uppstod", error: error.message });
  }
};

export const getAllWorkPlaces = async (req, res) => {
  try {
    const workPlaces = await Unit.find().populate("workPlaces");
    return res.status(200).json(workPlaces);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateWorkPlace = async (req, res) => {
  try {
    const { unitId, workplaceId } = req.params;

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(400).json({ message: "Enheten finns inte" });

    const updatedWorkplace = await workPlace.findByIdAndUpdate(
      workplaceId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedWorkplace)
      return res.status(400).json({ message: "updatedWorkplace finns inte" });
    return res.status(204).json(updatedWorkplace);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getWorkPlace = async (req, res) => {
  try {
    const { workplaceId, unitId } = req.params;

    const unit = await Unit.findById(unitId).populate("workplaces");
    if (!unit) return res.status(400).json({ message: "Enhet noy found" });

    const workplace = unit.workPlaces.find(
      (t) => t._id.toString() === workplaceId
    );
    if (!workplace)
      return res.status(400).json({ message: "specialist not found" });
    res.status(200).json(workplace);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//fixa sen

export const deleteSpecialist = async (req, res) => {
  const { workplaceId, unitId } = req.params;
  try {
    const unit = await Unit.findById(unitId).populate("workplaces");
    if (!unit) return res.status(400).json({ message: "Enhet hittades inte" });

    const updatedSpecialister = unit.specialister.filter(
      (t) => t._id.toString() !== specialistId
    );
    unit.specialister = updatedSpecialister;
    await unit.save();
    return res
      .status(200)
      .json({ message: "Deleted specialist", specialist: updatedSpecialister });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
