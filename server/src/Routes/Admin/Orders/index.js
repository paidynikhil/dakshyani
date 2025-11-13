import express from "express";
import { getAllOrders } from "../../../Controllers/Admin/Orders/getAllOrders.js";
import { getOrderStatistics } from "../../../Controllers/Admin/Orders/getOrderStatistics.js";
import { getOrderById } from "../../../Controllers/Admin/Orders/getOrderById.js";
import { updateOrderStatus } from "../../../Controllers/Admin/Orders/updateOrderStatus.js";

import authMiddleware from "../../../Middlewares/authMiddleware.js";
import checkRole from "../../../Middlewares/checkRole.js";

const router = express.Router();

router.route("/").get(authMiddleware, checkRole(["Admin"]), getAllOrders),
router.route("/statistics").get(authMiddleware, checkRole(["Admin"]), getOrderStatistics),
router.route("/:orderId").get(getOrderById),
router.route("/:orderId/status").patch(authMiddleware, checkRole(["Admin"]), updateOrderStatus);
export default router;
