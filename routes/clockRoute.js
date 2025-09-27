import express from "express";
import {
  clockIn,
  clockOut,
  getUserClocks,
} from "../controllers/clockController.js";

const clokcRouter = express.Router();

router.post("/clocks/in", clockIn);
router.post("/clocks/out", clockOut);
router.get("/clocks/:userId", getUserClocks);

export default clokcRouter;
