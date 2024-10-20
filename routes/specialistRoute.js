import express from "express";
import {
  addSpecialistToUnit,
  deleteSpecialist,
  getAllSpecialist,
  getSpecialist,
  updateSpecialist,
} from "../controllers/SpecialistController.js";
//Router för specialister

const specialistRoute = express.Router();

specialistRoute.put("/units/:unitId/specialister", addSpecialistToUnit);
specialistRoute.put(
  "/units/:unitId/specialister/:specialistId",
  updateSpecialist
);
specialistRoute.get("/units/:unitId/specialister/:specialistId", getSpecialist);
specialistRoute.get("/specialister", getAllSpecialist);

specialistRoute.delete(
  "/units/:unitId/specialister/:specialistId",
  deleteSpecialist
);
export default specialistRoute;
