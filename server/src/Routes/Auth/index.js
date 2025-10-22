import express from "express";
import passport from "passport";
import {
  signUpAdmin,
  signInAdmin,
  resetPassword
} from "../../Controllers/Auth/authController.js";

import {
  signUpUser,
  signInUser,
} from "../../Controllers/Auth/userController.js";

import { refreshTokenHandler } from "../../Controllers/Auth/refreshToken.js";

const router = express.Router();

router.post("/sign-up", signUpAdmin);

router.post("/sign-in", signInAdmin);

router.post("/reset-password", resetPassword);

router.post("/user/sign-up", signUpUser);

router.post("/user/sign-in", signInUser);

router.route("/user/refresh-token").post(refreshTokenHandler);


// Google login Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/v1/auth/google/failure", session: false }),
  (req, res) => {
    if (!req.user || !req.user.token) {
      return res.redirect("https://dakshyani.onrender.com/v1/auth/google?error=authentication_failed");
    }

    const redirectUrl = `https://dakshyani.onrender.com?token=${req.user.token}&userId=${req.user.user._id}`;
    res.redirect(redirectUrl);
  }
);

router.get("/google/failure", (req, res) => {
  res.redirect("https://dakshyani.onrender.com/v1/auth/google?error=google_auth_failed");
});

router.get("/google/get", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).json({ error: "Not authenticated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/google/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

router.get("/google/debug-session", (req, res) => {
  res.json(req.user || { error: "No user session found" });
});

export default router;
