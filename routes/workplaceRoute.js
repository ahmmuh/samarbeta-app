import express from "express";

// import { getToken } from "../middleware/authMiddleware.js";
import {
  assignUserToWorkPlace,
  createWorkPlace,
  deleteWorkplace,
  getAllWorkPlaces,
  getNearbyWorkPlaces,
  getWorkPlaceById,
  removeUserFromWorkPlace,
  updateWorkPlace,
} from "../controllers/WorkplaceController.js";

const workplaceRoute = express.Router();

workplaceRoute.post("/workplaces", createWorkPlace);
workplaceRoute.get("/workplaces/nearby", getNearbyWorkPlaces);
workplaceRoute.get("/workplaces", getAllWorkPlaces);
workplaceRoute.get("/workplaces/:workplaceId", getWorkPlaceById);

// workplaceRoute.put(
//   "/units/:unitId/workplaces/:workplaceId",
//   addWorkPlaceToUnit
// );
workplaceRoute.put("/workplaces/:workplaceId", updateWorkPlace);
workplaceRoute.delete("/workplaces/:workplaceId", deleteWorkplace);
workplaceRoute.patch("/workplaces/:workplaceId", assignUserToWorkPlace);
workplaceRoute.delete(
  "/workplaces/:workplaceId/users/:userId",
  removeUserFromWorkPlace
);

export default workplaceRoute;
