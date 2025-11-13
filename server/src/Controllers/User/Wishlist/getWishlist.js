import { getWishlistService } from "../../../Services/wishlistServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await getWishlistService(userId);

    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};
