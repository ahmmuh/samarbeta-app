import express from "express";
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitByID,
  searchUnit,
  updateUnit,
} from "../controllers/UnitController.js";
import { getToken } from "../middleware/authMiddleware.js";

const unitRouter = express.Router();

unitRouter.get("/units/search", getToken, searchUnit);
unitRouter.get("/units", getToken, getAllUnits);

unitRouter.get("/units/:unitId", getToken, getUnitByID);
unitRouter.post("/units", getToken, createUnit);
unitRouter.put("/units/:unitId", getToken, updateUnit);
unitRouter.delete("/units/:unitId", getToken, deleteUnit);

export default unitRouter;
