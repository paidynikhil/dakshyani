import { updateOrderStatusService } from "../../../Services/orderServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const { orderId } = req.params;
    const statusData = req.body;

    if (!statusData.status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await updateOrderStatusService(orderId, adminId, statusData);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};