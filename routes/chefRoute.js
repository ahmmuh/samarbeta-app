import express from "express";
import {
  addChefToUnit,
  deleteChef,
  getAllChefer,
  getChefByID,
  updateChef,
} from "../controllers/ChefController.js";

const chefRoute = express.Router();

chefRoute.get("/chefer", getAllChefer);
chefRoute.get("/units/:unitId/chefer/:chefId", getChefByID);
chefRoute.put("/units/:unitId/chefer", addChefToUnit);
chefRoute.put("/units/:unitId/chefer/:chefId", updateChef);
chefRoute.delete("/units/:unitId/chefer/:chefId", deleteChef);

export default chefRoute;
