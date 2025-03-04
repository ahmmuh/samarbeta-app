import express from "express";
import {
  addTaskToUnit,
  assignTaskToUnit,
  deleteTask,
  getAllTasks,
  getTask,
  getTaskStatuses,
  // updateTask,
} from "../controllers/TaskController.js";

const taskRoute = express.Router();

//Tasks
taskRoute.get("/units/:unitId/tasks", getAllTasks);
taskRoute.put("/units/:unitId/tasks", addTaskToUnit);
taskRoute.put("/units/:unitId/tasks/:taskId", assignTaskToUnit);
// taskRoute.put("/units/:unitId/tasks/:taskId", updateTask);
taskRoute.get("/units/:unitId/tasks/:taskId", getTask);
taskRoute.delete("/units/:unitId/tasks/:taskId", deleteTask);
taskRoute.get("/units/:unitId/tasks/statuses", getTaskStatuses);

export default taskRoute;
