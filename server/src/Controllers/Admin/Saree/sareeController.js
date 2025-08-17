import {
  createSareeService,
  getAllSareesService,
  getSareeByIdService,
  updateSareeService,
  deleteSareeService
} from "../../../Services/sareeServices.js";
import { handleControllerError } from "../../../Utils/errorHandler.js";

export const createSaree = async (req, res) => {
  try {
    const saree = await createSareeService(req.body, req.files);
    res.status(201).json({ success: true, message: "Saree created", data: saree });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const parseArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(",").map(v => v.trim()).filter(Boolean);
};

export const getAllSarees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      types,
      colors,
      occasions,
      patterns,
      minPrice,
      maxPrice,
      showOutOfStock = true,
      onlyFastDelivery = false,
      sortBy = "popularity",
    } = req.query;

    const priceRange = [
      minPrice ? +minPrice : 0,
      maxPrice ? +maxPrice : 3000,
    ];

    const result = await getAllSareesService(
      +page,
      +limit,
      search,
      parseArray(types),
      parseArray(colors),
      parseArray(occasions),
      parseArray(patterns),
      priceRange,
      showOutOfStock === "true" || showOutOfStock === true,
      onlyFastDelivery === "true" || onlyFastDelivery === true,
      sortBy
    );

    res.status(200).json({
      success: true,
      message: "Fetched all sarees",
      data: result.sarees,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};


export const getSareeById = async (req, res) => {
  try {
    const saree = await getSareeByIdService(req.params.id);
    if (!saree) return res.status(404).json({ success: false, message: "Saree not found" });
    res.status(200).json({ success: true, message: "Saree found", data: saree });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const updateSaree = async (req, res) => {
  try {
    const saree = await updateSareeService(req.params.id, req.body, req.files);
    res.status(200).json({ success: true, message: "Saree updated", data: saree });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const deleteSaree = async (req, res) => {
  try {
    await deleteSareeService(req.params.id);
    res.status(200).json({ success: true, message: "Saree deleted" });
  } catch (error) {
    return handleControllerError(res, error);
  }
};
