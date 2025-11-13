import express from "express";
import { addToWishlist } from "../../../Controllers/User/Wishlist/addToCart.js";
import { getWishlist } from "../../../Controllers/User/Wishlist/getWishlist.js";
import { clearWishlist } from "../../../Controllers/User/Wishlist/clearWishlist.js";
import { removeFromWishlist } from "../../../Controllers/User/Wishlist/removeFromWishlist.js";
import { checkProductInWishlist } from "../../../Controllers/User/Wishlist/checkProductInWishlist.js";


import authMiddleware from "../../../Middlewares/authMiddleware.js";
import checkRole from "../../../Middlewares/checkRole.js";

const router = express.Router();

router.route("/add").post(authMiddleware, checkRole(["User"]), addToWishlist),
router.route("/remove").post(authMiddleware, checkRole(["User"]), removeFromWishlist),
router.route("/").get( authMiddleware, checkRole(["User"]), getWishlist),
router.route("/clear").delete(authMiddleware, checkRole(["User"]), clearWishlist);
router.route("/check").get(authMiddleware, checkRole(["User"]), checkProductInWishlist);

export default router;
