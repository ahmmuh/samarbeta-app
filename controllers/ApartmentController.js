import Apartment from "../models/apartment.js";

export const getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();
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

export const createApartment = async (req, res) => {
  console.log("Hela Begäran: ", req.body);
  const { apartmentLocation, description, keyLocation } = req.body;
  try {
    const newApartment = new Apartment({
      apartmentLocation,
      description,
      keyLocation,
    });
    newApartment.priority = "Hög";
    newApartment.startDate = new Date();
    newApartment.assignedUnit = "6739998297a4cb689a4a83b2";
    await newApartment.save();
    console.log("New Apartment:", newApartment);
    res.status(201).json(newApartment);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server Error" });
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
      .json({ message: "apartment uppdaterades", enhet: updateApartment });
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
