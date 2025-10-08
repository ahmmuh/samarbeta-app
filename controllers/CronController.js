import Unit from "../models/unit.js";
import Task from "../models/task.js";

export const autoAssignTasks = async () => {
  try {
    const units = await Unit.find();
    const unassignedTasks = await Task.find({
      status: "Ej påbörjat",
      unit: null,
    }).sort({ createdAt: 1 }); // FIFO – äldst först

    if (unassignedTasks.length === 0) {
      console.log("✅ Inga uppgifter kvar att fördela.");
      return;
    }

    let totalAssigned = 0;

    for (const unit of units) {
      const currentTasks = await Task.find({
        unit: unit._id,
        status: { $in: ["Ej påbörjat", "Påbörjat"] }, // 🔹 ändrat "Pågår" → "Påbörjat"
      });

      // 🧩 Om enheten har mindre än 3 aktiva uppgifter, tilldela nya
      while (currentTasks.length < 3 && unassignedTasks.length > 0) {
        const nextTask = unassignedTasks.shift();
        await Task.findByIdAndUpdate(nextTask._id, {
          unit: unit._id,
          status: "Ej påbörjat",
        });
        currentTasks.push(nextTask);
        totalAssigned++;

        console.log(
          `🟢 Tilldelade uppgift ${nextTask._id} till enhet ${unit.name}. Totalt nu: ${currentTasks.length}`
        );
      }
    }

    if (totalAssigned === 0) {
      console.log("⚠️ Alla enheter har redan 3 uppgifter.");
    } else {
      console.log(`✅ Totalt ${totalAssigned} uppgifter tilldelades.`);
    }
  } catch (err) {
    console.error("❌ Fel vid fördelning:", err.message);
  }
};

// export const autoAssignTasks = async () => {
//   try {
//     const units = await Unit.find();
//     const unassignedTasks = await Task.find({
//       status: "Ej påbörjat",
//       unit: null,
//     }).sort({ createdAt: 1 });

//     if (unassignedTasks.length === 0) {
//       console.log("Inga uppgifter kvar att fördela.");
//       return;
//     }

//     let totalAssigned = 0;

//     for (const unit of units) {
//       const currentTasks = await Task.find({
//         unit: unit._id,
//         status: "Ej påbörjat",
//       });

//       // Om enheten har färre än 3 uppgifter, ge en till
//       if (currentTasks.length < 3) {
//         const nextTask = unassignedTasks.shift();
//         if (!nextTask) break;

//         await Task.findByIdAndUpdate(nextTask._id, { unit: unit._id });

//         totalAssigned++;
//         console.log(
//           `Tilldelade 1 uppgift till enhet ${unit.name}. Totalt: ${
//             currentTasks.length + 1
//           }`
//         );
//       }
//     }

//     if (totalAssigned === 0) {
//       console.log(
//         "Alla enheter har redan 3 uppgifter. Väntar på att någon blir klar."
//       );
//     }
//   } catch (err) {
//     console.error("Fel vid fördelning:", err.message);
//   }
// };
