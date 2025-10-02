import express from "express";
import {
  createMachine,
  getMachinesWithQRCode,
  getMachineById,
  updateMachine,
  deleteMachine,
  borrowMachine,
  returnMachine,
  searchMachines,
} from "../controllers/machineController.js";

const machineRouter = express.Router();

// CRUD
machineRouter.post("/machines", createMachine); // body: { name, unitId }
machineRouter.get("/machines", getMachinesWithQRCode);
machineRouter.get("/machines/search", searchMachines);
machineRouter.get("/machines/:machineId", getMachineById);
machineRouter.put("/machines/:machineId", updateMachine); // body: { name }
machineRouter.delete("/machines/:machineId", deleteMachine);

// Utlåning / återlämning
machineRouter.post("/machines/:machineId/borrow", borrowMachine); // body: { userId }
machineRouter.post("/machines/:machineId/return", returnMachine);

export default machineRouter;
