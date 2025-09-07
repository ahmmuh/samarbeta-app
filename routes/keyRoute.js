import express, { Router } from "express";
import {
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

keyRoute.patch("/keys/:keyId", getToken, updateKey);
keyRoute.delete("/keys/:keyId", getToken, deleteKey);

export default keyRoute;
