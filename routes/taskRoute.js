import express from "express";
import {
  addTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/TaskController.js";
import { getToken } from "../middleware/authMiddleware.js";

const taskRoute = express.Router();

//Tasks
taskRoute.post("/tasks", getToken, addTask);
taskRoute.get("/tasks", getAllTasks);
taskRoute.patch("/tasks/:taskId", updateTask);
taskRoute.delete("/tasks/:taskId", deleteTask);
taskRoute.get("/tasks/:taskId", getTaskById);

export default taskRoute;
