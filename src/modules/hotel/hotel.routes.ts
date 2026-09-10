import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { validateRequest } from "../../middlewares/validate.request.js";

import {
  getHotels,
  getHotelDetails,
  registerHotel,
} from "./hotel.controller.js";
import { createHotelSchema } from "./hotel.schema.js";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelDetails);
router.post(
  "/",
  protect,
  upload.single("image"),
  validateRequest(createHotelSchema),
  registerHotel,
);

export default router;
