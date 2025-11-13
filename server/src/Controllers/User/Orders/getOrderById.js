import { getOrderByIdService } from "../../../Services/orderServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;

    const order = await getOrderByIdService(orderId, userId, false);

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};