import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";
import KeyModel from "../models/key.js";

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

export const registerNewKey = async (req, res) => {
  const { keyLabel, location } = req.body;

  if (!keyLabel || !location) {
    return res.status(400).json({ message: "keyLabel eller location saknas" });
  }

  try {
    const existingKey = await KeyModel.findOne({ keyLabel });
    if (existingKey) {
      return res.status(400).json({ message: "Nyckel finns redan" });
    }

    // 1. Spara nyckeln först
    const newKey = new KeyModel({ keyLabel, location });
    await newKey.save(); // först här skapas _id

    // 2. Generera QR med _id
    const qrCode = await generateQRCodeWithLabel({
      qrText: newKey._id.toString(), // <-- lägg in ID i QR-kod
      line1: keyLabel,
      line2: location,
    });

    // 3. Uppdatera nyckeln med QR-koden
    newKey.qrCode = qrCode;
    await newKey.save();

    return res.status(201).json({
      message: "Nyckel registrerad",
      key: newKey,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Serverfel vid registrering av ny nyckel",
      error: error.message,
    });
  }
};

//GET All key med QRCode

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
