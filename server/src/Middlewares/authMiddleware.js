import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { decryptToken } from "../Utils/encryption.js";
import logger from "../Utils/logger.js";

dotenv.config();

const MAIN_SECRET = process.env.MAIN_SECRET;
if (!MAIN_SECRET) throw new Error("MAIN_SECRET is not set");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn({ ip: req.ip }, "Missing or malformed Authorization header");
      return res.status(401).json({ error: "Authorization header missing or malformed" });
    }

    const encryptedToken = authHeader.slice(7);
    const token = decryptToken(encryptedToken);
    const decoded = jwt.verify(token, MAIN_SECRET);

    req.user = decoded;

    // logger.info({ userId: decoded.userId, ip: req.ip }, "User authenticated successfully");
    next();
  } catch (err) {
    logger.error({ error: err.message, ip: req.ip }, "Authentication failed");
    res.status(401).json({ error: err.message });
  }
};

export default authMiddleware;
