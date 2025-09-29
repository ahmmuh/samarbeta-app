import express from "express";

// import { getToken } from "../middleware/authMiddleware.js";
import {
  addWorkPlaceToUnit,
  createWorkPlace,
  deleteWorkplace,
  getNearbyWorkPlaces,
  getWorkPlaceById,
  updateWorkPlace,
} from "../controllers/WorkplaceController.js";

const workplaceRoute = express.Router();

workplaceRoute.post("/workplaces", createWorkPlace);
workplaceRoute.get("/workplaces", getNearbyWorkPlaces);
workplaceRoute.get("/workplaces/:workplaceId", getWorkPlaceById);

workplaceRoute.put("/workplaces", addWorkPlaceToUnit);
workplaceRoute.put("/workplaces/:workplaceId", updateWorkPlace);
workplaceRoute.delete("/workplaces/workplaceId", deleteWorkplace);

export default workplaceRoute;
