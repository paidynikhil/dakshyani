// Models/wishlistModel.js
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "items.productModel",
        },
        productModel: {
          type: String,
          required: true,
          enum: ["Lehenga", "Saree", "Dress"], // Add more models as needed
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for better query performance
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ "items.product": 1 });

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);