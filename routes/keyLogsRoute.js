import express from "express";
import { getAllKeyLogs } from "../controllers/KeylogController.js";

const keyLogRoute = express.Router();

keyLogRoute.get("/keyLogs", getAllKeyLogs);

export default keyLogRoute;
