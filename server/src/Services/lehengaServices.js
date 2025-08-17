import { Lehenga } from "../Models/lehengaModel.js";
import { getUploader } from "../Utils/uploadFile.js";

const { getFilePath, deleteOldFile } = getUploader("lehenga");

export const createLehengaService = async (data, files) => {
  const image = files?.image?.[0]?.filename ? getFilePath(files.image[0].filename) : undefined;

  let discount;
  if (data.originalPrice && data.originalPrice > 0 && data.price) {
    discount = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
  }

  const lehenga = new Lehenga({
    ...data,
    image,
    discount,
    createdAt: new Date(),
  });

  return await lehenga.save();
};

export const getAllLehengasService = async (
  page = 1,
  limit = 10,
  search,
  styles = [],
  occasions = [],
  workTypes = [],
  colors = [],
  priceRange = [0, Number.MAX_SAFE_INTEGER],
  inStockOnly = false,
  newArrivalsOnly = false,
  sortBy = "newest"
) => {
  const query = {};

  // Search in title, description, brand
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  // Filters
  if (styles.length) query.style = { $in: styles };
  if (occasions.length) query.occasion = { $in: occasions };
  if (workTypes.length) query.workType = { $in: workTypes };
  if (colors.length) query.color = { $in: colors };
  if (inStockOnly) query.inStock = true;
  if (newArrivalsOnly) query.isNew = true;
  query.price = { $gte: priceRange[0], $lte: priceRange[1] };

  // Sorting
  let sortQuery = {};
  switch (sortBy) {
    case "price-low":
      sortQuery.price = 1;
      break;
    case "price-high":
      sortQuery.price = -1;
      break;
    case "rating":
      sortQuery.rating = -1;
      break;
    case "discount":
      sortQuery.discount = -1;
      break;
    case "newest":
      sortQuery.createdAt = -1;
      break;
    default:
      sortQuery.createdAt = -1; // default newest
  }

  const lehengas = await Lehenga.find(query)
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Lehenga.countDocuments(query);

  return {
    lehengas,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getLehengaByIdService = async (id) => {
  return await Lehenga.findById(id).lean();
};

export const updateLehengaService = async (id, data, files) => {
  const existing = await Lehenga.findById(id);
  if (!existing) throw new Error("Lehenga not found");

  let image = existing.image;
  if (files?.image?.[0]) {
    if (image) deleteOldFile(image);
    image = getFilePath(files.image[0].filename);
  }

  // 🟢 Fix sizes field
  let sizes = data.sizes;
  if (sizes) {
    try {
      // If sizes comes as JSON string, parse it
      if (typeof sizes === "string") {
        sizes = JSON.parse(sizes);
      }
      // If it’s still not an array, force wrap
      if (!Array.isArray(sizes)) {
        sizes = [sizes];
      }
    } catch {
      sizes = [sizes]; // fallback
    }
  }

  Object.assign(existing, { ...data, sizes, image });
  return await existing.save();
};

export const deleteLehengaService = async (id) => {
  const existing = await Lehenga.findById(id);
  if (!existing) throw new Error("Lehenga not found");

  if (existing.image) deleteOldFile(existing.image);

  return await Lehenga.findByIdAndDelete(id);
};
