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
} from "../controllers/machineController.js";
import { getToken } from "../middleware/authMiddleware.js";

const machineRouter = express.Router();

// CRUD
machineRouter.post("/machines", createMachine); // body: { name, unitId }
machineRouter.get("/machines", getMachinesWithQRCode);
machineRouter.get("/machines/search", searchMachines);
machineRouter.get("/machines/:machineId", getMachineById);
machineRouter.put("/machines/:machineId", updateMachine); // body: { name }
machineRouter.delete("/machines/:machineId", deleteMachine);

// Utlåning / återlämning
machineRouter.post("/machines/:machineId/borrow", getToken, borrowMachine); // body: { userId }
machineRouter.post("/machines/:machineId/return", getToken, returnMachine);

export default machineRouter;
