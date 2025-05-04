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
    return res
      .status(400)
      .json({ message: `${keyLabel} eller ${location} saknas` });
  }

  try {
    // Kontrollera om nyckel med samma label redan finns
    const existingKey = await KeyModel.findOne({ keyLabel });
    if (existingKey) {
      return res.status(409).json({ message: "Nyckel finns redan" });
    }

    // Skapa och spara ny nyckel
    const newKey = new KeyModel({ keyLabel, location });
    // await newKey.save();

    const qrCodeWithText = await generateQRCodeWithLabel({
      qrText: keyLabel,
      line1: keyLabel,
      line2: location,
    });

    return res.status(201).json({
      message: "Nyckel har registrerats",
      key: newKey,
      qrCode: qrCodeWithText, // ← base64-bild att visa/spara
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Serverfel vid registrering av ny nyckel",
      error: error.message,
    });
  }
};
