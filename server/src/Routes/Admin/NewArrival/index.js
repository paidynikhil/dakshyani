import express from "express";
import { getNewArrivals} from "../../../Controllers/Admin/NewArrival/newArrivalController.js";
import { validatePagination } from "../../../Utils/pagination.js";


const router = express.Router();

router
  .route("/")
  .get(validatePagination, getNewArrivals);

export default router;
