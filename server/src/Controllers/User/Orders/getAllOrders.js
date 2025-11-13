import { getUserOrdersService } from "../../../Services/orderServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    const result = await getUserOrdersService(
      userId,
      parseInt(page),
      parseInt(limit),
      status
    );

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

