import express from "express";
import {
  createSaree,
  getAllSarees,
  getSareeById,
  updateSaree,
  deleteSaree,
} from "../../../Controllers/Admin/Saree/sareeController.js";

import { validatePagination } from "../../../Utils/pagination.js";

import { getUploader } from "../../../Utils/uploadFile.js";
import authMiddleware from "../../../Middlewares/authMiddleware.js";
import checkRole from "../../../Middlewares/checkRole.js";

const router = express.Router();
const { fields } = getUploader("sarees");

router
  .route("/")
  .post(
    authMiddleware,
    checkRole(["Admin"]),
    fields([{ name: "image", maxCount: 1 }]),
    createSaree
  )
  .get(validatePagination, getAllSarees);

router
  .route("/:id")
  .get(getSareeById)
  .patch(
    authMiddleware,
    checkRole(["Admin"]),
    fields([{ name: "image", maxCount: 1 }]),
    updateSaree
  )
  .delete(authMiddleware, checkRole(["Admin"]), deleteSaree);

export default router;
