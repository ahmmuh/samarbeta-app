import KeyModel from "../models/key.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select("-password")
      .populate("unit")
      .populate("keys");

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
  console.log("USERID i getUserById", userId);

  if (!userId) {
    return res.status(400).json({ message: "Ingen användar-ID angiven" });
  }

  try {
    const user = await User.findById(userId)
      .populate("keys")
      .select("-password");

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
  // const { name, email, phone, username, role, unit } = req.body;

  const updateData = req.body;
  if (!userId) {
    return res.status(400).json({ message: "userId saknas" });
  }

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Kunde inte hitta user" });
    }

    // Object.assign(user, updateData);

    // await user.save();
    console.log("En användare uppdaterats", user);
    return res.status(200).json({ message: "user har uppdaterats", user });
  } catch (error) {
    console.error("Fel vid uppdatering av user:", error);
    return res.status(500).json({ message: "Internt serverfel" });
  }
};

// Delete användare
// export const deleteUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const deletedUser = await User.findByIdAndDelete(userId);
//     if (!deletedUser) {
//       return res.status(404).json({ message: "Användare hittades inte" });
//     }

//     return res
//       .status(200)
//       .json({ message: "Användare borttagen", Användare: deletedUser });
//   } catch (error) {
//     console.error("Error:", error.message);
//     return res.status(500).json({ message: "Serverfel", error: error.message });
//   }
// };

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }

    user.keys = [];
    await user.save();

    // await KeyModel.updateMany(
    //   { borrowedBy: userId },
    //   { $set: { borrowedBy: null } }
    // );
    // await KeyModel.updateMany(
    //   { lastBorrowedBy: userId },
    //   { $set: { lastBorrowedBy: null } }
    // );

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Användare borttagen", användare: deletedUser });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

//Sök användare

export const searchUser = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Namn saknas i förfrågan" });
  }

  try {
    const users = await User.find({
      name: { $regex: name, $options: "i" },
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "Ingen användare matchar sökningen." });
    }

    return res.status(200).json({ message: "Användare hittades", data: users });
  } catch (error) {
    console.error("Fel vid sökning:", error.message);
    return res.status(500).json({ message: "Serverfel" });
  }
};
