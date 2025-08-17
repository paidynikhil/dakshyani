import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { decryptToken } from "../Utils/encryption.js";

dotenv.config();
const MAIN_SECRET = process.env.MAIN_SECRET;
if (!MAIN_SECRET) throw new Error("MAIN_SECRET is not set");

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const encryptedToken = authHeader.slice(7);
      const token = decryptToken(encryptedToken);
      const decoded = jwt.verify(token, MAIN_SECRET);
      req.user = decoded;
    } else {
      req.user = null; // not logged in
    }

    next();
  } catch (error) {
    req.user = null; // invalid token → treat as guest
    next();
  }
};

export default optionalAuth;
