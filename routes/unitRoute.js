import express from "express";
import {
  addSpecialToUnit,
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitByID,
  updateUnit,
} from "../controllers/UnitController.js";

const unitRouter = express.Router();

unitRouter.get("/units", getAllUnits);
unitRouter.get("/units/:id", getUnitByID);
unitRouter.post("/units", createUnit);
unitRouter.put("/units/:id", updateUnit);
unitRouter.delete("/units/:id", deleteUnit);

//Router för specialister

unitRouter.put("/units/:unitId/specialister", addSpecialToUnit);

export default unitRouter;
