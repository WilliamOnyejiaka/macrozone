import { Request, Response } from 'express';
import MealService from './meals.service';
import response from '../../common/utils/controller-response';

const mealService = new MealService();

export async function createMeal(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const result = await mealService.createMeal(userId, req.body);
    response(res, result);
}

export async function getMeals(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const page = Number(req.query.page) || 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await mealService.getMeals(userId, page, limit);
    response(res, result);
}

export async function getMealById(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const { id: mealId } = req.params;
    const result = await mealService.getMealById(userId, mealId as string);
    response(res, result);
}

export async function updateMeal(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const { id: mealId } = req.params;
    const result = await mealService.updateMeal(userId, mealId as string, req.body);
    response(res, result);
}

export async function deleteMeal(req: Request, res: Response) {
    const { id: userId } = res.locals.data;
    const { id: mealId } = req.params;
    const result = await mealService.deleteMeal(userId, mealId as string);
    response(res, result);
}