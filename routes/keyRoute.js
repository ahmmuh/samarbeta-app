import express, { Router } from "express";
import {
  addNewKey,
  deleteKey,
  getAllKeys,
  getKey,
  getKeyById,
  updateKey,
} from "../controllers/KeyController.js";
import { getToken } from "../middleware/authMiddleware.js";

const keyRoute = express.Router();

keyRoute.post("/keys/add", addNewKey);

keyRoute.get("/keys", getAllKeys);
keyRoute.get("/keys/:keyId/:userId", getKey);
keyRoute.get("/keys/:keyId", getKeyById);

keyRoute.patch("/keys/:keyId", updateKey);
keyRoute.delete("/keys/:keyId", deleteKey);

export default keyRoute;
