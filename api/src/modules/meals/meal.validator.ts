import { body, param, query } from "express-validator";
import handleValidationErrors from "../../common/utils/handleValidationErrors";

export const createMealValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Meal name is required")
        .isString()
        .withMessage("Meal name must be a string"),
    body("calories")
        .notEmpty()
        .withMessage("Calories is required")
        .isFloat({ min: 0 })
        .withMessage("Calories must be a non-negative number")
        .toFloat(),
    body("protein")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Protein must be a non-negative number")
        .toFloat(),
    body("carbs")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Carbs must be a non-negative number")
        .toFloat(),
    body("fat")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Fat must be a non-negative number")
        .toFloat(),
    handleValidationErrors,
];

export const updateMealValidator = [
    param("id")
        .isUUID()
        .withMessage("Valid meal id is required"),
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Meal name cannot be empty")
        .isString()
        .withMessage("Meal name must be a string"),
    body("calories")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Calories must be a non-negative number")
        .toFloat(),
    body("protein")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Protein must be a non-negative number")
        .toFloat(),
    body("carbs")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Carbs must be a non-negative number")
        .toFloat(),
    body("fat")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Fat must be a non-negative number")
        .toFloat(),
    body().custom((value, { req }) => {
        const { name, calories, protein, carbs, fat } = req.body || {};
        if (
            name === undefined &&
            calories === undefined &&
            protein === undefined &&
            carbs === undefined &&
            fat === undefined
        ) {
            throw new Error("At least one field must be provided to update");
        }
        return true;
    }),
    handleValidationErrors,
];

export const mealIdParamValidator = [
    param("id")
        .isUUID()
        .withMessage("Valid meal id is required"),
    handleValidationErrors,
];

export const getMealsValidator = [
    query("date")
        .optional()
        .isISO8601()
        .withMessage("Valid date format (YYYY-MM-DD) is required"),
    handleValidationErrors,
];
