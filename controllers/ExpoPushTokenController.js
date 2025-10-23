import Expo from "expo-server-sdk";
import User from "../models/user.js";

//Den finns för att kunna hämta befintlig expo token för att sedan kunna skicka notis/påminnelse till en specific användare
export const getPushToken = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId).select("-password");
    const pushToken = user.expoPushToken;
    if (!pushToken) {
      return res
        .status(400)
        .json({ message: "Push token hittades inte i databasen" });
    }

    return res.status(200).json({ message: `Hämtad token: ${pushToken}` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av expo push token" });
  }
};

//Spara Expo push-token i användarens dokument
export const saveExpoPushToken = async (req, res) => {
  const userId = req.user._id;
  const { expoPushToken } = req.body;

  console.log("EXPO PUSH TOKEN", expoPushToken);
  console.log("ID för: Inloggade användare som ska få expo push token", userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Användare med ID ${userId} hittades inte` });
    }

    const updatedUserWithExpoToken = await User.findByIdAndUpdate(userId, {
      expoPushToken,
    });
    return res.status(200).json({
      success: true,
      message: `Användare med ID ${userId} och expo push token ${expoPushToken} har uppdaterats `,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Serverfel vid uppdatering av expoPushToken" });
  }
};

//Skicka en push-notis till en specifik användare via Expo’s push-service

// export const sendPushNotis = async (req, res) => {
//   const { userId } = req.body;
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "Användare hittades inte" });
//     }

//     console.log(
//       "Användare med push-notis token från ExpoPushTokenContoller:",
//       user
//     );
//     const expoPushToken = user.expoPushToken;

//     if (!expoPushToken || !Expo.isExpoPushToken(expoPushToken)) {
//       return res
//         .status(400)
//         .json({ message: "Ogiltig eller saknad Expo push-token" });
//     }
//     const expoClient = new Expo();
//     const message = {
//       to: expoPushToken,
//       title: title || "Ny notis",
//       body: body || "Du har ett nytt meddelande",
//       sound: "default",
//       data: data || {},
//     };
//     const tickets = await expoClient.sendPushNotificationsAsync([message]);

//     return res
//       .status(200)
//       .json({ success: true, message: "Push-notis skickad", tickets });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Serverfel när push-notis skulle skickas" });
//   }
// };

// Intern funktion för att skicka push-notis till en specifik användare
export const sendPushNotis = async ({ userId, title, body, data = {} }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Användare hittades inte");

  const expoPushToken = user.expoPushToken;
  if (!expoPushToken || !Expo.isExpoPushToken(expoPushToken)) {
    throw new Error("Ogiltig eller saknad Expo push-token");
  }

  const expoClient = new Expo();
  const message = {
    to: expoPushToken,
    title,
    body,
    sound: "default",
    data,
  };

  const tickets = await expoClient.sendPushNotificationsAsync([message]);
  return tickets; // Returnerar tickets så du kan logga eller felsöka
};
