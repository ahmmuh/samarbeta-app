import express from "express";
import {
  createApartment,
  deleteApartment,
  getAllApartments,
  getApartmentByID,
  updateApartment,
} from "../controllers/ApartmentController.js";
import { getToken } from "../middleware/authMiddleware.js";

const apartmentRoute = express.Router();


apartmentRoute.get("/apartments", getAllApartments);
apartmentRoute.get("/apartments/:apartmentId", getApartmentByID);
apartmentRoute.patch("/apartments/:apartmentId", updateApartment);
apartmentRoute.delete("/apartments/:apartmentId", deleteApartment);
apartmentRoute.post("/apartments", createApartment);

export default apartmentRoute;
