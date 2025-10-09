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
import { getToken } from "../middleware/authMiddleware.js";

const workplaceRoute = express.Router();

workplaceRoute.post("/workplaces", getToken, createWorkPlace);
workplaceRoute.get("/workplaces/nearby", getToken, getNearbyWorkPlaces);
workplaceRoute.get("/workplaces", getToken, getAllWorkPlaces);
workplaceRoute.get("/workplaces/:workplaceId", getToken, getWorkPlaceById);

// workplaceRoute.put(
//   "/units/:unitId/workplaces/:workplaceId",
//   addWorkPlaceToUnit
// );
workplaceRoute.put("/workplaces/:workplaceId", getToken, updateWorkPlace);
workplaceRoute.delete("/workplaces/:workplaceId", getToken, deleteWorkplace);
workplaceRoute.patch(
  "/workplaces/:workplaceId",
  getToken,
  assignUserToWorkPlace
);
workplaceRoute.delete(
  "/workplaces/:workplaceId/users/:userId",
  getToken,
  removeUserFromWorkPlace
);

export default workplaceRoute;
