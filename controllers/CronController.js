import Unit from "../models/unit.js";
import Task from "../models/task.js";
import Specialist from "../models/specialist.js";

export const autoAssignTasks = async () => {
  try {
    const units = await Unit.find().populate("specialister");
    const unassignedTasks = await Task.find({
      completed: "Ej påbörjat",
      unit: null,
    }).sort({ createdAt: 1 });

    if (unassignedTasks.length === 0) {
      console.log("Inga uppgifter kvar att fördela.");
      return;
    }

    let totalAssigned = 0;

    for (const unit of units) {
      const currentTasks = await Task.find({
        unit: unit._id,
        completed: "Ej påbörjat",
      });

      // Om enheten har färre än 3 uppgifter, ge en till
      if (currentTasks.length < 3) {
        const nextTask = unassignedTasks.shift();
        if (!nextTask) break;

        await Task.findByIdAndUpdate(nextTask._id, { unit: unit._id });

        totalAssigned++;
        console.log(
          `Tilldelade 1 uppgift till enhet ${unit.name}. Totalt: ${
            currentTasks.length + 1
          }`
        );
      }
    }

    if (totalAssigned === 0) {
      console.log(
        "Alla enheter har redan 3 uppgifter. Väntar på att någon blir klar."
      );
    }
  } catch (err) {
    console.error("Fel vid fördelning:", err.message);
  }
};
