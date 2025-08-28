import Adress from "../models/adressCatalog.js";

// Skapa ny adress
export const createAdress = async (req, res) => {
  try {
    const { name, adress } = req.body;
    if (!name || !adress) {
      return res.status(400).json({
        message:
          "Namn och adress måste finnas med vid registrering av ny adress",
      });
    }

    const newAdress = new Adress({ name, adress });
    await newAdress.save();
    return res.status(201).json(newAdress);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Fel vid skapande av adress", error });
  }
};

// Hämta alla adresser
export const getAllAdresses = async (req, res) => {
  try {
    const adresses = await Adress.find();
    return res.status(200).json(adresses);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Fel vid hämtning av adresser", error });
  }
};

// Hämta en adress via ID
export const getAdressById = async (req, res) => {
  try {
    const adress = await Adress.findById(req.params.id);
    if (!adress) {
      return res.status(404).json({ message: "Adressen hittades inte" });
    }
    return res.status(200).json(adress);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Fel vid hämtning av adress", error });
  }
};

// Uppdatera adress via ID
export const updateAdress = async (req, res) => {
  try {
    const { name, adress } = req.body;
    const updatedAdress = await Adress.findByIdAndUpdate(
      req.params.id,
      { name, adress },
      { new: true, runValidators: true }
    );
    if (!updatedAdress) {
      return res.status(404).json({ message: "Adressen hittades inte" });
    }
    return res.status(200).json(updatedAdress);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Fel vid uppdatering av adress", error });
  }
};

// Ta bort adress via ID
export const deleteAdress = async (req, res) => {
  try {
    const deletedAdress = await Adress.findByIdAndDelete(req.params.id);
    if (!deletedAdress) {
      return res.status(404).json({ message: "Adressen hittades inte" });
    }
    return res.status(200).json({ message: "Adressen har tagits bort" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Fel vid borttagning av adress", error });
  }
};
