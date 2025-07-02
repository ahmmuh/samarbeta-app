import Unit from "../models/unit.js";
import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json(users);
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

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId saknas" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kunde inte hitta user" });
    }

    Object.assign(user, updateData);

    await user.save();

    return res.status(200).json({ message: "user har uppdaterats", user });
  } catch (error) {
    console.error("Fel vid uppdatering av user:", error);
    return res.status(500).json({ message: "Internt serverfel" });
  }
};
