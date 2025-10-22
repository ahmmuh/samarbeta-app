import express from "express";
import {
  clockIn,
  clockOut,
  getAllUserClocks,
  getUserClocks,
} from "../controllers/ClockController.js";
import { getToken } from "../middleware/authMiddleware.js";

const clokcRoute = express.Router();

clokcRoute.post("/clocks/in", getToken, clockIn);
clokcRoute.post("/clocks/out", getToken, clockOut);
clokcRoute.get("/clocks/user/:lastFour", getToken, getUserClocks);
clokcRoute.get("/clocks/users", getToken, getAllUserClocks);

export default clokcRoute;
