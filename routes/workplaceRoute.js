import express from "express";

// import { getToken } from "../middleware/authMiddleware.js";
import {
  addWorkPlaceToUnit,
  createWorkPlace,
  deleteWorkplace,
  getAllWorkPlaces,
  getNearbyWorkPlaces,
  getWorkPlaceById,
  updateWorkPlace,
} from "../controllers/WorkplaceController.js";

const workplaceRoute = express.Router();

workplaceRoute.post("/workplaces", createWorkPlace);
workplaceRoute.get("/workplaces/nearby", getNearbyWorkPlaces);
workplaceRoute.get("/workplaces", getAllWorkPlaces);
workplaceRoute.get("/workplaces/:workplaceId", getWorkPlaceById);

workplaceRoute.put(
  "/units/:unitId/workplaces/:workplaceId",
  addWorkPlaceToUnit
);
workplaceRoute.put("/workplaces/:workplaceId", updateWorkPlace);
workplaceRoute.delete("/workplaces/:workplaceId", deleteWorkplace);

export default workplaceRoute;
