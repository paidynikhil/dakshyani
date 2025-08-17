import {
  adminSignUp,
  adminSignIn,
  resetPasswordDirect
} from "../../Services/adminServices.js";
import { handleControllerError } from "../../Utils/errorHandler.js";

export const signUpAdmin = async (req, res) => {
  try {
    const admin = await adminSignUp(req.body);
    res.status(201).json({
      success: true,
      message: "Admin created",
      data: admin
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const signInAdmin = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const lowerEmail = email.trim().toLowerCase();
    const { token, userId, name, role } = await adminSignIn(lowerEmail, password, fcmToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { _id: userId, name, role }
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    if (!email || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await resetPasswordDirect(email, newPassword, confirmNewPassword);
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return handleControllerError(res, error);
  }
};
