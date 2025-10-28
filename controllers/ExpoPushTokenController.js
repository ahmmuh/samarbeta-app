import * as ExpoServerSdk from "expo-server-sdk";
import User from "../models/user.js";

const { isExpoPushToken, sendPushNotificationsAsync } = ExpoServerSdk;

/* =========================================
   Hämta Expo push-tokens för en användare
========================================= */
export const getPushTokens = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user || !user.expoPushTokens || user.expoPushTokens.length === 0) {
      return res
        .status(400)
        .json({ message: "Push tokens hittades inte i databasen" });
    }

    return res.status(200).json({
      message: `Hämtade tokens: ${user.expoPushTokens}`,
      tokens: user.expoPushTokens,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av Expo push tokens" });
  }
};

/* =========================================
   Spara Expo push-token för användare
   Stödjer flera enheter
========================================= */
export const saveExpoPushToken = async (req, res) => {
  const userId = req.user._id;
  const { expoPushToken } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Användare med ID ${userId} hittades inte` });
    }

    // Om det finns gammalt fält som sträng, flytta in det i arrayen
    if (user.expoPushToken) {
      if (!user.expoPushTokens) user.expoPushTokens = [];
      if (!user.expoPushTokens.includes(user.expoPushToken)) {
        user.expoPushTokens.push(user.expoPushToken);
      }
      user.expoPushToken = undefined; // ta bort gamla strängen
    }

    // Skapa array om den inte finns
    if (!user.expoPushTokens) user.expoPushTokens = [];

    // Lägg bara till token om den inte redan finns
    if (!user.expoPushTokens.includes(expoPushToken)) {
      user.expoPushTokens.push(expoPushToken);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Push token ${expoPushToken} har lagts till för användare ${userId}`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Serverfel vid uppdatering av Expo push tokens" });
  }
};

/* =========================================
   Intern funktion för att skicka push-notiser
   till alla tokens för en användare
========================================= */
export const sendPushNotis = async ({ user, title, body, data = {} }) => {
  if (!user) throw new Error("Användare hittades inte");

  const tokens = user.expoPushTokens || [];

  if (tokens.length === 0) {
    console.log(`⚠️ Ingen expoPushToken för användare ${user.name}`);
    return;
  }

  const messages = tokens
    .filter((t) => isExpoPushToken(t))
    .map((token) => ({
      to: token,
      title,
      body,
      sound: "default",
      data,
    }));

  if (messages.length === 0) {
    console.log(`⚠️ Inga giltiga Expo-tokens för ${user.name}`);
    return;
  }

  try {
    const tickets = await sendPushNotificationsAsync(messages);
    console.log(`✅ Push-notiser skickade till ${user.name}`);
    return tickets;
  } catch (err) {
    console.error("Fel vid skickande av push-notis:", err);
  }
};
