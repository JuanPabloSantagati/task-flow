import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
