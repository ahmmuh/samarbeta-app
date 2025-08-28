import express from "express";
import {
  createAdress,
  deleteAdress,
  getAdressById,
  getAllAdresses,
  updateAdress,
} from "../controllers/AdressCatalogController.js";

const addressRoute = express.Router();

// Skapa ny adress
addressRoute.post("/adresses", createAdress);

// Hämta alla adresser
addressRoute.get("/adresses", getAllAdresses);

// Hämta en adress via ID
addressRoute.get("/adresses/:id", getAdressById);

// Uppdatera en adress
addressRoute.put("/adresses/:id", updateAdress);

// Ta bort en adress
addressRoute.delete("/adresses/:id", deleteAdress);

export default addressRoute;
