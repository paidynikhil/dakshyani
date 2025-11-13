import {getAllOrdersService } from "../../../Services/orderServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      paymentMethod,
      search,
    } = req.query;

    const filters = {
      status,
      paymentStatus,
      paymentMethod,
      search,
    };

    const result = await getAllOrdersService(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result.orders,
      pagination: result.pagination,
      stats: result.stats,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};