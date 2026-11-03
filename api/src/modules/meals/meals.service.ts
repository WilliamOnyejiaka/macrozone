import { eq, and, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import db from "../../db";
import { meals, type NewMeal, type Meal } from "../../db/schema";
import { HttpStatus } from "../../common/types/constants";

export type CreateMealDto = {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
};

export type UpdateMealDto = Partial<CreateMealDto>;

class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = "AppError";
    }
}

export class MealsService {
    /** Fetch all meals for a user, newest-first. */
    async getMealsByUser(userId: string, date?: string): Promise<Meal[]> {
        const allMeals = await db
            .select()
            .from(meals)
            .where(eq(meals.userId, userId))
            .orderBy(desc(meals.createdAt));

        if (!date) return allMeals;

        // Filter to the given calendar day (YYYY-MM-DD)
        return allMeals.filter((m) => {
            const d = new Date(m.createdAt);
            const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            return iso === date;
        });
    }

    /** Create a new meal for a user. */
    async createMeal(userId: string, dto: CreateMealDto): Promise<Meal> {
        this.validateCreateDto(dto);

        const newMeal: NewMeal = {
            id: uuidv4(),
            userId,
            name: dto.name.trim(),
            calories: dto.calories,
            protein: dto.protein ?? 0,
            carbs: dto.carbs ?? 0,
            fat: dto.fat ?? 0,
        };

        const [created] = await db.insert(meals).values(newMeal).returning();
        return created;
    }

    /** Update a meal — only the owner can update their own meal. */
    async updateMeal(userId: string, mealId: string, dto: UpdateMealDto): Promise<Meal> {
        this.validateUpdateDto(dto);

        const existing = await this.findOwnedMeal(userId, mealId);

        const updates: Partial<NewMeal> = {};
        if (dto.name !== undefined) updates.name = dto.name.trim();
        if (dto.calories !== undefined) updates.calories = dto.calories;
        if (dto.protein !== undefined) updates.protein = dto.protein;
        if (dto.carbs !== undefined) updates.carbs = dto.carbs;
        if (dto.fat !== undefined) updates.fat = dto.fat;

        if (Object.keys(updates).length === 0) {
            return existing;
        }

        const [updated] = await db
            .update(meals)
            .set(updates)
            .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
            .returning();

        return updated;
    }

    /** Delete a single meal — only the owner can delete their own meal. */
    async deleteMeal(userId: string, mealId: string): Promise<void> {
        await this.findOwnedMeal(userId, mealId);

        await db
            .delete(meals)
            .where(and(eq(meals.id, mealId), eq(meals.userId, userId)));
    }

    /** Delete all meals for a user. */
    async deleteAllMeals(userId: string): Promise<void> {
        await db.delete(meals).where(eq(meals.userId, userId));
    }

    // ─── Private helpers ────────────────────────────────────────────────────────

    private async findOwnedMeal(userId: string, mealId: string): Promise<Meal> {
        const [meal] = await db
            .select()
            .from(meals)
            .where(and(eq(meals.id, mealId), eq(meals.userId, userId)));

        if (!meal) {
            throw new AppError(HttpStatus.NOT_FOUND, "Meal not found.");
        }
        return meal;
    }

    private validateCreateDto(dto: CreateMealDto): void {
        if (!dto.name || typeof dto.name !== "string" || dto.name.trim() === "") {
            throw new AppError(HttpStatus.UNPROCESSABLE_ENTITY, "Meal name is required.");
        }
        if (typeof dto.calories !== "number" || dto.calories < 0) {
            throw new AppError(HttpStatus.UNPROCESSABLE_ENTITY, "Calories must be a non-negative number.");
        }
        this.validateMacros(dto);
    }

    private validateUpdateDto(dto: UpdateMealDto): void {
        if (Object.keys(dto).length === 0) {
            throw new AppError(HttpStatus.UNPROCESSABLE_ENTITY, "No fields provided to update.");
        }
        if (dto.name !== undefined && (typeof dto.name !== "string" || dto.name.trim() === "")) {
            throw new AppError(HttpStatus.UNPROCESSABLE_ENTITY, "Meal name cannot be empty.");
        }
        if (dto.calories !== undefined && (typeof dto.calories !== "number" || dto.calories < 0)) {
            throw new AppError(HttpStatus.UNPROCESSABLE_ENTITY, "Calories must be a non-negative number.");
        }
        this.validateMacros(dto);
    }

    private validateMacros(dto: Partial<CreateMealDto>): void {
        for (const field of ["protein", "carbs", "fat"] as const) {
            if (dto[field] !== undefined && (typeof dto[field] !== "number" || dto[field]! < 0)) {
                throw new AppError(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    `${field.charAt(0).toUpperCase() + field.slice(1)} must be a non-negative number.`,
                );
            }
        }
    }
}

export default new MealsService();

