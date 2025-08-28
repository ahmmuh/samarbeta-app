import axios from "axios";

// Nominatim URL
const BASE_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Sök platser (autocomplete-liknande)
 * GET /api/places?query=skola
 */
export const getPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Anropa Nominatim
    const response = await axios.get(BASE_URL, {
      params: {
        q: query, // sökord
        format: "json", // JSON-svar
        limit: 10, // max antal resultat
      },
      headers: {
        "User-Agent": "your-app-name", // Nominatim kräver User-Agent
      },
    });

    // Filtrera till namn, adress och koordinater
    const results = response.data.map((item) => ({
      name: item.display_name, // kan vara kort namn + adress
      adress: item.display_name,
      coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(`Error fetching OSM places: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error fetching places", error: error.message });
  }
};
