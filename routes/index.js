import express from "express";
const router = express.Router();
import * as controller from "../controllers/controller.js";
import { signUpValidator } from "../validators/userValidator.js";

router.get("/", controller.getHome);

router.get("/sign-up", controller.getSignUpForm);
router.post("/sign-up", signUpValidator, controller.postSignUpForm);

router.get("/log-in", controller.getLogInForm);
router.post("/log-in", controller.postLogInForm);

// router.get("/become-member", controller.getMemberForm)
// router.post("/become-member", controller.postMemberForm)

// router.get("/become-admin", controller.getAdminForm)
// router.post("/become-admin", controller.postAdminForm)

export function mountRoutes(app) {
  app.use("/", router);
}
