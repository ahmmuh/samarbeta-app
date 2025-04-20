import express from "express";
import { getAllKeyLogs } from "../controllers/KeylogController.js";

const keyLogRoute = express.Router();

keyLogRoute.get("/logs", getAllKeyLogs);

export default keyLogRoute;
