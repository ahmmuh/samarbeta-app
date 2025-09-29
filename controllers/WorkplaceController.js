import Unit from "../models/unit";
import WorkPlace from "../models/WorkPlace";

//Skapa ny arbetsplats

export const createWorkPlace = async (req, res) => {
  try {
    const { name, address, location } = req.body;

    if (!name || !address || !location?.coordinates) {
      return res.status(400).json({ message: "Namn, adress och plats krävs" });
    }

    // Kolla om arbetsplats redan finns på samma adress och koordinater
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
    const { name, address, location } = req.body;

    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(404).json({ message: "Enheten hittades inte" });

    // Kolla om arbetsplats redan finns (på samma adress)
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
    const newWorkplace = new WorkPlace({ name, address, location });
    await newWorkplace.save();

    unit.workPlaces.push(newWorkplace._id);
    await unit.save();

    res.status(201).json({
      message: "Arbetsplats tillagd i enheten",
      workPlace: newWorkplace,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Hämta alla arbetsplatser nära en given plats
export const getNearbyWorkPlaces = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 200 } = req.query; // maxDistance i meter

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
          $maxDistance: parseInt(maxDistance), // tex 200 meter
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

//Hämta arbetsplats via ID
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
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
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
