import express from "express";
import {
  clockIn,
  clockOut,
  getUserClocks,
} from "../controllers/clockController.js";

const router = express.Router();

router.post("/in", clockIn);
router.post("/out", clockOut);
router.get("/:userId", getUserClocks);

export default router;
