// get alla taskska via unit

import Task from "../models/task.js";
import { Unit } from "../models/unit.js";

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
// update status för task

// export const taskStarted = async (req, res) => {
//   try {
//     const { unitId, taskId } = req.params;
//     if (!unitId || !taskId) {
//       console.log(`The unit med ${unitId} OR ${taskId} not found`);
//     }
//     const unit = await Unit.findById(unitId);

//   } catch (error) {}
// };
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

    console.log("UnidID & taskId i updateTask function", unitId, taskId);

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
