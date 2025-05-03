import { Unit } from "../models/unit.js";
import Specialist from "../models/specialist.js";
import Task from "../models/task.js";

// Help functions

//Hämta units med specialist och task

const getTask = async () => {
  const unassignedTasks = await Task.find({
    unit: null,
    completed: "Ej påbörjat",
  });
  return unassignedTasks;
};

const getUnitsWithChildren = async (res) => {
  try {
    const units = await Unit.find().populate("specialister tasks");
    const unassignedTasks = await getTask();

    if (unassignedTasks.length === 0) {
      const msg = "Inga uppgifter att fördela";
      if (res) return res.status(200).json({ units, unassignedTasks: [] });
      console.log(msg);
      return { units: [], unassignedTasks: [] }; // Se till att returnera här
    }

    return { units, unassignedTasks }; // Returnera enheterna och uppgifterna
  } catch (error) {
    console.error("Fel vid hämtning av enheter:", error); // Logga felmeddelandet
    if (res) {
      return res
        .status(500)
        .json({ message: "Fel vid hämtning av enheter", error: error.message });
    }
    return { units: [], unassignedTasks: [] };
  }
};

//Fördela arbeten automatiskt
export const autoAssignMorningTasks = async (req = null, res = null) => {
  try {
    // Destrukturera units och unassignedTasks från getUnitsWithChildren
    const { units, unassignedTasks } = await getUnitsWithChildren(res);

    // Om inga uppgifter finns, returnera direkt med ett meddelande
    if (unassignedTasks.length === 0) {
      const msg = "Inga uppgifter att fördela";
      if (res) return res.status(200).json({ message: msg });
      console.log(msg);
      return;
    }

    const unitInfos = await Promise.all(
      units.map(async (unit) => {
        const activeSpecialists = await Specialist.find({
          _id: { $in: unit.specialister },
          isAbsent: false,
        });

        let maxTasks = 0;
        if (activeSpecialists.length === 1) {
          maxTasks = 2;
        } else if (activeSpecialists.length >= 2) {
          maxTasks = 3;
        }

        const activeTasks = unit.tasks.filter(
          (t) => t.completed !== "Färdigt" && t.completed !== "Påbörjat"
        );

        return {
          unit,
          currentTasks: activeTasks.length,
          maxTasks,
          assigned: 0,
        };
      })
    );

    let taskIndex = 0;
    let assignedInRound = true;

    while (assignedInRound && taskIndex < unassignedTasks.length) {
      assignedInRound = false;

      const eligibleUnits = unitInfos
        .filter((u) => u.currentTasks + u.assigned < u.maxTasks)
        .sort((a, b) => {
          const totalA = a.currentTasks + a.assigned;
          const totalB = b.currentTasks + b.assigned;
          if (totalA !== totalB) return totalA - totalB;
          return Math.random() - 0.5;
        });

      for (const u of eligibleUnits) {
        if (taskIndex >= unassignedTasks.length) break;

        const task = unassignedTasks[taskIndex];
        task.unit = u.unit._id;
        await task.save();
        u.unit.tasks.push(task._id);
        u.assigned++;
        taskIndex++;
        assignedInRound = true;
      }
    }

    for (const u of unitInfos) {
      if (u.assigned > 0) await u.unit.save();
    }

    const assignmentLog = unitInfos
      .filter((u) => u.assigned > 0)
      .map((u) => ({
        enhet: u.unit.name,
        tilldeladeUppgifter: u.assigned,
        totaltEfter: u.currentTasks + u.assigned,
        maxTillåtna: u.maxTasks,
      }));

    const responseData = {
      message: "Uppgifter tilldelades tills inga fler kunde delas ut.",
      totaltTilldelade: taskIndex,
      fördelning: assignmentLog,
    };

    if (res) {
      return res.status(200).json(responseData);
    } else {
      console.log("[CRON]:", responseData);
    }
  } catch (error) {
    console.error("Fel vid uppgiftsfördelning:", error);
    if (res) {
      return res
        .status(500)
        .json({ message: "Internt serverfel vid uppgiftsfördelning" });
    }
  }
};

//Fördela arbeten automatiskt
// export const autoAssignMorningTasks = async (req = null, res = null) => {
//   try {
//     const units = await getUnitsWithChildren(res);
//     const unitInfos = await Promise.all(
//       units.map(async (unit) => {
//         const activeSpecialists = await Specialist.find({
//           _id: { $in: unit.specialister },
//           isAbsent: false,
//         });

//         let maxTasks = 0;
//         if (activeSpecialists.length === 1) {
//           maxTasks = 2;
//         } else if (activeSpecialists.length >= 2) {
//           maxTasks = 3;
//         }

//         const activeTasks = unit.tasks.filter(
//           (t) => t.completed !== "Färdigt" && t.completed !== "Påbörjat"
//         );

//         return {
//           unit,
//           currentTasks: activeTasks.length,
//           maxTasks,
//           assigned: 0,
//         };
//       })
//     );

//     let taskIndex = 0;
//     let assignedInRound = true;

//     while (assignedInRound && taskIndex < unassignedTasks.length) {
//       assignedInRound = false;

//       const eligibleUnits = unitInfos
//         .filter((u) => u.currentTasks + u.assigned < u.maxTasks)
//         .sort((a, b) => {
//           const totalA = a.currentTasks + a.assigned;
//           const totalB = b.currentTasks + b.assigned;
//           if (totalA !== totalB) return totalA - totalB;
//           return Math.random() - 0.5;
//         });

//       for (const u of eligibleUnits) {
//         if (taskIndex >= unassignedTasks.length) break;

//         const task = unassignedTasks[taskIndex];
//         task.unit = u.unit._id;
//         await task.save();
//         u.unit.tasks.push(task._id);
//         u.assigned++;
//         taskIndex++;
//         assignedInRound = true;
//       }
//     }

//     for (const u of unitInfos) {
//       if (u.assigned > 0) await u.unit.save();
//     }

//     const assignmentLog = unitInfos
//       .filter((u) => u.assigned > 0)
//       .map((u) => ({
//         enhet: u.unit.name,
//         tilldeladeUppgifter: u.assigned,
//         totaltEfter: u.currentTasks + u.assigned,
//         maxTillåtna: u.maxTasks,
//       }));

//     const responseData = {
//       message: "Uppgifter tilldelades tills inga fler kunde delas ut.",
//       totaltTilldelade: taskIndex,
//       fördelning: assignmentLog,
//     };

//     if (res) {
//       return res.status(200).json(responseData);
//     } else {
//       console.log("[CRON]:", responseData);
//     }
//   } catch (error) {
//     console.error("Fel vid uppgiftsfördelning:", error);
//     if (res) {
//       return res
//         .status(500)
//         .json({ message: "Internt serverfel vid uppgiftsfördelning" });
//     }
//   }
// };
