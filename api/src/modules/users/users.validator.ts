import { body } from "express-validator";
import handleValidationErrors from "../../common/utils/handle-validation-errors";
import uploads from "../../common/middlewares/multer";

export const updateProfileValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("dailyCalorieGoal")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Daily calorie goal must be a valid positive number"),

    body("dailyFatGoal")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Daily fat goal must be a valid positive number"),

    body("dailyCarbsGoal")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Daily carbs goal must be a valid positive number"),

    body("dailyProteinGoal")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Daily protein goal must be a valid positive number"),

    handleValidationErrors
];

export const changePasswordValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required")
        .isString()
        .withMessage("Current password must be a string"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),

    handleValidationErrors
];

export const updateProfilePictureValidator = [
    uploads(1).fields([
        { name: "avatar", maxCount: 1 },
        { name: "profilePicture", maxCount: 1 },
    ]),
    (req: any, res: any, next: any) => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const file = req.file || files?.avatar?.[0] || files?.profilePicture?.[0];
        if (!file) {
            res.status(400).json({
                error: true,
                message: "Profile picture file is required",
            });
            return;
        }

        return next();
    },
    handleValidationErrors,
];