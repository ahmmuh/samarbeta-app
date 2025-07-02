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

keyRoute.post("/keys/add", getToken, addNewKey);

keyRoute.get("/keys", getToken, getAllKeys);
keyRoute.get("/keys/:keyId/:userId", getToken, getKey);
keyRoute.get("/keys/:keyId", getToken, getKeyById);

keyRoute.patch("/keys/:keyId", getToken, updateKey);
keyRoute.delete("/keys/:keyId", getToken, deleteKey);

export default keyRoute;
