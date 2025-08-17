import { userRegister, userLogin } from "../../Services/userServices.js";
import {handleControllerError} from "../../Utils/errorHandler.js";

export const signUpUser = async (req, res) => {
  try {
    const user = await userRegister(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const signInUser = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;
    const result = await userLogin(email, password, fcmToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: { _id: result.userId, name: result.name, role: result.role },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};
