import express, { Router } from "express";
import {
  addKeyToUser,
  addNewKey,
  checkInKey,
  checkOutKey,
  getAllKeys,
} from "../controllers/KeyController.js";

const keyRoute = express.Router();

keyRoute.post("/keys/add", addNewKey);

keyRoute.get("/keys", getAllKeys);
keyRoute.patch("/keys/checkout", checkOutKey);
keyRoute.patch("/keys/checkin", checkInKey);

keyRoute.patch("/units/:unitId/users/:userId/keys/:keyId", addKeyToUser);

export default keyRoute;
