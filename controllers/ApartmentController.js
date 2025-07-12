import Apartment from "../models/apartment.js";
import Settings from "../models/settings.js";
import Unit from "../models/unit.js";

export const createApartment = async (req, res) => {
  console.log("Hela Begäran: ", req.body);
  const {
    apartmentLocation,
    description,
    keyLocation,
    startDate,
    endDate,
    priority,
  } = req.body;
  try {
    const units = await Unit.find().sort({ createdAt: 1 });
    if (units.length === 0) {
      return res.status(400).json({ message: "Det finns inga enheter" });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    let nextIndex = (settings.lastAssignedUnitIndex + 1) % units.length;

    const assignedUnit = units[nextIndex];

    const newApartment = await Apartment.create({
      apartmentLocation,
      description,
      keyLocation,
      startDate,
      endDate,
      priority,
      assignedUnit: assignedUnit._id,
      assignedAt: new Date(),
    });
    assignedUnit.apartments.push(newApartment._id);

    await assignedUnit.save();
    settings.lastAssignedUnitIndex = nextIndex;
    await settings.save();
    console.log("New Apartment:", newApartment);
    res.status(201).json(newApartment);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllApartments = async (req, res) => {
  console.log("Called getToken när jag använder api/apartments");
  console.log("Token i cookies: api/apartments", req.cookies.token);
  try {
    const apartments = await Apartment.find().populate("assignedUnit", "name");
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

export const getApartmentByID = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({ message: "Apartment hittades inte" });
    }
    res.status(200).json(apartment);
  } catch (error) {
    console.error("Fel vid hämtning av apartment ", error.message);
    res.status(500).json({ message: "Serverfel" });
  }
};

export const updateApartment = async (req, res) => {
  const { apartmentId } = req.params;
  console.log("apartment ID ", apartmentId);
  try {
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment)
      return res.status(400).json({ message: "apartment hittades inte!" });

    const updatedApartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      req.body,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "apartment uppdaterades", enhet: updatedApartment });
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).json({ message: "Internal Error", error });
  }
};
export const deleteApartment = async (req, res) => {
  const { apartmentId } = req.params;
  try {
    const deletedApartment = await Apartment.findByIdAndDelete(apartmentId, {
      new: true,
    });
    res.status(200).json({
      message: "Apartment med ID " + apartmentId + " has been deleted",
      apartment: deletedApartment,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Sök lägenheter

export const searchApartment = async (req, res) => {
  const { apartmentLocation } = req.query;

  if (!apartmentLocation) {
    return res.status(400).json({ message: "query saknas i förfrågan" });
  }

  try {
    const apartments = await Apartment.find({
      apartmentLocation: { $regex: apartmentLocation, $options: "i" },
    }).populate("assignedUnit");

    if (apartments.length === 0) {
      return res
        .status(404)
        .json({ message: "Ingen lägenhet matchar sökningen." });
    }

    return res
      .status(200)
      .json({ message: "Lägenheter hittades", data: apartments });
  } catch (error) {
    console.error("Fel vid sökning:", error.message);
    return res.status(500).json({ message: "Serverfel vid sökning." });
  }
};
