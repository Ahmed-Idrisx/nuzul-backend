import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.request.js";

import { createRoom, toggleRoomAvailability } from "./room.controller.js";
import {
  createRoomSchema,
  toggleRoomAvailabilitySchema,
} from "./room.schema.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/create-room",
  protect,
  upload.array("images", 5),
  validateRequest(createRoomSchema),
  createRoom,
);

router.post(
  "/toggle-availability",
  protect,
  validateRequest(toggleRoomAvailabilitySchema),
  toggleRoomAvailability,
);

export default router;
