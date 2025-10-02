import express from "express";
import {
  clockIn,
  clockOut,
  getUserClocks,
} from "../controllers/ClockController.js";

const clokcRoute = express.Router();

clokcRoute.post("/clocks/in", clockIn);
clokcRoute.post("/clocks/out", clockOut);
clokcRoute.get("/clocks/user/:lastFour", getUserClocks);

export default clokcRoute;
