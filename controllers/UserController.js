import Chef from "../models/chef.js";
import Specialist from "../models/specialist.js";
import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const chefer = await Chef.find();
    const specialister = await Specialist.find();
    const allUsers = [...users, ...chefer, ...specialister];
    if (allUsers.length === 0) {
      return res
        .status(400)
        .json({ message: "Det finns inga användare att visa" });
    }

    console.log(
      "Hämtade användare, kan bestå av chefer och specialister",
      allUsers
    );

    return res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Serverfel vid hämtning av users (chefer och specialister",
    });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Ingen användar-ID angiven" });
  }

  try {
    // Försök hitta användaren i någon av modellerna
    const user =
      (await User.findById(userId)) ||
      (await Chef.findById(userId)) ||
      (await Specialist.findById(userId));

    if (!user) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }

    console.log("Hämtade användare (kan vara chef eller specialist):", user);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Serverfel vid hämtning av användare",
    });
  }
};
