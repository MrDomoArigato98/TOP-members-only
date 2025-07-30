import { body } from "express-validator";

export const messageValidator = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be 1–100 characters long"),

  body("body")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Message must be 1- 200 characters long"),
];
