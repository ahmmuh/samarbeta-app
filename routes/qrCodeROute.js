import express from "express";
import {
  getKeysWithQRCode,
  registerNewKey,
} from "../controllers/QRController.js";
import { getToken } from "../middleware/authMiddleware.js";

const qrCodeRoute = express.Router();

qrCodeRoute.post("/keys/qrcode", getToken, registerNewKey);

qrCodeRoute.get("/keys/qrcodes", getToken, getKeysWithQRCode);

export default qrCodeRoute;
