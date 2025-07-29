import { body } from "express-validator";

export const signUpValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username (email) is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail()
    .isLength({ max: 100 }),

  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 50 })
    .withMessage("Full name must be under 50 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("confirm_password")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
