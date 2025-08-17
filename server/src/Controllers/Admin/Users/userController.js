import { getUsersService, toggleUserStatusService } from "../../../Services/userServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const getUsers = async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const result = await getUsersService(page, limit);

    res.status(200).json({
      success: true,
      message: "Users fetched",
      data: result.users,
      pagination: result.pagination,
      stats: result.stats,  // 👈 include stats in response
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const updatedUser = await toggleUserStatusService(req.params.id);
    res.status(200).json({ success: true, message: "User status updated", data: updatedUser });
  } catch (error) {
    return handleControllerError(res, error);
  }
};
