import express from "express";
import {
  getKeysWithQRCode,
  registerNewKey,
} from "../controllers/QRController.js";
import { getToken } from "../middleware/authMiddleware.js";

const qrCodeRoute = express.Router();


qrCodeRoute.post("/keys/qrcode", registerNewKey);

qrCodeRoute.get("/keys/qrcodes", getKeysWithQRCode);

export default qrCodeRoute;
