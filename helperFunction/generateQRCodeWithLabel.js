import { createCanvas } from "canvas";
import QRCode from "qrcode";

export const generateQRCodeWithLabel = async ({ qrText, line1, line2 }) => {
  const width = 300;
  const height = 380; // extra plats för två rader text
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // QR i separat canvas
  const qrCanvas = createCanvas(width, width);
  await QRCode.toCanvas(qrCanvas, qrText, { width });

  // Rita QR på huvudcanvas
  ctx.drawImage(qrCanvas, 0, 0);

  // Lägg till text
  ctx.fillStyle = "green";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";

  ctx.fillText(line1, width / 2, height - 40); // maskinens namn/ID
  ctx.fillText(line2, width / 2, height - 20); // enhetens namn

  return canvas.toDataURL(); // base64-sträng
};
