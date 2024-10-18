import { Unit } from "../models/Unit.js";

export const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

export const getUnitByID = (req, res) => {
  res.status(200).json({ message: "Singel unit" });
  console.log("EN enhet");
};

export const addSpecialToUnit = async (req, res) => {
  const { unitId } = req.params;
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
