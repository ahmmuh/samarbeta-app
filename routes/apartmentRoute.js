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

apartmentRoute.get("/apartments", getToken, getAllApartments);
apartmentRoute.get("/apartments/:apartmentId", getToken, getApartmentByID);
apartmentRoute.patch("/apartments/:apartmentId", getToken, updateApartment);
apartmentRoute.delete("/apartments/:apartmentId", getToken, deleteApartment);
apartmentRoute.post("/apartments", getToken, createApartment);

export default apartmentRoute;
