import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { encryptToken } from "./encryption.js";

dotenv.config();

const MAIN_SECRET = process.env.MAIN_SECRET;
const MAIN_TOKEN_EXPIRY = "10d";

const generateToken = (user) => {
  if (!MAIN_SECRET) throw new Error("MAIN_SECRET not set");

  const payload = {
    userId: user._id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role,
    referenceNo: user.referenceNo,
  };

  const jwtToken = jwt.sign(payload, MAIN_SECRET, { expiresIn: MAIN_TOKEN_EXPIRY });
  return encryptToken(jwtToken);
};

export default generateToken;
