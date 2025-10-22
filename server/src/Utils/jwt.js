import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { encryptToken } from "./encryption.js";

dotenv.config();

const MAIN_SECRET = process.env.MAIN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const ACCESS_TOKEN_EXPIRY = "1d";
const REFRESH_TOKEN_EXPIRY = "365d";

if (!MAIN_SECRET) throw new Error("MAIN_SECRET not set");
if (!REFRESH_SECRET) throw new Error("REFRESH_SECRET not set");

const generateToken = (user) => {
  const payload = {
    userId: user._id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role,
    referenceNo: user.referenceNo,
  };
  const jwtAccessToken = jwt.sign(payload, MAIN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const accessToken = encryptToken(jwtAccessToken);

  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};
export default generateToken;
