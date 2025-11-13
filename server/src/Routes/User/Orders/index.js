import express from "express";
import { placeOrder } from "../../../Controllers/User/Orders/placeOrder.js";
import { getMyOrders } from "../../../Controllers/User/Orders/getAllOrders.js";
import { getMyOrderById } from "../../../Controllers/User/Orders/getOrderById.js";
import { cancelOrder } from "../../../Controllers/User/Orders/cancelOrder.js";


import authMiddleware from "../../../Middlewares/authMiddleware.js";
import checkRole from "../../../Middlewares/checkRole.js";

const router = express.Router();

router.route("/place").post(authMiddleware, checkRole(["User"]), placeOrder),
router.route("/").get( authMiddleware, checkRole(["User"]), getMyOrders),
router.route("/:orderId").get(authMiddleware, checkRole(["User"]), getMyOrderById);
router.route("/:orderId/cancel").delete(authMiddleware, checkRole(["User"]), cancelOrder);

export default router;
