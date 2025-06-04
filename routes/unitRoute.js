import express from "express";
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getUnitByID,
  updateUnit,
} from "../controllers/UnitController.js";

const unitRouter = express.Router();

// I början av unitRoute.js
console.log("unitRoute is being loaded");

// Inuti en route:
unitRouter.get("/", (req, res) => {
  console.log("GET /api/unit körs");
  res.json({ message: "Units OK" });
});

//enheter

unitRouter.get("/units", getAllUnits);
unitRouter.get("/units/:unitId", getUnitByID);
unitRouter.post("/units", createUnit);
unitRouter.put("/units/:unitId", updateUnit);
unitRouter.delete("/units/:unitId", deleteUnit);

export default unitRouter;
