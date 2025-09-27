import Clock from "../models/Clock.js";
import User from "../models/User.js";

// Hjälpfunktion för att räkna avstånd mellan två punkter (Haversine formula)
const getDistanceInMeters = (coords1, coords2) => {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  const toRad = (v) => (v * Math.PI) / 180;

  const R = 6371000; // jordens radie i meter
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // avstånd i meter
};

// CLOCK IN
export const clockIn = async (req, res) => {
  try {
    const { lastFour, location } = req.body;
    if (!location?.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ message: "Ogiltig platsdata" });
    }

    const user = await User.findOne({ lastFour });
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

    // Kontrollera att platsen ligger inom allowedWorkplaces
    const isAllowed = user.allowedWorkplaces.some((wp) => {
      if (!wp.location?.coordinates) return false;
      const distance = getDistanceInMeters(
        location.coordinates,
        wp.location.coordinates
      );
      return distance <= 100; // t.ex. 100 meter tolerans
    });

    if (!isAllowed) {
      return res
        .status(400)
        .json({ message: "Du jobbar inte på den här adressen." });
    }

    // Uppdatera användarens nuvarande position
    user.currentLocation = location;
    user.currentAddress =
      user.allowedWorkplaces.find((wp) => {
        const distance = getDistanceInMeters(
          location.coordinates,
          wp.location.coordinates
        );
        return distance <= 100;
      })?.address || "";
    await user.save();

    // Skapa clock-in
    const clock = await Clock.create({
      user: user._id,
      clockInDate: new Date(),
      address: user.currentAddress,
      location: location,
    });

    res.status(201).json(clock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLOCK OUT
export const clockOut = async (req, res) => {
  try {
    const { lastFour, location } = req.body;

    if (!location?.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ message: "Ogiltig platsdata" });
    }

    const user = await User.findOne({ lastFour });
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

    // Uppdatera användarens nuvarande position
    user.currentLocation = location;

    // Hitta närmaste allowedWorkplace för att sätta address
    const closestWP = user.allowedWorkplaces.reduce((closest, wp) => {
      if (!wp.location?.coordinates) return closest;
      const distance = getDistanceInMeters(
        location.coordinates,
        wp.location.coordinates
      );
      if (distance <= 100 && (!closest || distance < closest.distance)) {
        return { wp, distance };
      }
      return closest;
    }, null);

    user.currentAddress = closestWP?.wp.address || user.currentAddress;
    await user.save();

    // Spara clock-out
    clock.clockOutDate = new Date();
    clock.location = location;
    clock.address = user.currentAddress;

    await clock.save();

    res.status(200).json(clock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// HÄMTA ALLA PASS
export const getUserClocks = async (req, res) => {
  try {
    const { lastFour } = req.params;
    const user = await User.findOne({ lastFour });
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
