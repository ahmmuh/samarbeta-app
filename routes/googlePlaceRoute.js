import express from "express";
import {
  getPlaceDetail,
  getPlaces,
} from "../controllers/GooglePlaceController.js";
import { getToken } from "../middleware/authMiddleware.js";

const googlePlaceRoute = express.Router();

googlePlaceRoute.get("/places", getToken, getPlaces);

googlePlaceRoute.get("/places/details/:placeId", getToken, getPlaceDetail);

export default googlePlaceRoute;
