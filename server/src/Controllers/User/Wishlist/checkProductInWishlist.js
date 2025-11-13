import { checkProductInWishlistService } from "../../../Services/wishlistServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const checkProductInWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, productModel } = req.query;

    if (!productId || !productModel) {
      return res.status(400).json({
        success: false,
        message: "Product ID and Product Model are required",
      });
    }

    const result = await checkProductInWishlistService(userId, productId, productModel);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};