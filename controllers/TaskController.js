// get alla taskska via unit

import Task from "../models/task.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";

//Add task to task list (utan enhet)
export const addTask = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  console.log("Logged användare - i addTask()", user);

  if (!user || !user.unit) {
    return res.status(400).json({ message: "Användaren saknar enhet" });
  }

  const { title, description, location } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({
      message:
        "Det saknas en eller fler av följande: title, description, location",
    });
  }
  try {
    const newTask = new Task({
      title,
      description,
      location,
      unit: user.unit,
      createdBy: user._id,
    });
    await newTask.save();
    console.log("NEW TASK", newTask);
    return res.status(200).json(newTask);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Serverfel vid skapande av ny task utan enhet" });
  }
};

//Ny task (EJ UPDATE)
export const addTaskToUnit = async (req, res) => {
  const { unitId } = req.params;

  try {
    const { title, description, location, status } = req.body;
    console.log("Tasks from body", req.body);

    const unit = await Unit.findById(unitId);
    if (!unit)
      return res
        .status(400)
        .json({ message: "Enheten finns inte i databasen!" });
    console.log("unitId", unitId);
    const newTask = new Task({ title, description, location, status });
    console.log("The new task with status FUNCTION", newTask);
    await newTask.save();
    unit.tasks.push(newTask._id);
    console.log("New task", unit);
    await unit.save();
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
    const { status } = req.body;
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

    if (status) {
      task.status = status;
    }
    unit.tasks.push(task);
    await unit.save();
    console.log("TASK WICH WILL BE UPDATED IN THE DATABASE IS: ", task);
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
  console.log("Called getToken när jag använder api/tasks");
  console.log("Token i cookies: api/tasks", req.cookies.token);
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;

  console.log("Task ID i updateTask from backend", req.body);

  if (!taskId) {
    return res.status(400).json({ message: "taskId saknas" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Inga uppdateringar skickades" });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task finns inte" });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Fel vid uppdatering av task:", error.message);
    return res
      .status(500)
      .json({ message: "Internt serverfel", error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task hittades inte" });
    }

    return res
      .status(200)
      .json({ message: "Task borttagen", task: deletedTask });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

///Kolla på det sen

// export const getAllTasksByUnits = async (req, res) => {
//   try {
//     const { unitId } = req.params;
//     const tasks = await Unit.findById(unitId)
//       .populate("tasks")
//       .sort({ status: "Ej påbörjat" });
//     return res.status(200).json(tasks);
//   } catch (error) {
//     console.log("Error", error.message);
//     return res.status(500).json({ message: "Internal Server Error", error });
//   }
// };
