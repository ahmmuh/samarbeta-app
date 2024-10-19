import Specialist from "../models/specialist.js";
import { Unit } from "../models/unit.js";

export const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

export const getUnitByID = async (req, res) => {
  try {
    const units = await Unit.find();
    res.status(200).json({ message: "Singel unit" });
    console.log("EN enhet");
  } catch (error) {}
};

export const addSpecialToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit ID", unitId);
    const { name, phone, email } = req.body;
    console.log("Specialister from body", req.body);
    const units = await Unit.findById(unitId);
    if (!units)
      return res.status(400).json({ message: "Enheten hittades inte" });

    const specialist = new Specialist({ name, phone, email });
    if(specialist) return res.status(400).json({Message: "Denna specialist finns redan i systemet", specialist})

    units.specialister.push(specialist._id);
    console.log("Unit med specialist", units);
    //await units.save();

    res.status(201).json({ message: "En specialist lagts till enhet" });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "External Error uppstod", error: error.message });
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

export const updateUnit = (req, res) => {
  console.log("ENhet updated");
};
export const deleteUnit = (req, res) => {
  console.log("ENhet deleted");
};

// get alla taskska via unit

//get Alla specialist via unit
//get Alla workplaces via unit
//get Alla lokalvårdare via workplaces
//get Alla tasks via unit

// change status (task to completed: true)
