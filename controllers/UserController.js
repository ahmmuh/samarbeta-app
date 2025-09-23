import KeyModel from "../models/key.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } })
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

//NY update kod:
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId saknas" });
  }

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kunde inte hitta user" });
    }

    // -------------------------
    // Hantera enhetsbyte
    // -------------------------
    if (updateData.unit && user.unit?.toString() !== updateData.unit) {
      const newUnit = await Unit.findById(updateData.unit).populate("users");
      if (!newUnit) {
        return res
          .status(404)
          .json({ message: "Kunde inte hitta nya enheten" });
      }

      if (user.unit) {
        await Unit.findByIdAndUpdate(user.unit, { $pull: { users: userId } });
      }

      await Unit.findByIdAndUpdate(newUnit._id, {
        $addToSet: { users: userId },
      });

      user.unit = updateData.unit;
    }

    // -------------------------
    // Hantera roller
    // -------------------------
    if ("role" in updateData) {
      const newRoles = Array.isArray(updateData.role) ? updateData.role : [];
      const updatedRolesSet = new Set([...(user.role || []), ...newRoles]);

      if (newRoles.length === 0) {
        user.role = [];
      } else {
        user.role = Array.from(updatedRolesSet);
      }

      const rolesRequiringUnit = [
        "Enhetschef",
        "Flyttstädansvarig",
        "Specialare",
        "Lokalvårdare",
      ];
      const hasRoleRequiringUnit = user.role.some((r) =>
        rolesRequiringUnit.includes(r)
      );

      if (!hasRoleRequiringUnit) {
        user.unit = null;
      }
    }

    // -------------------------
    // Uppdatera andra fält
    // -------------------------
    const fieldsToUpdate = ["name", "email", "phone", "username"];
    fieldsToUpdate.forEach((field) => {
      if (field in updateData) {
        user[field] = updateData[field];
      }
    });

    await user.save();

    return res.status(200).json({ message: "User har uppdaterats", user });
  } catch (error) {
    console.error("Fel vid uppdatering av user:", error);
    return res.status(500).json({ message: "Internt serverfel" });
  }
};

//GANSKA NY kod:
// export const updateUser = async (req, res) => {
//   const { userId } = req.params;
//   const updateData = req.body;

//   if (!userId) {
//     return res.status(400).json({ message: "userId saknas" });
//   }

//   try {
//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "Kunde inte hitta user" });
//     }

//     // Om användaren byter enhet
//     if (updateData.unit && user.unit?.toString() !== updateData.unit) {
//       // Kolla att nya enheten finns
//       const newUnit = await Unit.findById(updateData.unit).populate("users");
//       if (!newUnit) {
//         return res
//           .status(404)
//           .json({ message: "Kunde inte hitta nya enheten" });
//       }

//       // Ta bort användaren från gamla enheten
//       if (user.unit) {
//         await Unit.findByIdAndUpdate(user.unit, { $pull: { users: userId } });
//       }

//       // Hitta befintlig enhetschef i den nya enheten (som inte är den aktuella användaren)
//       const existingChef = newUnit.users.find(
//         (u) =>
//           u._id.toString() !== userId &&
//           (Array.isArray(u.role)
//             ? u.role.includes("Enhetschef")
//             : u.role === "Enhetschef")
//       );

//       if (existingChef) {
//         // Ta bort enhetschefen från enheten
//         await Unit.findByIdAndUpdate(newUnit._id, {
//           $pull: { users: existingChef._id },
//         });

//         // Ta bort rollen "Enhetschef" från användarens roll-array
//         const updatedRoles = existingChef.role.filter(
//           (r) => r !== "Enhetschef"
//         );

//         // Kontrollera om användaren har andra roller som kräver unit
//         const rolesRequiringUnit = [
//           "Enhetschef",
//           "Flyttstädansvarig",
//           "Specialare",
//           "Lokalvårdare",
//         ];
//         const hasOtherRoles = updatedRoles.some((r) =>
//           rolesRequiringUnit.includes(r)
//         );

//         await User.findByIdAndUpdate(existingChef._id, {
//           role: updatedRoles,
//           unit: hasOtherRoles ? existingChef.unit : null,
//         });
//       }

//       // Lägg till användaren i nya enheten
//       await Unit.findByIdAndUpdate(updateData.unit, {
//         $addToSet: { users: userId },
//       });
//     }

//     // Uppdatera användarens fält
//     Object.assign(user, updateData);
//     await user.save();

//     console.log("En användare uppdaterats", user);
//     return res.status(200).json({ message: "User har uppdaterats", user });
//   } catch (error) {
//     console.error("Fel vid uppdatering av user:", error);
//     return res.status(500).json({ message: "Internt serverfel" });
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
