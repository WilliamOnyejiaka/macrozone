import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mealsService from "./meals.service";
import { HttpStatus } from "../../common/types/constants";

/**
 * GET /api/v1/meals
 * GET /api/v1/meals?date=YYYY-MM-DD
 */
export const getMeals = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = res.locals.data.id;
    const date = typeof req.query.date === "string" ? req.query.date : undefined;

    const data = await mealsService.getMealsByUser(userId, date);

    res.status(HttpStatus.OK).json({
        error: false,
        data,
    });
});

/**
 * POST /api/v1/meals
 */
export const createMeal = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = res.locals.data.id;
    const { name, calories, protein, carbs, fat } = req.body;

    const meal = await mealsService.createMeal(userId, {
        name,
        calories: Number(calories),
        protein: protein !== undefined ? Number(protein) : undefined,
        carbs: carbs !== undefined ? Number(carbs) : undefined,
        fat: fat !== undefined ? Number(fat) : undefined,
    });

    res.status(HttpStatus.CREATED).json({
        error: false,
        data: meal,
    });
});

/**
 * PATCH /api/v1/meals/:id
 */
export const updateMeal = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = res.locals.data.id;
    const mealId = req.params.id;
    const { name, calories, protein, carbs, fat } = req.body;

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (calories !== undefined) updates.calories = Number(calories);
    if (protein !== undefined) updates.protein = Number(protein);
    if (carbs !== undefined) updates.carbs = Number(carbs);
    if (fat !== undefined) updates.fat = Number(fat);

    const meal = await mealsService.updateMeal(userId, mealId as string, updates);

    res.status(HttpStatus.OK).json({
        error: false,
        data: meal,
    });
});

/**
 * DELETE /api/v1/meals/:id
 */
export const deleteMeal = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = res.locals.data.id;
    const mealId = req.params.id;

    await mealsService.deleteMeal(userId, mealId as string);

    res.status(HttpStatus.NO_CONTENT).send();
});

/**
 * DELETE /api/v1/meals
 */
export const deleteAllMeals = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = res.locals.data.id;

    await mealsService.deleteAllMeals(userId);

    res.status(HttpStatus.NO_CONTENT).send();
});

