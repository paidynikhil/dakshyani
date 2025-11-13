import { placeOrderService } from "../../../Services/orderServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderData = req.body;

    const order = await placeOrderService(userId, orderData);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};