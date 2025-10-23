import { generateQRCodeWithLabel } from "../helperFunction/generateQRCodeWithLabel.js";
import Machine from "../models/machine.js";
import Unit from "../models/unit.js";
import MachineLog from "../models/machineLog.js";

/* =====================================================
   🟢 SKAPA MASKIN
   ===================================================== */
export const createMachine = async (req, res) => {
  const { name, unitId } = req.body;

  if (!name || !unitId) {
    return res.status(400).json({ message: "Namn och enhetsId krävs" });
  }

  try {
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ message: "Enheten hittades inte" });
    }

    const machine = new Machine({ name, unitId });
    await machine.save();

    const qrCode = await generateQRCodeWithLabel({
      qrText: machine._id.toString(),
      line1: machine.name,
      line2: unit.name,
    });

    machine.qrCode = qrCode;
    await machine.save();

    const populatedMachine = await Machine.findById(machine._id).populate(
      "unitId",
      "name"
    );

    await MachineLog.create({
      machine: machine._id,
      action: "CREATED",
      performedBy: req.user?._id || null, // vem som lånar
      unit: machine.unitId?._id || null,
      workplace: machine.borrowedFrom || null, //
    });
    return res
      .status(201)
      .json({ message: "Maskin skapad", machine: populatedMachine });
  } catch (error) {
    console.error(" createMachine error:", error);
    return res.status(500).json({
      message: "Serverfel vid skapande av maskin",
      error: error.message,
    });
  }
};

/* =====================================================
   🟡 HÄMTA ALLA MASKINER
   ===================================================== */
export const getMachinesWithQRCode = async (req, res) => {
  try {
    const machines = await Machine.find()
      .populate("unitId", "name")
      .populate("borrowedBy", "name")
      .populate("borrowedFrom", "name");

    if (!machines.length)
      return res.status(404).json({ message: "Inga maskiner hittades" });

    return res.status(200).json(machines);
  } catch (error) {
    console.error(" getMachines error:", error);
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av maskiner" });
  }
};

/* =====================================================
   🟡 HÄMTA MASKIN MED ID
   ===================================================== */
export const getMachineById = async (req, res) => {
  const { machineId } = req.params;
  try {
    const machine = await Machine.findById(machineId)
      .populate("unitId", "name")
      .populate("borrowedBy", "name")
      .populate("borrowedFrom", "name");
    if (!machine)
      return res.status(404).json({ message: "Maskin hittades inte" });

    return res.status(200).json(machine);
  } catch (error) {
    console.error("❌ getMachineById error:", error);
    return res.status(500).json({ message: "Serverfel" });
  }
};

/* =====================================================
   🟠 UPPDATERA MASKIN
   ===================================================== */
export const updateMachine = async (req, res) => {
  const { machineId } = req.params;
  const { name } = req.body;
  console.log("updateMachine → machineId:", machineId);

  console.log("updateMachine → req.body:", req.body);

  try {
    const machine = await Machine.findById(machineId);
    if (!machine)
      return res.status(404).json({ message: "Maskin hittades inte" });

    const oldName = machine.name;
    if (name) machine.name = name;
    await machine.save();

    console.log("🟢 Machine saved:", machine._id);

    return res.status(200).json({ message: "Maskin uppdaterad", machine });
  } catch (error) {
    console.error(" updateMachine error:", error);
    return res.status(500).json({ message: "Serverfel vid uppdatering" });
  }
};

/* =====================================================
   🔴 TA BORT MASKIN
   ===================================================== */
export const deleteMachine = async (req, res) => {
  const { machineId } = req.params;
  try {
    const machine = await Machine.findByIdAndDelete(machineId);
    if (!machine)
      return res.status(404).json({ message: "Maskin hittades inte" });

    return res.status(200).json({ message: "Maskin borttagen", machine });
  } catch (error) {
    console.error("❌ deleteMachine error:", error);
    return res.status(500).json({ message: "Serverfel vid borttagning" });
  }
};

/* =====================================================
   🔵 LÅNA MASKIN
   ===================================================== */

//Ny kod utan userId i body

