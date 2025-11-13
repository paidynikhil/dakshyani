import { removeFromWishlistService } from "../../../Services/wishlistServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, productModel } = req.body;

    if (!productId || !productModel) {
      return res.status(400).json({
        success: false,
        message: "Product ID and Product Model are required",
      });
    }

    const wishlist = await removeFromWishlistService(userId, productId, productModel);

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      data: wishlist,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};