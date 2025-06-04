import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import getConnection from "./db/connection.js";
import unitRouter from "./routes/unitRoute.js";
import specialistRoute from "./routes/specialistRoute.js";
import chefRoute from "./routes/chefRoute.js";
import taskRoute from "./routes/taskRoute.js";
import workplaceRoute from "./routes/workplaceRoute.js";
import googlePlaceRoute from "./routes/googlePlaceRoute.js";
import keyRoute from "./routes/keyRoute.js";
import userRouter from "./routes/userRoute.js";
import keyLogRoute from "./routes/keyLogsRoute.js";
import apartmentRoute from "./routes/apartmentRoute.js";
import { autoAssignTasks } from "./controllers/CronController.js";
import cronJobRoute from "./routes/cronJobRoute.js";
import qrCodeRoute from "./routes/qrCodeROute.js";
import authRoute from "./routes/authRoute.js";
import { getToken } from "./middleware/authMiddleware.js";
const app = express();
app.use(cors());
const port = 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoute);
app.use("/api", getToken, userRouter);
app.use("/api", getToken, unitRouter);
app.use("/api", getToken, specialistRoute);
app.use("/api", getToken, chefRoute);
app.use("/api", getToken, taskRoute);
app.use("/api", getToken, googlePlaceRoute);
app.use("/api", getToken, workplaceRoute);
app.use("/api", getToken, qrCodeRoute);
app.use("/api", getToken, keyRoute);
app.use("/api", getToken, keyLogRoute);
app.use("/api", getToken, apartmentRoute);

app.use("/api/cronjobs", cronJobRoute);
app.listen(port, () => {
  console.log(`The Server listening on port ${port}`);
  getConnection();
});
