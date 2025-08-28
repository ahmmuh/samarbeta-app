import Task from "../models/task.js";
import Unit from "../models/unit.js";
import User from "../models/user.js";

// ---------------------------
// Lägg till task (utan enhet)
// ---------------------------
import Task from "../models/task.js";

export const addTask = async (req, res) => {
  const { title, description, location, coordinates } = req.body;

  // Kontrollera att nödvändiga fält finns
  if (!title || !description || !location) {
    return res.status(400).json({
      message:
        "Det saknas en eller fler av följande: title, description, location",
    });
  }

  try {
    // Skapa task utan koppling till user eller unit
    const newTask = new Task({
      title,
      description,
      location,
      coordinates, // [lon, lat]
      // unit och createdBy lämnas tomma
    });

    await newTask.save();
    return res.status(200).json(newTask);
  } catch (error) {
    console.error("Fel vid skapande av task:", error.message);
    return res.status(500).json({
      message: "Serverfel vid skapande av ny task",
      error: error.message,
    });
  }
};

// ---------------------------
// Tilldela task till enhet
// ---------------------------
export const assignTaskToUnit = async (req, res) => {
  try {
    const { taskId, unitId } = req.params;
    const { status } = req.body;

    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(404).json({
        message: "Enheten finns inte",
      });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task finns inte" });

    task.unit = unitId;
    if (status) task.status = status;

    unit.tasks.push(task._id);
    await unit.save();
    await task.save();

    return res.status(200).json({
      message: `Enhet med ID ${unitId} har tagit på sig task med ID ${taskId}`,
    });
  } catch (error) {
    console.error("Fel vid assignTaskToUnit:", error.message);
    return res
      .status(500)
      .json({ message: "Internt serverfel", error: error.message });
  }
};

// ---------------------------
// Hämta alla tasks
// ---------------------------
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("unit");
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Fel vid getAllTasks:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ---------------------------
// Uppdatera task
// ---------------------------
export const updateTask = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId || !req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "taskId saknas eller inga uppdateringar skickades" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask)
      return res.status(404).json({ message: "Task finns inte" });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Fel vid updateTask:", error.message);
    return res
      .status(500)
      .json({ message: "Internt serverfel", error: error.message });
  }
};

// ---------------------------
// Hämta task med ID
// ---------------------------
export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json(task);
  } catch (error) {
    console.error("Fel vid getTaskById:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ---------------------------
// Ta bort task
// ---------------------------
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask)
      return res.status(404).json({ message: "Task hittades inte" });
    return res
      .status(200)
      .json({ message: "Task borttagen", task: deletedTask });
  } catch (error) {
    console.error("Fel vid deleteTask:", error.message);
    return res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

// ---------------------------
// Sök tasks
// ---------------------------
export const searchTask = async (req, res) => {
  const { title } = req.query;

  if (!title)
    return res.status(400).json({ message: "title saknas i förfrågan" });

  try {
    const tasks = await Task.find({
      title: { $regex: title, $options: "i" },
    });

    if (tasks.length === 0)
      return res
        .status(404)
        .json({ message: "Ingen uppgift matchar sökningen." });

    return res.status(200).json({ message: "Uppgifter hittades", data: tasks });
  } catch (error) {
    console.error("Fel vid searchTask:", error.message);
    return res.status(500).json({ message: "Serverfel", error: error.message });
  }
};
