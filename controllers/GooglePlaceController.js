import axios from "axios";
import { response } from "express";

const GOOGLE_PLACES_API_KEY = "";
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export const getPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    // location, radius //kolla sen om det behövs location och radius

    if (!query) {
      return res.status(400).json({ message: "Query Parameter is required" });
    }

    console.log("Query Params:", req.query);

    const response = await axios.get(`${BASE_URL}/textsearch/json`, {
      params: {
        query,
        key: GOOGLE_PLACES_API_KEY,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      `Error vid searchig av place status ${error.response?.status} Error message: ${error.message}`
    );
  }
};

export const getPlaceDetail = async (req, res) => {
  try {
    const { placeId } = req.params;
    if (!placeId) {
      return res.status(400).json({ message: "placeID is required" });
    }
    const response = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching place details: ${error.message}`);
    res.status(error.response?.status || 500).json({
      message: "Error fetching place details",
      error: error.message,
    });
  }
};
