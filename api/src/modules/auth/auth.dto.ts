

export interface SignUpDto {
    name: string,
    email: string,
    password: string,
    dailyCalorieGoal?: number,
    dailyProteinGoal?: number,
    dailyCarbsGoal?: number,
    dailyFatGoal?: number,
    userAgent: string,
    ipAddress: string,
}

export interface LoginDto {
    email: string,
    password: string,
    userAgent: string,
    ipAddress: string,
}