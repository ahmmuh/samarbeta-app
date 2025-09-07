import express from "express";
import { AddNewKey, getKeysWithQRCode } from "../controllers/QRController.js";
import { getToken } from "../middleware/authMiddleware.js";

const qrCodeRoute = express.Router();

qrCodeRoute.post("/keys/add", getToken, AddNewKey);

qrCodeRoute.get("/keys/qrcodes", getToken, getKeysWithQRCode);

export default qrCodeRoute;
