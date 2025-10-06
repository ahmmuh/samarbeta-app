// import { generateQRCodeWithLabel } from "../helperFunction/generateQRCodeWithLabel.js";
// import Machine from "../models/machine.js";
// import Unit from "../models/unit.js";

// // Skapa ny maskin
// // export const createMachine = async (req, res) => {
// //   const { name, unitId } = req.body;

// //   if (!name || !unitId) {
// //     return res.status(400).json({ message: "Namn och enhetsId krävs" });
// //   }

// //   try {
// //     const unit = await Unit.findById(unit);
// //     if (!unit)
// //       return res.status(404).json({ message: "Enheten hittades inte" });

// //     const machine = new Machine({ name, unit: unit });
// //     await machine.save();

// //     const qrCode = await generateQRCodeWithLabel({
// //       qrText: machine._id.toString(),
// //       line1: machine.name,
// //       line2: unit.name,
// //     });

// //     machine.qrCode = qrCode;
// //     await machine.save();

// //     const populatedMachine = await Machine.findById(machine._id).populate(
// //       "unit",
// //       "name"
// //     );

// //     return res
// //       .status(201)
// //       .json({ message: "Maskin skapad", machine: populatedMachine });
// //   } catch (error) {
// //     console.error(error);
// //     return res.status(500).json({
// //       message: "Serverfel vid skapande av maskin",
// //       error: error.message,
// //     });
// //   }
// // };

// export const createMachine = async (req, res) => {
//   const { name, unitId } = req.body;

//   if (!name || !unitId) {
//     return res.status(400).json({ message: "Namn och enhetsId krävs" });
//   }

//   try {
//     // Hämta unit med rätt unitId
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ message: "Enheten hittades inte" });
//     }

//     // Skapa maskin med unitId (fältnamn enligt schema)
//     const machine = new Machine({ name, unitId });
//     await machine.save();

//     // Generera QR-kod
//     const qrCode = await generateQRCodeWithLabel({
//       qrText: machine._id.toString(),
//       line1: machine.name,
//       line2: unit.name,
//     });

//     machine.qrCode = qrCode;
//     await machine.save();

//     // Populera unit för respons
//     const populatedMachine = await Machine.findById(machine._id).populate(
//       "unitId", // måste matcha fältet i schema
//       "name"
//     );

//     return res
//       .status(201)
//       .json({ message: "Maskin skapad", machine: populatedMachine });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Serverfel vid skapande av maskin",
//       error: error.message,
//     });
//   }
// };
// // Hämta alla maskiner
// export const getMachinesWithQRCode = async (req, res) => {
//   try {
//     const machines = await Machine.find()
//       .populate("unitId", "name")
//       .populate("borrowedBy", "name");

//     if (machines.length === 0)
//       return res.status(404).json({ message: "Inga maskiner hittades" });

//     return res.status(200).json(machines);
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Serverfel vid hämtning av maskiner" });
//   }
// };

// // Hämta maskin med machineId
// export const getMachineById = async (req, res) => {
//   const { machineId } = req.params;
//   try {
//     const machine = await Machine.findById(machineId)
//       .populate("unitId", "name")
//       .populate("borrowedBy", "name");

//     if (!machine)
//       return res.status(404).json({ message: "Maskin hittades inte" });
//     return res.status(200).json(machine);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Serverfel" });
//   }
// };

// // Uppdatera maskin
// export const updateMachine = async (req, res) => {
//   const { machineId } = req.params;
//   const { name, isAvailable } = req.body; // 👈 ta emot isAvailable

//   try {
//     const machine = await Machine.findById(machineId);
//     if (!machine)
//       return res.status(404).json({ message: "Maskin hittades inte" });

//     if (name) machine.name = name;
//     if (typeof isAvailable === "boolean") machine.isAvailable = isAvailable; // 👈 uppdatera checkbox

//     await machine.save();

//     return res.status(200).json({ message: "Maskin uppdaterad", machine });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Serverfel vid uppdatering" });
//   }
// };

// // Ta bort maskin
// export const deleteMachine = async (req, res) => {
//   const { machineId } = req.params;
//   try {
//     const machine = await Machine.findByIdAndDelete(machineId);
//     if (!machine)
//       return res.status(404).json({ message: "Maskin hittades inte" });
//     return res.status(200).json({ message: "Maskin borttagen", machine });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Serverfel vid borttagning" });
//   }
// };

// // Låna maskin
// export const borrowMachine = async (req, res) => {
//   const { machineId } = req.params;
//   const { userId } = req.body;

