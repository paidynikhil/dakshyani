import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import compression from "compression";
import { connectDB } from "./src/Config/db.js";
import Router from "./src/Routes/index.js";
import {apiLimiter} from "./src/Middlewares/rateLimit.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --- Middleware ---
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : ["*"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "src", "uploads"), {
    setHeaders: (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "public, max-age=86400");
}
  })
);

app.get("/", (req, res) => {
  res.send("Hello, welcome to Survey.");
});

if (process.env.NODE_ENV !== "production") {
  app.use("/v1", Router);
} else {
  app.use("/v1", apiLimiter, Router);
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: err.message });
});

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGODB_URI is not set in .env");
    }

    await connectDB();

    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Startup error:", err.message);
    process.exit(1);
  }
};

startServer();

export default app;
