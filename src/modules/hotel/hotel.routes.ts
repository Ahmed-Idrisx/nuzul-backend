import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { validateRequest } from "../../middlewares/validate.request.js";

import { registerHotel } from "./hotel.controller.js";
import { createHotelSchema } from "./hotel.schema.js";

const router = Router();

router.post(
  "/",
  protect,
  upload.single("image"),
  validateRequest(createHotelSchema),
  registerHotel,
);

export default router;
