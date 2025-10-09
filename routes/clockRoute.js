import express from "express";
import {
  clockIn,
  clockOut,
  getAllUserClocks,
  getUserClocks,
} from "../controllers/ClockController.js";

const clokcRoute = express.Router();

clokcRoute.post("/clocks/in", clockIn);
clokcRoute.post("/clocks/out", clockOut);
clokcRoute.get("/clocks/user/:lastFour", getUserClocks);
clokcRoute.get("/clocks/users", getAllUserClocks);

export default clokcRoute;
