import express from "express";
import {
  addWorkPlaceToUnit,
  getAllWorkPlaces,
  getWorkPlace,
  updateWorkPlace,
} from "../controllers/WorkplaceController.js";

const workplaceRoute = express.Router();

workplaceRoute.get("/units/:unitId/workPlaces", getAllWorkPlaces);
workplaceRoute.get("/units/:unitId/workPlaces/:workplaceId", getWorkPlace);
workplaceRoute.put("/units/:unitId/workPlaces", addWorkPlaceToUnit);
workplaceRoute.put("/units/:unitId/workPlaces/:workplaceId", updateWorkPlace);
// workplaceRoute.delete("/units/:unitId/workplaces/workplaceId", delete); fixa lite senare

export default workplaceRoute;
