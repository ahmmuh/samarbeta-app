import express from "express";
import cron from "node-cron";
import { autoAssignMorningTasks } from "../controllers/CronController.js";

const cronJobRoute = express.Router();

cronJobRoute.patch("/tasks/auto-assign", autoAssignMorningTasks);

cron.schedule("** * * * *", async () => {
  console.log("⏰ [CRON] Kör autoAssignMorningTasks...");
  await autoAssignMorningTasks();
});

export default cronJobRoute;
