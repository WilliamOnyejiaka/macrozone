import { body, param, query } from "express-validator";
import handleValidationErrors from "../../common/utils/handle-validation-errors";

export const createMealValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Meal name is required")
        .isString()
        .withMessage("Meal name must be a string"),

    body("calories")
        .notEmpty()
        .withMessage("Calories are required")
        .isInt({ min: 0 })
        .withMessage("Calories must be a valid non-negative number"),

    body("protein")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Protein must be a valid non-negative number"),

    body("carbs")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Carbs must be a valid non-negative number"),

    body("fat")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Fat must be a valid non-negative number"),

    handleValidationErrors
];

export const getMealsValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be an integer greater than 0"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be an integer between 1 and 100"),

    handleValidationErrors
];

export const updateMealValidator = [
    param("id")
        .notEmpty()
        .withMessage("Meal ID is required")
        .isUUID()
        .withMessage("Meal ID must be a valid UUID"),

    body("name")
        .optional()
        .trim()
        .isString()
        .withMessage("Meal name must be a string"),

    body("calories")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Calories must be a valid non-negative number"),

    body("protein")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Protein must be a valid non-negative number"),

    body("carbs")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Carbs must be a valid non-negative number"),

    body("fat")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Fat must be a valid non-negative number"),

    handleValidationErrors
];

export const mealIdParamValidator = [
    param("id")
        .notEmpty()
        .withMessage("Meal ID is required")
        .isUUID()
        .withMessage("Meal ID must be a valid UUID"),

    handleValidationErrors
];