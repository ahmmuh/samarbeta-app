import { geocodeAddress } from "../lib/geocode/geocoder.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";
import WorkPlace from "../models/workPlace.js";

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
    const workplaces = await WorkPlace.find().populate({
      path: "cleaners",
      select: "-password",
    });
    res.status(200).json(workplaces);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//Lägga användare på en arbetsplats
// export const assignUserToWorkPlace = async (req, res) => {
//   try {
//     const { workplaceId } = req.params;
//     const { userId } = req.body;

//     if (!workplaceId || !userId) {
//       return res.status(400).json({ message: "workplaceId och userId krävs" });
//     }

//     const workPlace = await WorkPlace.findById(workplaceId);
//     if (!workPlace) {
//       return res.status(404).json({ message: "Arbetsplatsen hittades inte" });
//     }

//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "Användaren hittades inte" });
//     }

//     // Lägg till användaren i cleaners[] om hen inte redan finns där
//     if (!workPlace.cleaners.includes(user._id)) {
//       workPlace.cleaners.push(user._id);
//       await workPlace.save();
//     }

//     console.log("Tilldelad workplace med användare", workPlace, user);
//     return res.status(200).json({
//       message: "Användaren har tilldelats arbetsplatsen",
//       workPlace,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Serverfel", error: error.message });
//   }
// };
//Lägga användare på en arbetsplats
export const assignUserToWorkPlace = async (req, res) => {
  try {
    const { workplaceId } = req.params;
    const { userId } = req.body;

    if (!workplaceId || !userId) {
      return res.status(400).json({ message: "workplaceId och userId krävs" });
    }

    const workPlace = await WorkPlace.findById(workplaceId);
    if (!workPlace) {
      return res.status(404).json({ message: "Arbetsplatsen hittades inte" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }

    // Lägg till användaren i cleaners[] om hen inte redan finns där
    if (!workPlace.cleaners.includes(user._id)) {
      workPlace.cleaners.push(user._id);
      await workPlace.save();
    }

    // Populera cleaners innan vi skickar tillbaka
    const populatedWorkPlace = await WorkPlace.findById(workplaceId).populate({
      path: "cleaners",
      select: "-password",
    });

    return res.status(200).json({
      message: "Användaren har tilldelats arbetsplatsen",
      workPlace: populatedWorkPlace,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

// Hämta alla arbetsplatser nära en given plats
export const getNearbyWorkPlaces = async (req, res) => {
  try {
    const userId = req.user.id; // från auth middleware
    const { lat, lng } = req.body; // GPS från klienten
    const maxDistance = 200; // standard (meter)

    if (!lat || !lng) {
      return res.status(400).json({ message: "GPS-position krävs" });
    }

    // Hämta användarens arbetsplatser (bara deras IDs)
    const user = await User.findById(userId).populate("workplaces");
    if (!user || !user.workplaces.length) {
      return res.status(404).json({ message: "Inga arbetsplatser tilldelade" });
    }

    // Hämta ID:n på arbetsplatserna
    const workplaceIds = user.workplaces.map((wp) => wp._id);

    // Använd MongoDB $near för att hitta arbetsplatser nära användaren
    const nearbyWorkPlaces = await WorkPlace.find({
      _id: { $in: workplaceIds }, // bara användarens arbetsplatser
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    if (!nearbyWorkPlaces.length) {
      return res.status(404).json({
        message: "Du befinner dig inte nära någon av dina arbetsplatser",
      });
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

    const workplace = await WorkPlace.findById(workplaceId).populate({
      path: "cleaners",
      select: "-password",
    });

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

//Ta bort tilldelad användare från en arbetsplats:

// export const removeUserFromWorkPlace = async (req, res) => {
//   try {
//     const { workplaceId } = req.params;
//     const { userId } = req.body;

//     if (!userId) return res.status(400).json({ message: "userId saknas" });

//     const updatedWorkPlace = await WorkPlace.findByIdAndUpdate(
//       workplaceId,
//       { $pull: { cleaners: userId } }, // tar bort userId från arrayen
//       { new: true }
//     );

//     if (!updatedWorkPlace) {
//       return res.status(404).json({ message: "Arbetsplatsen hittades inte" });
//     }

//     res
//       .status(200)
//       .json({ message: "Användare borttagen", workPlace: updatedWorkPlace });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };
// Ta bort tilldelad användare från en arbetsplats
export const removeUserFromWorkPlace = async (req, res) => {
  try {
    const { workplaceId, userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId saknas" });
    }

    // Ta bort userId från cleaners-arrayen
    await WorkPlace.findByIdAndUpdate(
      workplaceId,
      { $pull: { cleaners: userId } },
      { new: true }
    );

    // Hämta arbetsplatsen igen och populera cleaners
    const updatedWorkPlace = await WorkPlace.findById(workplaceId).populate({
      path: "cleaners",
      select: "-password",
    });

    if (!updatedWorkPlace) {
      return res.status(404).json({ message: "Arbetsplatsen hittades inte" });
    }

    res.status(200).json({
      message: "Användare borttagen",
      workPlace: updatedWorkPlace,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
