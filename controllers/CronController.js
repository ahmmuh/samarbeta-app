import Unit from "../models/unit.js";
import Task from "../models/task.js";
import Specialist from "../models/specialist.js";

export const autoAssignTasks = async (req = null, res = null) => {
  try {
    // Hämta alla enheter och deras aktiva specialister
    const units = await Unit.find().populate("specialister");
    const changeLog = [];

    // Samla information om varje enhet
    const unitDetails = await Promise.all(
      units.map(async (unit) => {
        const activeSpecialists = await Specialist.find({
          _id: { $in: unit.specialister.map((s) => s._id) },
          isAbsent: false,
        });

        // Hämta både pågående och färdiga uppgifter
        const currentTasks = await Task.find({
          unit: unit._id,
          completed: "Ej påbörjat",
        });
        // console.log("Alla currentTasks", currentTasks);

        const completedTasks = await Task.find({
          unit: unit._id,
          completed: "Färdigt",
        });

        return {
          unit,
          activeSpecialistsCount: activeSpecialists.length,
          currentTaskCount: currentTasks.length,
          completedTaskCount: completedTasks.length,
          maxAllowedTasks: activeSpecialists.length === 1 ? 2 : 3, // 2 för en specialist, 3 för två
        };
      })
    );

    // Hämta alla ej påbörjade uppgifter
    const unassignedTasks = await Task.find({
      completed: "Ej påbörjat",
      unit: null,
    }).sort({ createdAt: 1 });

    // Fördela uppgifter
    for (const task of unassignedTasks) {
      // Uppdatera enheternas aktuella uppgiftsantal baserat på färdiga uppgifter
      const eligibleUnit = unitDetails
        .filter((info) => {
          // Kontrollera max uppgifter baserat på antal specialister
          const maxTasks = info.activeSpecialistsCount === 1 ? 2 : 3;
          return info.currentTaskCount < maxTasks;
        })
        .sort((a, b) => a.currentTaskCount - b.currentTaskCount)[0];

      if (eligibleUnit) {
        await Task.findByIdAndUpdate(task._id, {
          unit: eligibleUnit.unit._id,
        });

        eligibleUnit.currentTaskCount++;

        changeLog.push({
          taskId: task._id,
          unitName: eligibleUnit.unit.name,
          currentTaskCount: eligibleUnit.currentTaskCount,
          maxTasks: eligibleUnit.maxAllowedTasks,
          specialistsCount: eligibleUnit.activeSpecialistsCount,
        });
      }
    }

    // Kontrollera färdiga uppgifter och omfördela
    for (const unitInfo of unitDetails) {
      const completedTasks = await Task.find({
        unit: unitInfo.unit._id,
        completed: "Färdigt",
      });

      if (
        completedTasks.length > 0 &&
        unitInfo.currentTaskCount < unitInfo.maxAllowedTasks
      ) {
        // Hitta en ny uppgift att tilldela
        const newTask = await Task.findOne({
          completed: "Ej påbörjat",
          unit: null,
        });

        if (newTask) {
          await Task.findByIdAndUpdate(newTask._id, {
            unit: unitInfo.unit._id,
          });

          unitInfo.currentTaskCount++;

          changeLog.push({
            taskId: newTask._id,
            unitName: unitInfo.unit.name,
            currentTaskCount: unitInfo.currentTaskCount,
            maxTasks: unitInfo.maxAllowedTasks,
            specialistsCount: unitInfo.activeSpecialistsCount,
            replacingCompletedTask: true,
          });
        }
      }
    }

    if (changeLog.length > 0) {
      // console.log("Fördelning slutförd:", changeLog);
    }

    if (res) {
      return res.status(200).json({
        message:
          changeLog.length > 0
            ? "Uppgifter har fördelats"
            : "Inga nya uppgifter att fördela",
        changes: changeLog,
      });
    }
  } catch (error) {
    console.error("Fel vid fördelning:", error);
    if (res) {
      return res.status(500).json({
        message: "Ett fel uppstod vid fördelning av uppgifter",
        error: error.message,
      });
    }
  }
};
