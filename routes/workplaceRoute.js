import express from "express";
import {
  addWorkPlaceToUnit,
  getAllWorkPlaces,
  getWorkPlace,
} from "../controllers/WorkplaeController.js";

const workplaceRoute = express.Router();

workplaceRoute.get("/units", getAllWorkPlaces);
workplaceRoute.get("/units/:unitId", getWorkPlace);
workplaceRoute.put("/units/:unitId/workplaces", addWorkPlaceToUnit);
// workplaceRoute.put("/units/:unitId", updateUnit);
// workplaceRoute.delete("/units/:unitId", deleteUnit);

export default workplaceRoute;
