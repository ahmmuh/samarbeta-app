import express from "express";

import { getToken } from "../middleware/authMiddleware.js";
import { getPlaces } from "../controllers/osmPlacesController.js";

const placesRoute = express.Router();

placesRoute.get("/places", getToken, getPlaces);

export default placesRoute;
