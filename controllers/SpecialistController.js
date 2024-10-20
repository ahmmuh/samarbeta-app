//get Alla specialist via unit

import Specialist from "../models/specialist.js";
import { Unit } from "../models/unit.js";

export const addSpecialistToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit ID", unitId);
    const { name, phone, email } = req.body;
    console.log("Specialister from body", req.body);
    const units = await Unit.findById(unitId);
    if (!units)
      return res.status(400).json({ message: "Enheten hittades inte" });

    const existingSpecialist = await Specialist.findOne({ email });
    if (existingSpecialist) {
      return res.status(400).json({
        Message: "Denna specialist finns redan i systemet",
        specialist: existingSpecialist,
      });
    }

    const specialist = new Specialist({ name, phone, email });
    await specialist.save();
    units.specialister.push(specialist._id);
    console.log("Specialist ID ", specialist._id);
    console.log("Unit med specialist", units);
    await units.save();

    res.status(201).json({ message: "En specialist lagts till enhet" });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "External Error uppstod", error: error.message });
  }
};

export const getAllSpecialist = async (req, res) => {
  try {
    const specialister = await Specialist.find();
    return res.status(200).json(specialister);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateSpecialist = async (req, res) => {
  try {
    const { unitId, specialistId } = req.params;
    if (!specialistId)
      return res.status(400).json({ message: "Specialist finns inte" });

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(400).json({ message: "Enheten finns inte" });

    const updatedSpecialist = await Specialist.findByIdAndUpdate(
      specialistId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedSpecialist)
      return res.status(400).json({ message: "Specialist finns inte" });
    return res.status(204).json(updatedSpecialist);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getSpecialist = async (req, res) => {
  try {
    const { specialistId, unitId } = req.params;

    const unit = await Unit.findById(unitId).populate("specialister");
    if (!unit) return res.status(400).json({ message: "Enhet noy found" });

    const specialist = unit.specialister.find(
      (t) => t._id.toString() === specialistId
    );
    if (!specialist)
      return res.status(400).json({ message: "specialist not found" });
    res.status(200).json(specialist);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSpecialist = async (req, res) => {
  const { specialistId, unitId } = req.params;
  try {
    const unit = await Unit.findById(unitId).populate("specialister");
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
