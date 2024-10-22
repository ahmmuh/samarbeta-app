import express from "express";
import {
  addTaskToUnit,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/TaskController";

const taskRoute = express.Router();

//Tasks
taskRoute.get("/units/:unitId/tasks", getAllTasks);
taskRoute.put("/units/:unitId/tasks", addTaskToUnit);
taskRoute.put("/units/:unitId/tasks/:taskId", updateTask);
taskRoute.get("/units/:unitId/tasks/:taskId", getTask);
taskRoute.delete("/units/:unitId/tasks/:taskId", deleteTask);

export default taskRoute;
