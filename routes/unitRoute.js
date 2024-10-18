import express from "express";
import {
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

export default unitRouter;
