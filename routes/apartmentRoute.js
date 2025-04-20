import express from "express";
import {
  createApartment,
  deleteApartment,
  getAllApartments,
  getApartmentByID,
  updateApartment,
} from "../controllers/ApartmentController.js";

const apartmentRoute = express.Router();

apartmentRoute.get("/apartments", getAllApartments);
apartmentRoute.get("/apartments/:apartmentId", getApartmentByID);
apartmentRoute.patch("/apartments/:apartmentId", updateApartment);
apartmentRoute.delete("/apartments/:apartmentId", deleteApartment);

apartmentRoute.post("/apartments/create", createApartment);
export default apartmentRoute;
