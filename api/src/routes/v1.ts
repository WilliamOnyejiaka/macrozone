import { Router } from "express";
import mealsRouter from "../modules/meals/meals.router";
import authRouter from "../modules/auth/auth.router";
import usersRouter from "../modules/users/users.router"
import verifyJWT from "../common/middlewares/verify-jwt";
import { TokenType } from "../common/types";

const router = Router();
const jwtAuth = verifyJWT([TokenType.ACCESS]);

router.use("/auth", authRouter);
router.use("/users", jwtAuth, usersRouter);
router.use("/meals", jwtAuth, mealsRouter);

export default router;

