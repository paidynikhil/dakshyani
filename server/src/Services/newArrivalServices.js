import { Saree } from "../Models/sareeModel.js";
import { Lehenga } from "../Models/lehengaModel.js";

export const getNewArrivalsService = async (filters, pagination) => {
  const { category: categoryFilter, search } = filters;
  const { page, limit } = pagination;

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const now = new Date();

  // Helper to build search regex
  const buildSearchQuery = (fields) => {
    if (!search) return {};
    const regex = new RegExp(search.split("").join(".*"), "i");
    return { $or: fields.map(f => ({ [f]: { $regex: regex } })) };
  };

  let sarees = [];
  let lehengas = [];

  if (!categoryFilter || categoryFilter.toLowerCase() === "sarees") {
    const sareeQuery = { createdAt: { $gte: oneMonthAgo }, ...buildSearchQuery([
      "title",
      "category",
      "color",
      "occasion",
      "pattern",
      "fabric",
      "type"
    ])};
    sarees = await Saree.find(sareeQuery).lean();
  }

  if (!categoryFilter || categoryFilter.toLowerCase() === "lehengas") {
    const lehengaQuery = { createdAt: { $gte: oneMonthAgo }, ...buildSearchQuery([
      "title",
      "category",
      "color",
      "occasion",
      "workType",
      "style"
    ])};
    lehengas = await Lehenga.find(lehengaQuery).lean();
  }

  // Merge arrays
  const allItems = [...sarees, ...lehengas];

  // Add daysAgo field
  const itemsWithDaysAgo = allItems.map(item => ({
    ...item,
    daysAgo: Math.floor((now - new Date(item.createdAt)) / (1000 * 60 * 60 * 24))
  }));

  // Sort by createdAt descending
  itemsWithDaysAgo.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedItems = itemsWithDaysAgo.slice(startIndex, startIndex + limit);

  return {
    total: itemsWithDaysAgo.length,
    page,
    limit,
    data: paginatedItems
  };
};