export const borrowMachine = async (req, res) => {
  const { machineId } = req.params;
  try {
    const machine = await Machine.findById(machineId);
    if (!machine)
      return res.status(404).json({ message: "Maskin hittades inte" });

    if (!machine.isAvailable)
      return res.status(400).json({ message: "Maskinen är redan utlånad" });

    machine.borrowedBy = req.user._id;
    machine.borrowedDate = new Date();
    machine.returnedDate = null;
    machine.isAvailable = false;

    await machine.save();

    await MachineLog.create({
      machine: machine._id,
      action: "BORROWED",
      performedBy: req.user._id,
      unit: machine.unitId || null,
      workplace: machine.borrowedFrom || null,
    });

    return res.status(200).json({ message: "Maskin utlånad", machine });
  } catch (error) {
    console.error("❌ borrowMachine error:", error);
    return res.status(500).json({ message: "Serverfel vid utlåning" });
  }
};

/* =====================================================
   🟣 ÅTERLÄMNA MASKIN
   ===================================================== */
// export const returnMachine = async (req, res) => {
//   const { machineId } = req.params;

//   try {
//     const machine = await Machine.findById(machineId);
//     if (!machine)
//       return res.status(404).json({ message: "Maskin hittades inte" });
//     if (machine.isAvailable)
//       return res.status(400).json({ message: "Maskinen är redan tillgänglig" });

//     machine.returnedDate = new Date();
//     machine.isAvailable = true;
//     const borrower = machine.borrowedBy;
//     machine.borrowedBy = null;
//     machine.borrowedDate = null;

//     await machine.save();

//     await MachineLog.create({
//       machineId,
//       userId: borrower,
//       action: "returned",
//       details: `Maskin '${machine.name}' återlämnades`,
//     });

//     return res.status(200).json({ message: "Maskin återlämnad", machine });
//   } catch (error) {
//     console.error("❌ returnMachine error:", error);
//     return res.status(500).json({ message: "Serverfel vid återlämning" });
//   }
// };

export const returnMachine = async (req, res) => {
  const { machineId } = req.params;

  try {
    const machine = await Machine.findById(machineId);
    if (!machine)
      return res.status(404).json({ message: "Maskin hittades inte" });

    if (machine.isAvailable)
      return res.status(400).json({ message: "Maskinen är redan tillgänglig" });

    // Återställ maskinstatus
    machine.borrowedBy = null;
    machine.returnedDate = new Date();
    machine.isAvailable = true;

    await machine.save();

    // Skapa logg
    await MachineLog.create({
      machine: machine._id,
      action: "RETURNED",
      performedBy: req.user?._id || null, // vem som lämnar tillbaka
      unit: machine.unitId?._id || null,
      workplace: machine.borrowedFrom || null, //
    });

    return res.status(200).json(machine);
  } catch (error) {
    console.error("returnMachine error:", error);
    return res.status(500).json({ message: "Serverfel vid återlämning" });
  }
};

/* =====================================================
   🔍 SÖK MASKINER
   ===================================================== */
export const searchMachines = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Söksträng saknas" });

  try {
    const machines = await Machine.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { serialNumber: { $regex: query, $options: "i" } },
      ],
    })
      .populate("unitId", "name")
      .populate("borrowedFrom", "name")
      .populate("borrowedBy", "name");

    return res.status(200).json(machines);
  } catch (error) {
    console.error("searchMachines error:", error);
    return res.status(500).json({ message: "Serverfel vid sökning" });
  }
};

// Hämta alla logs med användare
export const getAllMachineLogs = async (req, res) => {
  try {
    const logs = await MachineLog.find()
      .populate("performedBy", "name email") // populera med valda fält, t.ex. name och email
      .populate("machine", "name serialNumber") // om du vill populera maskininfo
      .populate("borrowedFrom", "name") // om du vill populera arbetsplats
      .populate("unit", "name") // om du vill populera enhet
      .sort({ timestamp: -1 }); // senaste först

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching machine logs:", error);
    res.status(500).json({ message: "Serverfel vid hämtning av maskinloggar" });
  }
};
