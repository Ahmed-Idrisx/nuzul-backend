import { Router } from "express";

import { createBooking, checkAvailability } from "./booking.controller.js";
import { validateRequest } from "../../middlewares/validate.request.js";
import {
  checkAvailabilitySchema,
  createBookingSchema,
} from "./booking.schema.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/check-availability",
  validateRequest(checkAvailabilitySchema),
  checkAvailability,
);
router.post(
  "/book",
  protect,
  validateRequest(createBookingSchema),
  createBooking,
);

export default router;