//   try {
//     const machine = await Machine.findById(machineId);
//     if (!machine)
//       return res.status(404).json({ message: "Maskin hittades inte" });
//     if (!machine.isAvailable)
//       return res.status(400).json({ message: "Maskinen är redan utlånad" });

//     machine.borrowedBy = userId;
//     machine.borrowedDate = new Date();
//     machine.returnedDate = null;
//     machine.isAvailable = false;

//     await machine.save();
//     return res.status(200).json({ message: "Maskin utlånad", machine });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Serverfel vid utlåning" });
//   }
// };

// // Lämna tillbaka maskin
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
//     machine.borrowedBy = null;
//     machine.borrowedDate = null;

//     await machine.save();
//     return res.status(200).json({ message: "Maskin återlämnad", machine });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Serverfel vid återlämning" });
//   }
// };

// // Sök maskiner
// export const searchMachines = async (req, res) => {
//   const { query } = req.query;
//   if (!query) return res.status(400).json({ message: "Söksträng saknas" });

//   try {
//     const machines = await Machine.find({
//       $or: [
//         { name: { $regex: query, $options: "i" } },
//         { serialNumber: { $regex: query, $options: "i" } },
//       ],
//     })
//       .populate("unitId", "name")
//       .populate("borrowedBy", "name");

//     return res.status(200).json({ message: "Maskiner hittades", machines });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Serverfel vid sökning" });
//   }
// };

import { generateQRCodeWithLabel } from "../helperFunction/generateQRCodeWithLabel.js";
import Machine from "../models/machine.js";
import Unit from "../models/unit.js";

/* =====================================================
   🟢 SKAPA MASKIN
   ===================================================== */
export const createMachine = async (req, res) => {
  const { name, unitId } = req.body;

  if (!name || !unitId) {
    return res.status(400).json({ message: "Namn och enhetsId krävs" });
  }

  try {
    // Kontrollera att unit finns
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ message: "Enheten hittades inte" });
    }

    // Skapa maskin
    const machine = new Machine({ name, unitId });
    await machine.save();

    // Generera QR-kod med etikett
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

    return res
      .status(201)
      .json({ message: "Maskin skapad", machine: populatedMachine });
  } catch (error) {
    console.error("❌ createMachine error:", error);
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
      .populate("borrowedBy", "name");

    if (!machines.length)
      return res.status(404).json({ message: "Inga maskiner hittades" });

    return res.status(200).json(machines);
  } catch (error) {
    console.error("❌ getMachines error:", error);
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
      .populate("borrowedBy", "name");

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
  const { name } = req.body; // ⚠️ endast name hanteras här

  try {
    const machine = await Machine.findById(machineId);
    if (!machine)
      return res.status(404).json({ message: "Maskin hittades inte" });

    if (name) machine.name = name;

    // ❌ isAvailable hanteras inte här
    // den styrs via borrowMachine() och returnMachine()

    await machine.save();

    return res.status(200).json({ message: "Maskin uppdaterad", machine });
  } catch (error) {
    console.error("❌ updateMachine error:", error);
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
export const borrowMachine = async (req, res) => {
  const { machineId } = req.params;
  const { userId } = req.body;

  try {
    const machine = await Machine.findById(machineId);
    if (!machine)
      return res.status(404).json({ message: "Maskin hittades inte" });
    if (!machine.isAvailable)
      return res.status(400).json({ message: "Maskinen är redan utlånad" });

    machine.borrowedBy = userId;
    machine.borrowedDate = new Date();
    machine.returnedDate = null;
    machine.isAvailable = false;

    await machine.save();
    return res.status(200).json({ message: "Maskin utlånad", machine });
  } catch (error) {
    console.error("❌ borrowMachine error:", error);
    return res.status(500).json({ message: "Serverfel vid utlåning" });
  }
};

/* =====================================================
   🟣 ÅTERLÄMNA MASKIN
   ===================================================== */
export const returnMachine = async (req, res) => {
  const { machineId } = req.params;

  try {
    const machine = await Machine.findById(machineId);
    if (!machine)
      return res.status(404).json({ message: "Maskin hittades inte" });
    if (machine.isAvailable)
      return res.status(400).json({ message: "Maskinen är redan tillgänglig" });

    machine.returnedDate = new Date();
    machine.isAvailable = true;
    machine.borrowedBy = null;
    machine.borrowedDate = null;

    await machine.save();
    return res.status(200).json({ message: "Maskin återlämnad", machine });
  } catch (error) {
    console.error("❌ returnMachine error:", error);
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
      .populate("borrowedBy", "name");

    return res.status(200).json({ message: "Maskiner hittades", machines });
  } catch (error) {
    console.error("searchMachines error:", error);
    return res.status(500).json({ message: "Serverfel vid sökning" });
  }
};
