import express from "express";
import {
  addSpecialistToUnit,
  addTaskToUnit,
  createUnit,
  deleteUnit,
  getAllSpecialist,
  getAllUnits,
  getSpecialist,
  getTask,
  getTasks,
  getUnitByID,
  updateSpecialist,
  updateTask,
  updateUnit,
} from "../controllers/UnitController.js";

const unitRouter = express.Router();


//enheter

unitRouter.get("/units", getAllUnits);
unitRouter.get("/units/:unitId", getUnitByID);
unitRouter.post("/units", createUnit);
unitRouter.put("/units/:unitId", updateUnit);
unitRouter.delete("/units/:unitId", deleteUnit);



unitRouter.get("/chefer", getAllUnits);
unitRouter.get("/units/:unitId/chefer/:chefId", getUnitByID);
unitRouter.put("//units/:unitId/chefer/:chefId", createUnit);
unitRouter.put("/units/:unitId/chefer/:chefId", updateUnit);
unitRouter.delete("/units/:unitId/chefer/:chefId", deleteUnit);

//Router för specialister

unitRouter.put("/units/:unitId/specialister", addSpecialistToUnit);
unitRouter.put("/units/:unitId/specialister/:specialistId", updateSpecialist);
unitRouter.get("/units/:unitId/specialister/:specialistId", getSpecialist);
unitRouter.get("/specialister", getAllSpecialist);

//Tasks
unitRouter.get("/tasks", getTasks);
unitRouter.put("/units/:unitId/tasks", addTaskToUnit);
unitRouter.put("/units/:unitId/tasks/:taskId", updateTask);
unitRouter.get("/units/:unitId/tasks/:taskId", getTask);

// work places
unitRouter.get("/workPlaces", getTasks);
unitRouter.put("/units/:unitId/workPlaces", addTaskToUnit);
unitRouter.put("/units/:unitId/workPlaces/:workplaceID", updateTask);
unitRouter.get("/units/:unitId/workPlaces/:workplaceID", getTask);

//cleaners
unitRouter.get("/cleaners", getTasks);
unitRouter.put("/units/:unitId/workPlaces/:workplaceID/cleaners", addTaskToUnit);
unitRouter.put("/units/:unitId/workPlaces/:workplaceID/cleaners/:cleanerID", updateTask);
unitRouter.get("/units/:unitId/workPlaces/:workplaceID/cleaners/:cleanerId", getTask);
export default unitRouter;
