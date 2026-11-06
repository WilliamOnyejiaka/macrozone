import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
    createMeal,
    getMeals,
    getMealById,
    updateMeal,
    deleteMeal
} from "./meals.controller";
import {
    createMealValidator,
    updateMealValidator,
    mealIdParamValidator,
    getMealsValidator
} from "./meals.validator";

const router = Router();

router.post("/", createMealValidator, asyncHandler(createMeal));
router.get("/", getMealsValidator, asyncHandler(getMeals));
router.get("/:id", mealIdParamValidator, asyncHandler(getMealById));
router.patch("/:id", updateMealValidator, asyncHandler(updateMeal));
router.delete("/:id", mealIdParamValidator, asyncHandler(deleteMeal));

export default router;