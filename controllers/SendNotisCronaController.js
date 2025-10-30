import cron from "node-cron";
import Machine from "../models/machine.js";
import Apartment from "../models/apartment.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import KeyModel from "../models/key.js";
import { sendPushNotis } from "../controllers/ExpoPushTokenController.js";

/* ===================================
   HJÄLP: Hämta enhetschef + specialare för en unit
=================================== */
const getUnitRecipients = async (unitId) => {
  if (!unitId) return [];
  return await User.find({
    unit: unitId,
    role: { $in: ["Enhetschef", "Specialare", "Lokalvårdare"] },
    isDeleted: false,
  });
};

/* ===================================
   1) MASKINER – PÅMINNELSE
=================================== */
export const sendOverdueMachineNotifications = async () => {
  //   console.log("⏱ Kontrollera överlämnade maskiner...");
  const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

  const overdueMachines = await Machine.find({
    isAvailable: false,
    borrowedDate: { $lte: oneMinuteAgo },
  }).populate([
    { path: "borrowedBy", select: "name expoPushTokens" },
    { path: "unitId", select: "name" },
  ]);

  //   console.log("🧾 Hittade maskiner:", overdueMachines.length);

  for (const machine of overdueMachines) {
    const recipients = [];
    if (machine.borrowedBy) recipients.push(machine.borrowedBy);

    const unitUsers = await getUnitRecipients(machine.unitId?._id);
    recipients.push(...unitUsers);

    for (const user of recipients) {
      if (!user) continue;
      try {
        await sendPushNotis({
          user,
          title: "Påminnelse: Maskin",
          body: `Maskinen "${machine.name}" är fortfarande utlånad, vänligen lämna tillbaka den.`,
        });

        console.log(
          "************************ ============= Maskiner ========================= *************************"
        );

        console.log(
          `📩 Maskin-notis till: ${user.name} – Maskin: "${machine.name}"`
        );
      } catch (err) {
        console.error("Fel vid push-notis:", err);
      }
    }
  }
};

/* ===================================
   2) NYCKLAR – PÅMINNELSE
=================================== */
export const sendOverdueKeyNotifications = async () => {
  //   console.log("⏱ Kontrollera överlämnade nycklar...");
  const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

  const overdueKeys = await KeyModel.find({
    status: "checked-out",
    borrowedAt: { $lte: oneMinuteAgo },
    returnedAt: null,
  }).populate([
    { path: "borrowedBy", select: "name expoPushTokens" },
    { path: "unit", select: "name" },
  ]);

  //   console.log("🧾 Hittade nycklar:", overdueKeys.length);

  for (const key of overdueKeys) {
    const recipients = [];
    if (key.borrowedBy) recipients.push(key.borrowedBy);

    const unitUsers = await getUnitRecipients(key.unit?._id);
    recipients.push(...unitUsers);

    for (const user of recipients) {
      if (!user) continue;
      try {
        await sendPushNotis({
          user,
          title: "Påminnelse: Nyckel",
          body: `Nyckeln "${key.keyLabel}" är fortfarande utlånad, vänligen lämna tillbaka den.`,
        });

        console.log(
          "************************ ============= Nycklar ========================= *************************"
        );

        console.log(
          `📩 Nyckel-notis till: ${user.name} – Nyckel: "${key.keyLabel}"`
        );
      } catch (err) {
        console.error("Fel vid push-notis:", err);
      }
    }
  }
};

/* ===================================
   3) NY FLYTTSTÄDNING PÅ ENHET
=================================== */
export const sendFlyttstadningNotifications = async () => {
  console.log("🏠 Kontrollera nya flyttstäd...");

  const apartments = await Apartment.find({ status: "Ej påbörjat" }).populate([
    { path: "assignedUnit", select: "name" },
  ]);

  console.log("🧾 Hittade flyttstäd:", apartments.length);

  for (const apartment of apartments) {
    const recipients = await getUnitRecipients(apartment.assignedUnit?._id);

    for (const user of recipients) {
      if (!user) continue;
      try {
        await sendPushNotis({
          user,
          title: "Ny Flyttstädning",
          body: `Ny flyttstädning: ${
            apartment.apartmentLocation ||
            apartment.description ||
            "Ingen adress"
          }`,
        });

        console.log(
          "************************ ============= Flyttstädning ========================= *************************"
        );
        console.log(
          `📩 Flyttstäd-notis till: ${user.name}: "${
            apartment.apartmentLocation || apartment.description
          }"`
        );
      } catch (err) {
        console.error("Fel vid push-notis:", err);
      }
    }
  }
};

/* ===================================
   4) MORGONNOTIS – TASKS
=================================== */
export const sendMorningTaskNotification = async () => {
  console.log("🌅 Kontrollera morgonuppgifter...");
  const tasks = await Task.find({ status: "Ej påbörjat" }).populate([
    { path: "unit", select: "name" },
    { path: "createdBy", select: "name expoPushTokens" },
  ]);

  console.log("🧾 Hittade uppgifter:", tasks.length);

  for (const task of tasks) {
    const recipients = [];
    if (task.createdBy) recipients.push(task.createdBy);

    const unitUsers = await getUnitRecipients(task.unit?._id);
    recipients.push(...unitUsers);

    for (const user of recipients) {
      if (!user) continue;
      try {
        await sendPushNotis({
          user,
          title: "Nya Uppgifter Idag",
          body: `Uppgift: "${task.title}" (${task.address || "Ingen adress"})`,
        });

        console.log(
          "************************ ============= Morgonjobb ========================= *************************"
        );

        console.log(
          `📩 Morgonnotis till: ${user.name} – Task: "${task.title}"`
        );
      } catch (err) {
        console.error("Fel vid push-notis:", err);
      }
    }
  }
};

/* ===================================
   CRON SCHEDULES
=================================== */
cron.schedule("* * * * *", async () => {
  console.log("⏱ Kör minutersnotiser...");
  await sendOverdueMachineNotifications();
  await sendOverdueKeyNotifications();
  await sendMorningTaskNotification();
  await sendFlyttstadningNotifications();
});

// cron.schedule("* * * * *", async () => {
//   console.log("🌅 Skickar morgonjobb-notiser...");
//   await sendMorningTaskNotification();
// });

// cron.schedule("* * * * *", async () => {
//   console.log("🏠 Skickar flyttstäd-notiser...");
//   await sendFlyttstadningNotifications();
// });

console.log("✅ Cron-jobb modulen laddad!");
