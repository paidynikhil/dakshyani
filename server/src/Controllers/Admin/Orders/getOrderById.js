import { getOrderByIdService } from "../../../Services/orderServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await getOrderByIdService(orderId, null, true);

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};
