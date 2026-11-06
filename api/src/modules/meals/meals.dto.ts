export interface CreateMealDto {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}

export interface UpdateMealDto {
    name?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}