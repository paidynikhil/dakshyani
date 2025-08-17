import express from "express";

import Auth from "./Auth/index.js";
import Admin from "./Admin/index.js";

const router = express.Router();

router.use("/auth", Auth);
router.use("/admin", Admin);

export default router;