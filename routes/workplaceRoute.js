import express from "express";
import {
  addWorkPlaceToUnit,
  getAllWorkPlaces,
  getWorkPlace,
  updateWorkPlace,
} from "../controllers/WorkplaceController.js";
import { getToken } from "../middleware/authMiddleware.js";

const workplaceRoute = express.Router();

workplaceRoute.get("/units/:unitId/workplaces", getAllWorkPlaces);
workplaceRoute.get("/units/:unitId/workplaces/:workplaceId", getWorkPlace);
workplaceRoute.put("/units/:unitId/workplaces", addWorkPlaceToUnit);
workplaceRoute.put("/units/:unitId/workplaces/:workplaceId", updateWorkPlace);
// workplaceRoute.delete("/units/:unitId/workplaces/workplaceId", delete); fixa lite senare

export default workplaceRoute;
