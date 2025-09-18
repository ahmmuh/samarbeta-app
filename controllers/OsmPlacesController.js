import axios from "axios";

// Nominatim URL
const BASE_URL = "https://nominatim.openstreetmap.org/search";

export const getPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "En sökparameter krävs" });
    }

    // Anropa Nominatim
    const response = await axios.get(BASE_URL, {
      params: {
        q: query, // sökord
        format: "json",
        limit: 15,
        addressdetails: 1,
        namedetails: 1,
      },
      headers: {
        "User-Agent": "Ecavatten",
      },
    });

    const results = response.data.map((item) => {
      const address = item.address || {};

      // Försök ta ett vettigt namn
      const name =
        item.namedetails?.name ||
        address.school ||
        address.building ||
        item.display_name.split(",")[0]; // fallback

      const adress = [
        address.road,
        address.house_number,
        address.city || address.town || address.village,
        address.postcode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        name,
        adress,
        coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
      };
    });

    console.log("OSM RESULT", results);
    res.status(200).json(results);
  } catch (error) {
    console.error(`Error fetching OSM places: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error fetching places", error: error.message });
  }
};
