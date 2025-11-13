import { cancelOrderService } from "../../../Services/orderServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await cancelOrderService(orderId, userId, reason);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};