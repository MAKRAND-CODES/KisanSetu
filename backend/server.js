import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import fertilizerRoutes from "./routes/fertilizerRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import insuranceRoutes from "./routes/insuranceRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import satelliteRoutes from "./routes/satelliteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
dotenv.config();

connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://kisan-setu-c6yf.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("KisanSetu  Backend is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/farms",farmRoutes);
app.use("/api/weather",weatherRoutes);
app.use("/api/crops",cropRoutes);
app.use("/api/fertilizer", fertilizerRoutes);
app.use("/api/complaints",complaintRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/schemes",schemeRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/satellite",satelliteRoutes);
app.use("/api/notifications",notificationRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
