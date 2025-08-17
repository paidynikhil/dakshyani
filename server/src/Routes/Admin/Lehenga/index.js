import express from "express";
import {
  createLehenga,
  getAllLehengas,
  getLehengaById,
  updateLehenga,
  deleteLehenga
} from "../../../Controllers/Admin/Lehenga/lehengaController.js";

import { getUploader } from "../../../Utils/uploadFile.js";
import authMiddleware from "../../../Middlewares/authMiddleware.js";
import checkRole from "../../../Middlewares/checkRole.js";

const router = express.Router();
const { fields } = getUploader("lehenga");

router
  .route("/")
  .post(
    authMiddleware,
    checkRole(["Admin"]),
    fields([{ name: "image", maxCount: 1 }]),
    createLehenga
  )
  .get(getAllLehengas);

router
  .route("/:id")
  .get(getLehengaById)
  .patch(
    authMiddleware,
    checkRole(["Admin"]),
    fields([{ name: "image", maxCount: 1 }]),
    updateLehenga
  )
  .delete(authMiddleware, checkRole(["Admin"]), deleteLehenga);

export default router;
