import Specialist from "../models/specialist.js";
import Task from "../models/task.js";
import { Unit } from "../models/unit.js";

export const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

export const getUnitByID = async (req, res) => {
  try {
    const units = await Unit.find();
    res.status(200).json({ message: "Singel unit" });
    console.log("EN enhet");
  } catch (error) {}
};


export const createUnit = async (req, res) => {
  console.log("Hela Begäran: ", req.body);
  const { name } = req.body;
  try {
    const newUnit = new Unit({ name });
    await newUnit.save();
    console.log("New Unit:", newUnit);
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

export const updateUnit = async (req, res) => {
  const { unitId } = req.params;
  console.log("Unit ID ", unitId);
  try {
    const unit = await Unit.findById(unitId);
    if (!unit)
      return res.status(400).json({ message: "Enheten hittades inte!" });

    const updatedUnit = await Unit.findByIdAndUpdate(unitId, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Enhet uppdaterades", enhet: updatedUnit });
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).json({ message: "Internal Error", error });
  }
};
export const deleteUnit = (req, res) => {
  console.log("ENhet deleted");
};

// get alla taskska via unit

export const addTaskToUnit = async (req, res) => {
  const { unitId } = req.params;

  try {
    const { title, description } = req.body;
    const unit = await Unit.findById(unitId);
    if (!unit)
      return res
        .status(400)
        .json({ message: "Enheten finns inte i databasen!" });
    const newTask = new Task({ title, description });
    await newTask.save();
    unit.tasks.push(newTask._id);
    unit.save();
    res.status(200).json({ message: "En task har lagts till enheten" });
  } catch (error) {
    console.log("Error ", error.message);
    return res.status(500).json({ Message: "Error", error });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Unit.find().populate("tasks");
    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { unitId, taskId } = req.params;
    if (!taskId) return res.status(400).json({ message: "Task finns inte" });

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(400).json({ message: "Enheten finns inte" });

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    if (!updatedTask)
      return res.status(400).json({ message: "Task finns inte" });
    return res.status(204).json(updatedTask);
  } catch (error) {
    console.log("Error", error.message);
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

export const deleteTasks = async (req, res) => {
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
//get Alla specialist via unit



export const addSpecialistToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    console.log("Unit ID", unitId);
    const { name, phone, email } = req.body;
    console.log("Specialister from body", req.body);
    const units = await Unit.findById(unitId);
    if (!units)
      return res.status(400).json({ message: "Enheten hittades inte" });

    const existingSpecialist = await Specialist.findOne({ email });
    if (existingSpecialist) {
      return res.status(400).json({
        Message: "Denna specialist finns redan i systemet",
        specialist: existingSpecialist,
      });
    }

    const specialist = new Specialist({ name, phone, email });
    await specialist.save();
    units.specialister.push(specialist._id);
    console.log("Specialist ID ", specialist._id);
    console.log("Unit med specialist", units);
    await units.save();

    res.status(201).json({ message: "En specialist lagts till enhet" });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "External Error uppstod", error: error.message });
  }
};


export const getAllSpecialist = async (req, res) => {
  try {
    const tasks = await Unit.find().populate("tasks");
    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};


export const updateSpecialist = async (req, res) => {
  try {
    const { unitId, taskId } = req.params;
    if (!taskId) return res.status(400).json({ message: "Task finns inte" });

    const unit = await Unit.findById(unitId);
    if (!unit) return res.status(400).json({ message: "Enheten finns inte" });

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    if (!updatedTask)
      return res.status(400).json({ message: "Task finns inte" });
    return res.status(204).json(updatedTask);
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getSpecialist = async (req, res) => {
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

export const deleteSpecialist = async (req, res) => {
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

//get Alla workplaces via unit
//get Alla lokalvårdare via workplaces
//get Alla tasks via unit

// change status (task to completed: true)
