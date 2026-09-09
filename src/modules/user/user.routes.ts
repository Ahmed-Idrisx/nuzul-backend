import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  getMe,
  storeRecentSearchedCities,
  updateMe,
} from "./user.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { addRecentCitySchema, updateUserSchema } from "./user.schema.js";
import { validateRequest } from "../../middlewares/validate.request.js";

const router = Router();

router.get("/me", protect, getMe);
router.post(
  "/me",
  protect,
  upload.single("image"),
  validateRequest(updateUserSchema),
  updateMe,
);
router.post(
  "/store-recent-search",
  protect,
  validateRequest(addRecentCitySchema),
  storeRecentSearchedCities,
);

export default router;
