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
taskRoute.get("/tasks", getToken, getAllTasks);
taskRoute.patch("/tasks/:taskId", getToken, updateTask);
taskRoute.delete("/tasks/:taskId", getToken, deleteTask);
taskRoute.get("/tasks/:taskId", getToken, getTaskById);

export default taskRoute;
