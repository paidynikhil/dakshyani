import express from "express";

import Saree from "./Saree/index.js";
import Lehenga from "./Lehenga/index.js";
import NewArrival from "./NewArrival/index.js";
import User from "./User/index.js";

const router = express.Router();

router.use("/sarees", Saree);
router.use("/lehenga", Lehenga);
router.use("/new-arrival", NewArrival);
router.use("/user", User);

export default router;