import express from "express";
import cron from "node-cron";
import { autoAssignTasks } from "../controllers/CronController.js";

const cronJobRoute = express.Router();

cronJobRoute.patch("/tasks/auto-assign", autoAssignTasks);

// Kör varje minut
cron.schedule("* * * * *", async () => {
  console.log("🕐 Kör autoAssignTasks...");
  await autoAssignTasks(); // req och res är null, vilket du hanterar i funktionen
});
export default cronJobRoute;
