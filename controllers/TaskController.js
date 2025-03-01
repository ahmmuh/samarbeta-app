// get alla taskska via unit

import Task from "../models/task.js";
import { Unit } from "../models/unit.js";

//Ny task (EJ UPDATE)
export const addTaskToUnit = async (req, res) => {
  const { unitId } = req.params;

  try {
    const { title, description, completed } = req.body;
    console.log("Tasks from body", req.body);

    const unit = await Unit.findById(unitId);
    if (!unit)
      return res
        .status(400)
        .json({ message: "Enheten finns inte i databasen!" });
    console.log("unitId", unitId);
    const newTask = new Task({ title, description, completed });
    console.log("The new task with COMPLETED FUNCTION", newTask);
    await newTask.save();
    unit.tasks.push(newTask._id);
    console.log("New task", unit);
    unit.save();
    res.status(200).json({ message: "En task har lagts till enheten" });
  } catch (error) {
    console.log("Error ", error.message);
    return res.status(500).json({ Message: "Error", error });
  }
};
//assign task to unit
export const assignTaskToUnit = async (req, res) => {
  try {
    const { taskId, unitId } = req.params;
    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(404).json({
        message:
          "Det går inte att tilldela en uppgift med någon enhet som inte finns",
      });
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task finns inte" });
    }
    task.unit = unitId;
    await task.save();
    return res.status(200).json({
      message: `Enhet med ID ${unitId} har tagit på sig en task med ID ${taskId} `,
    });
  } catch (error) {
    console.error("Server error vid tilldelning av uppgift:", error);
    return res.status(500).json({ message: "Internt serverfel" });
  }
};
export const getAllTasks = async (req, res) => {
  try {
    const { unitId } = req.params;
    const tasks = await Unit.findById(unitId).populate("tasks");
    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

//fixa sen
export const updateTask = async (req, res) => {
  try {
    const { unitId, taskId } = req.params;

    console.log("UnitID & taskId i updateTask function", unitId, taskId);

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(400).json({ message: "Enheten finns inte" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task finns inte" });

    if (Object.keys(req.body).length === 0) {
      return res.status(404).json({ message: "Inga uppdateringar skickades" });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getTask = async (req, res) => {
  try {
    const { taskId, unitId } = req.params;

    const unit = await Unit.findById(unitId).populate("tasks");
    if (!unit) return res.status(400).json({ message: "Enhet noy found" });

    const task = unit.tasks.find((t) => t._id.toString() === taskId);
    if (!task) return res.status(400).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskStatuses = async (req, res) => {
  const { unitId } = req.params;
  console.log("UNIT ID in getTaskStatuses");
  try {
    const unit = await Unit.findById(unitId).populate("tasks");
    if (!unit) {
      return res.status(404).json({ message: "Enheten hittades inte" });
    }

    const statuses = [...new Set(unit.tasks.map((task) => task.completed))];

    if (statuses.length === 0) {
      return res.status(404).json({ message: "Ingen statusar hittades" });
    }
    res.status(200).json(statuses);
  } catch (error) {
    console.warn(`Error Message: ${error.message}`);
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId, unitId } = req.params;
  try {
    const unit = await Unit.findById(unitId).populate("tasks");
    if (!unit) return res.status(400).json({ message: "Enhet hittades inte" });

    const updatedTasks = unit.tasks.filter((t) => t._id.toString() !== taskId);
    unit.tasks = updatedTasks;
    await unit.save();
    return res
      .status(200)
      .json({ message: "Deleted task", tasks: updatedTasks });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
