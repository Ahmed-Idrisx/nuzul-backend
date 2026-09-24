import { Router } from "express";

import {
  createBooking,
  checkAvailability,
  updateBookingStatus,
} from "./booking.controller.js";
import { validateRequest } from "../../middlewares/validate.request.js";
import {
  checkAvailabilitySchema,
  createBookingSchema,
  updateBookingStatusSchema,
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
router.post(
  "/:bookingId/status",
  protect,
  validateRequest(updateBookingStatusSchema),
  updateBookingStatus,
);

export default router;
