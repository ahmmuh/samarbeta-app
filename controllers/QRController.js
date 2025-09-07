import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";
import KeyModel from "../models/key.js";
import Unit from "../models/unit.js";

//help function

// utils/generateQRCodeWithLabel.js

const generateQRCodeWithLabel = async ({ qrText, line1, line2 }) => {
  const width = 300;
  const height = 380; // extra plats för två rader text
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 1. Skapa QR-kod i separat canvas
  const qrCanvas = createCanvas(width, width);
  await QRCode.toCanvas(qrCanvas, qrText, { width });

  // 2. Rita QR-koden på huvudcanvas
  ctx.drawImage(qrCanvas, 0, 0);

  // 3. Lägg till text under QR-koden
  ctx.fillStyle = "green";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";

  // Första raden (t.ex. nyckel-ID)
  ctx.fillText(line1, width / 2, height - 40);

  // Andra raden (t.ex. plats)
  ctx.fillText(line2, width / 2, height - 20);

  return canvas.toDataURL(); // Base64-sträng
};

export const AddNewKey = async (req, res) => {
  const { keyLabel, unitId } = req.body;

  if (!keyLabel || !unitId) {
    return res
      .status(400)
      .json({ message: "Nyckelnamn eller enhetensID saknas" });
  }

  try {
    const existingKey = await KeyModel.findOne({ keyLabel });
    if (existingKey) {
      return res.status(400).json({ message: "Nyckel finns redan" });
    }

    const newKey = new KeyModel({ keyLabel, unit: unitId });
    await newKey.save();

    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ message: "Enheten hittades inte" });
    }
    unit.keys.push(newKey._id);
    await unit.save();

    // Generera QR med _id
    const qrCode = await generateQRCodeWithLabel({
      qrText: newKey._id.toString(),
      line1: keyLabel,
      line2: unit.name, // 👈 bättre än unitId
    });

    //Uppdatera nyckeln med QR-koden
    newKey.qrCode = qrCode;
    await newKey.save();

    // Populera unit.name innan return
    const populatedKey = await KeyModel.findById(newKey._id).populate(
      "unit",
      "name"
    );

    console.log("NEW skapad Key", populatedKey);

    console.log("NY NYCKEL", newKey);

    return res.status(201).json({
      message: "Nyckel registrerad",
      key: populatedKey,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Serverfel vid registrering av ny nyckel",
      error: error.message,
    });
  }
};

export const getKeysWithQRCode = async (req, res) => {
  try {
    // Hämta alla enheter först
    const keys = await KeyModel.find();
    if (keys.length === 0) {
      return res
        .status(400)
        .json({ message: "Det finns inga nycklar att visa" });
    }

    return res.status(200).json(keys);
  } catch (error) {
    console.error("Fel vid hämtning av keys i :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
