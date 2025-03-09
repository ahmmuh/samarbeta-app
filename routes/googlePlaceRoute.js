import express from "express";
import {
  getPlaceDetail,
  getPlaces,
} from "../controllers/GooglePlaceController.js";

const googlePlaceRoute = express.Router();

googlePlaceRoute.get("/places", getPlaces);

googlePlaceRoute.get("/places/details/:placeId", getPlaceDetail);

export default googlePlaceRoute;
