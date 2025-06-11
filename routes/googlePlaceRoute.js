import express from "express";
import {
  getPlaceDetail,
  getPlaces,
} from "../controllers/GooglePlaceController.js";
import { getToken } from "../middleware/authMiddleware.js";

const googlePlaceRoute = express.Router();


googlePlaceRoute.get("/places", getPlaces);

googlePlaceRoute.get("/places/details/:placeId", getPlaceDetail);

export default googlePlaceRoute;
