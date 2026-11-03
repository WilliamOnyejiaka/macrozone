import { Router } from "express";
import mealsRouter from "../modules/meals/meals.router";

const router = Router();

router.use("/meals", mealsRouter);

export default router;

