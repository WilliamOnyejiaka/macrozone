
export interface UpdateProfileDto {
    name?: string;
    dailyCalorieGoal?: number;
    dailyFatGoal?: number;
    dailyCarbsGoal?: number;
    dailyProteinGoal?: number;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateProfilePictureDto {
    profilePicture?: string;
    avatarUrl?: string;
}