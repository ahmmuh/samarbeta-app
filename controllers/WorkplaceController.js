import Unit from "../models/unit.js";
import WorkPlace from "../models/workPlace.js";

export const addWorkPlaceToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit ID", unitId);
    const { name, location } = req.body;
    console.log("workplaces from body", req.body);
    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(404).json({ message: "Enheten hittades inte" });

    const existingWorkPlace = await WorkPlace.findOne({ name });

    if (existingWorkPlace && unit.workPlaces.includes(existingWorkPlace._id)) {
      return res.status(400).json({
        message: "Denna WorkPlace finns redan i systemet",
        workPlace: existingWorkPlace,
      });
    }

    const newWorkplace = new WorkPlace({ name, location });
    await newWorkplace.save();
    unit.workPlaces.push(newWorkplace._id);

    await unit.save();
    console.log("Ny arbetsplats skapad med ID:", newWorkplace._id);
    console.log("Uppdaterad enhet:", unit);

    res.status(201).json({
      message: "Arbetsplats tillagd i enheten",
      workPlace: newWorkplace,
    });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "External Error uppstod", error: error.message });
  }
};

export const getAllWorkPlaces = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("UNIT ID IN WORK PLACE CONTROLLER, ", unitId);
    const workplaces = await Unit.findById(unitId).populate("workPlaces");

    console.log("Founded workPlaces ", workplaces);

    if (!workplaces || workplaces.length === 0) {
      return res
        .status(404)
        .json({ message: "No.workPlaces found for this unit" });
    }
    console.log("WORKPLACE DATA: ", workplaces);
    return res.status(200).json(workplaces);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// export const getAllWorkPlaces = async (req, res) => {
//   try {
//     const { unitId } = req.params;
//     const foundedWorkPlace = await Unit.findById(unitId).populate("workPlaces");
//     if (!foundedWorkPlace.workPlaces) {
//       return res.status(404).json({ message: "Workplace not founded" });
//     }
//     return res.status(200).json(foundedWorkPlace.workPlaces);
//   } catch (error) {
//     console.log("Error", error.message);
//     return res.status(500).json({ message: "Internal Server Error", error });
//   }
// };

export const updateWorkPlace = async (req, res) => {
  try {
    const { unitId, workplaceId } = req.params;

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(400).json({ message: "Enheten finns inte" });

    const updatedWorkplace = await WorkPlace.findByIdAndUpdate(
      workplaceId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedWorkplace)
      return res.status(400).json({ message: "updatedWorkplace finns inte" });
    return res.status(204).json(updatedWorkplace);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getWorkPlace = async (req, res) => {
  try {
    const { unitId, workplaceId } = req.params;

    console.log("Unit ID:", unitId);
    console.log("Workplace ID:", workplaceId);

    const unit = await Unit.findById(unitId).populate("workPlaces");
    if (!unit) return res.status(400).json({ message: "Enhet not found" });

    console.log("Hittad enhet:", unit);
    console.log("Hittade arbetsplatser:", unit.workPlaces);

    const workplace = unit?.workPlaces?.find(
      (t) => t._id.toString() === workplaceId
    );
    if (!workplace) {
      return res.status(400).json({ message: "workplaces not found" });
    }

    res.status(200).json(workplace);
    console.log("Workplace in server sidan: ", workplace);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//fixa sen

export const deleteWorkplace = async (req, res) => {
  const { workplaceId, unitId } = req.params;
  try {
    const unit = await Unit.findById(unitId).populate("workplaces");
    if (!unit) return res.status(400).json({ message: "Enhet hittades inte" });

    const deletedWorkplace = unit.workPlaces.filter(
      (t) => t._id.toString() !== workplaceId
    );
    unit.workPlaces = deletedWorkplace;
    await unit.save();
    return res
      .status(200)
      .json({ message: "Deleted workplace", workplace: deletedWorkplace });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
