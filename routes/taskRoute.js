import express from "express";
import {
  addTaskToUnit,
  assignTaskToUnit,
  deleteTask,
  getAllTasks,
  getTask,
  getTaskStatuses,
  updateTask,
} from "../controllers/TaskController.js";

const taskRoute = express.Router();

//Tasks
taskRoute.get("/units/:unitId/tasks", getAllTasks);
taskRoute.patch("/units/:unitId/tasks/add", addTaskToUnit);
taskRoute.get("/units/:unitId/tasks/:taskId", getTask);
taskRoute.delete("/units/:unitId/tasks/:taskId", deleteTask);
taskRoute.get("/units/:unitId/tasks/statuses", getTaskStatuses);
taskRoute.patch("/units/:unitId/tasks/:taskId/assign", assignTaskToUnit);
taskRoute.patch("/units/:unitId/tasks/:taskId/update", updateTask);

export default taskRoute;
