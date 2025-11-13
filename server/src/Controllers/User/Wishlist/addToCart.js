import { addToWishlistService } from "../../../Services/wishlistServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    const { productId, productModel } = req.body;

    if (!productId || !productModel) {
      return res.status(400).json({
        success: false,
        message: "Product ID and Product Model are required",
      });
    }

    const wishlist = await addToWishlistService(userId, productId, productModel);

    res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: wishlist,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};