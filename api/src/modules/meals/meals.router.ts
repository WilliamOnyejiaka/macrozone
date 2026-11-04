import { Router } from "express";
import verifyJWT from "../../common/middlewares/verifyJwt";
import { TokenType } from "../../common/types/constants";
import {
    getMeals,
    createMeal,
    updateMeal,
    deleteMeal,
    deleteAllMeals,
} from "./meals.controller";
import {
    createMealValidator,
    updateMealValidator,
    mealIdParamValidator,
    getMealsValidator,
} from "./meals.validator";

const router = Router();

// All meal routes require a valid access token
router.get("/", getMealsValidator, getMeals);
router.post("/", createMealValidator, createMeal);
router.patch("/:id", updateMealValidator, updateMeal);
router.delete("/", deleteAllMeals); // must come BEFORE /:id
router.delete("/:id", mealIdParamValidator, deleteMeal);

export default router;

