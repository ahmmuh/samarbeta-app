import express from "express";
import { getAllKeyLogs } from "../controllers/KeylogController.js";
import { getToken } from "../middleware/authMiddleware.js";

const keyLogRoute = express.Router();

keyLogRoute.get("/logs", getToken, getAllKeyLogs);

export default keyLogRoute;
