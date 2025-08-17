import express from "express";
import {
  signUpAdmin,
  signInAdmin,
  resetPassword
} from "../../Controllers/Auth/authController.js";

import {
  signUpUser,
  signInUser,
} from "../../Controllers/Auth/userController.js";

const router = express.Router();

router.post("/sign-up", signUpAdmin);

router.post("/sign-in", signInAdmin);

router.post("/reset-password", resetPassword);

router.post("/user/sign-up", signUpUser);

router.post("/user/sign-in", signInUser);

export default router;
