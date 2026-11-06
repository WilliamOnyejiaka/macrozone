import { Router } from "express";
import { signUp, login, logout, refreshToken } from "./auth.controller";
import { signUpValidator,loginValidator, logoutValidator, refreshTokenValidator } from "./auth.validator";

const router = Router();

router.post("/sign-up", signUpValidator, signUp);   
router.post("/login", loginValidator, login);
router.post("/refresh", refreshTokenValidator, refreshToken);
router.post("/logout", logoutValidator, logout);

export default router;

