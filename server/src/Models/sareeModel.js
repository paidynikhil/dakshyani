import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number },
  type: { type: String },
  color: { type: String },
  occasion: { type: String },
  pattern: { type: String },
  fabric: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  fastDelivery: { type: Boolean, default: false },
  brand: { type: String },
  category: { type: String, default: "Sarees" },
  image: { type: String },
}, { timestamps: true });

export const Saree = mongoose.model("Saree", sareeSchema);
