import express from "express";
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitByID,
  updateUnit,
} from "../controllers/UnitController.js";

const unitRouter = express.Router();

//enheter

unitRouter.get("/units", getAllUnits);
unitRouter.get("/units/:unitId", getUnitByID);
unitRouter.post("/units", createUnit);
unitRouter.put("/units/:unitId", updateUnit);
unitRouter.delete("/units/:unitId", deleteUnit);



// // work places
// unitRouter.get("/workPlaces", getTasks);
// unitRouter.put("/units/:unitId/workPlaces", addTaskToUnit);
// unitRouter.put("/units/:unitId/workPlaces/:workplaceID", updateTask);
// unitRouter.get("/units/:unitId/workPlaces/:workplaceID", getTask);

// //cleaners
// unitRouter.get("/cleaners", getTasks);
// unitRouter.put(
//   "/units/:unitId/workPlaces/:workplaceID/cleaners",
//   addTaskToUnit
// );
// unitRouter.put(
//   "/units/:unitId/workPlaces/:workplaceID/cleaners/:cleanerID",
//   updateTask
// );
// unitRouter.get(
//   "/units/:unitId/workPlaces/:workplaceID/cleaners/:cleanerId",
//   getTask
// );
export default unitRouter;
