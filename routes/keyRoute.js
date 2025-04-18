import express, { Router } from "express";
import { addNewKey, getAllKeys } from "../controllers/KeyController.js";

const keyRoute = express.Router();

keyRoute.post("/keys/add", addNewKey);

keyRoute.get("/keys", getAllKeys);

export default keyRoute;
