import mongoose from "mongoose";

const lehengaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number },
  brand: { type: String },
  style: { type: String },
  occasion: { type: String },
  workType: { type: String },
  color: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  sizes: [{ type: String }],
  inStock: { type: Boolean, default: true },
  isNew: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  category: { type: String, default: "Lehengas" },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Lehenga = mongoose.model("Lehenga", lehengaSchema);
