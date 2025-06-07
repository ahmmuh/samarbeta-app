import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import getConnection from "./db/connection.js";
import unitRouter from "./routes/unitRoute.js";
import taskRoute from "./routes/taskRoute.js";
// import workplaceRoute from "./routes/workplaceRoute.js";
// import googlePlaceRoute from "./routes/googlePlaceRoute.js";
import keyRoute from "./routes/keyRoute.js";
// import userRouter from "./routes/userRoute.js";
import keyLogRoute from "./routes/keyLogsRoute.js";
import apartmentRoute from "./routes/apartmentRoute.js";
// import { autoAssignTasks } from "./controllers/CronController.js";
// import cronJobRoute from "./routes/cronJobRoute.js";
import qrCodeRoute from "./routes/qrCodeROute.js";
import authRoute from "./routes/authRoute.js";
import { getToken } from "./middleware/authMiddleware.js";
import addressRoute from "./routes/addressRoute.js";
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const port = 8000;

app.use(express.json());
app.use(cookieParser());

// app.use("/api", addressRoute);
app.use("/api", authRoute);
app.use("/api", apartmentRoute);
// app.use("/api", getToken, userRouter);
app.use("/api", unitRouter);
app.use("/api", taskRoute);
// app.use("/api", googlePlaceRoute);
// app.use("/api", getToken, workplaceRoute);
app.use("/api", qrCodeRoute);
app.use("/api", keyRoute);
app.use("/api", keyLogRoute);

// app.use("/api/cronjobs", cronJobRoute);
app.listen(port, () => {
  console.log(`The Server listening on port ${port}`);
  getConnection();
});
