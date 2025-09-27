import Clock from "../models/Clock.js";
import User from "../models/User.js";

// Clock In
export const clockIn = async (req, res) => {
  try {
    const { lastFour } = req.body;
    const user = await User.findOne({ ssnLastFour: lastFour });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Kontrollera om användaren redan är inloggad
    const activeClock = await Clock.findOne({
      user: user._id,
      clockOutDate: null,
    });
    if (activeClock) {
      return res
        .status(400)
        .json({ message: "Du är redan stämplad in. Stämpla ut först." });
    }

    const clock = await Clock.create({
      user: user._id,
      clockInDate: new Date(),
    });
    res.status(201).json(clock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clock Out
export const clockOut = async (req, res) => {
  try {
    const { lastFour } = req.body;
    const user = await User.findOne({ ssnLastFour: lastFour });

    if (!user) return res.status(404).json({ message: "User not found" });

    const clock = await Clock.findOne({
      user: user._id,
      clockOutDate: null,
    }).sort({
      clockInDate: -1,
    });

    if (!clock) {
      return res.status(400).json({
        message: "Du måste stämpla in först innan du kan stämpla ut.",
      });
    }

    clock.clockOutDate = new Date();
    await clock.save();

    res.status(200).json(clock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hämta alla pass
export const getUserClocks = async (req, res) => {
  try {
    const { lastFour } = req.params;
    const user = await User.findOne({ ssnLastFour: lastFour });

    if (!user)
      return res.status(404).json({ message: "Användare hittades inte" });

    const clocks = await Clock.find({ user: user._id }).sort({
      clockInDate: -1,
    });
    res.json(clocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
