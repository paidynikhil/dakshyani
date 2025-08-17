import {
  createLehengaService,
  getAllLehengasService,
  getLehengaByIdService,
  updateLehengaService,
  deleteLehengaService
} from "../../../Services/lehengaServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const createLehenga = async (req, res) => {
  try {
    const lehenga = await createLehengaService(req.body, req.files);
    res.status(201).json({ success: true, message: "Lehenga created", data: lehenga });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getAllLehengas = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      styles = [],
      occasions = [],
      workTypes = [],
      colors = [],
      sizes = [],
      minPrice,
      maxPrice,
      inStockOnly = false,
      newArrivalsOnly = false,
      sortBy = "newest",
    } = req.query;

    const priceRange = [
      minPrice ? +minPrice : 0,
      maxPrice ? +maxPrice : 1000000,
    ];

    const parseArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(",").map(v => v.trim()).filter(Boolean);
};

const result = await getAllLehengasService(
  +page,
  +limit,
  search,
  parseArray(styles),
  parseArray(occasions),
  parseArray(workTypes),
  parseArray(colors),
  parseArray(sizes),  // ✅ now ["M","S"] not ["M,S"]
  priceRange,
  inStockOnly === "true" || inStockOnly === true,
  newArrivalsOnly === "true" || newArrivalsOnly === true,
  sortBy
);

    res.status(200).json({
      success: true,
      message: "Fetched all lehengas",
      data: result.lehengas,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const getLehengaById = async (req, res) => {
  try {
    const lehenga = await getLehengaByIdService(req.params.id);
    if (!lehenga) return res.status(404).json({ success: false, message: "Lehenga not found" });
    res.status(200).json({ success: true, message: "Lehenga found", data: lehenga });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const updateLehenga = async (req, res) => {
  try {
    const lehenga = await updateLehengaService(req.params.id, req.body, req.files);
    res.status(200).json({ success: true, message: "Lehenga updated", data: lehenga });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const deleteLehenga = async (req, res) => {
  try {
    await deleteLehengaService(req.params.id);
    res.status(200).json({ success: true, message: "Lehenga deleted" });
  } catch (error) {
    return handleControllerError(res, error);
  }
};
