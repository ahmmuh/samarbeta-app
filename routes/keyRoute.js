import express, { Router } from "express";
import {
  addKey,
  checkInKey,
  checkOutKey,
  getAllkeys,
} from "../controllers/KeyController.js";

const keyRoute = express.Router();

keyRoute.get("/keys", getAllkeys);
keyRoute.patch("/keys/checkout", checkOutKey);
keyRoute.patch("/keys/checkin", checkInKey);

keyRoute.patch("/units/:unitId/users/:userId/keys/add", addKey);

export default keyRoute;
