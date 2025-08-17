import { Saree } from "../Models/sareeModel.js";
import { getUploader } from "../Utils/uploadFile.js";

const { getFilePath, deleteOldFile } = getUploader("sarees");

export const createSareeService = async (data, files) => {
  const image = files?.image?.[0]?.filename ? getFilePath(files.image[0].filename) : undefined;

  let discount;
  if (data.originalPrice && data.price) {
    discount = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
  }

  const saree = new Saree({
    ...data,
    image,
    discount,
  });

  return await saree.save();
};

export const getAllSareesService = async (
  page = 1,
  limit = 10,
  search,
  types = [],
  colors = [],
  occasions = [],
  patterns = [],
  priceRange = [0, Number.MAX_SAFE_INTEGER],
  showOutOfStock = true,
  onlyFastDelivery = false,
  sortBy = "popularity"
) => {
  const query = {};

  // Search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  // Filters
  if (types.length) query.type = { $in: types };
  if (colors.length) query.color = { $in: colors };
  if (occasions.length) query.occasion = { $in: occasions };
  if (patterns.length) query.pattern = { $in: patterns };
  if (!showOutOfStock) query.inStock = true;
  if (onlyFastDelivery) query.fastDelivery = true;
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
      sortQuery.rating = -1;
  }

  const sarees = await Saree.find(query)
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Saree.countDocuments(query); // total items for pagination

  return {
    sarees,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getSareeByIdService = async (id) => {
  return await Saree.findById(id).lean();
};

export const updateSareeService = async (id, data, files) => {
  const existing = await Saree.findById(id);
  if (!existing) throw new Error("Saree not found");

  let image = existing.image;
  if (files?.image?.[0]) {
    if (image) deleteOldFile(image);
    image = getFilePath(files.image[0].filename);
  }

  Object.assign(existing, { ...data, image });
  return await existing.save();
};

export const deleteSareeService = async (id) => {
  const existing = await Saree.findById(id);
  if (!existing) throw new Error("Saree not found");

  if (existing.image) deleteOldFile(existing.image);

  return await Saree.findByIdAndDelete(id);
};
