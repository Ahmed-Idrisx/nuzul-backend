import { Router } from "express";

import { register } from "./auth.controller.js";
import { registerSchema } from "./auth.schema.js";
import { validateRequest } from "../../middlewares/validate.request.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);

export default router;
