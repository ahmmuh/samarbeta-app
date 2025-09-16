import express, { Router } from "express";
import {
  checkInKey,
  checkOutKey,
  deleteKey,
  getAllKeys,
  getKey,
  getKeyById,
  searchKey,
  updateKey,
} from "../controllers/KeyController.js";
import { getToken } from "../middleware/authMiddleware.js";

const keyRoute = express.Router();

keyRoute.get("/keys/search", getToken, searchKey);
keyRoute.get("/keys", getToken, getAllKeys);

keyRoute.get("/keys/:keyId/:userId", getToken, getKey);
keyRoute.get("/keys/:keyId", getToken, getKeyById);

keyRoute.patch("/keys/:keyId/:userId/checkin", getToken, checkInKey);

keyRoute.patch("/keys/:keyId/:userId/checkout", getToken, checkOutKey);
keyRoute.patch("/keys/:keyId", getToken, updateKey);
keyRoute.delete("/keys/:keyId", getToken, deleteKey);

export default keyRoute;
