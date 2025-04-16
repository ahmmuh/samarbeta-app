import express, { Router } from "express";
import {
  addNewKey,
  checkInKey,
  checkOutKeyAndAssignToUser,
  getAllKeys,
} from "../controllers/KeyController.js";

const keyRoute = express.Router();

keyRoute.post("/keys/add", addNewKey);

keyRoute.get("/keys", getAllKeys);
// keyRoute.patch("/keys/checkout", checkOutKey);
keyRoute.patch("/keys/checkin", checkInKey);

keyRoute.patch(
  "/units/:unitId/:userType/:userId/keys/:keyId",
  checkOutKeyAndAssignToUser
);

export default keyRoute;
