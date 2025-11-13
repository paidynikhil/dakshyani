import { getOrderStatisticsService } from "../../../Services/orderServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const getOrderStatistics = async (req, res) => {
  try {
    const stats = await getOrderStatisticsService();

    res.status(200).json({
      success: true,
      message: "Order statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};