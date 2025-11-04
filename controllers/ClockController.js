import { getGreetingMessage } from "../helperFunction/greetings.js";
import Clock from "../models/clock.js";
import User from "../models/user.js";
import WorkPlace from "../models/workPlace.js";

// Clock in
export const clockIn = async (req, res) => {
  try {
    // const now = new Date();
    // const hour = now.getHours();

    // if (hour >= 15) {
    //   return res.status(400).json({
    //     isError: true,
    //     message: "Kan ej stämpla in efter 15:00",
    //   });
    // }

    const { lastFour, location } = req.body;

    console.log("Client coords:", location.coordinates);

    if (!location?.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        isError: true,
        message: "Ogiltig platsdata",
      });
    }

    const user = await User.findOne({ lastFour }).populate(
      "assignedWorkplaces"
    );
    if (!user) {
      return res.status(404).json({
        isError: true,
        message: "Denna användare hittades inte",
      });
    }

    // Kolla om user redan är inne
    const activeClock = await Clock.findOne({
      user: user._id,
      clockOutDate: null,
    });
    if (activeClock) {
      return res.status(400).json({
        isError: true,
        message: "Du är redan stämplad in.",
      });
    }

    // Hitta en arbetsplats inom 100 m som användaren är kopplad till
    const assignedWPs = user.assignedWorkplaces || [];
    const matchedWP = await WorkPlace.findOne({
      _id: { $in: assignedWPs.map((wp) => wp._id) },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: location.coordinates },
          $maxDistance: 500,
        },
      },
    });

    if (!matchedWP) {
      return res.status(400).json({
        isError: true,
        message: "Du är inte på rätt plats för att stämpla in.",
      });
    }

    // Uppdatera user position + adress
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

    const populatedClock = await Clock.findById(clock._id).populate(
      "user",
      "name"
    );
    const greetingMessage = getGreetingMessage(true, user.name, new Date());

    res.status(201).json({
      isError: false,
      clock: populatedClock,
      name: populatedClock.user.name,
      message: greetingMessage,
    });
  } catch (error) {
    res.status(500).json({
      isError: true,
      message: error.message,
    });
  }
};

// Clock out
export const clockOut = async (req, res) => {
  try {
    const { lastFour, location } = req.body;

    if (!location?.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        isError: true,
        message: "Ogiltig platsdata",
      });
    }

    const user = await User.findOne({ lastFour }).populate(
      "assignedWorkplaces"
    );
    if (!user) {
      return res.status(404).json({
        isError: true,
        message: "Denna användare hittades inte",
      });
    }

    const clock = await Clock.findOne({
      user: user._id,
      clockOutDate: null,
    }).sort({ clockInDate: -1 });

    if (!clock) {
      return res.status(400).json({
        isError: true,
        message: "Du måste stämpla in först",
      });
    }

    // Hitta arbetsplats som är nära användarens position
    const matchedWP = await WorkPlace.findOne({
      _id: { $in: user.assignedWorkplaces.map((wp) => wp._id) },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: location.coordinates },
          $maxDistance: 500, // inom 100 m
        },
      },
    });

    if (!matchedWP) {
      return res.status(400).json({
        isError: true,
        message: "Du är inte på rätt plats för att stämpla ut.",
      });
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

    const populatedClock = await Clock.findById(clock._id).populate(
      "user",
      "name"
    );

    const greetingMessage = getGreetingMessage(false, user.name, new Date());

    res.status(200).json({
      isError: false,
      populatedClock,
      clock,
      name: user.name,
      message: greetingMessage,
    });
  } catch (error) {
    res.status(500).json({
      isError: true,
      message: error.message,
    });
  }
};

// Hämta användarens pass
export const getUserClocks = async (req, res) => {
  try {
    const { lastFour } = req.params;

    const user = await User.findOne({ lastFour });
    if (!user) {
      return res.status(404).json({
        isError: true,
        message: "Användare hittades inte",
      });
    }

    const clocks = await Clock.find({ user: user._id })
      .sort({ clockInDate: -1 })
      .populate("workplace", "name address");

    res.json({ isError: false, clocks });
  } catch (error) {
    res.status(500).json({
      isError: true,
      message: error.message,
    });
  }
};

// Hämta alla användares pass summerat per dag
export const getAllUserClocks = async (req, res) => {
  try {
    const dailySummaryAll = await Clock.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $addFields: {
          dateOnly: {
            $dateToString: { format: "%Y-%m-%d", date: "$clockInDate" },
          },
        },
      },
      {
        $group: {
          _id: { date: "$dateOnly", userId: "$user._id" },
          totalMinutes: { $sum: "$totalMinutes" },
          clocks: {
            $push: {
              clockInDate: "$clockInDate",
              clockOutDate: "$clockOutDate",
              totalMinutes: "$totalMinutes",
              workplace: "$workplace",
            },
          },
          userName: { $first: "$user.name" },
        },
      },
      { $sort: { "_id.date": 1, userName: 1 } },
    ]);

    // Populera arbetsplatsnamn för varje pass
    for (const day of dailySummaryAll) {
      for (const clock of day.clocks) {
        if (clock.workplace) {
          const wp = await WorkPlace.findById(clock.workplace).select(
            "name address"
          );
          clock.workplace = wp ? `${wp.name}, ${wp.address}` : "";
        }
      }
    }

    // Formatera totalMinutes till timmar + minuter
    const formattedSummary = dailySummaryAll.map((day) => {
      const hours = Math.floor(day.totalMinutes / 60);
      const minutes = day.totalMinutes % 60;
      return {
        user: day.userName,
        date: day._id.date,
        totalTime: `${hours}h ${minutes}m`,
        clocks: day.clocks,
      };
    });

    res.json({ isError: false, dailySummary: formattedSummary });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isError: true,
      message: error.message,
    });
  }
};
