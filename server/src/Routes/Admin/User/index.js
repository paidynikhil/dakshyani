import express from "express";

import {
  getUsers,
  toggleUserStatus,
} from "../../../Controllers/Admin/Users/userController.js";

import { validatePagination } from "../../../Utils/pagination.js";

import authMiddleware from "../../../Middlewares/authMiddleware.js";
import checkRole from "../../../Middlewares/checkRole.js";

const router = express.Router();

router.get(
  "/",
  validatePagination,
  authMiddleware,
  checkRole(["Admin"]),
  getUsers
);

router.patch(
  "/:id",
  validatePagination,
  authMiddleware,
  checkRole(["Admin"]),
  toggleUserStatus
);

export default router;
