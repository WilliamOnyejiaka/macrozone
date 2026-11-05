import { Router } from "express";
import { signUp, login } from "./auth.controller";
import { signUpValidator,loginValidator } from "./auth.validator";

const router = Router();

router.post("/sign-up", signUpValidator, signUp);   
router.post("/login", loginValidator, login);

export default router;

