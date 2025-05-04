import express from "express";
import {
  addTask,
  addTaskToUnit,
  assignTaskToUnit,
  deleteTask,
  getAllTasks,
  getAllTasksByUnits,
  getTask,
  getTaskStatuses,
  updateTask,
} from "../controllers/TaskController.js";

const taskRoute = express.Router();

//Tasks
taskRoute.get("/units/:unitId/tasks", getAllTasksByUnits);
taskRoute.get("/tasks", getAllTasks);

taskRoute.patch("/units/:unitId/tasks/add", addTaskToUnit);
taskRoute.get("/units/:unitId/tasks/:taskId", getTask);
taskRoute.delete("/tasks/:taskId", deleteTask);
taskRoute.get("/units/:unitId/tasks/statuses", getTaskStatuses);
taskRoute.patch("/units/:unitId/tasks/:taskId/assign", assignTaskToUnit);
taskRoute.post("/tasks/add", addTask);

taskRoute.patch("/tasks/:taskId/update", updateTask);

export default taskRoute;
