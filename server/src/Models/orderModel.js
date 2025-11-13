// Models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
          enum: ["Lehenga", "Saree", "Dress"],
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String },
        color: { type: String },
        image: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      shippingCost: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI", "Wallet", "NetBanking"],
      default: "UPI",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded", "Refund Initiated"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "OutForDelivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
    statusHistory: [
      {
        status: { type: String },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    deliveredAt: { type: Date },
    trackingNumber: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Indexes for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);