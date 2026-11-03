export * from "./meal.validator";
export type { CreateMealDto, UpdateMealDto } from "./meals.service";

export interface GetMealsQueryInput {
    date?: string;
}
