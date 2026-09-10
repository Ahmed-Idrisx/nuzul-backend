import { Router } from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.request.js";

import { createRoom } from "./room.controller.js";
import { createRoomSchema } from "./room.schema.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/",
  protect,
  upload.array("images", 5),
  validateRequest(createRoomSchema),
  createRoom,
);

export default router;
