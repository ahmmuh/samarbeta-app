import { Unit } from "../models/Unit";

export const getAllUnits = (req, res) => {
  const units = new Unit.find();
  //   units
  
  console.log("Alla Enheter");
};

export const getUnitByID = (req, res) => {
  console.log("EN enhet");
};

export const createUnit = (req, res) => {
  console.log("Enhet created");
};

export const updateUnt = (req, res) => {
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
