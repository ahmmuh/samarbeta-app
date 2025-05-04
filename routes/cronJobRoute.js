import express from "express";
import cron from "node-cron";
import { autoAssignTasks } from "../controllers/CronController.js";

const cronJobRoute = express.Router();

cronJobRoute.patch("/tasks/auto-assign", autoAssignTasks);

// cron.schedule("*/10 * * * * *", async () => {
//   console.log("⏰ [CRON] Running autoAssignTasks every 10 seconds...");
//   await autoAssignTasks();
// });

export default cronJobRoute;
