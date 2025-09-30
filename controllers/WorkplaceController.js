import { geocodeAddress } from "../lib/geocode/geocoder.js";
import Unit from "../models/unit.js";
import WorkPlace from "../models/WorkPlace.js";

// Skapa ny arbetsplats
export const createWorkPlace = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Namn och adress krävs" });
    }

    // Geokoda adressen automatiskt
    const [lng, lat] = await geocodeAddress(address);

    const location = {
      type: "Point",
      coordinates: [lng, lat],
    };

    // Kolla om arbetsplats redan finns
    const existingWorkPlace = await WorkPlace.findOne({
      address,
      "location.coordinates": location.coordinates,
    });

    if (existingWorkPlace) {
      return res.status(400).json({
        message: "Denna arbetsplats finns redan i systemet",
        workPlace: existingWorkPlace,
      });
    }

    // Skapa ny arbetsplats
    const newWorkPlace = new WorkPlace({ name, address, location });
    await newWorkPlace.save();

    res.status(201).json({
      message: "Arbetsplats skapad",
      workPlace: newWorkPlace,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Lägg till arbetsplats till en unit
export const addWorkPlaceToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Namn och adress krävs" });
    }

    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(404).json({ message: "Enheten hittades inte" });

    // Geokoda adressen
    const [lng, lat] = await geocodeAddress(address);
    const location = { type: "Point", coordinates: [lng, lat] };

    // Kolla om arbetsplats redan finns
    const existingWorkPlace = await WorkPlace.findOne({
      address,
      "location.coordinates": location.coordinates,
    });

    if (existingWorkPlace && unit.workPlaces.includes(existingWorkPlace._id)) {
      return res.status(400).json({
        message: "Denna arbetsplats finns redan i enheten",
        workPlace: existingWorkPlace,
      });
    }

    // Skapa ny arbetsplats
    const newWorkPlace = new WorkPlace({ name, address, location });
    await newWorkPlace.save();

    unit.workPlaces.push(newWorkPlace._id);
    await unit.save();

    res.status(201).json({
      message: "Arbetsplats tillagd i enheten",
      workPlace: newWorkPlace,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Hämta alla arbetsplatser
export const getAllWorkPlaces = async (req, res) => {
  try {
    const workplaces = await WorkPlace.find();
    res.status(200).json(workplaces);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Hämta alla arbetsplatser nära en given plats
export const getNearbyWorkPlaces = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 200 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: "lng och lat krävs" });
    }

    const nearbyWorkPlaces = await WorkPlace.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    if (!nearbyWorkPlaces.length) {
      return res
        .status(404)
        .json({ message: "Inga arbetsplatser nära positionen" });
    }

    res.status(200).json(nearbyWorkPlaces);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Hämta arbetsplats via ID
export const getWorkPlaceById = async (req, res) => {
  try {
    const { workplaceId } = req.params;

    if (!workplaceId) {
      return res.status(400).json({ message: "workplaceId saknas" });
    }

    const workplace = await WorkPlace.findById(workplaceId);

    if (!workplace) {
      return res.status(404).json({ message: "Arbetsplats hittades inte" });
    }

    res.status(200).json(workplace);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Uppdatera arbetsplats
export const updateWorkPlace = async (req, res) => {
  try {
    const { workplaceId } = req.params;

    const updatedWorkplace = await WorkPlace.findByIdAndUpdate(
      workplaceId,
      req.body,
      { new: true }
    );

    if (!updatedWorkplace) {
      return res.status(404).json({ message: "Arbetsplats hittades inte" });
    }

    res.status(200).json(updatedWorkplace);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Ta bort arbetsplats från en unit
export const deleteWorkplace = async (req, res) => {
  try {
    const { workplaceId, unitId } = req.params;

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: "Enhet hittades inte" });

    unit.workPlaces = unit.workPlaces.filter(
      (id) => id.toString() !== workplaceId
    );
    await unit.save();

    await WorkPlace.findByIdAndDelete(workplaceId);

    res.status(200).json({ message: "Arbetsplats raderad" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
