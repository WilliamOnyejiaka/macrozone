import { body } from "express-validator";
import handleValidationErrors from "../../common/utils/handle-validation-errors";
import verifyJWT from "../../common/middlewares/verify-jwt";
import { TokenType } from "../../common/types";

export const signUpValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("dailyCalorieGoal").optional().isInt({ min: 0 }),
    body("dailyFatGoal").optional().isInt({ min: 0 }),
    body("dailyCarbsGoal").optional().isInt({ min: 0 }),
    body("dailyProteinGoal").optional().isInt({ min: 0 }),
    handleValidationErrors,
];

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .notEmpty()
        .withMessage("Password is required"),
    handleValidationErrors,
];

export const refreshTokenValidator = [
    // body("refreshToken")
    //     .notEmpty()
    //     .withMessage("refreshToken is required")
    //     .isString()
    //     .withMessage("refreshToken must be a string"),
    verifyJWT([TokenType.REFRESH]),

    handleValidationErrors
];

export const logoutValidator = [
    verifyJWT([TokenType.ACCESS, TokenType.REFRESH]),
    body("refreshToken")
        .optional()
        .isString()
        .withMessage("refreshToken must be a string"),

    handleValidationErrors
];