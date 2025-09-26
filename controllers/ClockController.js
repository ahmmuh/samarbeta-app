import Clock from "../models/Clock.js";
import User from "../models/User.js";

// Clock In med sista 4 siffror i personnummer
export const clockIn = async (req, res) => {
  try {
    const { lastFour } = req.body; // sista 4 siffror

    const user = await User.findOne({ ssnLastFour: lastFour }); // anta fält ssnLastFour i User
    if (!user) return res.status(404).json({ message: "User not found" });

    const clock = await Clock.create({ user: user._id, in: new Date() });
    res.status(201).json(clock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clock Out med sista 4 siffror
export const clockOut = async (req, res) => {
  try {
    const { lastFour } = req.body;

    const user = await User.findOne({ ssnLastFour: lastFour });
    if (!user) return res.status(404).json({ message: "User not found" });

    const clock = await Clock.findOne({ user: user._id, out: null }).sort({
      in: -1,
    });
    if (!clock)
      return res.status(400).json({ message: "No active clock-in found" });

    clock.out = new Date();
    await clock.save();

    res.status(200).json(clock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hämta alla pass med sista 4 siffror
export const getUserClocks = async (req, res) => {
  try {
    const { lastFour } = req.params;
    const user = await User.findOne({ ssnLastFour: lastFour });
    if (!user) return res.status(404).json({ message: "User not found" });

    const clocks = await Clock.find({ user: user._id }).sort({ in: -1 });
    res.json(clocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
