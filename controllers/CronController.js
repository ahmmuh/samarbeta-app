import Unit from "../models/unit.js";
import Task from "../models/task.js";

// export const autoAssignTasks = async () => {
//   try {
//     const units = await Unit.find();
//     const unassignedTasks = await Task.find({
//       status: "Ej påbörjat",
//       unit: null,
//     }).sort({ createdAt: 1 });

//     if (unassignedTasks.length === 0) {
//       console.log("✅ Inga uppgifter kvar att fördela.");
//       return;
//     }

//     let totalAssigned = 0;

//     for (const unit of units) {
//       const currentTasks = await Task.find({
//         unit: unit._id,
//         status: { $in: ["Ej påbörjat", "Påbörjat"] },
//       });

//       // 🧩 Om enheten har mindre än 3 aktiva uppgifter, tilldela nya
//       while (currentTasks.length < 3 && unassignedTasks.length > 0) {
//         const nextTask = unassignedTasks.shift();
//         await Task.findByIdAndUpdate(nextTask._id, {
//           unit: unit._id,
//           status: "Ej påbörjat",
//         });
//         currentTasks.push(nextTask);
//         totalAssigned++;

//         console.log(
//           `🟢 Tilldelade uppgift ${nextTask._id} till enhet ${unit.name}. Totalt nu: ${currentTasks.length}`
//         );
//       }
//     }

//     if (totalAssigned === 0) {
//       console.log("⚠️ Alla enheter har redan 3 uppgifter.");
//     } else {
//       console.log(`✅ Totalt ${totalAssigned} uppgifter tilldelades.`);
//     }
//   } catch (err) {
//     console.error("❌ Fel vid fördelning:", err.message);
//   }
// };

//Ny kod för auto tilldelning

/**
 * Tilldelar uppgifter till enheter i rund-robin,
 * max 3 aktiva uppgifter per enhet.
 * När alla enheter har 3 uppgifter, väntar systemet
 * tills någon uppgift markeras som klar (status: "Klar").
 */
export const autoAssignTasks = async () => {
  try {
    const units = await Unit.find();
    const unassignedTasks = await Task.find({
      status: "Ej påbörjat",
      unit: null,
    }).sort({ createdAt: 1 });

    if (unassignedTasks.length === 0) {
      console.log("✅ Inga uppgifter kvar att fördela.");
      return;
    }

    let unitIndex = 0; // starta från första enheten
    let totalAssigned = 0;

    for (const task of unassignedTasks) {
      let assigned = false;
      let attempts = 0;

      // Hitta nästa enhet som kan ta emot uppgift (<3 aktiva)
      while (!assigned && attempts < units.length) {
        const unit = units[unitIndex];

        const activeTasks = await Task.countDocuments({
          unit: unit._id,
          status: { $in: ["Ej påbörjat", "Påbörjat"] },
        });

        if (activeTasks < 3) {
          // Tilldela uppgiften
          await Task.findByIdAndUpdate(task._id, {
            unit: unit._id,
            status: "Ej påbörjat",
          });

          console.log(
            `🟢 Tilldelade uppgift ${task._id} till enhet ${unit.name}`
          );
          totalAssigned++;
          assigned = true;
        }

        // Gå till nästa enhet (rund-robin)
        unitIndex = (unitIndex + 1) % units.length;
        attempts++;
      }

      // Om ingen enhet kan ta emot uppgift → stoppa
      if (!assigned) {
        console.log(
          "⚠️ Alla enheter har redan 3 uppgifter. Väntar på att någon uppgift markeras som färdig."
        );
        break;
      }
    }

    console.log(`✅ Totalt ${totalAssigned} uppgifter tilldelades.`);
  } catch (err) {
    console.error("❌ Fel vid fördelning:", err.message);
  }
};
