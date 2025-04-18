import express, { Router } from "express";
import {
  addNewKey,
  deleteKey,
  getAllKeys,
  getKey,
  updateKey,
} from "../controllers/KeyController.js";

const keyRoute = express.Router();

keyRoute.post("/keys/add", addNewKey);

keyRoute.get("/keys", getAllKeys);
keyRoute.get("/keys/:keyId", getKey);

keyRoute.patch("/keys/:keyId", updateKey);
keyRoute.delete("/keys/:keyId", deleteKey);

export default keyRoute;
