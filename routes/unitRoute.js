import express from "express";
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitByID,
  updateUnit,
} from "../controllers/UnitController.js";
import { getToken } from "../middleware/authMiddleware.js";

const unitRouter = express.Router();

unitRouter.get("/units", getAllUnits);
unitRouter.get("/units/:unitId", getUnitByID);
unitRouter.post("/units", createUnit);
unitRouter.put("/units/:unitId", updateUnit);
unitRouter.delete("/units/:unitId", deleteUnit);

export default unitRouter;
