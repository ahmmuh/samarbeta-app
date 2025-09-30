// import Clock from "../models/Clock.js";
// import User from "../models/User.js";
// import WorkPlace from "../models/WorkPlace.js";

// // CLOCK IN
// export const clockIn = async (req, res) => {
//   try {
//     const { lastFour, location } = req.body;
//     if (!location?.coordinates || location.coordinates.length !== 2) {
//       return res.status(400).json({ message: "Ogiltig platsdata" });
//     }

//     const user = await User.findOne({ lastFour });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Kolla om användaren redan är inloggad
//     const activeClock = await Clock.findOne({
//       user: user._id,
//       clockOutDate: null,
//     });
//     if (activeClock) {
//       return res
//         .status(400)
//         .json({ message: "Du är redan stämplad in. Stämpla ut först." });
//     }

//     // Hitta närmaste arbetsplats inom 100m som är tillåten för användaren
//     const matchedWP = await WorkPlace.findOne({
//       _id: { $in: user.allowedWorkplaces.map((wp) => wp._id || wp) },
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: location.coordinates },
//           $maxDistance: 100, // meter
//         },
//       },
//     });

//     if (!matchedWP) {
//       return res
//         .status(400)
//         .json({ message: "Du jobbar inte på den här adressen." });
//     }

//     // Uppdatera user position
//     user.currentLocation = location;
//     user.currentAddress = matchedWP.address;
//     await user.save();

//     // Skapa nytt clock-in
//     const clock = await Clock.create({
//       user: user._id,
//       clockInDate: new Date(),
//       address: matchedWP.address,
//       location,
//     });

//     res.status(201).json(clock);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // CLOCK OUT
// export const clockOut = async (req, res) => {
//   try {
//     const { lastFour, location } = req.body;
//     if (!location?.coordinates || location.coordinates.length !== 2) {
//       return res.status(400).json({ message: "Ogiltig platsdata" });
//     }

//     const user = await User.findOne({ lastFour });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const clock = await Clock.findOne({
//       user: user._id,
//       clockOutDate: null,
//     }).sort({ clockInDate: -1 });

//     if (!clock) {
//       return res.status(400).json({
//         message: "Du måste stämpla in först innan du kan stämpla ut.",
//       });
//     }

//     // Hitta närmaste tillåtna arbetsplats inom 100m
//     const matchedWP = await WorkPlace.findOne({
//       _id: { $in: user.allowedWorkplaces.map((wp) => wp._id || wp) },
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: location.coordinates },
//           $maxDistance: 100,
//         },
//       },
//     });

//     // Uppdatera user position + adress
//     user.currentLocation = location;
//     if (matchedWP) user.currentAddress = matchedWP.address;
//     await user.save();

//     // Avsluta arbetspasset
//     clock.clockOutDate = new Date();
//     clock.location = location;
//     clock.address = matchedWP ? matchedWP.address : user.currentAddress;
//     await clock.save();

//     res.status(200).json(clock);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // HÄMTA ALLA PASS FÖR EN USER
// export const getUserClocks = async (req, res) => {
//   try {
//     const { lastFour } = req.params;
//     const user = await User.findOne({ lastFour });
//     if (!user) {
//       return res.status(404).json({ message: "Användare hittades inte" });
//     }

//     const clocks = await Clock.find({ user: user._id }).sort({
//       clockInDate: -1,
//     });
//     res.json(clocks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Clock from "../models/Clock.js";
import User from "../models/User.js";
import WorkPlace from "../models/WorkPlace.js";

// CLOCK IN
export const clockIn = async (req, res) => {
  try {
    const { lastFour, location, workplaceId } = req.body;

    if (!location?.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ message: "Ogiltig platsdata" });
    }

    const user = await User.findOne({ lastFour }).populate("allowedWorkplaces");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Kolla om användaren redan är inloggad
    const activeClock = await Clock.findOne({
      user: user._id,
      clockOutDate: null,
    });
    if (activeClock) {
      return res
        .status(400)
        .json({ message: "Du är redan stämplad in. Stämpla ut först." });
    }

    // Kontrollera att användaren har valt en giltig arbetsplats
    const workplace = user.allowedWorkplaces.find(
      (wp) => wp._id.toString() === workplaceId
    );
    if (!workplace) {
      return res.status(400).json({ message: "Ogiltig arbetsplats" });
    }

    // Kontrollera GPS-avstånd: användaren måste vara inom 100 m
    const matchedWP = await WorkPlace.findOne({
      _id: workplace._id,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: location.coordinates },
          $maxDistance: 100,
        },
      },
    });

    if (!matchedWP) {
      return res
        .status(400)
        .json({ message: "Du befinner dig inte på arbetsplatsen." });
    }

    // Uppdatera user position
    user.currentLocation = location;
    user.currentAddress = matchedWP.address;
    await user.save();

    // Skapa nytt clock-in
    const clock = await Clock.create({
      user: user._id,
      clockInDate: new Date(),
      address: matchedWP.address,
      workplace: matchedWP._id,
      location,
    });

    res.status(201).json(clock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLOCK OUT
export const clockOut = async (req, res) => {
  try {
    const { lastFour, location, workplaceId } = req.body;

    if (!location?.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ message: "Ogiltig platsdata" });
    }

    const user = await User.findOne({ lastFour }).populate("allowedWorkplaces");
    if (!user) return res.status(404).json({ message: "User not found" });

    const clock = await Clock.findOne({
      user: user._id,
      clockOutDate: null,
    }).sort({ clockInDate: -1 });

    if (!clock) {
      return res.status(400).json({
        message: "Du måste stämpla in först innan du kan stämpla ut.",
      });
    }

    // Kontrollera arbetsplats och GPS-avstånd
    const workplace = user.allowedWorkplaces.find(
      (wp) => wp._id.toString() === workplaceId
    );
    if (!workplace) {
      return res.status(400).json({ message: "Ogiltig arbetsplats" });
    }

    const matchedWP = await WorkPlace.findOne({
      _id: workplace._id,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: location.coordinates },
          $maxDistance: 100,
        },
      },
    });

    if (!matchedWP) {
      return res
        .status(400)
        .json({ message: "Du befinner dig inte på arbetsplatsen." });
    }

    // Uppdatera user position + adress
    user.currentLocation = location;
    user.currentAddress = matchedWP.address;
    await user.save();

    // Avsluta arbetspasset
    clock.clockOutDate = new Date();
    clock.location = location;
    clock.address = matchedWP.address;
    clock.workplace = matchedWP._id;
    await clock.save();

    res.status(200).json(clock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// HÄMTA ALLA PASS FÖR EN USER
export const getUserClocks = async (req, res) => {
  try {
    const { lastFour } = req.params;
    const user = await User.findOne({ lastFour });
    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }

    const clocks = await Clock.find({ user: user._id }).sort({
      clockInDate: -1,
    });
    res.json(clocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
