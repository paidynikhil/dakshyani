import {clearWishlistService } from "../../../Services/wishlistServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await clearWishlistService(userId);

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: wishlist,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};