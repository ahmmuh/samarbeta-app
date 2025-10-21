import express from "express";
import {
  createMachine,
  getMachinesWithQRCode,
  getMachineById,
  updateMachine,
  deleteMachine,
  borrowMachine,
  searchMachines,
  returnMachine,
  getAllMachineLogs,
} from "../controllers/machineController.js";
import { getToken } from "../middleware/authMiddleware.js";

const machineRouter = express.Router();

// CRUD
machineRouter.post("/machines", getToken, createMachine);

machineRouter.get("/machines/search", getToken, searchMachines);
machineRouter.get("/machines/:machineId", getToken, getMachineById);
machineRouter.put("/machines/:machineId", getToken, updateMachine);
machineRouter.delete("/machines/:machineId", getToken, deleteMachine);

// Utlåning / återlämning
machineRouter.post("/machines/:machineId/borrow", getToken, borrowMachine);
machineRouter.post("/machines/:machineId/return", getToken, returnMachine);
machineRouter.get("/machines/logs", getToken, getAllMachineLogs);
machineRouter.get("/machines", getToken, getMachinesWithQRCode);

export default machineRouter;
