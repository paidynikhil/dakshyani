import { getNewArrivalsService } from "../../../Services/newArrivalServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const getNewArrivals = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const pagination = { page: parseInt(page), limit: parseInt(limit) };
    const filters = { category, search };

    const result = await getNewArrivalsService(filters, pagination);
    res.status(200).json({
      success: true,
      message: "New arrivals fetched",
      total: result.total,
      page: result.page,
      limit: result.limit,
      data: result.data
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};
