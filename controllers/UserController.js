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
