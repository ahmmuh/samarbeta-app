import express from "express";
import {
  addTask,
  assignTaskToUnit,
  deleteTask,
  getAllTasks,
  getAllTasksByUnits,
  getTaskById,
  getTaskStatuses,
  updateTask,
} from "../controllers/TaskController.js";

const taskRoute = express.Router();

//Tasks
taskRoute.get("/tasks", getAllTasks);
taskRoute.patch("/tasks/:taskId/update", updateTask);
taskRoute.delete("/tasks/:taskId", deleteTask);
taskRoute.post("/tasks/add", addTask);
taskRoute.patch("/tasks/:taskId/update", updateTask);
taskRoute.get("/tasks/:taskId", getTaskById);

//Task med unit

taskRoute.get("/units/:unitId/tasks", getAllTasksByUnits);
// taskRoute.get("/units/:unitId/tasks/:taskId", getTask);
// taskRoute.delete("/tasks/:taskId", deleteTask);
taskRoute.get("/units/:unitId/tasks/statuses", getTaskStatuses);
taskRoute.patch("/units/:unitId/tasks/:taskId/assign", assignTaskToUnit);

taskRoute.patch("/tasks/:taskId/update", updateTask);

// taskRoute.patch("/units/:unitId/tasks/add", addTaskToUnit);
export default taskRoute;
