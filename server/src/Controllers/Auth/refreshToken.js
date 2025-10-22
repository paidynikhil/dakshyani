import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateTokens from "../../Utils/jwt.js";
import { getUserByIdService } from "../../Services/userServices.js"; 

dotenv.config();

const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token required" });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
      }

      const user = await getUserByIdService(decoded.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      return res.json({
        success: true,
        message: "Token refreshed successfully",
        accessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
