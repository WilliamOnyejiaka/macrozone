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
} from "./meal.validator";

const router = Router();

// All meal routes require a valid access token
const auth = verifyJWT([TokenType.ACCESS]);

router.get("/", auth, getMealsValidator, getMeals);
router.post("/", auth, createMealValidator, createMeal);
router.patch("/:id", auth, updateMealValidator, updateMeal);
router.delete("/", auth, deleteAllMeals); // must come BEFORE /:id
router.delete("/:id", auth, mealIdParamValidator, deleteMeal);

export default router;

