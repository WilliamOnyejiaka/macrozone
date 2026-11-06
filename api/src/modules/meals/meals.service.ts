import BaseService from "../../common/services";
import { db } from "../../db";
import { meals } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";
import { HttpStatus } from "../../common/types";
import { CreateMealDto, UpdateMealDto } from "./meals.dto";

export default class MealService extends BaseService {
    public constructor() {
        super();
    }

    public async createMeal(userId: string, payload: CreateMealDto) {
        try {
            const [newMeal] = await db
                .insert(meals)
                .values({
                    userId,
                    name: payload.name,
                    calories: payload.calories,
                    protein: payload.protein ?? 0,
                    carbs: payload.carbs ?? 0,
                    fat: payload.fat ?? 0,
                })
                .returning();

            if (!newMeal) {
                return super.errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create meal");
            }

            return super.successResponse(HttpStatus.CREATED, "Meal created successfully", newMeal);
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async getMeals(userId: string, page: number, limit: number) {
        try {
            const normalizedLimit = super.normalizeLimit(limit);
            const offset = super.offset(page, normalizedLimit);

            const [records, [countResult]] = await Promise.all([
                db
                    .select()
                    .from(meals)
                    .where(eq(meals.userId, userId))
                    .limit(normalizedLimit)
                    .offset(offset),
                db
                    .select({ count: sql`count(${meals.id})::int` })
                    .from(meals)
                    .where(eq(meals.userId, userId))
            ]);

            const total = countResult?.count ? Number(countResult.count) : 0;


            return super.successResponse(HttpStatus.OK, "Meals retrieved successfully", {
                records,
                pagination: super.pagination(page, normalizedLimit, total),
            });
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async getMealById(userId: string, mealId: string) {
        try {
            const [meal] = await db
                .select()
                .from(meals)
                .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
                .limit(1);

            if (!meal) {
                return super.errorResponse(HttpStatus.NOT_FOUND, "Meal not found");
            }

            return super.successResponse(HttpStatus.OK, "Meal retrieved successfully", meal);
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async updateMeal(userId: string, mealId: string, payload: UpdateMealDto) {
        try {
            const [updatedMeal] = await db
                .update(meals)
                .set({
                    ...payload,
                })
                .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
                .returning();

            if (!updatedMeal) {
                return super.errorResponse(HttpStatus.NOT_FOUND, "Meal not found");
            }

            return super.successResponse(HttpStatus.OK, "Meal updated successfully", updatedMeal);
        } catch (error) {
            return super.handleError(error);
        }
    }

    public async deleteMeal(userId: string, mealId: string) {
        try {
            const [deletedMeal] = await db
                .delete(meals)
                .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
                .returning();

            if (!deletedMeal) {
                return super.errorResponse(HttpStatus.NOT_FOUND, "Meal not found");
            }

            return super.successResponse(HttpStatus.OK, "Meal deleted successfully");
        } catch (error) {
            return super.handleError(error);
        }
    }
}