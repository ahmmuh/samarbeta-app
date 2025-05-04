//get Alla specialist via unit

import Specialist from "../models/specialist.js";
import Unit from "../models/unit.js";

export const getTestSpecialister = async (req, res) => {
  try {
    const specialister = await Specialist.find();
    if (!specialister) {
      return res.status(404).json({ message: "No specialister" });
    }

    return res.status(200).json(specialister);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const addSpecialistToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit ID i addSpecialistToUnit", unitId);
    const { name, phone, email } = req.body;
    console.log("Specialister from body : addSpecialistToUnit", req.body);
    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(400).json({ message: "Enheten hittades inte" });

    const specialist = new Specialist({
      ...req.body,
      userType: "specialister",
    });
    await specialist.save();
    unit.specialister.push(specialist._id);
    console.log("Specialist ID i addSpecialistToUnit", specialist._id);
    console.log("Unit med specialist i addSpecialistToUnit", unit);
    await unit.save();

    res.status(201).json({ message: "En specialist lagts till enhet" });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "External Error uppstod", error: error.message });
  }
};

export const getAllSpecialister = async (req, res) => {
  try {
    const { unitId } = req.params;

    const foundedSpecialister = await Unit.findById(unitId).populate(
      "specialister"
    );

    console.log("Founded specialister ", foundedSpecialister.specialister);

    // const specialister = await Specialist.find();
    if (
      !foundedSpecialister.specialister ||
      foundedSpecialister.specialister.length === 0
    ) {
      return res
        .status(404)
        .json({ message: "No specialister found for this unit" });
    }
    return res.status(200).json(foundedSpecialister.specialister);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateSpecialist = async (req, res) => {
  try {
    const { unitId, specialistId } = req.params;
    console.log("Hela body i backend", req.body);

    console.log("DEBUG - unitId:", unitId);
    console.log("DEBUG - specialistId:", specialistId);
    // Kontrollera att både unitId och specialistId finns
    if (!unitId || !specialistId) {
      return res
        .status(400)
        .json({ message: "unitId eller specialistId saknas" });
    }

    // Kontrollera att specialisten tillhör enheten
    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(404).json({ message: "Enheten finns inte" });

    // Uppdatera specialisten
    const updatedSpecialist = await Specialist.findByIdAndUpdate(
      specialistId,
      req.body,
      { new: true }
    );

    if (!updatedSpecialist) {
      return res.status(400).json({ message: "Ingen uppdatering har gjorts" });
    }

    return res
      .status(200)
      .json(`Specialist med följande ID ${specialistId} har uppdaterats`);
  } catch (error) {
    console.error("Serverfel vid uppdatering av specialist:", error);
    return res
      .status(500)
      .json({ message: "Internt serverfel", error: error.message });
  }
};

export const getSpecialist = async (req, res) => {
  try {
    const { specialistId, unitId } = req.params;

    const unit = await Unit.findById(unitId).populate("specialister");
    if (!unit) return res.status(400).json({ message: "Enhet noy found" });

    const specialist = unit.specialister.find(
      (t) => t._id.toString() === specialistId
    );
    if (!specialist)
      return res.status(400).json({ message: "specialist not found" });
    res.status(200).json(specialist);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSpecialist = async (req, res) => {
  const { specialistId, unitId } = req.params;
  try {
    const unit = await Unit.findById(unitId).populate("specialister");
    if (!unit) return res.status(400).json({ message: "Enhet hittades inte" });

    const updatedSpecialister = unit.specialister.filter(
      (t) => t._id.toString() !== specialistId
    );
    unit.specialister = updatedSpecialister;
    await unit.save();
    return res
      .status(200)
      .json({ message: "Deleted specialist", specialist: updatedSpecialister });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//Fetch alla specialister utan unit

export const getAllSpecialistWithoutUnit = async (req, res) => {
  try {
    const specialister = await Specialist.find();
    if (specialister.length === 0) {
      return res
        .status(400)
        .json({ message: "Det finns inga specialister att hämta" });
    }
    console.log("Hämtade specialister i backend", specialister);
    return res.status(200).json(specialister);
  } catch (error) {
    console.error("Error vid hämtning av specialister", error.message);
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av specialister" });
  }
};
